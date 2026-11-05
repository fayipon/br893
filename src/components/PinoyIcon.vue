<script setup>
defineProps({ name: String, size: { type: Number, default: 24 } })
const paths = {
  menu: ['M4 6h16M4 12h16M4 18h16'],
  close: ['m6 6 12 12M6 18 18 6'],
  right: ['m9 5 7 7-7 7'],
  left: ['m15 5-7 7 7 7'],
  arrow: ['M4 12h16m-6-6 6 6-6 6'],
  home: ['m3 10 9-7 9 7v10H15v-7H9v7H3Z'],
  wallet: ['M20 8H5a2 2 0 0 1 0-4h13v4M3 6v13a1 1 0 0 0 1 1h16V8M20 12h-5v4h5M17 14h.01'],
  gift: ['M3 8h18v4H3zM5 12v9h14v-9M12 8v13M12 8H7a2.5 2.5 0 1 1 2.5-2.5L12 8Zm0 0h5a2.5 2.5 0 1 0-2.5-2.5L12 8Z'],
  rebate: ['M3 3v5h5M3 8a9 9 0 1 1-1 6M14.4 9.6c-.4-.8-1.3-1.3-2.4-1.3-1.4 0-2.4.8-2.4 1.8s1 1.5 2.4 1.9 2.4.8 2.4 1.9-1 1.8-2.4 1.8c-1.1 0-2-.5-2.4-1.3M12 7v1.3m0 7.4V17'],
  cashback: ['M4 10h13a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8Zm0 0 9-4m.5 9a2 2 0 1 1 0-2M15 3.5A6 6 0 0 1 20 8m0-3.5V8h-3.5'],
  wheel: ['M20 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM12 3v16M4 11h16M6.34 5.34l11.32 11.32m0-11.32L6.34 16.66M10 1h4l-2 3ZM9 22l2-3m4 3-2-3m-6 3h10'],
  calendar: ['M3 5h18v16H3ZM8 3v4m8-4v4M3 10h18m-10 8v-5h3a1.5 1.5 0 0 1 0 3h-3m-2-2h7'],
  bag: ['m6 2-3 4v15h18V6l-3-4ZM3 6h18m-13 4a4 4 0 0 0 8 0'],
  gamepad: ['M6 5h12a3 3 0 0 1 3 3l1 8a3 3 0 0 1-5 2l-2-2H9l-2 2a3 3 0 0 1-5-2l1-8a3 3 0 0 1 3-3ZM6 10h4M8 8v4m8-2h.01M18 12h.01'],
  profile: ['M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-3a8 8 0 0 1 16 0v3Z'],
  people: ['M14 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM3 21v-3a8 8 0 0 1 16 0v3ZM17 4a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 5v3'],
  search: ['M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-2 6 6 6'],
}
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path v-for="(d, i) in paths[name] || paths.gift" :key="i" :d="d" /></svg>
</template>
