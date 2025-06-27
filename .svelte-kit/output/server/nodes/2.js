

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.sMhp7DX4.js","_app/immutable/chunks/BGQszin6.js","_app/immutable/chunks/IHki7fMi.js"];
export const stylesheets = ["_app/immutable/assets/2.BFHnwEOz.css"];
export const fonts = [];
