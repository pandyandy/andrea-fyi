<svelte:head>
  <title>andrea.fyi</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="main-section">
  <h1 class="greeting">Hi:)</h1>
  <div class="nav-links">
    <a href="/about" class="nav-link">about me</a>
    <a href="/coffee" class="nav-link nav-link-alt">coffee?</a>
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

  .main-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
  }

  .greeting {
    font-size: 4rem;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 2rem 0;
    letter-spacing: -1px;
  }

  .nav-links {
    display: flex;
    gap: 1.25rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .nav-link {
    font-size: 1.2rem;
    font-weight: 600;
    color: #1a1a1a;
    text-decoration: none;
    border: 3px solid #1a1a1a;
    padding: 0.6rem 1.5rem;
    background: #ffffff;
    box-shadow: 4px 4px 0px #1a1a1a;
    transform: rotate(1deg);
    transition: transform 0.1s, box-shadow 0.1s;
  }

  .nav-link-alt {
    background: #fff7e0;
    transform: rotate(-1.5deg);
  }

  .nav-link:hover {
    transform: rotate(0deg) translate(-2px, -2px);
    box-shadow: 6px 6px 0px #1a1a1a;
  }

  .nav-link:active {
    transform: rotate(0deg) translate(2px, 2px);
    box-shadow: 2px 2px 0px #1a1a1a;
  }

  @media (max-width: 600px) {
    .greeting {
      font-size: 2.5rem;
      padding: 1rem 2rem;
    }
  }
</style>
