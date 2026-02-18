<svelte:head>
  <title>about | andrea.fyi</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="page">
  <a href="/" class="back-link">&larr; back</a>
  <div class="content">
    <h1 class="title">About</h1>
    <div class="cv-placeholder">
      <p>CV coming soon.</p>
    </div>
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
    max-width: 800px;
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
    font-size: 3rem;
    font-weight: 700;
    color: #1a1a1a;
    border: 4px solid #1a1a1a;
    padding: 1rem 2rem;
    background: #ffffff;
    box-shadow: 6px 6px 0px #1a1a1a;
    transform: rotate(-1deg);
    display: inline-block;
    margin: 0 0 2.5rem 0;
  }

  .cv-placeholder {
    border: 3px solid #1a1a1a;
    padding: 2rem;
    background: #ffffff;
    box-shadow: 4px 4px 0px #1a1a1a;
    font-size: 1.1rem;
  }

  .cv-placeholder p {
    margin: 0;
  }
</style>
