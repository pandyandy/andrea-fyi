<script>
  import { onMount } from 'svelte';

  // Timer variables
  let timeRemaining = '';
  let timerInterval;

  function updateTimer() {
    // September 26, 2025 at 12:05am CET (UTC+1)
    // CET is UTC+1, so 12:05am CET = 11:05pm UTC on September 25, 2025
    const targetDate = new Date('2025-09-25T23:05:00Z'); // 12:05am CET = 11:05pm UTC
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      timeRemaining = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else {
      timeRemaining = "Time's up! ♡";
      clearInterval(timerInterval);
    }
  }

  onMount(() => {
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
    
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  });
</script>

<svelte:head>
  <title>Countdown - andrea.fyi</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="timer-section">
  <h2>Hi ◡̈ jfyi ♡</h2>
  <div class="timer-display">
    {timeRemaining}
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: #011638;
    color: #EEC643;
    font-family: 'Courier New', monospace;
    font-size: 1.2rem;
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
  }


  :global(*) {
    position: relative;
    z-index: 2;
  }

  :global(::selection) {
    background: rgba(255, 255, 255, 0.3);
    color: #fff;
  }

  .timer-section {
    padding: 4rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }

  .timer-section h2 {
    color: #EEC643;
    font-size: 2rem;
    margin-bottom: 2rem;
    font-family: 'Courier New', monospace;
    text-shadow: none;
    font-weight: normal;
    letter-spacing: 0;
    animation: none;
  }

  .timer-display {
    background: none;
    border: none;
    border-radius: 0;
    padding: 0;
    font-size: 2.5rem;
    font-weight: normal;
    color: #EFF0F2;
    max-width: none;
    margin: 0 auto 2rem auto;
    transition: none;
    font-family: 'Courier New', monospace;
    letter-spacing: 0;
    text-shadow: none;
    position: relative;
    overflow: visible;
  }


  @media (max-width: 768px) {
    .timer-display {
      margin: 0 1rem 2rem 1rem;
      padding: 2rem;
      font-size: 2rem;
    }
    
    .timer-section h2 {
      font-size: 1.5rem;
    }

  }
</style>
