<script context="module">
  // Hand-drawn flowers that grow up from the bottom of the screen.
  // Seeded random so the garden looks the same on every visit.
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];

  const petalColors = ['#771c31', '#c8b2ce', '#d5c472', '#e5d1d1', '#dbe0e6'];
  const kinds = ['daisy', 'tulip', 'swirl', 'daisy', 'bell'];
  export const COUNT = 15;

  export const flowers = Array.from({ length: COUNT }, (_, i) => {
    const h = 150 + rand() * 120; // stem height inside a 100×300 box
    const tipX = 50 + (rand() - 0.5) * 24;
    const tipY = 300 - h;
    const bend = (rand() - 0.5) * 30;
    const stem = `M50 300 C${50 + bend} ${300 - h * 0.35}, ${50 - bend} ${300 - h * 0.7}, ${tipX} ${tipY}`;

    // One or two leaves partway up the stem
    const leaves = [];
    const leafCount = 1 + Math.round(rand());
    for (let l = 0; l < leafCount; l++) {
      const y = 300 - h * (0.25 + l * 0.3 + rand() * 0.1);
      const dir = (l + i) % 2 ? 1 : -1;
      const len = 22 + rand() * 10;
      leaves.push(
        `M50 ${y} q${dir * len * 0.5} ${-len * 0.55}, ${dir * len} ${-len * 0.25} q${-dir * len * 0.45} ${len * 0.5}, ${-dir * len} ${len * 0.25}`
      );
    }

    const petals = 5 + Math.floor(rand() * 3);
    return {
      left: (i + 0.5) * (100 / COUNT) + (rand() - 0.5) * 3,
      scale: 0.75 + rand() * 0.4,
      stem,
      leaves,
      tipX,
      tipY,
      kind: pick(kinds),
      color: pick(petalColors),
      petals,
      tilt: (rand() - 0.5) * 30,
      delay: 0.2 + i * 0.12 + rand() * 0.5,
      sway: 3 + rand() * 3,
    };
  });
</script>

<!-- Shared "pen wobble" filter that makes clean paths look hand-drawn -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <filter id="rough">
    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="3" />
    <feDisplacementMap in="SourceGraphic" scale="3.5" />
  </filter>
</svg>

<div class="garden" aria-hidden="true">
  {#each flowers as f}
    <svg
      class="flower"
      viewBox="0 0 100 300"
      overflow="visible"
      style="left:{f.left}%; --s:{f.scale}; --d:{f.delay}s; --sway:{f.sway}s"
    >
      <g class="sway" filter="url(#rough)">
        <path class="stem" d={f.stem} pathLength="1" />

        {#each f.leaves as leaf, li}
          <path class="leaf" d={leaf} pathLength="1" style="--ld:{f.delay + 0.6 + li * 0.25}s" />
        {/each}

        <g transform="translate({f.tipX} {f.tipY}) rotate({f.tilt})">
          <g class="bloom">
            {#if f.kind === 'daisy'}
              {#each Array(f.petals) as _, p}
                <ellipse
                  cx="0" cy="-13" rx="6.5" ry="12"
                  transform="rotate({(360 / f.petals) * p})"
                  fill={f.color}
                />
              {/each}
              <circle r="6" fill="#d5c472" />
            {:else if f.kind === 'tulip'}
              <path d="M-14 -4 C-16 -18,-10 -28,-6 -30 L0 -20 L6 -30 C10 -28,16 -18,14 -4 C10 6,-10 6,-14 -4 Z" fill={f.color} />
            {:else if f.kind === 'bell'}
              <path d="M0 -2 C-14 -2,-16 12,-18 20 C-10 16,-6 20,0 16 C6 20,10 16,18 20 C16 12,14 -2,0 -2 Z" fill={f.color} transform="rotate(180)" />
            {:else}
              <circle r="15" fill={f.color} />
              <path d="M0 0 C4 -2,5 4,1 6 C-5 8,-8 0,-5 -5 C-1 -11,9 -9,10 0 C11 9,1 14,-6 12" fill="none" />
            {/if}
          </g>
        </g>
      </g>
    </svg>
  {/each}
</div>

<style>
  .garden {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 0;
    pointer-events: none;
    z-index: 1;
  }

  .flower {
    position: absolute;
    bottom: 0;
    height: calc(clamp(170px, 40vh, 360px) * var(--s));
    width: auto;
    aspect-ratio: 1 / 3;
    transform: translateX(-50%);
  }

  .sway {
    transform-origin: 50px 300px;
    animation: sway var(--sway) ease-in-out calc(var(--d) + 2s) infinite alternate;
  }

  path, ellipse, circle {
    stroke: #1a1a1a;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .stem {
    fill: none;
    stroke-width: 2.6;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: draw 1.4s ease-out var(--d) forwards;
  }

  .leaf {
    fill: #8a9445;
    fill-opacity: 0;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation:
      draw 0.6s ease-out var(--ld) forwards,
      fill-in 0.4s ease-out calc(var(--ld) + 0.4s) forwards;
  }

  .bloom {
    transform: scale(0);
    animation: bloom 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) calc(var(--d) + 1.2s) forwards;
  }

  @keyframes draw {
    to { stroke-dashoffset: 0; }
  }

  @keyframes fill-in {
    to { fill-opacity: 1; }
  }

  @keyframes bloom {
    to { transform: scale(1); }
  }

  @keyframes sway {
    from { transform: rotate(-2.5deg); }
    to   { transform: rotate(2.5deg); }
  }

  @media (max-width: 600px) {
    .flower:nth-child(even) { display: none; }
  }
</style>
