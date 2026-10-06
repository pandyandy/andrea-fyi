import { error } from '@sveltejs/kit';
import { articles } from '$lib/articles.js';

export function entries() {
  return articles.map((a) => ({ slug: a.slug }));
}

export function load({ params }) {
  const index = articles.findIndex((a) => a.slug === params.slug);
  if (index === -1) error(404, 'article not found');
  return {
    article: articles[index],
    next: articles[(index + 1) % articles.length],
  };
}
