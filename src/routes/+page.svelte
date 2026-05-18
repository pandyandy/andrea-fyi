<script>
  import { onMount } from 'svelte';

  const articles = [
    {
      tag: 'observation',
      title: 'the tyranny of open tabs',
      blurb: 'on digital hoarding, the myth of "i\'ll read this later," and why your browser is just anxiety with a favicon.',
      body: [
        'There are currently 47 tabs open in my browser. Seventeen are articles I\'ve been meaning to read since February. Three are recipe pages from a dinner party I hosted in March. One is a Wikipedia rabbit hole about the history of the harmonica that I genuinely cannot account for.',
        'A tab is a bet on your future self — a little flag in the sand that says I will return here, I will be the kind of person who reads this. But the future self never comes, and the tabs accumulate, and at some point the browser becomes less a tool and more a monument to all the things you meant to do.',
        'The paradox is that closing them feels like loss. Even the harmonica one.',
      ],
      bg: '#dbe0e6',
    },
    {
      tag: 'theory',
      title: 'medium rare opinions',
      blurb: 'thoughts that are not quite raw and not quite cooked — warm enough to serve but still a little bloody in the middle.',
      body: [
        'A well-done opinion is easy. You\'ve had it for years, argued it at dinner tables, cited three sources and a personal anecdote. A raw opinion is also easy — it\'s just a feeling, a flash, a gut reaction before the brain has fully arrived.',
        'The hard one is the medium rare. The thought you\'ve held long enough to warm but not so long that it\'s set. It still yields when you press it. You can still be wrong about it without it being a crisis.',
        'Most of what I write lives here. In the temperature between impulse and conviction. I\'m not sure if that\'s courage or just bad follow-through.',
      ],
      bg: '#e5d1d1',
    },
    {
      tag: 'dispatch',
      title: 'notes from a city that walks',
      blurb: 'a neighborhood is a mood. here are some moods, collected over a long walk, two wrong turns, and one very good coffee.',
      body: [
        'The city changes when you walk slowly enough. Not dramatically — not buildings shifting, storefronts materializing. It changes the way you change: incrementally, almost imperceptibly, and then all at once when you stop and look around.',
        'There\'s a street near the canal where the cobblestones are uneven and everyone who walks it tilts the same way, like they\'re all leaning into the same private thought. I\'ve started thinking of this as the city\'s grammar — the way a place teaches you to hold your body.',
        'I took two wrong turns to get to the coffee. I\'m going to keep taking them.',
      ],
      bg: '#c8b2ce',
    },
  ];

  let activeIndex = 0;
  let mainEl;

  function onScroll() {
    if (!mainEl) return;
    const max = mainEl.scrollHeight - mainEl.clientHeight;
    if (max <= 0) return;
    const t = mainEl.scrollTop / max;
    activeIndex = Math.min(Math.round(t * (articles.length - 1)), articles.length - 1);
  }

  function scrollTo(i) {
    if (!mainEl) return;
    mainEl.scrollTo({ top: i * mainEl.clientHeight, behavior: 'smooth' });
  }

  onMount(() => {
    mainEl.addEventListener('scroll', onScroll, { passive: true });
    return () => mainEl.removeEventListener('scroll', onScroll);
  });
</script>

<svelte:head>
  <title>andrea.fyi</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<!-- Grain overlay — sits above sections, below chrome -->
<svg class="grain" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <filter id="gf">
    <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
    <feColorMatrix type="saturate" values="0" />
  </filter>
  <rect width="100%" height="100%" filter="url(#gf)" />
</svg>

<!-- Fixed chrome -->
<a href="/" class="site-name">andrea.fyi</a>

<div class="site-footer">
  <a href="/about" class="footer-link">about me</a>
  <a href="/coffee" class="footer-link">coffee?</a>
  <a href="mailto:novakovadrea@gmail.com" class="footer-link">novakovadrea@gmail.com</a>
</div>

