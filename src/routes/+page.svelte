<script>
  import { onMount } from 'svelte';
  import Flowers, { flowers } from '$lib/Flowers.svelte';

  // Placeholders for now: swap `src` for a real image path (e.g. /favorites/coffee.jpg)
  const favorites = [
    { caption: 'favorite thing no. 1', src: null, color: '#e5d1d1' },
    { caption: 'favorite thing no. 2', src: null, color: '#dbe0e6' },
    { caption: 'favorite thing no. 3', src: null, color: '#d5c472' },
    { caption: 'favorite thing no. 4', src: null, color: '#c8b2ce' },
    { caption: 'favorite thing no. 5', src: null, color: '#dbe0e6' },
    { caption: 'favorite thing no. 6', src: null, color: '#e5d1d1' },
  ];

  let sectionEl;
  let size = { w: 0, h: 0 };
  let strings = [];
  let progress = 0;

  // Each visible flower's stem carries on down the page as a wavy string
  function layout() {
    if (!sectionEl) return;
    const w = sectionEl.offsetWidth;
    const h = sectionEl.offsetHeight;
    const mobile = window.matchMedia('(max-width: 600px)').matches;
    size = { w, h };
    strings = flowers
      .map((f, i) => ({ f, i }))
      .filter(({ i }) => !mobile || i % 2 === 0)
      .map(({ f, i }) => {
        const x0 = (f.left / 100) * w;
        const seg = 160 + (i % 4) * 30;
        const amp = 12 + (i % 5) * 5;
        let d = `M${x0} -2`;
        let prevX = x0;
        let prevY = -2;
        for (let y = seg; prevY < h; y += seg) {
          const x = x0 + Math.sin(y / seg + i) * amp;
          d += ` C${prevX} ${prevY + seg / 2}, ${x} ${y - seg / 2}, ${x} ${y}`;
          prevX = x;
          prevY = y;
        }
        return { d, lag: (i % 3) * 0.04 };
      });
    onScroll();
  }

  function onScroll() {
    if (!sectionEl) return;
    const top = sectionEl.getBoundingClientRect().top;
    progress = Math.min(Math.max(((window.innerHeight - top) / size.h) * 1.15, 0), 1);
  }

  onMount(() => {
    let raf;
    const schedule = (fn) => () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(fn);
    };
    const scroll = schedule(onScroll);
    const resize = schedule(layout);

    layout();
    document.fonts?.ready.then(layout);
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', resize);
    };
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

<a href="/" class="site-name">andrea.fyi</a>

<main>
  <section class="hero">
    <div class="center-text">
      <h1>hi, i'm andrea</h1>
    </div>
    <Flowers />
  </section>

  <section class="favorites" bind:this={sectionEl}>
    <svg class="strings" width={size.w} height={size.h} aria-hidden="true">
      <g filter="url(#rough)">
        {#each strings as s}
          <path
            d={s.d}
            pathLength="1"
            style="stroke-dashoffset: {1 - Math.min(Math.max(progress - s.lag, 0) / (1 - s.lag), 1)}"
          />
        {/each}
      </g>
    </svg>

    <div class="content">
      <h2 class="heading">my favorite things</h2>

      <div class="grid">
        {#each favorites as item, i}
          <figure class="polaroid" style="--tilt: {[-2.5, 1.5, -1, 2.5, -1.8, 1][i % 6]}deg">
            <span class="tape" aria-hidden="true"></span>
            {#if item.src}
              <img src={item.src} alt={item.caption} />
            {:else}
              <div class="placeholder" style="background: {item.color}">
                <span class="placeholder-icon" aria-hidden="true">✿</span>
                <span class="placeholder-label">image coming soon</span>
              </div>
            {/if}
            <figcaption>{item.caption}</figcaption>
          </figure>
        {/each}
      </div>
    </div>
  </section>

  <footer class="site-footer">
    <a href="/about" class="footer-link">about me</a>
    <a href="/coffee" class="footer-link">coffee?</a>
    <a href="mailto:novakovadrea@gmail.com" class="footer-link">novakovadrea@gmail.com</a>
  </footer>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: #fefef5;
    font-family: 'Space Grotesk', sans-serif;
    overflow-x: hidden;
  }

  :global(::selection) {
    background: #1a1a1a;
    color: #ffffff;
  }

  main {
    overflow-x: clip;
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

  .site-name {
    position: fixed;
    top: 1.5rem;
    left: 1.5rem;
    z-index: 200;
    font-size: 0.95rem;
    font-weight: 700;
    color: #1a1a1a;
    text-decoration: none;
  }

  .site-name:hover {
    text-decoration: underline;
  }

  /* ── Hero ── */
  .hero {
    position: relative;
    height: 100vh;
    min-height: 520px;
  }

  .center-text {
    position: absolute;
    inset: 0 0 30% 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0 1.5rem;
  }

  .center-text h1 {
    font-size: clamp(2.4rem, 8vw, 6rem);
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.04em;
    margin: 0;
    color: #1a1a1a;
  }

  /* ── Favorite things, on a background of strings ── */
  .favorites {
    position: relative;
    min-height: 100vh;
    padding: 25vh 1.5rem 18vh;
  }

  .strings {
    position: absolute;
    top: 0;
    left: 0;
    overflow: visible;
    pointer-events: none;
  }

  .strings path {
    fill: none;
    stroke: #1a1a1a;
    stroke-width: 2.4;
    stroke-linecap: round;
    stroke-dasharray: 1;
  }

  .content {
    position: relative;
    z-index: 1;
    max-width: 1000px;
    margin: 0 auto;
  }

  .heading {
    display: table;
    margin: 0 auto 4rem;
    padding: 0.5rem 1.2rem;
    font-size: clamp(2rem, 5vw, 3.4rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.05;
    color: #1a1a1a;
    background: #fefef5;
    border: 3px solid #1a1a1a;
    box-shadow: 5px 5px 0 #1a1a1a;
    transform: rotate(-1.5deg);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 4.5rem 4rem;
  }

  .polaroid {
    position: relative;
    margin: 0;
    padding: 0.8rem 0.8rem 0;
    background: #fefef5;
    border: 2.5px solid #1a1a1a;
    box-shadow: 5px 5px 0 #1a1a1a;
    transform: rotate(var(--tilt));
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .polaroid:hover {
    transform: rotate(0deg) scale(1.04);
  }

  .tape {
    position: absolute;
    top: -12px;
    left: 50%;
    width: 70px;
    height: 22px;
    margin-left: -35px;
    background: rgba(213, 196, 114, 0.75);
    border: 1.5px solid rgba(26, 26, 26, 0.4);
    transform: rotate(-4deg);
  }

  .polaroid img,
  .placeholder {
    display: block;
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border: 2px solid #1a1a1a;
  }

  .placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
  }

  .placeholder-icon {
    font-size: 2.6rem;
    line-height: 1;
    color: #1a1a1a;
  }

  .placeholder-label {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #333;
  }

  figcaption {
    padding: 0.8rem 0.2rem 1rem;
    font-size: 0.95rem;
    font-weight: 700;
    text-align: center;
    color: #1a1a1a;
  }

  /* ── Footer ── */
  .site-footer {
    position: relative;
    z-index: 1;
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    padding: 2rem 1.75rem;
    background: #fefef5;
    border-top: 3px solid #1a1a1a;
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

  @media (max-width: 600px) {
    .grid { gap: 3.5rem; }
    .site-footer { gap: 1rem; }
  }
</style>
