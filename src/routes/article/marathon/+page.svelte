<script>
  // ─── DATA ────────────────────────────────────────────────────────────────

  // US marathon finishers (thousands)
  // Source: Running USA annual reports; academic estimates for interpolated years
  const finishersData = [
    { year: 1980, v: 143 },
    { year: 1985, v: 200 },
    { year: 1990, v: 224 },
    { year: 1995, v: 295 },
    { year: 2000, v: 353 },
    { year: 2005, v: 395 },
    { year: 2008, v: 425 },
    { year: 2010, v: 507 },
    { year: 2014, v: 551 },
    { year: 2016, v: 502 },
    { year: 2019, v: 490 },
    { year: 2020, v: 145 },
    { year: 2021, v: 290 },
    { year: 2022, v: 440 },
    { year: 2023, v: 490 },
  ];

  // Women as % of US marathon finishers
  // Source: Running USA; Exploring Women's Marathon Participation in the US, 1980–2019
  const womenData = [
    { year: 1980, v: 10.5 },
    { year: 1985, v: 17 },
    { year: 1990, v: 23 },
    { year: 1995, v: 30 },
    { year: 2000, v: 36 },
    { year: 2005, v: 40 },
    { year: 2010, v: 43 },
    { year: 2014, v: 44 },
    { year: 2017, v: 47 },
    { year: 2020, v: 43 },
    { year: 2022, v: 43 },
    { year: 2024, v: 41 },
  ];

  // World Marathon Majors — women's % (approx. 2023–24)
  const majors = [
    { name: 'NYC',     pct: 46 },
    { name: 'Chicago', pct: 45 },
    { name: 'Boston',  pct: 44 },
    { name: 'London',  pct: 40 },
    { name: 'Berlin',  pct: 34 },
    { name: 'Tokyo',   pct: 27 },
  ];

  // ─── CHART BUILDER ───────────────────────────────────────────────────────

  // Shared SVG dimensions
  const CW = 660, CH = 260;
  const PAD = { l: 58, r: 22, t: 18, b: 44 };
  const plotW = CW - PAD.l - PAD.r;   // 580
  const plotH = CH - PAD.t - PAD.b;   // 198

  function buildLineChart(data, yMax) {
    const xMin = data[0].year;
    const xMax = data[data.length - 1].year;
    const xRange = xMax - xMin;

    const cx = yr  => PAD.l + ((yr - xMin) / xRange) * plotW;
    const cy = val => PAD.t + plotH - (val / yMax) * plotH;

    const pts = data.map(d => ({ x: cx(d.year), y: cy(d.v), year: d.year, v: d.v }));

    const linePath = pts
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(' ');

    const areaPath =
      linePath +
      ` L ${pts[pts.length - 1].x.toFixed(1)} ${cy(0).toFixed(1)}` +
      ` L ${pts[0].x.toFixed(1)} ${cy(0).toFixed(1)} Z`;

    return { pts, linePath, areaPath, cx, cy, xMin, xMax, yMax };
  }

  const fc = buildLineChart(finishersData, 600);   // finishers chart
  const wc = buildLineChart(womenData, 55);         // women % chart

  // Axis ticks
  const xTicksF = [1980, 1990, 2000, 2010, 2020];
  const yTicksF = [0, 150, 300, 450, 600];

  const xTicksW = [1980, 1990, 2000, 2010, 2020];
  const yTicksW = [0, 10, 20, 30, 40, 50];

  // ─── BAR CHART (MAJORS) ──────────────────────────────────────────────────

  const BW = 660;
  const bPadL = 82, bPadR = 55, bPadT = 16, bPadB = 12;
  const barH = 40, barGap = 14;
  const bMax = 55;
  const bPlotW = BW - bPadL - bPadR;   // 523
  const BH = bPadT + majors.length * (barH + barGap) - barGap + bPadB;  // ~318

  const bx   = pct => bPadL + (pct / bMax) * bPlotW;
  const bTop  = i   => bPadT + i * (barH + barGap);
  const bMid  = i   => bTop(i) + barH / 2;

  // reference line position for 50%
  const refX = bx(50);
</script>