<nav class="dots" aria-label="article navigation">
  {#each articles as _, i}
    <button class="dot" class:active={activeIndex === i} on:click={() => scrollTo(i)} aria-label="article {i + 1}"></button>
  {/each}
</nav>

<!-- Scroll container -->
<main class="scroll-wrap" bind:this={mainEl}>
  {#each articles as article, i}
    <section class="section" style="background: {article.bg}">

      {#if i === 0}
        <!-- 8-arm asterisk, spins -->
        <div class="deco" style="top:7%;right:5%">
          <svg class="anim-spin" width="90" height="90" viewBox="0 0 100 100" aria-hidden="true">
            <line x1="50" y1="7" x2="50" y2="93" stroke="#8a9445" stroke-width="10" stroke-linecap="round"/>
            <line x1="7" y1="50" x2="93" y2="50" stroke="#8a9445" stroke-width="10" stroke-linecap="round"/>
            <line x1="18" y1="18" x2="82" y2="82" stroke="#8a9445" stroke-width="10" stroke-linecap="round"/>
            <line x1="82" y1="18" x2="18" y2="82" stroke="#8a9445" stroke-width="10" stroke-linecap="round"/>
          </svg>
        </div>
        <!-- 4-pointed sparkle, floats -->
        <div class="deco" style="bottom:9%;left:4%">
          <svg class="anim-float" width="68" height="68" viewBox="0 0 100 100" aria-hidden="true">
            <polygon points="50,0 56,44 100,50 56,56 50,100 44,56 0,50 44,44" fill="#771c31" stroke="#1a1a1a" stroke-width="3" stroke-linejoin="round"/>
          </svg>
        </div>
        <!-- Starburst badge, breathes -->
        <div class="deco" style="top:55%;right:5%">
          <svg class="anim-breathe" width="52" height="52" viewBox="0 0 100 100" aria-hidden="true">
            <polygon points="50,5 64,15 82,18 85,36 95,50 85,64 82,82 64,85 50,95 36,85 18,82 15,64 5,50 15,36 18,18 36,15" fill="#2a5654" stroke="#1a1a1a" stroke-width="2.5"/>
          </svg>
        </div>

      {:else if i === 1}
        <!-- Squiggle, wobbles -->
        <div class="deco" style="top:8%;left:3%">
          <svg class="anim-wobble" width="118" height="58" viewBox="0 0 118 58" aria-hidden="true">
            <path d="M5 38 C18 10,32 10,48 32 C64 54,78 54,94 32 C106 18,114 18,115 30" stroke="#2a5654" stroke-width="7" fill="none" stroke-linecap="round"/>
          </svg>
        </div>
        <!-- 4-pointed sparkle, floats delayed -->
        <div class="deco" style="bottom:8%;right:5%">
          <svg class="anim-float-delay" width="78" height="78" viewBox="0 0 100 100" aria-hidden="true">
            <polygon points="50,0 56,44 100,50 56,56 50,100 44,56 0,50 44,44" fill="#8a9445" stroke="#1a1a1a" stroke-width="3" stroke-linejoin="round"/>
          </svg>
        </div>
        <!-- Plus cross, spins reverse -->
        <div class="deco" style="top:11%;right:5%">
          <svg class="anim-spin-rev" width="44" height="44" viewBox="0 0 100 100" aria-hidden="true">
            <rect x="42" y="5" width="16" height="90" rx="8" fill="#771c31"/>
            <rect x="5" y="42" width="90" height="16" rx="8" fill="#771c31"/>
          </svg>
        </div>

      {:else}
        <!-- 4-pointed sparkle, floats -->
        <div class="deco" style="top:8%;right:4%">
          <svg class="anim-float" width="84" height="84" viewBox="0 0 100 100" aria-hidden="true">
            <polygon points="50,0 56,44 100,50 56,56 50,100 44,56 0,50 44,44" fill="#8a9445" stroke="#1a1a1a" stroke-width="3" stroke-linejoin="round"/>
          </svg>
        </div>
        <!-- Starburst badge, breathes -->
        <div class="deco" style="bottom:9%;left:4%">
          <svg class="anim-breathe-delay" width="74" height="74" viewBox="0 0 100 100" aria-hidden="true">
            <polygon points="50,5 64,15 82,18 85,36 95,50 85,64 82,82 64,85 50,95 36,85 18,82 15,64 5,50 15,36 18,18 36,15" fill="#d5c472" stroke="#1a1a1a" stroke-width="2.5"/>
          </svg>
        </div>
        <!-- 8-arm asterisk, spins mid-left -->
        <div class="deco" style="top:46%;left:4%">
          <svg class="anim-spin" width="52" height="52" viewBox="0 0 100 100" aria-hidden="true">
            <line x1="50" y1="8" x2="50" y2="92" stroke="#771c31" stroke-width="11" stroke-linecap="round"/>
            <line x1="8" y1="50" x2="92" y2="50" stroke="#771c31" stroke-width="11" stroke-linecap="round"/>
            <line x1="19" y1="19" x2="81" y2="81" stroke="#771c31" stroke-width="11" stroke-linecap="round"/>
            <line x1="81" y1="19" x2="19" y2="81" stroke="#771c31" stroke-width="11" stroke-linecap="round"/>
          </svg>
        </div>
      {/if}

      <div class="inner">
        <span class="tag">{article.tag}</span>
        <h2 class="title">{article.title}</h2>
        <p class="blurb">{article.blurb}</p>
        <div class="rule"></div>
        <div class="body">
          {#each article.body as para}
            <p>{para}</p>
          {/each}
        </div>
      </div>
    </section>
  {/each}
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: #fefef5;
    font-family: 'Space Grotesk', sans-serif;
    overflow: hidden;
  }

  :global(::selection) {
    background: #1a1a1a;
    color: #ffffff;
  }

  /* ── Grain — above sections (z:10), below chrome (z:200) ── */
  .grain {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 50;
    opacity: 0.05;
    mix-blend-mode: multiply;
  }

  /* ── Site name ── */
  .site-name {
    position: fixed;
    top: 1.5rem;
    left: 1.5rem;
    z-index: 200;
    font-size: 0.95rem;
    font-weight: 700;
    color: #1a1a1a;
    text-decoration: none;
    border: 2.5px solid #1a1a1a;
    padding: 0.3rem 0.85rem;
    background: #c8b2ce;
    box-shadow: 3px 3px 0 #1a1a1a;
    transform: rotate(-0.6deg);
    transition: transform 0.1s, box-shadow 0.1s;
  }

  .site-name:hover {
    transform: rotate(0deg) translate(-1px, -1px);
    box-shadow: 4px 4px 0 #1a1a1a;
  }

  /* ── Footer links ── */
  .site-footer {
    position: fixed;
    bottom: 1.5rem;
    left: 1.75rem;
    z-index: 200;
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .footer-link {
    font-size: 0.75rem;
    font-weight: 600;
    color: #555;
    text-decoration: none;
    transition: color 0.12s;
  }

  .footer-link:hover {
    color: #1a1a1a;
  }

  /* ── Dots ── */
  .dots {
    position: fixed;
    right: 1.75rem;
    top: 50%;
    transform: translateY(-50%);
    z-index: 200;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }

  .dot {
    width: 8px;
    height: 8px;
    border: 2px solid #1a1a1a;
    background: transparent;
    padding: 0;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }

  .dot:hover { transform: scale(1.3); }
  .dot.active { background: #1a1a1a; }

  /* ── Scroll container ── */
  .scroll-wrap {
    position: fixed;
    inset: 0;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
    z-index: 10;
    background: transparent;
    scrollbar-width: none;
  }

  .scroll-wrap::-webkit-scrollbar { display: none; }

  /* ── Sections ── */
  .section {
    height: 100vh;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  /* ── Decorations ── */
  .deco {
    position: absolute;
    pointer-events: none;
    z-index: 0;
  }

  /* Animation classes */
  .anim-spin         { animation: spin 12s linear infinite; transform-box: fill-box; transform-origin: center; }
  .anim-spin-rev     { animation: spin 9s linear infinite reverse; transform-box: fill-box; transform-origin: center; }
  .anim-float        { animation: float 4s ease-in-out infinite; }
  .anim-float-delay  { animation: float 4.5s ease-in-out infinite 1.2s; }
  .anim-breathe      { animation: breathe 3.5s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
  .anim-breathe-delay{ animation: breathe 4s ease-in-out infinite 0.8s; transform-box: fill-box; transform-origin: center; }
  .anim-wobble       { animation: wobble 3.2s ease-in-out infinite; transform-origin: center bottom; }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-12px); }
  }

  @keyframes breathe {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.14); }
  }

  @keyframes wobble {
    0%, 100% { transform: rotate(-7deg); }
    50%       { transform: rotate(7deg); }
  }

  /* ── Content ── */
  .inner {
    position: relative;
    z-index: 1;
    max-width: 660px;
    width: 100%;
    padding: 0 2.5rem;
    margin: 0 auto;
  }

  .tag {
    display: inline-block;
    font-size: 0.62rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2.5px;
    color: #333;
    border: 2px solid #333;
    padding: 0.18rem 0.55rem;
    margin-bottom: 1.1rem;
  }

  .title {
    font-size: clamp(2rem, 5.5vw, 4rem);
    font-weight: 700;
    line-height: 1.07;
    letter-spacing: -0.03em;
    margin: 0 0 1.1rem 0;
    color: #1a1a1a;
  }

  .blurb {
    font-size: 1.05rem;
    line-height: 1.65;
    color: #444;
    font-style: italic;
    margin: 0 0 1.6rem 0;
    max-width: 500px;
  }

  .rule {
    width: 2.5rem;
    height: 3px;
    background: #1a1a1a;
    margin-bottom: 1.6rem;
  }

  .body p {
    font-size: 0.97rem;
    line-height: 1.8;
    color: #2a2a2a;
    margin: 0 0 0.9rem 0;
    max-width: 540px;
  }

  .body p:last-child { margin-bottom: 0; }

  @media (max-width: 600px) {
    .inner  { padding: 0 1.5rem; }
    .deco   { opacity: 0.6; }
    .dots   { right: 0.75rem; }
    .site-footer { gap: 1rem; }
  }
</style>
