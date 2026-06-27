<template>
  <main class="app-shell">
    <header class="app-header">
      <div>
        <p class="eyebrow">前端源码重建 / v1</p>
        <h1>微信小店群控</h1>
      </div>
      <span class="safe-badge">当前仅重建 ShopList，只读优先</span>
    </header>

    <ShopList />
  </main>
</template>

<script setup>
import ShopList from './views/ShopList.vue';
</script>
