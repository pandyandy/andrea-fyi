<script>
  import { onMount } from 'svelte';
  import { articles } from '$lib/articles.js';
  import Shape from '$lib/Shape.svelte';

  const flyers = [
    ...articles.map((a) => ({
      href: `/article/${a.slug}`,
      shape: a.shape,
      color: a.color,
      tag: a.tag,
      title: a.title,
    })),
    { href: '/about', shape: 'blob', color: '#e5d1d1', title: 'about me', small: true },
    { href: '/coffee', shape: 'sparkle', color: '#d5c472', title: 'coffee?', small: true },
  ];

  let els = [];
  let hovered = flyers.map(() => false);

  onMount(() => {
    // Spread starting points across the screen, each with its own slow heading.
    const state = flyers.map((_, i) => {
      const angle = i * 2.4 + 0.7;
      const speed = 22 + (i % 3) * 8; // px per second
      return {
        x: ((i * 0.37 + 0.1) % 0.8) * window.innerWidth,
        y: ((i * 0.53 + 0.15) % 0.75) * window.innerHeight,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 0,
        vr: (i % 2 ? 1 : -1) * (4 + i),
      };
    });

    let raf;
    let last = performance.now();

    function tick(now) {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const W = window.innerWidth;
      const H = window.innerHeight;

      state.forEach((s, i) => {
        const el = els[i];
        if (!el) return;
        const maxX = Math.max(W - el.offsetWidth, 0);
        const maxY = Math.max(H - el.offsetHeight, 0);

        if (!hovered[i]) {
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          s.r += s.vr * dt;
          if (s.x <= 0 || s.x >= maxX) s.vx = -s.vx;
          if (s.y <= 0 || s.y >= maxY) s.vy = -s.vy;
        }
        s.x = Math.min(Math.max(s.x, 0), maxX);
        s.y = Math.min(Math.max(s.y, 0), maxY);

        el.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${Math.sin(s.r / 20) * 12}deg)`;
      });

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  });
</script>

<svelte:head>
  <title>andrea.fyi</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<!-- Grain overlay -->
<svg class="grain" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <filter id="gf">
    <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
    <feColorMatrix type="saturate" values="0" />
  </filter>
  <rect width="100%" height="100%" filter="url(#gf)" />
</svg>

<main class="stage">
  <a href="/" class="site-name">andrea.fyi</a>

  <div class="center-text">
    <h1>hi ☺︎</h1>
    <p>catch one to read it.</p>
  </div>

  {#each flyers as f, i}
    <a
      href={f.href}
      class="flyer"
      class:small={f.small}
      bind:this={els[i]}
      on:mouseenter={() => (hovered[i] = true)}
      on:mouseleave={() => (hovered[i] = false)}
      on:focus={() => (hovered[i] = true)}
      on:blur={() => (hovered[i] = false)}
    >
      <div class="flyer-body">
        <Shape shape={f.shape} color={f.color} />
        <span class="sticker">
          {#if f.tag}<span class="sticker-tag">{f.tag}</span>{/if}
          <span class="sticker-title">{f.title}</span>
        </span>
      </div>
    </a>
  {/each}

  <footer class="site-footer">
    <a href="mailto:novakovadrea@gmail.com" class="footer-link">novakovadrea@gmail.com</a>
  </footer>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: #fefef5;
    font-family: 'Space Grotesk', sans-serif;
  }

  :global(::selection) {
    background: #1a1a1a;
    color: #ffffff;
  }

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

  .stage {
    position: fixed;
    inset: 0;
    overflow: hidden;
    background: #fefef5;
  }

  .site-name {
    position: absolute;
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

  .center-text {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0 1.5rem;
    pointer-events: none;
  }

  .center-text h1 {
    font-size: clamp(2.4rem, 8vw, 6rem);
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.04em;
    margin: 0 0 1.2rem;
    color: #1a1a1a;
  }

  .center-text p {
    font-size: 1.05rem;
    font-style: italic;
    color: #444;
    margin: 0;
  }

  /* ── Flyers ── */
  .flyer {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: clamp(150px, 20vw, 240px);
    aspect-ratio: 1;
    color: #1a1a1a;
    text-decoration: none;
    will-change: transform;
  }

  .flyer.small {
    width: clamp(105px, 12vw, 150px);
  }

  .flyer:focus-visible {
    outline: none;
  }

  .flyer-body {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .flyer:hover .flyer-body,
  .flyer:focus-visible .flyer-body {
    transform: scale(1.1);
  }

  .sticker {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    max-width: 75%;
    padding: 0.5rem 0.65rem;
    background: #fefef5;
    border: 2.5px solid #1a1a1a;
    box-shadow: 3px 3px 0 #1a1a1a;
    transform: rotate(-3deg);
    font-weight: 700;
    text-align: center;
  }

  .sticker-tag {
    font-size: 0.55rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #555;
  }

  .sticker-title {
    font-size: clamp(0.8rem, 1.3vw, 1.05rem);
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  .flyer:focus-visible .sticker {
    outline: 3px dashed #1a1a1a;
    outline-offset: 4px;
  }

  .site-footer {
    position: absolute;
    bottom: 1.5rem;
    left: 1.75rem;
    z-index: 200;
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
</style>
