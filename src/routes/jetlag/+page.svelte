<script>
  const timezones = [
    { value: -12,   label: 'UTC−12  Baker Island' },
    { value: -11,   label: 'UTC−11  American Samoa, Niue' },
    { value: -10,   label: 'UTC−10  Hawaii' },
    { value: -9,    label: 'UTC−9   Alaska' },
    { value: -8,    label: 'UTC−8   Los Angeles, Vancouver' },
    { value: -7,    label: 'UTC−7   Denver, Phoenix' },
    { value: -6,    label: 'UTC−6   Chicago, Mexico City' },
    { value: -5,    label: 'UTC−5   New York, Toronto' },
    { value: -4,    label: 'UTC−4   Halifax, Caracas' },
    { value: -3,    label: 'UTC−3   Sao Paulo, Buenos Aires' },
    { value: -2,    label: 'UTC−2   Mid-Atlantic' },
    { value: -1,    label: 'UTC−1   Azores, Cape Verde' },
    { value: 0,     label: 'UTC+0   London, Dublin, Lisbon' },
    { value: 1,     label: 'UTC+1   Paris, Berlin, Rome' },
    { value: 2,     label: 'UTC+2   Cairo, Athens, Helsinki' },
    { value: 3,     label: 'UTC+3   Moscow, Istanbul, Nairobi' },
    { value: 3.5,   label: 'UTC+3:30  Tehran' },
    { value: 4,     label: 'UTC+4   Dubai, Baku' },
    { value: 4.5,   label: 'UTC+4:30  Kabul' },
    { value: 5,     label: 'UTC+5   Karachi, Tashkent' },
    { value: 5.5,   label: 'UTC+5:30  Mumbai, Delhi' },
    { value: 5.75,  label: 'UTC+5:45  Kathmandu' },
    { value: 6,     label: 'UTC+6   Dhaka, Almaty' },
    { value: 6.5,   label: 'UTC+6:30  Yangon' },
    { value: 7,     label: 'UTC+7   Bangkok, Hanoi, Jakarta' },
    { value: 8,     label: 'UTC+8   Singapore, Beijing, Hong Kong' },
    { value: 8.75,  label: 'UTC+8:45  Eucla, Australia' },
    { value: 9,     label: 'UTC+9   Tokyo, Seoul' },
    { value: 9.5,   label: 'UTC+9:30  Adelaide, Darwin' },
    { value: 10,    label: 'UTC+10  Sydney, Melbourne' },
    { value: 11,    label: 'UTC+11  Vladivostok, Solomon Islands' },
    { value: 12,    label: 'UTC+12  Auckland, Fiji' },
    { value: 13,    label: 'UTC+13  Apia, Tonga' },
  ];

  let homeOffset = '';
  let destOffset = '';
  let wakeTime = '07:00';
  let bedTime = '23:00';
  let preTravelAdjust = false;

  function timeToMins(t) {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  }

  function wrapMins(m) {
    return ((Math.round(m) % 1440) + 1440) % 1440;
  }

  function minsToStr(m) {
    const w = wrapMins(m);
    const h = Math.floor(w / 60);
    const mn = w % 60;
    return `${String(h).padStart(2, '0')}:${String(mn).padStart(2, '0')}`;
  }

  function getLightAndMeds(wakeMins, bedMins, direction) {
    const caffeineStop = minsToStr(wrapMins(bedMins - 6 * 60));
    let lightSeek, lightAvoid, melatonin;

    if (direction === 'east') {
      // Phase advance: morning light pushes clock earlier
      lightSeek = {
        from: minsToStr(wakeMins),
        to: minsToStr(wrapMins(wakeMins + 3 * 60)),
        label: 'SEEK bright light',
        hint: 'go outside, light therapy box, or sit by a window',
      };
      lightAvoid = {
        from: minsToStr(wrapMins(bedMins - 2 * 60)),
        to: minsToStr(bedMins),
        label: 'AVOID blue light',
        hint: 'dim screens, blue-light glasses, or candlelight',
      };
      melatonin = {
        time: minsToStr(wrapMins(bedMins - 2 * 60)),
        dose: '0.5mg',
        hint: 'low dose signals earlier nighttime to your brain',
      };
    } else {
      // Phase delay: evening light pushes clock later
      lightSeek = {
        from: minsToStr(wrapMins(bedMins - 3 * 60)),
        to: minsToStr(wrapMins(bedMins - 60)),
        label: 'SEEK evening light',
        hint: 'bright light in the evening delays your clock',
      };
      lightAvoid = {
        from: minsToStr(wakeMins),
        to: minsToStr(wrapMins(wakeMins + 2 * 60)),
        label: 'AVOID morning light',
        hint: 'blackout curtains, sunglasses if going outside',
      };
      melatonin = null; // westward travel: light alone is usually enough
    }

    return { caffeineStop, lightSeek, lightAvoid, melatonin };
  }

  $: plan = (() => {
    if (homeOffset === '' || destOffset === '' || !wakeTime || !bedTime) return null;

    const homeOff = parseFloat(homeOffset);
    const destOff = parseFloat(destOffset);

    // Raw difference in minutes; positive = eastward
    let deltaMins = (destOff - homeOff) * 60;

    // Always take the shorter path around the globe
    if (deltaMins > 12 * 60) deltaMins -= 24 * 60;
    if (deltaMins < -12 * 60) deltaMins += 24 * 60;

    const absDelta = Math.abs(deltaMins);
    if (absDelta < 30) return { sameZone: true };

    const direction = deltaMins > 0 ? 'east' : 'west';
    const dirSign = direction === 'east' ? 1 : -1; // +1 east, -1 west

    const shiftPerDay = 90; // minutes the circadian clock can shift per day
    const homeWake = timeToMins(wakeTime);
    const homeBed = timeToMins(bedTime);

    // Pre-travel: max 3 days, each shifts sleep by shiftPerDay in the right direction
    const preDays = preTravelAdjust ? Math.min(3, Math.ceil(absDelta / shiftPerDay)) : 0;
    const preTravelShiftMins = preDays * shiftPerDay;

    const days = [];

    // --- Pre-travel days (shown in home timezone) ---
    for (let i = preDays; i >= 1; i--) {
      // Day furthest from departure has smallest shift, builds each day
      const dayShift = (preDays - i + 1) * shiftPerDay;
      // East = sleep earlier (subtract); West = sleep later (add)
      const wake = wrapMins(homeWake - dirSign * dayShift);
      const bed  = wrapMins(homeBed  - dirSign * dayShift);
      const meds = getLightAndMeds(wake, bed, direction);
      const shiftHours = (dayShift / 60).toFixed(1).replace('.0', '');

      days.push({
        type: 'pre-travel',
        label: i === 1 ? 'Night before departure' : `${i} nights before departure`,
        tzLabel: 'home time',
        wake: minsToStr(wake),
        bed: minsToStr(bed),
        ...meds,
        shiftNote: direction === 'east'
          ? `Shift sleep ${shiftHours}h earlier than your normal schedule`
          : `Shift sleep ${shiftHours}h later than your normal schedule`,
      });
    }

    // --- Travel day ---
    days.push({
      type: 'travel',
      label: 'Travel day',
      tzLabel: null,
      wake: minsToStr(homeWake),
      bed: null,
      caffeineStop: null,
      lightSeek: null,
      lightAvoid: null,
      melatonin: null,
      travelNote: direction === 'east'
        ? 'Try to sleep during destination night hours on the plane. Set your watch to destination time immediately. Seek sunlight on arrival if it is daytime there.'
        : 'Stay awake until your destination bedtime. Avoid napping en route. Seek bright evening light once you land.',
    });

    // --- Post-arrival days (shown in destination timezone) ---
    // Where body clock sits in destination local time on arrival:
    // homeWake + deltaMins = homeWake in dest clock (east: body wakes "late" in dest time)
    // minus pre-travel already done: subtract dirSign * preTravelShiftMins
    const bodyWakeInDest = wrapMins(homeWake + deltaMins - dirSign * preTravelShiftMins);
    const bodyBedInDest  = wrapMins(homeBed  + deltaMins - dirSign * preTravelShiftMins);

    const remainingShift = Math.max(0, absDelta - preTravelShiftMins);
    // Always show at least 1 post-arrival day
    const postDays = remainingShift < 30 ? 1 : Math.ceil(remainingShift / shiftPerDay);

    for (let d = 1; d <= postDays; d++) {
      const shiftApplied = d * shiftPerDay;
      const fullyAdjusted = shiftApplied >= remainingShift;

      // Each day the body clock moves shiftPerDay toward the target
      // East: body wakes too late in dest → shift earlier (subtract)
      // West: body wakes too early in dest → shift later (add)
      const wake = fullyAdjusted ? homeWake : wrapMins(bodyWakeInDest - dirSign * shiftApplied);
      const bed  = fullyAdjusted ? homeBed  : wrapMins(bodyBedInDest  - dirSign * shiftApplied);
      const meds = getLightAndMeds(wake, bed, direction);

      days.push({
        type: fullyAdjusted ? 'adjusted' : 'post-arrival',
        label: d === 1 ? 'Arrival day' : `Day +${d}`,
        tzLabel: 'destination time',
        wake: minsToStr(wake),
        bed: minsToStr(bed),
        ...meds,
        adjustProgress: Math.min(1, (preTravelShiftMins + shiftApplied) / absDelta),
        fullyAdjusted,
      });
    }

    return {
      sameZone: false,
      deltaHours: Math.abs(deltaMins / 60),
      direction,
      days,
      totalDays: preDays + 1 + postDays,
    };
  })();
