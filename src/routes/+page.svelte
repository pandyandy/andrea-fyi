<script>
  import { onMount } from 'svelte';

  // Timer variables
  let timeRemaining = '';
  let timerInterval;

  function updateTimer() {
    // January 9, 2026 at 14:30 CET (UTC+1)
    // CET is UTC+1, so 14:30 CET = 13:30 UTC
    const targetDate = new Date('2026-01-09T13:40:00Z'); // 14:30 CET = 13:30 UTC
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
  <title>andrea.fyi</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="main-section">
  <h2>Hi ♡ jfyi</h2>
  <div class="timer-display">
    {timeRemaining}
  </div>
  <div class="smiley">◡̈</div>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: #FFFFFF;
    color: #333333;
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

  .main-section {
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

  .main-section h2 {
    color: #333333;
    font-size: 2.5rem;
    margin-bottom: 2rem;
    font-family: 'Courier New', monospace;
    text-shadow: none;
    font-weight: 900;
    letter-spacing: 0;
    animation: none;
    border: 6px solid #333333;
    background: #FF4081;
    padding: 1rem 2rem;
    display: inline-block;
    transform: rotate(-2deg);
  }

  .timer-display {
    background: #00BFFF;
    border: 8px solid #333333;
    border-radius: 0;
    padding: 2rem 3rem;
    font-size: 3rem;
    font-weight: 900;
    color: #333333;
    max-width: 600px;
    margin: 0 auto 2rem auto;
    transition: none;
    font-family: 'Courier New', monospace;
    letter-spacing: 2px;
    text-shadow: none;
    position: relative;
    overflow: visible;
    transform: rotate(1deg);
    box-shadow: 8px 8px 0px #333333;
  }

  .smiley {
    font-size: 8rem;
    color: #333333;
    font-family: 'Courier New', monospace;
    line-height: 1;
    border: 8px solid #333333;
    background: #FFD700;
    padding: 1rem 2rem;
    display: inline-block;
    transform: rotate(-1deg);
    box-shadow: 8px 8px 0px #333333;
  }


</style> 
