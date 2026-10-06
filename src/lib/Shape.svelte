<script>
  export let shape = 'starburst';
  export let color = '#d5c472';
</script>

<svg viewBox="0 0 100 100" aria-hidden="true" overflow="visible">
  {#if shape === 'starburst'}
    <polygon
      points="50,2 61,13 77,9 81,25 96,32 89,47 96,62 81,70 77,87 61,84 50,97 39,84 23,87 19,70 4,62 11,47 4,32 19,25 23,9 39,13"
      fill={color} stroke="#1a1a1a" stroke-width="2.5" stroke-linejoin="round"
    />
  {:else if shape === 'blob'}
    <path
      d="M50 4 C72 2,94 18,96 42 C98 66,84 92,58 96 C32 100,8 86,4 60 C0 34,24 6,50 4 Z"
      fill={color} stroke="#1a1a1a" stroke-width="2.5"
    />
  {:else}
    <polygon
      points="50,0 60,40 100,50 60,60 50,100 40,60 0,50 40,40"
      fill={color} stroke="#1a1a1a" stroke-width="2.5" stroke-linejoin="round"
    />
  {/if}
</svg>

<style>
  svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    filter: drop-shadow(4px 4px 0 #1a1a1a);
  }
</style>
