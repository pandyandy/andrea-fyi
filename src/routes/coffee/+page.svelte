<script>
  import { onMount } from 'svelte';

  const coffees = [
    { id: 'espresso',    name: 'Espresso',        icon: '☕', mg: 63,  desc: 'single shot' },
    { id: 'double',      name: 'Double Espresso', icon: '⚡', mg: 126, desc: 'two shots' },
    { id: 'latte',       name: 'Latte',           icon: '🥛', mg: 63,  desc: 'milky & smooth' },
    { id: 'cappuccino',  name: 'Cappuccino',      icon: '☁️', mg: 63,  desc: 'fluffy foam' },
    { id: 'flat-white',  name: 'Flat White',      icon: '🫖', mg: 130, desc: 'strong & silky' },
    { id: 'filter',      name: 'Filter Coffee',   icon: '🫘', mg: 150, desc: 'classic drip' },
    { id: 'cold-brew',   name: 'Cold Brew',       icon: '🧊', mg: 200, desc: 'ice cold beast' },
    { id: 'iced-latte',  name: 'Iced Latte',      icon: '🧋', mg: 100, desc: 'chilled & sweet' },
    { id: 'matcha',      name: 'Matcha Latte',    icon: '🍵', mg: 70,  desc: 'green & calm' },
  ];

  let selectedCoffee = null;
  let drinkTime = '';
  let bedTime = '23:00';

  // caffeine half-life ~5h; below 25mg is considered negligible for sleep
  const HALF_LIFE = 5;
  const THRESHOLD = 25;

  onMount(() => {
    const now = new Date();
    drinkTime = now.toTimeString().slice(0, 5);
  });

  function timeToMins(t) {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  }

  function minsToTimeStr(totalMins) {
    const wrapped = ((totalMins % 1440) + 1440) % 1440;
    const h = Math.floor(wrapped / 60);
    const m = wrapped % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  $: result = (() => {
    if (!selectedCoffee || !drinkTime || !bedTime) return null;

    const drinkMins = timeToMins(drinkTime);
    let bedMins = timeToMins(bedTime);
    if (bedMins <= drinkMins) bedMins += 1440; // next day

    const hoursUntilBed = (bedMins - drinkMins) / 60;
    const mg = selectedCoffee.mg;

    // caffeine remaining at bedtime via half-life decay
    const atBed = mg * Math.pow(0.5, hoursUntilBed / HALF_LIFE);

    // hours until caffeine drops to negligible threshold
    const hoursToClear = mg > THRESHOLD
      ? HALF_LIFE * Math.log2(mg / THRESHOLD)
      : 0;

    const clearTime = minsToTimeStr(drinkMins + Math.round(hoursToClear * 60));
    const hoursOverBed = Math.max(0, hoursToClear - hoursUntilBed);

    let status, headline, detail;
    if (atBed <= THRESHOLD) {
      status = 'ok';
      headline = 'you\'re good! go for it';
      detail = `caffeine drops to ~${Math.round(atBed)}mg by bedtime — basically nothing. enjoy!`;
    } else if (atBed <= 55) {
      status = 'borderline';
      headline = 'it\'s a bit risky...';
      detail = `~${Math.round(atBed)}mg still in your system at bedtime. might mess with your sleep a little.`;
    } else {
      status = 'late';
      headline = 'too late!';
      detail = `~${Math.round(atBed)}mg still buzzing at bedtime. caffeine won't fully clear until around ${clearTime}.`;
    }

    return {
      atBed: Math.round(atBed),
      hoursToClear: Math.round(hoursToClear * 10) / 10,
      clearTime,
      hoursUntilBed: Math.round(hoursUntilBed * 10) / 10,
      hoursOverBed: Math.round(hoursOverBed * 10) / 10,
      status,
      headline,
      detail,
    };
  })();
</script>

<svelte:head>
  <title>coffee regrets | andrea.fyi</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="page">
  <a href="/" class="back-link">&larr; back</a>

  <div class="content">
    <h1 class="title">will i regret this coffee?</h1>

    <section class="section">
      <span class="section-label">1. pick your poison</span>
      <div class="coffee-grid">
        {#each coffees as coffee}
          <button
            class="coffee-card {selectedCoffee?.id === coffee.id ? 'selected' : ''}"
            on:click={() => selectedCoffee = coffee}
          >
            <span class="coffee-icon">{coffee.icon}</span>
            <span class="coffee-name">{coffee.name}</span>
            <span class="coffee-desc">{coffee.desc}</span>
            <span class="coffee-mg">{coffee.mg}mg</span>
          </button>
        {/each}
      </div>
    </section>

    <section class="section times-section">
      <div class="time-field">
        <label class="section-label" for="drink-time">2. drinking it at</label>
        <input id="drink-time" type="time" bind:value={drinkTime} class="time-input" />
      </div>
      <div class="time-field">
        <label class="section-label" for="bed-time">3. going to bed at</label>
        <input id="bed-time" type="time" bind:value={bedTime} class="time-input" />
      </div>
    </section>

    {#if result}
      <section class="result result-{result.status}">
        <p class="result-headline">{result.headline}</p>
        <p class="result-detail">{result.detail}</p>
        <div class="result-stats">
          <div class="stat">
            <span class="stat-label">time until bed</span>
            <span class="stat-value">{result.hoursUntilBed}h</span>
          </div>
          <div class="stat">
            <span class="stat-label">at bedtime</span>
            <span class="stat-value">~{result.atBed}mg</span>
          </div>
          <div class="stat">
            <span class="stat-label">fully clears by</span>
            <span class="stat-value">{result.clearTime}</span>
          </div>
          {#if result.hoursOverBed > 0}
            <div class="stat stat-warn">
              <span class="stat-label">active after bed</span>
              <span class="stat-value">{result.hoursOverBed}h more</span>
            </div>
          {/if}
        </div>
        <p class="footnote">based on 5h caffeine half-life · individual variation applies</p>
      </section>
    {:else}
      <div class="hint">← pick a coffee to see if you'll regret it</div>
    {/if}
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

  .page {
    max-width: 820px;
    margin: 0 auto;
    padding: 3rem 2rem;
    min-height: 100vh;
  }

  .back-link {
    font-size: 1rem;
    font-weight: 600;
    color: #1a1a1a;
    text-decoration: none;
    border: 3px solid #1a1a1a;
    padding: 0.4rem 1rem;
    background: #ffffff;
    box-shadow: 4px 4px 0px #1a1a1a;
    display: inline-block;
    transition: transform 0.1s, box-shadow 0.1s;
  }

  .back-link:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px #1a1a1a;
  }

  .back-link:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px #1a1a1a;
  }

  .content {
    margin-top: 3rem;
  }

  .title {
    font-size: 2.8rem;
    font-weight: 700;
    margin: 0 0 2.5rem 0;
  }

  .section {
    margin-bottom: 2rem;
  }

  .section-label {
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin: 0 0 0.75rem 0;
    display: block;
    color: #555;
  }

  /* Coffee grid */
  .coffee-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.6rem;
  }

  .coffee-card {
    border: 3px solid #1a1a1a;
    background: #ffffff;
    box-shadow: 3px 3px 0px #1a1a1a;
    padding: 0.85rem 0.6rem;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
    text-align: center;
    font-family: 'Space Grotesk', sans-serif;
    transition: transform 0.1s, box-shadow 0.1s, background 0.1s;
  }

  .coffee-card:hover {
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0px #1a1a1a;
    background: #fafafa;
  }

  .coffee-card.selected {
    background: #fff7b0;
    box-shadow: 5px 5px 0px #1a1a1a;
    transform: translate(-1px, -1px);
  }

  .coffee-icon {
    font-size: 2rem;
    line-height: 1;
  }

  .coffee-name {
    font-weight: 700;
    font-size: 0.82rem;
    color: #1a1a1a;
  }

  .coffee-desc {
    font-size: 0.7rem;
    color: #666;
  }

  .coffee-mg {
    font-size: 0.72rem;
    font-weight: 700;
    border: 2px solid #1a1a1a;
    padding: 0.1rem 0.35rem;
    background: #f0f0f0;
    margin-top: 0.25rem;
  }

  /* Time inputs */
  .times-section {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .time-field {
    flex: 1;
    min-width: 180px;
    display: flex;
    flex-direction: column;
  }

  .time-input {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.6rem;
    font-weight: 700;
    border: 3px solid #1a1a1a;
    padding: 0.5rem 0.9rem;
    box-shadow: 4px 4px 0px #1a1a1a;
    background: #ffffff;
    width: 100%;
    cursor: pointer;
    outline: none;
    color: #1a1a1a;
    transition: background 0.1s;
  }

  .time-input:focus {
    background: #fff7b0;
  }

  /* Result box */
  .result {
    border: 3px solid #1a1a1a;
    padding: 1.5rem;
    box-shadow: 5px 5px 0px #1a1a1a;
    margin-top: 0.5rem;
  }

  .result-ok         { background: #c8f7c5; }
  .result-borderline { background: #fff7b0; }
  .result-late       { background: #ffd4d4; }

  .result-headline {
    font-size: 1.6rem;
    font-weight: 700;
    margin: 0 0 0.4rem 0;
  }

  .result-detail {
    font-size: 1rem;
    margin: 0 0 1.25rem 0;
    color: #333;
    line-height: 1.5;
  }

  .result-stats {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  .stat {
    border: 2px solid #1a1a1a;
    padding: 0.45rem 0.75rem;
    background: rgba(255, 255, 255, 0.55);
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    min-width: 100px;
  }

  .stat-warn {
    background: rgba(255, 100, 100, 0.15);
  }

  .stat-label {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #555;
  }

  .stat-value {
    font-size: 1.1rem;
    font-weight: 700;
  }

  .footnote {
    font-size: 0.7rem;
    color: #888;
    margin: 0;
    font-style: italic;
  }

  .hint {
    margin-top: 0.5rem;
    font-size: 0.95rem;
    color: #999;
    font-style: italic;
    padding: 1rem 0;
  }

  @media (max-width: 600px) {
    .coffee-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .title {
      font-size: 2rem;
    }

    .time-input {
      font-size: 1.2rem;
    }

    .result-headline {
      font-size: 1.3rem;
    }
  }
</style>
