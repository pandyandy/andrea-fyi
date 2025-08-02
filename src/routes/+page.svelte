<script>
  import { onMount } from 'svelte';

  // Timer variables
  let timeRemaining = '';
  let timerInterval;

  function updateTimer() {
    // July 7, 2025 at 7:45 PM Pittsburgh time (EDT UTC-4 or EST UTC-5)
    // Using EDT (UTC-4) for July which is daylight saving time
    const targetDate = new Date('2025-08-07T23:45:00Z'); // 7:45 PM EDT = 11:45 PM UTC
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      timeRemaining = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else {
      timeRemaining = "Time's up! 🎉";
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
</svelte:head>

<div class="timer-section">
  <h2>Hi, jfyi 🥰🤪🤗</h2>
  <div class="timer-display">
    {timeRemaining}
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      linear-gradient(135deg, 
        #ff7b00 0%,     /* Orange */
        #ff4d7d 25%,    /* Pink-red */
        #c44dab 50%,    /* Purple-pink */
        #8b5fbf 75%,    /* Purple */
        #b794f6 100%    /* Light purple */
      );
    background-attachment: fixed;
    color: #fff;
    font-family: 'Courier New', Courier, monospace;
    font-size: 1.5rem;
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
  }

  :global(body::before) {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(circle at 20% 10%, rgba(255, 255, 255, 0.05) 0.5px, transparent 0.5px),
      radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.03) 0.3px, transparent 0.3px),
      radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.04) 0.4px, transparent 0.4px),
      radial-gradient(circle at 90% 20%, rgba(255, 255, 255, 0.02) 0.2px, transparent 0.2px),
      radial-gradient(circle at 10% 90%, rgba(255, 255, 255, 0.03) 0.3px, transparent 0.3px),
      radial-gradient(circle at 60% 30%, rgba(255, 255, 255, 0.04) 0.5px, transparent 0.5px),
      radial-gradient(circle at 30% 60%, rgba(255, 255, 255, 0.02) 0.2px, transparent 0.2px),
      radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.03) 0.3px, transparent 0.3px);
    background-size: 
      200px 200px, 
      150px 150px, 
      100px 100px, 
      250px 250px, 
      180px 180px, 
      120px 120px, 
      300px 300px, 
      80px 80px;
    opacity: 0.15;
    pointer-events: none;
    z-index: 1;
    animation: grain 8s steps(10) infinite;
  }

  @keyframes grain {
    0%, 100% { transform: translate(0, 0) }
    10% { transform: translate(-5%, -10%) }
    20% { transform: translate(-15%, 5%) }
    30% { transform: translate(7%, -25%) }
    40% { transform: translate(-5%, 25%) }
    50% { transform: translate(-15%, 10%) }
    60% { transform: translate(15%, 0%) }
    70% { transform: translate(0%, 15%) }
    80% { transform: translate(3%, 35%) }
    90% { transform: translate(-10%, 10%) }
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
    color: #fff;
    font-size: 2rem;
    margin-bottom: 2rem;
    font-family: 'Courier New', Courier, monospace;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  .timer-display {
    background: rgba(255, 255, 255, 0.15);
    border: 3px solid rgba(207, 248, 0, 0.8);
    border-radius: 15px;
    padding: 3rem 2rem;
    font-size: 3rem;
    font-weight: bold;
    color: #fff;
    max-width: 600px;
    margin: 0 auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    font-family: 'Courier New', Courier, monospace;
    letter-spacing: 2px;
    backdrop-filter: blur(10px);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }

  .timer-display:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 768px) {
    .timer-display {
      margin: 0 1rem;
      padding: 2rem;
      font-size: 2rem;
    }
    
    .timer-section h2 {
      font-size: 1.5rem;
    }
  }
</style> 