</script>

<svelte:head>
  <title>jet lag planner | andrea.fyi</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="page">
  <a href="/" class="back-link">&larr; back</a>

  <div class="content">
    <h1 class="title">jet lag planner</h1>
    <p class="subtitle">a custom itinerary to reset your circadian clock</p>

    <div class="setup-grid">

      <section class="section">
        <span class="section-label">1. your trip</span>
        <div class="tz-row">
          <div class="tz-field">
            <label class="field-label" for="home-tz">flying from</label>
            <select id="home-tz" class="tz-select" bind:value={homeOffset}>
              <option value="" disabled>select timezone</option>
              {#each timezones as tz}
                <option value={tz.value}>{tz.label}</option>
              {/each}
            </select>
          </div>
          <div class="arrow-between">&#8594;</div>
          <div class="tz-field">
            <label class="field-label" for="dest-tz">flying to</label>
            <select id="dest-tz" class="tz-select" bind:value={destOffset}>
              <option value="" disabled>select timezone</option>
              {#each timezones as tz}
                <option value={tz.value}>{tz.label}</option>
              {/each}
            </select>
          </div>
        </div>
      </section>

      <section class="section">
        <span class="section-label">2. your usual sleep schedule</span>
        <div class="times-row">
          <div class="time-field">
            <label class="field-label" for="wake-time">i normally wake up at</label>
            <input id="wake-time" type="time" class="time-input" bind:value={wakeTime} />
          </div>
          <div class="time-field">
            <label class="field-label" for="bed-time">i normally go to sleep at</label>
            <input id="bed-time" type="time" class="time-input" bind:value={bedTime} />
          </div>
        </div>
      </section>

      <section class="section">
        <span class="section-label">3. options</span>
        <label class="toggle-label">
          <span class="toggle-wrap">
            <input type="checkbox" class="toggle-input" bind:checked={preTravelAdjust} />
            <span class="toggle-track"></span>
          </span>
          <span class="toggle-text">
            start adjusting before I leave
            <span class="toggle-hint">shifts your sleep up to 3 nights before departure</span>
          </span>
        </label>
      </section>
    </div>

    {#if plan === null}
      <div class="hint">set your timezones above to generate your plan</div>

    {:else if plan.sameZone}
      <div class="same-zone">
        <p class="same-zone-head">no adjustment needed</p>
        <p class="same-zone-body">these timezones are less than 30 minutes apart. you're good to go!</p>
      </div>

    {:else}
      <div class="plan-header">
        <div class="plan-summary">
          <span class="plan-dir">{plan.direction === 'east' ? 'eastward' : 'westward'} flight</span>
          <span class="plan-delta">{plan.deltaHours.toFixed(1).replace('.0', '')}h time difference</span>
          <span class="plan-days">{plan.totalDays} day plan</span>
        </div>
        {#if plan.direction === 'east'}
          <p class="direction-note">eastward travel requires phase advance — your hardest direction. stick to the plan.</p>
        {:else}
          <p class="direction-note">westward travel is a phase delay — your body's natural drift direction. you have this.</p>
        {/if}
      </div>

      <div class="days-list">
        {#each plan.days as day, i}
          <div class="day-card day-{day.type}">
            <div class="day-header">
              <div class="day-label-row">
                <span class="day-label">{day.label}</span>
                {#if day.tzLabel}
                  <span class="day-tz">{day.tzLabel}</span>
                {/if}
              </div>
              {#if day.type === 'post-arrival' || day.type === 'adjusted'}
                <div class="progress-bar">
                  <div class="progress-fill" style="width: {day.adjustProgress * 100}%"></div>
                </div>
                <span class="progress-label">{Math.round(day.adjustProgress * 100)}% adjusted</span>
              {/if}
            </div>

            {#if day.type === 'travel'}
              <div class="travel-body">
                <p class="travel-note">{day.travelNote}</p>
                <div class="travel-tips">
                  <div class="tip-chip">stay hydrated</div>
                  <div class="tip-chip">set watch now</div>
                  <div class="tip-chip">avoid alcohol</div>
                  <div class="tip-chip">move around</div>
                </div>
              </div>

            {:else}
              <div class="day-body">
                {#if day.shiftNote}
                  <p class="shift-note">{day.shiftNote}</p>
                {/if}

                <div class="sleep-times">
                  <div class="sleep-chip wake-chip">
                    <span class="sleep-icon">&#9728;</span>
                    <span class="sleep-label">wake</span>
                    <span class="sleep-time">{day.wake}</span>
                  </div>
                  <div class="sleep-chip bed-chip">
                    <span class="sleep-icon">&#9790;</span>
                    <span class="sleep-label">sleep</span>
                    <span class="sleep-time">{day.bed}</span>
                  </div>
                </div>

                <div class="advice-strips">
                  {#if day.lightSeek}
                    <div class="strip strip-seek">
                      <div class="strip-left">
                        <span class="strip-icon">&#9728;</span>
                        <div>
                          <span class="strip-label">{day.lightSeek.label}</span>
                          <span class="strip-window">{day.lightSeek.from} &ndash; {day.lightSeek.to}</span>
                        </div>
                      </div>
                      <span class="strip-hint">{day.lightSeek.hint}</span>
                    </div>
                  {/if}

                  {#if day.lightAvoid}
                    <div class="strip strip-avoid">
                      <div class="strip-left">
                        <span class="strip-icon">&#128683;</span>
                        <div>
                          <span class="strip-label">{day.lightAvoid.label}</span>
                          <span class="strip-window">{day.lightAvoid.from} &ndash; {day.lightAvoid.to}</span>
                        </div>
                      </div>
                      <span class="strip-hint">{day.lightAvoid.hint}</span>
                    </div>
                  {/if}

                  {#if day.caffeineStop}
                    <div class="strip strip-caffeine">
                      <div class="strip-left">
                        <span class="strip-icon">&#9749;</span>
                        <div>
                          <span class="strip-label">last caffeine by</span>
                          <span class="strip-window">{day.caffeineStop}</span>
                        </div>
                      </div>
                      <span class="strip-hint">caffeine half-life 5h — respect the cutoff</span>
                    </div>
                  {/if}

                  {#if day.melatonin}
                    <div class="strip strip-melatonin">
                      <div class="strip-left">
                        <span class="strip-icon">&#128138;</span>
                        <div>
                          <span class="strip-label">melatonin {day.melatonin.dose}</span>
                          <span class="strip-window">take at {day.melatonin.time}</span>
                        </div>
                      </div>
                      <span class="strip-hint">{day.melatonin.hint}</span>
                    </div>
                  {/if}
                </div>

                {#if day.fullyAdjusted}
                  <p class="adjusted-note">fully adjusted — maintain this schedule going forward</p>
                {/if}
              </div>
            {/if}
          </div>
        {/each}
      </div>

      <p class="footnote">
        based on 1.5h/day circadian shift rate &middot; light is your strongest tool &middot; individual variation applies &middot; consult a doctor if using melatonin regularly
      </p>
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
    max-width: 860px;
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
  .back-link:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0px #1a1a1a; }
  .back-link:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0px #1a1a1a; }

  .content { margin-top: 3rem; }

  .title {
    font-size: 2.8rem;
    font-weight: 700;
    margin: 0 0 0.4rem 0;
  }

  .subtitle {
    font-size: 1rem;
    color: #666;
    margin: 0 0 2.5rem 0;
  }

  /* Setup */
  .setup-grid { display: flex; flex-direction: column; gap: 2rem; }

  .section { }

  .section-label {
    display: block;
    font-size: 0.82rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #555;
    margin-bottom: 0.75rem;
  }

  .tz-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .tz-field { flex: 1; min-width: 220px; display: flex; flex-direction: column; gap: 0.3rem; }

  .field-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: #777;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .tz-select {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.92rem;
    font-weight: 600;
    border: 3px solid #1a1a1a;
    padding: 0.55rem 0.75rem;
    box-shadow: 3px 3px 0px #1a1a1a;
    background: #ffffff;
    cursor: pointer;
    outline: none;
    color: #1a1a1a;
    transition: background 0.1s;
    width: 100%;
    -webkit-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%231a1a1a' stroke-width='2' fill='none'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    padding-right: 2.5rem;
  }
  .tz-select:focus { background-color: #fff7b0; }

  .arrow-between {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a1a1a;
    flex-shrink: 0;
    padding-top: 1.4rem;
  }

  .times-row {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .time-field { flex: 1; min-width: 180px; display: flex; flex-direction: column; gap: 0.3rem; }

  .time-input {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    border: 3px solid #1a1a1a;
    padding: 0.45rem 0.85rem;
    box-shadow: 3px 3px 0px #1a1a1a;
    background: #ffffff;
    width: 100%;
    cursor: pointer;
    outline: none;
    color: #1a1a1a;
    transition: background 0.1s;
    box-sizing: border-box;
  }
  .time-input:focus { background: #fff7b0; }

  /* Toggle */
  .toggle-label {
    display: flex;
    align-items: flex-start;
    gap: 0.85rem;
    cursor: pointer;
  }

  .toggle-wrap { position: relative; flex-shrink: 0; margin-top: 2px; }

  .toggle-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .toggle-track {
    display: block;
    width: 44px;
    height: 24px;
    border: 3px solid #1a1a1a;
    background: #e0e0e0;
    box-shadow: 2px 2px 0px #1a1a1a;
    position: relative;
    transition: background 0.15s;
  }

  .toggle-track::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 14px;
    height: 14px;
    background: #1a1a1a;
    transition: transform 0.15s;
  }

  .toggle-input:checked + .toggle-track {
    background: #a5f3a5;
  }

  .toggle-input:checked + .toggle-track::after {
    transform: translateX(20px);
  }

  .toggle-text {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    font-weight: 600;
    font-size: 1rem;
  }

  .toggle-hint {
    font-size: 0.78rem;
    color: #777;
    font-weight: 400;
  }

  /* Hint / same zone */
  .hint {
    margin-top: 2.5rem;
    font-size: 0.95rem;
    color: #999;
    font-style: italic;
    padding: 1rem 0;
  }

  .same-zone {
    margin-top: 2.5rem;
    border: 3px solid #1a1a1a;
    padding: 1.5rem;
    background: #c8f7c5;
    box-shadow: 5px 5px 0px #1a1a1a;
  }
  .same-zone-head { font-size: 1.4rem; font-weight: 700; margin: 0 0 0.4rem 0; }
  .same-zone-body { margin: 0; color: #333; }

  /* Plan header */
  .plan-header {
    margin-top: 2.5rem;
    margin-bottom: 1.5rem;
    border: 3px solid #1a1a1a;
    padding: 1.25rem 1.5rem;
    background: #fff7b0;
    box-shadow: 5px 5px 0px #1a1a1a;
  }

  .plan-summary {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 0.6rem;
  }

  .plan-dir {
    font-size: 1.1rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .plan-delta, .plan-days {
    font-size: 0.85rem;
    font-weight: 700;
    border: 2px solid #1a1a1a;
    padding: 0.2rem 0.6rem;
    background: rgba(255,255,255,0.55);
  }

  .direction-note {
    margin: 0;
    font-size: 0.92rem;
    color: #444;
    line-height: 1.5;
  }

  /* Day cards */
  .days-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .day-card {
    border: 3px solid #1a1a1a;
    box-shadow: 4px 4px 0px #1a1a1a;
    overflow: hidden;
  }

  .day-pre-travel  { background: #dbeafe; }
  .day-travel      { background: #fef9c3; }
  .day-post-arrival{ background: #ede9fe; }
  .day-adjusted    { background: #dcfce7; }

  .day-header {
    padding: 0.85rem 1.25rem 0.7rem 1.25rem;
    border-bottom: 2px solid rgba(26,26,26,0.2);
  }

  .day-label-row {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .day-label {
    font-size: 1rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .day-tz {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #666;
    border: 1.5px solid #888;
    padding: 0.1rem 0.45rem;
  }

  .progress-bar {
    height: 4px;
    background: rgba(0,0,0,0.12);
    margin-top: 0.5rem;
    border: 1px solid rgba(0,0,0,0.15);
  }

  .progress-fill {
    height: 100%;
    background: #1a1a1a;
    transition: width 0.3s;
  }

  .progress-label {
    font-size: 0.68rem;
    font-weight: 700;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: block;
    margin-top: 0.3rem;
  }

  /* Travel day body */
  .travel-body { padding: 1.25rem; }

  .travel-note {
    margin: 0 0 1rem 0;
    font-size: 0.97rem;
    line-height: 1.55;
    color: #333;
  }

  .travel-tips {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .tip-chip {
    border: 2px solid #1a1a1a;
    padding: 0.3rem 0.7rem;
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: rgba(255,255,255,0.5);
  }

  /* Normal day body */
  .day-body { padding: 1rem 1.25rem 1.25rem 1.25rem; }

  .shift-note {
    margin: 0 0 0.9rem 0;
    font-size: 0.9rem;
    color: #444;
    font-style: italic;
  }

  .sleep-times {
    display: flex;
    gap: 0.6rem;
    margin-bottom: 0.9rem;
    flex-wrap: wrap;
  }

  .sleep-chip {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: 2.5px solid #1a1a1a;
    padding: 0.5rem 1rem;
    background: rgba(255,255,255,0.55);
    box-shadow: 2px 2px 0px #1a1a1a;
  }

  .sleep-icon { font-size: 1.1rem; line-height: 1; }

  .sleep-label {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #555;
  }

  .sleep-time {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1;
  }

  /* Advice strips */
  .advice-strips { display: flex; flex-direction: column; gap: 0.4rem; }

  .strip {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    border: 2px solid #1a1a1a;
    padding: 0.55rem 0.9rem;
    flex-wrap: wrap;
  }

  .strip-seek      { background: #fefce8; border-color: #d97706; }
  .strip-avoid     { background: #fff1f2; border-color: #e11d48; }
  .strip-caffeine  { background: #f0f0f0; border-color: #555; }
  .strip-melatonin { background: #f0fdf4; border-color: #16a34a; }

  .strip-left {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .strip-icon { font-size: 1.1rem; flex-shrink: 0; }

  .strip-label {
    display: block;
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .strip-window {
    display: block;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.2;
  }

  .strip-hint {
    font-size: 0.72rem;
    color: #555;
    font-style: italic;
    text-align: right;
    max-width: 200px;
    line-height: 1.35;
  }

  .adjusted-note {
    margin: 0.9rem 0 0 0;
    font-size: 0.87rem;
    font-weight: 700;
    color: #16a34a;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .footnote {
    margin-top: 2rem;
    font-size: 0.7rem;
    color: #999;
    font-style: italic;
    line-height: 1.6;
  }

  @media (max-width: 600px) {
    .title { font-size: 2rem; }
    .tz-row { flex-direction: column; }
    .arrow-between { padding-top: 0; transform: rotate(90deg); align-self: center; }
    .time-input { font-size: 1.2rem; }
    .sleep-time { font-size: 1.2rem; }
    .strip { flex-direction: column; align-items: flex-start; }
    .strip-hint { text-align: left; max-width: 100%; }
    .plan-summary { gap: 0.6rem; }
  }
</style>
