<script>
  import Shape from '$lib/Shape.svelte';

  export let data;
  $: ({ article, next } = data);
</script>

<svelte:head>
  <title>{article.title} | andrea.fyi</title>
  <meta name="description" content={article.blurb} />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="page" style="background: {article.bg}">
  <a href="/" class="back-link">&larr; back to the sky</a>

  <div class="badge" aria-hidden="true">
    <Shape shape={article.shape} color={article.color} />
  </div>

  <article class="inner">
    <span class="tag">{article.tag}</span>
    <h1 class="title">{article.title}</h1>
    <p class="blurb">{article.blurb}</p>
    <div class="rule"></div>
    <div class="body">
      {#each article.body as para}
        <p>{para}</p>
      {/each}
    </div>

    {#if next.slug !== article.slug}
      <a href="/article/{next.slug}" class="next">
        <span class="next-label">next up</span>
        <span class="next-title">{next.title} &rarr;</span>
      </a>
    {/if}
  </article>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: #fefef5;
    color: #1a1a1a;
    font-family: 'Space Grotesk', sans-serif;
    overflow-x: hidden;
  }

  .page {
    position: relative;
    min-height: 100vh;
    padding: 6rem 1.5rem 5rem;
    overflow: hidden;
  }

  .back-link {
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
    z-index: 2;
    font-size: 0.95rem;
    font-weight: 700;
    color: #1a1a1a;
    text-decoration: none;
    border: 2.5px solid #1a1a1a;
    padding: 0.3rem 0.85rem;
    background: #fefef5;
    box-shadow: 3px 3px 0 #1a1a1a;
    transform: rotate(-0.6deg);
    transition: transform 0.1s, box-shadow 0.1s;
  }

  .back-link:hover {
    transform: rotate(0deg) translate(-1px, -1px);
    box-shadow: 4px 4px 0 #1a1a1a;
  }

  .badge {
    position: absolute;
    top: 3rem;
    right: 6%;
    width: clamp(90px, 14vw, 160px);
    aspect-ratio: 1;
    animation: drift 6s ease-in-out infinite;
  }

  @keyframes drift {
    0%, 100% { transform: translate(0, 0) rotate(-6deg); }
    50%      { transform: translate(-10px, 14px) rotate(6deg); }
  }

  @media (prefers-reduced-motion: reduce) {
    .badge { animation: none; }
  }

  .inner {
    position: relative;
    z-index: 1;
    max-width: 660px;
    margin: 0 auto;
  }

  .tag {
    display: inline-block;
    font-size: 0.62rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2.5px;
    color: #333;
    border: 2px solid #333;
    padding: 0.18rem 0.55rem;
    margin-bottom: 1.1rem;
  }

  .title {
    font-size: clamp(2.2rem, 6vw, 4.2rem);
    font-weight: 700;
    line-height: 1.05;
    letter-spacing: -0.03em;
    margin: 0 0 1.1rem;
  }

  .blurb {
    font-size: 1.1rem;
    line-height: 1.65;
    color: #444;
    font-style: italic;
    margin: 0 0 1.6rem;
  }

  .rule {
    width: 2.5rem;
    height: 3px;
    background: #1a1a1a;
    margin-bottom: 1.6rem;
  }

  .body p {
    font-size: 1.05rem;
    line-height: 1.85;
    color: #2a2a2a;
    margin: 0 0 1.1rem;
  }

  .next {
    display: inline-flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-top: 3rem;
    padding: 0.9rem 1.1rem;
    color: #1a1a1a;
    text-decoration: none;
    background: #fefef5;
    border: 2.5px solid #1a1a1a;
    box-shadow: 4px 4px 0 #1a1a1a;
    transform: rotate(0.8deg);
    transition: transform 0.1s, box-shadow 0.1s;
  }

  .next:hover {
    transform: rotate(0deg) translate(-1px, -1px);
    box-shadow: 5px 5px 0 #1a1a1a;
  }

  .next-label {
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #555;
  }

  .next-title {
    font-size: 1.1rem;
    font-weight: 700;
  }

  @media (max-width: 600px) {
    .badge { opacity: 0.5; right: 1rem; }
  }
</style>
