<script setup>
defineProps({ name: String, size: { type: [Number, String], default: 22 } })
const paths = {
  menu: 'M4 6h16M4 12h12M4 18h16',
  palette: 'M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1.4-3.4 1.5 1.5 0 0 1 1.1-2.6H18a3 3 0 0 0 3-3 9 9 0 0 0-9-9ZM7 11h.01M9 7h.01M14 6h.01M18 10h.01',
  close: 'm6 6 12 12M18 6 6 18',
  chevron: 'm6 9 6 6 6-6',
  left: 'm15 5-7 7 7 7',
  right: 'm9 5 7 7-7 7',
  search: 'm21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  download: 'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
  crown: 'm3 6 5 5 4-7 4 7 5-5-2 13H5L3 6Z',
  gift: 'M3 8h18v4H3zM5 12v9h14v-9M12 8v13M12 8H8a3 3 0 1 1 3-3l1 3Zm0 0h4a3 3 0 1 0-3-3l-1 3Z',
  people: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.87M15 3.13a4 4 0 0 1 0 7.75M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  calendar: 'M5 5h14v16H5zM8 3v4m8-4v4M5 10h14m-11 5 3 3 5-5',
  support: 'M3 14v-3a9 9 0 0 1 18 0v3M3 12h4v7H3zM17 12h4v7h-4zM19 19v2h-7',
  check: 'm5 12 4 4L19 6',
  arrow: 'M12 19V5m-7 7 7-7 7 7',
}
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path :d="paths[name] || paths.gift" />
  </svg>
</template>
