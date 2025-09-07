<script>
  // No timer logic needed on main page anymore
</script>

<svelte:head>
  <title>andrea.fyi</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="main-section">
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


</style> 
