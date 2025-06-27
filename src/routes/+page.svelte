<script>
  import { onMount } from 'svelte';

  let terminal;
  let typedText = '';
  const text = "Hi, I'm Andrea and this is my little project... :)";
  let i = 0;

  let clickCount = 0;
  let pandaCount = 0;

  function typeWriter() {
    if (i < text.length) {
      typedText += text.charAt(i);
      i++;
      setTimeout(typeWriter, 50);
    }
  }

  function explode() {
    clickCount += 1;
    pandaCount += 20;
    for (let j = 0; j < 20; j++) {
      const panda = document.createElement('div');
      panda.className = 'panda';
      panda.textContent = '🐼';

      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;

      panda.style.left = x + 'px';
      panda.style.top = y + 'px';

      const dx = (Math.random() - 0.5) * 300 + 'px';
      const dy = (Math.random() - 0.5) * 300 + 'px';
      panda.style.setProperty('--dx', dx);
      panda.style.setProperty('--dy', dy);

      document.body.appendChild(panda);
      setTimeout(() => panda.remove(), 1000);
    }
  }

  onMount(() => {
    typeWriter();
  });
</script>

<svelte:head>
  <title>andrea.fyi</title>
</svelte:head>

<div id="terminal">{typedText}</div>
<div class="metrics">
  <div>Button clicks: <strong>{clickCount}</strong></div>
  <div>Pandas appeared: <strong>{pandaCount}</strong></div>
</div>
<button class="cta" on:click={explode}>Nice 🐼</button>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: #000;
    color: #fff;
    font-family: 'Courier New', Courier, monospace;
    font-size: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    overflow: hidden;
    text-align: center;
  }

  :global(::selection) {
    background: #FF69B4;
    color: #CFF800;
  }

  #terminal {
    white-space: pre-wrap;
    padding: 1rem;
    min-height: 3rem;
  }

  .metrics {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
    color: #CFF800;
  }
  .metrics strong {
    color: #FF69B4;
  }

  .cta {
    border: none;
    padding: 1rem 2rem;
    margin-top: 2rem;
    cursor: pointer;
    font-size: 1.1rem;
    border-radius: 5px;
    font-family: 'Courier New', Courier, monospace;
    background: #CFF800;
    color: #000;
    transition: transform 0.2s ease;
  }

  .cta:hover {
    transform: scale(1.05);
    background: #FF69B4;
    color: #FFFFFF;
  }

  :global(.panda) {
    position: absolute;
    font-size: 32px;
    animation: explode 1s ease-out forwards;
    pointer-events: none;
  }

  @keyframes explode {
    0% {
      transform: scale(1) translate(0, 0);
      opacity: 1;
    }
    100% {
      transform: scale(1.5) translate(var(--dx), var(--dy));
      opacity: 0;
    }
  }
</style> 
