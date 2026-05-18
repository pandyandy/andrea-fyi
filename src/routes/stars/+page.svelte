<svelte:head>
  <title>good boy | andrea.fyi</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<script>
  import { onMount, onDestroy } from 'svelte';

  // ── CONSTANTS ────────────────────────────────────────────────────────────
  const DOG_W      = 66;
  const DOG_H      = 60;
  const TREAT_SIZE = 38;
  const SQ_W       = 50;
  const SQ_H       = 46;
  const DOG_SPEED  = 5.5;
  const JUMP_VY    = -17;
  const GRAVITY    = 0.62;
  const DURATION   = 60;
  const TREAT_CHARS = ['🦴','🎾','🍪','🥩','🍖'];

  // ── REACTIVE STATE ────────────────────────────────────────────────────────
  let phase    = 'idle';
  let score    = 0;
  let lives    = 3;
  let timeLeft = DURATION;
  let best     = 0;

  // ── CANVAS ───────────────────────────────────────────────────────────────
  let canvas;
  let ctx;
  let W = 800, H = 600;
  let GROUND_Y, WIRE_Y;

  // ── GAME OBJECTS (mutated directly for perf) ─────────────────────────────
  let dog        = {};
  let treats     = [];
  let squirrels  = [];
  let particles  = [];
  let keys       = {};

  let frameId, timerId;
  let nextId = 0, frame = 0, treatInterval = 110;

  // ── UTILS ────────────────────────────────────────────────────────────────
  function uid() { return nextId++; }

  function pop(x, y, text, color) {
    particles.push({ id: uid(), x, y, text, color, vy: -2.2, life: 52, maxLife: 52 });
  }

  // ── LAYOUT ───────────────────────────────────────────────────────────────
  function resize() {
    if (!canvas) return;
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    GROUND_Y = H * 0.80;
    WIRE_Y   = H * 0.42;
  }

  function initDog() {
    dog = {
      x: W / 2 - DOG_W / 2,
      y: GROUND_Y - DOG_H,
      vy: 0, facing: 1,
      isJumping: false,
      eatFrames: 0,
    };
  }

  // ── GAME CONTROL ─────────────────────────────────────────────────────────
  function startGame() {
    score = 0; lives = 3; timeLeft = DURATION;
    treats = []; squirrels = []; particles = [];
    frame = 0; treatInterval = 110;
    resize();
    initDog();
    phase = 'playing';
    timerId = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) endGame();
    }, 1000);
    frameId = requestAnimationFrame(loop);
  }

  function endGame() {
    phase = 'done';
    if (score > best) best = score;
    clearInterval(timerId);
    cancelAnimationFrame(frameId);
    render(); // freeze last frame
  }

  // ── GAME LOOP ─────────────────────────────────────────────────────────────
  function loop() {
    if (phase !== 'playing') return;
    update();
    render();
    frameId = requestAnimationFrame(loop);
  }

  function update() {
    frame++;

    // ── Dog movement ──
    if (keys['ArrowLeft']  || keys['a'] || keys['A']) { dog.x -= DOG_SPEED; dog.facing = -1; }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) { dog.x += DOG_SPEED; dog.facing =  1; }
    dog.x = Math.max(0, Math.min(W - DOG_W, dog.x));

    if (!dog.isJumping && (keys[' '] || keys['ArrowUp'] || keys['w'] || keys['W'])) {
      dog.vy = JUMP_VY;
      dog.isJumping = true;
    }
    dog.vy += GRAVITY;
    dog.y  += dog.vy;
    const gnd = GROUND_Y - DOG_H;
    if (dog.y >= gnd) { dog.y = gnd; dog.vy = 0; dog.isJumping = false; }
    if (dog.eatFrames > 0) dog.eatFrames--;

    // ── Spawn treats ──
    if (frame % treatInterval === 0) {
      treats.push({
        id: uid(),
        x:    60 + Math.random() * (W - 120),
        y:    -TREAT_SIZE,
        vy:   1.5 + Math.random() * 1.4,
        char: TREAT_CHARS[Math.floor(Math.random() * TREAT_CHARS.length)],
        gone: false,
      });
      treatInterval = Math.max(42, 110 - Math.floor((DURATION - timeLeft) / 8) * 9);
    }

    // ── Spawn squirrels ──
    if (frame % 270 === 0 && squirrels.length < 4) {
      const left = Math.random() < 0.5;
      squirrels.push({
        id: uid(),
        x:       left ? -SQ_W : W + SQ_W,
        y:       WIRE_Y - SQ_H + 6,
        vx:      left ? 3 : -3,
        facing:  left ? 1 : -1,
        hasTreat: false,
        treatChar: null,
      });
    }

    // ── Move squirrels ──
    squirrels.forEach(sq => {
      if (!sq.hasTreat) {
        // Hunt the nearest treat approaching the wire
        const prey = treats
          .filter(t => !t.gone && t.y > WIRE_Y - 220 && t.y < WIRE_Y + TREAT_SIZE)
          .sort((a, b) => Math.abs(a.x - sq.x) - Math.abs(b.x - sq.x))[0];
        if (prey) {
          const dx = prey.x - sq.x;
          if (Math.abs(dx) > 4) sq.vx = Math.sign(dx) * 4;
        } else {
          if (sq.x < 20)     sq.vx =  Math.abs(sq.vx);
          else if (sq.x > W - 20) sq.vx = -Math.abs(sq.vx);
        }
      } else {
        sq.vx = sq.facing * 5.5; // bolt off screen
      }
      sq.x += sq.vx;
      sq.facing = sq.vx > 0 ? 1 : -1;
    });
    squirrels = squirrels.filter(sq => sq.x > -130 && sq.x < W + 130);

    // ── Move treats ──
    treats.forEach(t => { t.y += t.vy; });

    // ── Squirrel steals treat ──
    treats.forEach(treat => {
      if (treat.gone) return;
      squirrels.forEach(sq => {
        if (sq.hasTreat) return;
        const cx = sq.x + SQ_W / 2;
        if (Math.abs(treat.x - cx) < 48 && treat.y > WIRE_Y - 90 && treat.y < WIRE_Y + 30) {
          treat.gone = true;
          sq.hasTreat = true;
          sq.treatChar = treat.char;
          pop(treat.x, treat.y, 'stolen! 🐿️', '#ff6b6b');
        }
      });
    });

    // ── Dog catches treat ──
    treats.forEach(treat => {
      if (treat.gone) return;
      if (
        treat.x + TREAT_SIZE > dog.x &&
        treat.x < dog.x + DOG_W &&
        treat.y + TREAT_SIZE > dog.y &&
        treat.y < dog.y + DOG_H
      ) {
        treat.gone   = true;
        score++;
        dog.eatFrames = 22;
        pop(treat.x + TREAT_SIZE / 2, treat.y, '+1', '#ffe066');
      }
    });

    // ── Treat hits ground ──
    treats.forEach(treat => {
      if (!treat.gone && treat.y > GROUND_Y + 10) {
        treat.gone = true;
        lives--;
        pop(treat.x, GROUND_Y - 50, '💔', '#ff4444');
        if (lives <= 0) { lives = 0; endGame(); }
      }
    });
    treats = treats.filter(t => !t.gone);

    // ── Particles ──
    particles.forEach(p => { p.y += p.vy; p.life--; });
    particles = particles.filter(p => p.life > 0);
  }

  // ── RENDER ───────────────────────────────────────────────────────────────
  function render() {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    drawBg();
    drawTreats();
    drawSquirrels();
    drawDog();
    drawParticles();
  }

  // ── BACKGROUND ───────────────────────────────────────────────────────────
  function drawBg() {
    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    sky.addColorStop(0, '#4EAAD4');
    sky.addColorStop(1, '#B8DDEF');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, GROUND_Y);

    // Clouds
    cloud(W * 0.12, H * 0.10, 70);
    cloud(W * 0.50, H * 0.07, 55);
    cloud(W * 0.76, H * 0.13, 80);

    // Sun
    ctx.fillStyle = '#FFE44D';
    ctx.beginPath();
    ctx.arc(W - 90, 80, 46, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#F0C600';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Ground
    const grd = ctx.createLinearGradient(0, GROUND_Y, 0, H);
    grd.addColorStop(0,    '#5DB83A');
    grd.addColorStop(0.07, '#4A9A2C');
    grd.addColorStop(1,    '#3A7820');
    ctx.fillStyle = grd;
    ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
    ctx.strokeStyle = '#2D6018';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(W, GROUND_Y);
    ctx.stroke();

    // Trees
    tree(W * 0.05, GROUND_Y, 88, 190);
    tree(W * 0.17, GROUND_Y, 66, 148);
    tree(W * 0.82, GROUND_Y, 88, 190);
    tree(W * 0.93, GROUND_Y, 66, 148);
    if (W > 900) tree(W * 0.50, GROUND_Y, 58, 130);

    // Wire
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, WIRE_Y);
    ctx.lineTo(W, WIRE_Y);
    ctx.stroke();

    // Wire insulator dots
    [W * 0.10, W * 0.50, W * 0.90].forEach(px => pole(px, WIRE_Y));
  }

  function cloud(cx, cy, r) {
    ctx.fillStyle = 'rgba(255,255,255,0.82)';
    [[0,0,r],[-(r*0.65),(r*0.18),(r*0.72)],[(r*0.65),(r*0.18),(r*0.72)]].forEach(([dx,dy,rad]) => {
      ctx.beginPath();
      ctx.arc(cx + dx, cy + dy, rad, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function tree(cx, baseY, spread, height) {
    // trunk
    ctx.fillStyle = '#7B4F2A';
    ctx.fillRect(cx - 6, baseY - height * 0.28, 12, height * 0.28);
    // canopy layers
    [
      { yFrac: 1.00, wFrac: 1.00, c: '#2A5E2A' },
      { yFrac: 0.72, wFrac: 0.88, c: '#337833' },
      { yFrac: 0.46, wFrac: 0.66, c: '#3D8840' },
    ].forEach(({ yFrac, wFrac, c }) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.moveTo(cx,                     baseY - height * yFrac);
      ctx.lineTo(cx - spread * wFrac / 2, baseY - height * (yFrac - 0.32));
      ctx.lineTo(cx + spread * wFrac / 2, baseY - height * (yFrac - 0.32));
      ctx.closePath();
      ctx.fill();
    });
  }

  function pole(x, wireY) {
    ctx.fillStyle = '#666';
    ctx.fillRect(x - 5, wireY, 10, GROUND_Y - wireY);
    ctx.fillStyle = '#888';
    ctx.fillRect(x - 14, wireY - 7, 28, 9);
  }

  // ── EMOJI HELPER ─────────────────────────────────────────────────────────
  function emoji(ch, x, y, size, flipX = false) {
    ctx.save();
    ctx.font = `${size}px serif`;
    ctx.textBaseline = 'top';
    if (flipX) {
      ctx.translate(x + size / 2, y);
      ctx.scale(-1, 1);
      ctx.fillText(ch, -size / 2, 0);
    } else {
      ctx.fillText(ch, x, y);
    }
    ctx.restore();
  }

  // ── DOG ──────────────────────────────────────────────────────────────────
  function drawDog() {
    if (!dog.x && dog.x !== 0) return;
    // shadow
    ctx.fillStyle = 'rgba(0,0,0,0.14)';
    ctx.beginPath();
    ctx.ellipse(dog.x + DOG_W / 2, GROUND_Y + 5, DOG_W * 0.48, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    const ch = dog.eatFrames > 0 ? '🐶' : '🐕';
    emoji(ch, dog.x, dog.y, DOG_W, dog.facing === -1);
  }

  // ── TREATS ───────────────────────────────────────────────────────────────
  function drawTreats() {
    treats.forEach(t => emoji(t.char, t.x, t.y, TREAT_SIZE));
  }

  // ── SQUIRRELS ────────────────────────────────────────────────────────────
  function drawSquirrels() {
    squirrels.forEach(sq => {
      emoji('🐿️', sq.x, sq.y, SQ_W, sq.facing === -1);
      if (sq.hasTreat && sq.treatChar) {
        emoji(sq.treatChar, sq.x + (sq.facing === 1 ? 4 : 0), sq.y - 26, 22);
      }
    });
  }

  // ── PARTICLES ────────────────────────────────────────────────────────────
  function drawParticles() {
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle   = p.color;
      ctx.font        = 'bold 22px "Space Grotesk", sans-serif';
      ctx.textAlign   = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.text, p.x, p.y);
      ctx.restore();
    });
  }

  // ── INPUT ────────────────────────────────────────────────────────────────
  function onKeyDown(e) {
    keys[e.key] = true;
    if ([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
      e.preventDefault();
    }
  }
  function onKeyUp(e) { keys[e.key] = false; }

  // ── LIFECYCLE ────────────────────────────────────────────────────────────
  onMount(() => {
    ctx = canvas.getContext('2d');
    resize();
    initDog();
    render(); // show background on idle screen
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', () => { resize(); if (phase !== 'playing') { initDog(); render(); } });
  });

  onDestroy(() => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    clearInterval(timerId);
    cancelAnimationFrame(frameId);
  });

  // ── END MESSAGE ──────────────────────────────────────────────────────────
  function getMessage() {
    if (score >= 35) return 'absolute goodest boy 🏆';
    if (score >= 25) return 'treat champion 🦴';
    if (score >= 15) return 'those squirrels were sneaky';
    if (score >= 8)  return 'the squirrels win this round';
    if (score >= 3)  return 'maybe let the dog try again?';
    return 'not a single treat... 😔';
  }
</script>

<div class="wrap">
  <canvas bind:this={canvas}></canvas>

  <!-- ── HUD ── -->
  {#if phase === 'playing'}
    <div class="hud">
      <div class="hud-box">
        score <span class="hud-val">{score}</span>
      </div>
      <div class="hud-hearts">
        {#each Array(3) as _, i}
          <span class="heart">{i < lives ? '❤️' : '🖤'}</span>
        {/each}
      </div>
      <div class="hud-box" class:urgent={timeLeft <= 10}>{timeLeft}s</div>
    </div>
  {/if}

  <!-- ── IDLE SCREEN ── -->
  {#if phase === 'idle'}
    <a href="/" class="corner-back">&larr; back</a>
    <div class="overlay">
      <div class="card">
        <div class="card-title">good boy</div>
        <p class="card-desc">catch the falling treats before the squirrels steal them from the wire!</p>
        <div class="controls">
          <span>← → to move</span>
          <span>↑ / space to jump</span>
        </div>
        <button class="btn" on:click={startGame}>play</button>
      </div>
    </div>
  {/if}

  <!-- ── DONE SCREEN ── -->
  {#if phase === 'done'}
    <div class="overlay">
      <div class="card">
        <div class="card-title">game over!</div>
        <div class="final-score">
          <div class="score-big">{score}</div>
          <div class="score-sub">treats caught</div>
          {#if score > 0 && score >= best}
            <div class="new-best">new best! 🎉</div>
          {:else if best > 0}
            <div class="prev-best">best: {best}</div>
          {/if}
        </div>
        <p class="card-desc">{getMessage()}</p>
        <button class="btn" on:click={startGame}>play again</button>
        <a href="/" class="back-link">← back home</a>
      </div>
    </div>
  {/if}
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
    font-family: 'Space Grotesk', sans-serif;
  }

  .wrap {
    position: fixed;
    inset: 0;
  }

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }

  /* ── HUD ── */
  .hud {
    position: absolute;
    top: 16px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    pointer-events: none;
  }

  .hud-box {
    background: #fefef5;
    border: 3px solid #1a1a1a;
    box-shadow: 4px 4px 0 #1a1a1a;
    padding: 0.35rem 1rem;
    font-size: 1.05rem;
    font-weight: 700;
    color: #1a1a1a;
  }

  .hud-box.urgent {
    background: #e5d1d1;
    animation: pulse 0.5s infinite alternate;
  }

  .hud-val {
    font-size: 1.4rem;
    margin-left: 0.4rem;
  }

  .hud-hearts {
    display: flex;
    gap: 2px;
    font-size: 1.8rem;
  }

  /* ── OVERLAY ── */
  .overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.42);
  }

  .card {
    background: #fefef5;
    border: 4px solid #1a1a1a;
    box-shadow: 8px 8px 0 #1a1a1a;
    padding: 2.5rem 3rem;
    text-align: center;
    max-width: 440px;
    width: 90%;
  }

  .card-title {
    font-size: 3.2rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 0.6rem;
  }

  .card-desc {
    color: #444;
    font-size: 1rem;
    margin: 0 0 1.25rem;
    line-height: 1.5;
  }

  .controls {
    display: flex;
    gap: 1.2rem;
    justify-content: center;
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .final-score {
    margin: 0.5rem 0 1rem;
  }

  .score-big {
    font-size: 5rem;
    font-weight: 700;
    line-height: 1;
    color: #1a1a1a;
  }

  .score-sub {
    font-size: 0.9rem;
    color: #777;
    margin-bottom: 0.4rem;
  }

  .new-best  { color: #8a9445; font-weight: 700; font-size: 1rem; }
  .prev-best { color: #aaa;    font-size: 0.9rem; }

  /* ── BUTTON ── */
  .btn {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.2rem;
    font-weight: 700;
    background: #d5c472;
    color: #1a1a1a;
    border: 3px solid #1a1a1a;
    box-shadow: 4px 4px 0 #1a1a1a;
    padding: 0.6rem 2.5rem;
    cursor: pointer;
    display: block;
    margin: 0 auto;
    transition: transform 0.1s, box-shadow 0.1s;
  }

  .btn:hover  { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #1a1a1a; }
  .btn:active { transform: translate( 2px,  2px); box-shadow: 2px 2px 0 #1a1a1a; }

  /* ── BACK LINKS ── */
  .back-link {
    display: block;
    margin-top: 1rem;
    color: #999;
    font-size: 0.9rem;
    text-decoration: none;
    transition: color 0.1s;
  }
  .back-link:hover { color: #1a1a1a; }

  .corner-back {
    position: absolute;
    top: 18px;
    left: 18px;
    font-size: 1rem;
    font-weight: 600;
    color: #1a1a1a;
    text-decoration: none;
    background: #fefef5;
    border: 3px solid #1a1a1a;
    box-shadow: 4px 4px 0 #1a1a1a;
    padding: 0.4rem 1rem;
    transition: transform 0.1s, box-shadow 0.1s;
    z-index: 10;
  }
  .corner-back:hover  { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #1a1a1a; }
  .corner-back:active { transform: translate( 2px,  2px); box-shadow: 2px 2px 0 #1a1a1a; }

  @keyframes pulse {
    from { transform: scale(1); }
    to   { transform: scale(1.05); }
  }
</style>
