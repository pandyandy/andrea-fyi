<svelte:head>
  <title>andrea.fyi</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="wrapper">
  <header class="site-header">
    <h1 class="site-name">andrea.fyi</h1>
  </header>

  <main class="main">
    <p class="section-label">essays</p>
    <div class="essay-list">

      <a href="/article/marathon" class="essay-card">
        <div class="card-tags">
          <span class="tag">running</span>
          <span class="tag">data</span>
        </div>
        <h2 class="card-title">everyone's running a marathon now</h2>
        <p class="card-blurb">i got curious about whether marathons were actually booming or if i was just in a bubble. 40 years of data later: they really are. and the women's story is the most interesting part.</p>
        <span class="card-cta">read →</span>
      </a>

    </div>
  </main>

  <footer class="site-footer">
    <a href="/about" class="footer-link">about me</a>
    <a href="/coffee" class="footer-link">coffee?</a>
    <a href="mailto:novakovadrea@gmail.com" class="footer-link">novakovadrea@gmail.com</a>
  </footer>
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

  .wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    max-width: 760px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  /* ── Header ── */
  .site-header {
    padding: 3.5rem 0 2.5rem;
  }

  .site-name {
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.5px;
    border: 3px solid #1a1a1a;
    display: inline-block;
    padding: 0.3rem 0.9rem;
    background: #fff;
    box-shadow: 4px 4px 0 #1a1a1a;
    transform: rotate(-0.8deg);
  }

  /* ── Main ── */
  .main {
    flex: 1;
    padding: 0.5rem 0 5rem;
  }

  .section-label {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2.5px;
    color: #aaa;
    margin: 0 0 1.25rem 0;
  }

  .essay-list {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .essay-card {
    display: block;
    text-decoration: none;
    color: #1a1a1a;
    border: 3px solid #1a1a1a;
    padding: 1.6rem 1.75rem;
    background: #fff;
    box-shadow: 6px 6px 0 #1a1a1a;
    transform: rotate(0.4deg);
    transition: transform 0.12s, box-shadow 0.12s;
  }

  .essay-card:hover {
    transform: rotate(0deg) translate(-2px, -2px);
    box-shadow: 8px 8px 0 #1a1a1a;
  }

  .essay-card:active {
    transform: rotate(0deg) translate(2px, 2px);
    box-shadow: 3px 3px 0 #1a1a1a;
  }

  .card-tags {
    display: flex;
    gap: 0.45rem;
    margin-bottom: 0.85rem;
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

  .card-title {
    font-size: 1.9rem;
    font-weight: 700;
    margin: 0 0 0.7rem 0;
    line-height: 1.15;
    letter-spacing: -0.5px;
  }

  .card-blurb {
    font-size: 0.95rem;
    line-height: 1.65;
    color: #555;
    margin: 0 0 1.1rem 0;
  }

  .card-cta {
    font-size: 0.9rem;
    font-weight: 700;
    color: #1a1a1a;
  }

  /* ── Footer ── */
  .site-footer {
    padding: 1.5rem 0 2.5rem;
    border-top: 2px solid #e8e8e8;
    display: flex;
    gap: 1.75rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .footer-link {
    font-size: 0.8rem;
    font-weight: 600;
    color: #bbb;
    text-decoration: none;
    transition: color 0.12s;
  }

  .footer-link:hover {
    color: #1a1a1a;
  }

  @media (max-width: 600px) {
    .card-title {
      font-size: 1.45rem;
    }
    .site-name {
      font-size: 1.2rem;
    }
    .essay-card {
      padding: 1.25rem 1.25rem;
    }
  }
</style>