<svelte:head>
  <title>everyone's running a marathon now | andrea.fyi</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="page">

  <a href="/" class="back-link">← andrea.fyi</a>

  <!-- ── Essay header ── -->
  <header class="essay-header">
    <div class="header-tags">
      <span class="tag">running</span>
      <span class="tag">data</span>
    </div>
    <h1 class="essay-title">everyone's running a marathon now</h1>
    <p class="deck">i got curious about whether this was actually a thing. turns out: it really is.</p>
    <p class="meta">April 2026 · 5 min read</p>
  </header>

  <!-- ── Intro ── -->
  <p class="body">
    A few months ago I started thinking about running a marathon. Not training for one—just thinking. The idea kept showing up: in conversations, in my feed, in the fact that three people I know ran one last fall. So I started wondering whether this was a genuine cultural shift or just my particular bubble.
  </p>
  <p class="body">
    I pulled some data. Here's what I found.
  </p>

  <!-- ── Section 1: The boom ── -->
  <h2 class="section-head">the numbers don't lie</h2>

  <p class="body">
    In 1980, about 143,000 people finished a marathon in the United States. By 2014—the peak year—that number had grown to over 550,000. That's a 285% increase in 34 years. Even after COVID decimated race calendars in 2020, participation bounced back fast. By 2023, US finishers were approaching half a million again.
  </p>

  <!-- Chart 1: US Finishers -->
  <div class="chart-block">
    <p class="chart-title">US marathon finishers, 1980–2023</p>
    <div class="chart-wrap">
      <svg viewBox="0 0 {CW} {CH}" width="100%" aria-label="Line chart showing US marathon finisher growth from 143,000 in 1980 to 551,000 in 2014, with a sharp dip in 2020">

        <!-- Grid lines -->
        {#each yTicksF as tick}
          {#if tick > 0}
            <line
              x1={PAD.l} y1={fc.cy(tick)}
              x2={CW - PAD.r} y2={fc.cy(tick)}
              stroke="#e8e8e8" stroke-width="1" stroke-dasharray="4 4"
            />
          {/if}
        {/each}

        <!-- Area fill -->
        <path d={fc.areaPath} fill="rgba(255,214,0,0.18)" />

        <!-- COVID annotation band -->
        <rect
          x={fc.cx(2019.5)} y={PAD.t}
          width={fc.cx(2021) - fc.cx(2019.5)}
          height={plotH}
          fill="rgba(255,80,80,0.08)"
        />

        <!-- Line -->
        <path d={fc.linePath} fill="none" stroke="#1a1a1a" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />

        <!-- Data dots -->
        {#each fc.pts as pt}
          <circle cx={pt.x} cy={pt.y} r="3.5" fill="#1a1a1a" />
        {/each}

        <!-- Axes -->
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + plotH} stroke="#1a1a1a" stroke-width="2" />
        <line x1={PAD.l} y1={PAD.t + plotH} x2={CW - PAD.r} y2={PAD.t + plotH} stroke="#1a1a1a" stroke-width="2" />

        <!-- Y axis labels -->
        {#each yTicksF as tick}
          <text x={PAD.l - 8} y={fc.cy(tick) + 4} text-anchor="end" font-family="Space Grotesk, sans-serif" font-size="11" fill="#999">
            {tick === 0 ? '0' : tick + 'k'}
          </text>
        {/each}

        <!-- X axis labels -->
        {#each xTicksF as yr}
          <text x={fc.cx(yr)} y={PAD.t + plotH + 18} text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="11" fill="#999">
            {yr}
          </text>
        {/each}

        <!-- COVID label -->
        <text x={fc.cx(2020)} y={fc.cy(145) - 10} text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="10" fill="#cc4444">
          COVID
        </text>

        <!-- Peak label -->
        <text x={fc.cx(2014) - 6} y={fc.cy(551) - 10} text-anchor="end" font-family="Space Grotesk, sans-serif" font-size="10" font-weight="700" fill="#1a1a1a">
          551k peak
        </text>
      </svg>
    </div>
    <p class="chart-note">US finishers only. Source: Running USA annual reports; estimates for 1985–1995 based on academic research. 2020 reflects COVID-related race cancellations.</p>
  </div>

  <p class="body">
    The global picture is similar. Worldwide, roughly 1.3 million people complete a marathon every year. Marathon participation grew 49% globally between 2008 and 2018 alone—with Asia leading at 263% growth over that same decade.
  </p>

  <!-- ── Section 2: Milestones ── -->
  <h2 class="section-head">a brief history of who got to run</h2>

  <p class="body">
    The growth story is interesting. But the story of who was <em>allowed</em> to participate is what really got me.
  </p>

  <div class="milestones">
    <div class="milestone">
      <div class="milestone-year">1896</div>
      <div class="milestone-dot"></div>
      <div class="milestone-text">
        <strong>Men only.</strong> The modern Olympic marathon is revived in Athens. Women are deemed too fragile for the distance. This assumption will persist, officially, for nearly a century.
      </div>
    </div>
    <div class="milestone">
      <div class="milestone-year">1967</div>
      <div class="milestone-dot"></div>
      <div class="milestone-text">
        <strong>Kathrine Switzer gets bib #261.</strong> She registers for Boston with her initials—K.V. Switzer—and the race doesn't realize. A mile in, race director Jock Semple tries to physically pull her off the course. Her boyfriend tackles him. She finishes.
      </div>
    </div>
    <div class="milestone">
      <div class="milestone-year">1972</div>
      <div class="milestone-dot"></div>
      <div class="milestone-text">
        <strong>Boston officially opens to women.</strong> Nine women enter. All eight who start finish. The number will grow every year after.
      </div>
    </div>
    <div class="milestone">
      <div class="milestone-year">1984</div>
      <div class="milestone-dot"></div>
      <div class="milestone-text">
        <strong>First women's Olympic marathon.</strong> Los Angeles. Joan Benoit of the United States wins in 2:24:52. The crowd loses its mind. It took 88 years from the first modern Olympics for women to run the distance at the Games.
      </div>
    </div>
    <div class="milestone">
      <div class="milestone-year">2017</div>
      <div class="milestone-dot"></div>
      <div class="milestone-text">
        <strong>Peak year.</strong> Women make up 47% of all US marathon finishers—the highest ever recorded. From essentially zero to nearly half, in a single lifetime.
      </div>
    </div>
  </div>

  <!-- ── Section 3: Women's arc ── -->
  <h2 class="section-head">the steeper curve</h2>

  <p class="body">
    If the overall growth in marathon participation is impressive, the women's participation curve is something else. In 1980, women made up about 10.5% of US marathon finishers. Today that number is around 41–44%. That's a rise from roughly 1 in 10 to nearly 1 in 2—in four decades.
  </p>
  <p class="body">
    Women's marathon participation grew 57% between 2008 and 2018, outpacing men's growth of 47% over the same period. The trend has leveled off and even dipped slightly since 2017, but the scale of the transformation is still remarkable.
  </p>

  <!-- Chart 2: Women's % -->
  <div class="chart-block chart-block-pink">
    <p class="chart-title">women as % of US marathon finishers, 1980–2024</p>
    <div class="chart-wrap">
      <svg viewBox="0 0 {CW} {CH}" width="100%" aria-label="Area chart showing women's share rising from 10.5% in 1980 to a peak of 47% in 2017, then declining slightly to 41% in 2024">

        <!-- Grid lines -->
        {#each yTicksW as tick}
          {#if tick > 0}
            <line
              x1={PAD.l} y1={wc.cy(tick)}
              x2={CW - PAD.r} y2={wc.cy(tick)}
              stroke="#e8e8e8" stroke-width="1" stroke-dasharray="4 4"
            />
          {/if}
        {/each}

        <!-- 50% reference line -->
        <line
          x1={PAD.l} y1={wc.cy(50)}
          x2={CW - PAD.r} y2={wc.cy(50)}
          stroke="#e83e6c" stroke-width="1" stroke-dasharray="6 4" opacity="0.5"
        />
        <text x={CW - PAD.r + 4} y={wc.cy(50) + 4} font-family="Space Grotesk, sans-serif" font-size="10" fill="#e83e6c" opacity="0.7">50%</text>

        <!-- Area fill -->
        <path d={wc.areaPath} fill="rgba(232,62,108,0.12)" />

        <!-- Line -->
        <path d={wc.linePath} fill="none" stroke="#e83e6c" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />

        <!-- Data dots -->
        {#each wc.pts as pt}
          <circle cx={pt.x} cy={pt.y} r="3.5" fill="#e83e6c" />
        {/each}

        <!-- Axes -->
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + plotH} stroke="#1a1a1a" stroke-width="2" />
        <line x1={PAD.l} y1={PAD.t + plotH} x2={CW - PAD.r} y2={PAD.t + plotH} stroke="#1a1a1a" stroke-width="2" />

        <!-- Y axis labels -->
        {#each yTicksW as tick}
          <text x={PAD.l - 8} y={wc.cy(tick) + 4} text-anchor="end" font-family="Space Grotesk, sans-serif" font-size="11" fill="#999">
            {tick}%
          </text>
        {/each}

        <!-- X axis labels -->
        {#each xTicksW as yr}
          <text x={wc.cx(yr)} y={PAD.t + plotH + 18} text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="11" fill="#999">
            {yr}
          </text>
        {/each}

        <!-- Callout: 1980 start -->
        <text x={wc.cx(1980) + 8} y={wc.cy(10.5) - 10} text-anchor="start" font-family="Space Grotesk, sans-serif" font-size="10" fill="#e83e6c">
          10.5%
        </text>

        <!-- Callout: 2017 peak -->
        <text x={wc.cx(2017)} y={wc.cy(47) - 10} text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="10" font-weight="700" fill="#e83e6c">
          47% peak
        </text>
      </svg>
    </div>
    <p class="chart-note">US data. Source: Running USA; <em>Exploring Women's Marathon Participation in the United States, 1980–2019</em> (academic research). Intermediate years are estimates.</p>
  </div>

  <!-- ── Section 4: World Majors ── -->
  <h2 class="section-head">not the same everywhere</h2>

  <p class="body">
    The six World Marathon Majors—Boston, NYC, Chicago, London, Berlin, and Tokyo—are the most prestigious races in the world. Look at the women's share at each one, and you see a wide spread.
  </p>
  <p class="body">
    NYC, Chicago, and Boston are all north of 44%. Tokyo sits at about 27%. Part of that is structural—Tokyo's qualification standards and lottery system work differently from the others—but it's also a reflection of local running culture. Berlin comes in at 34%, which is notably lower than the other European major, London, at 40%.
  </p>

  <!-- Chart 3: World Majors bar chart -->
  <div class="chart-block">
    <p class="chart-title">women's % at each World Marathon Major, 2023–24</p>
    <div class="chart-wrap">
      <svg viewBox="0 0 {BW} {BH}" width="100%" aria-label="Horizontal bar chart showing women's percentage at each World Marathon Major, ranging from NYC at 46% to Tokyo at 27%">

        <!-- 50% reference line -->
        <line
          x1={refX} y1={bPadT - 6}
          x2={refX} y2={BH - bPadB}
          stroke="#999" stroke-width="1" stroke-dasharray="5 4"
        />
        <text x={refX} y={bPadT - 10} text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="10" fill="#aaa">50%</text>

        {#each majors as m, i}
          <!-- Bar -->
          <rect
            x={bPadL}
            y={bTop(i)}
            width={bx(m.pct) - bPadL}
            height={barH}
            fill={m.pct >= 44 ? '#1a1a1a' : m.pct >= 35 ? '#555' : '#999'}
          />

          <!-- Race name (left) -->
          <text
            x={bPadL - 10}
            y={bMid(i) + 5}
            text-anchor="end"
            font-family="Space Grotesk, sans-serif"
            font-size="13"
            font-weight="700"
            fill="#1a1a1a"
          >{m.name}</text>

          <!-- Percentage (right of bar) -->
          <text
            x={bx(m.pct) + 8}
            y={bMid(i) + 5}
            text-anchor="start"
            font-family="Space Grotesk, sans-serif"
            font-size="13"
            font-weight="700"
            fill="#1a1a1a"
          >{m.pct}%</text>
        {/each}
      </svg>
    </div>
    <p class="chart-note">Approximate figures based on reported 2023–24 finisher data. Tokyo's lower figure reflects its selective qualification system and local running demographics.</p>
  </div>

  <!-- ── Closing ── -->
  <p class="body closing">
    I still haven't run a marathon. But I did spend an afternoon pulling this data, which I'm going to count as training.
  </p>
  <p class="body">
    The thing that stuck with me: the story of marathon running isn't just a story about a sport growing. It's a story about who gets to participate in things—and how slowly, and then quickly, that changes.
  </p>

  <!-- ── Data notes ── -->
  <div class="data-notes">
    <p class="data-notes-head">data notes</p>
    <p>US finisher data: Running USA annual reports (2000–2023). Earlier figures from academic research, including <em>Exploring Women's Marathon Participation in the United States, 1980–2019</em>. Years without reported figures are estimates based on known trend data. Global figures from RunRepeat 2019 worldwide research. World Majors women's percentages are approximate, based on publicly reported 2023–24 finisher breakdowns.</p>
  </div>

</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: #ffffff;
    color: #1a1a1a;
    font-family: 'Space Grotesk', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  :global(::selection) {
    background: #1a1a1a;
    color: #ffffff;
  }

  .page {
    max-width: 720px;
    margin: 0 auto;
    padding: 3rem 2rem 6rem;
  }

  /* ── Back link ── */
  .back-link {
    font-size: 0.85rem;
    font-weight: 700;
    color: #1a1a1a;
    text-decoration: none;
    border: 2px solid #1a1a1a;
    padding: 0.3rem 0.8rem;
    background: #fff;
    box-shadow: 3px 3px 0 #1a1a1a;
    display: inline-block;
    margin-bottom: 3.5rem;
    transition: transform 0.1s, box-shadow 0.1s;
  }

  .back-link:hover {
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0 #1a1a1a;
  }

  /* ── Essay header ── */
  .essay-header {
    margin-bottom: 2.5rem;
  }

  .header-tags {
    display: flex;
    gap: 0.45rem;
    margin-bottom: 1rem;
  }

  .tag {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    border: 2px solid #1a1a1a;
    padding: 0.15rem 0.55rem;
    background: #fff7e0;
  }

  .essay-title {
    font-size: 2.8rem;
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -1px;
    margin: 0 0 0.75rem 0;
  }

  .deck {
    font-size: 1.15rem;
    color: #555;
    margin: 0 0 0.6rem 0;
    line-height: 1.5;
  }

  .meta {
    font-size: 0.78rem;
    color: #aaa;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  /* ── Body text ── */
  .body {
    font-size: 1.05rem;
    line-height: 1.75;
    color: #2a2a2a;
    margin: 0 0 1.2rem 0;
    max-width: 640px;
  }

  .body em {
    font-style: italic;
  }

  .closing {
    margin-top: 2.5rem;
  }

  /* ── Section headings ── */
  .section-head {
    font-size: 1.35rem;
    font-weight: 700;
    margin: 3rem 0 1rem;
    letter-spacing: -0.3px;
    border-left: 4px solid #1a1a1a;
    padding-left: 0.75rem;
  }

  /* ── Charts ── */
  .chart-block {
    margin: 2rem 0 2.5rem;
    border: 3px solid #1a1a1a;
    box-shadow: 6px 6px 0 #1a1a1a;
    background: #fff;
    padding: 1.25rem 1.25rem 0.75rem;
  }

  .chart-block-pink {
    border-color: #e83e6c;
    box-shadow: 6px 6px 0 #e83e6c;
  }

  .chart-title {
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin: 0 0 0.75rem 0;
    color: #555;
  }

  .chart-wrap {
    overflow: hidden;
  }

  .chart-note {
    font-size: 0.72rem;
    color: #aaa;
    margin: 0.6rem 0 0;
    line-height: 1.5;
    font-style: italic;
  }

  /* ── Milestone timeline ── */
  .milestones {
    margin: 1.5rem 0 2rem;
    position: relative;
  }

  .milestone {
    display: grid;
    grid-template-columns: 52px 24px 1fr;
    gap: 0 0.75rem;
    margin-bottom: 1.5rem;
    align-items: start;
  }

  .milestone-year {
    font-size: 0.85rem;
    font-weight: 700;
    color: #888;
    padding-top: 2px;
    text-align: right;
  }

  .milestone-dot {
    width: 12px;
    height: 12px;
    background: #1a1a1a;
    border: 2px solid #1a1a1a;
    border-radius: 50%;
    margin-top: 4px;
    flex-shrink: 0;
    position: relative;
  }

  .milestone-dot::before {
    content: '';
    position: absolute;
    left: 3px;
    top: 12px;
    width: 1px;
    height: calc(100% + 26px);
    background: #ddd;
  }

  .milestone:last-child .milestone-dot::before {
    display: none;
  }

  .milestone-text {
    font-size: 0.95rem;
    line-height: 1.6;
    color: #333;
  }

  .milestone-text strong {
    color: #1a1a1a;
    font-weight: 700;
  }

  /* ── Data notes ── */
  .data-notes {
    margin-top: 4rem;
    padding-top: 1.5rem;
    border-top: 2px solid #e8e8e8;
  }

  .data-notes-head {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #aaa;
    margin: 0 0 0.6rem 0;
  }

  .data-notes p:last-child {
    font-size: 0.78rem;
    color: #bbb;
    line-height: 1.65;
    margin: 0;
  }

  /* ── Responsive ── */
  @media (max-width: 600px) {
    .essay-title {
      font-size: 2rem;
    }

    .section-head {
      font-size: 1.15rem;
    }

    .body {
      font-size: 0.98rem;
    }

    .chart-block {
      padding: 1rem 0.75rem 0.75rem;
      margin: 1.5rem -0.25rem;
    }

    .deck {
      font-size: 1rem;
    }
  }
</style>
