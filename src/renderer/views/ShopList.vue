<template>
  <section class="shop-list-page">
    <div class="page-title-row">
      <div>
        <p class="eyebrow">ShopList</p>
        <h2>店铺列表</h2>
        <p class="page-desc">第一版源码重建只做只读展示和进入店铺，高风险操作暂不启用。</p>
      </div>
      <div class="toolbar-actions">
        <button type="button" @click="loadShops" :disabled="loading">
          {{ loading ? '刷新中...' : '刷新店铺' }}
        </button>
        <button type="button" disabled title="扫码添加店铺后续接入保护流程后启用">添加店铺</button>
      </div>
    </div>

    <ShopGroupBar v-model="selectedGroupId" :groups="groupOptions" />

    <div class="toolbar-row">
      <input v-model="keyword" type="search" placeholder="搜索店铺名称、店铺 ID" />
      <div class="view-switch" role="group" aria-label="展示方式">
        <button type="button" :class="{ active: viewMode === 'card' }" @click="viewMode = 'card'">卡片</button>
        <button type="button" :class="{ active: viewMode === 'table' }" @click="viewMode = 'table'">列表</button>
      </div>
    </div>

    <p v-if="errorMessage" class="error-box">{{ errorMessage }}</p>

    <div v-if="loading" class="empty-box">正在加载店铺...</div>
    <div v-else-if="!visibleShops.length" class="empty-box">暂无匹配店铺</div>
    <div v-else-if="viewMode === 'card'" class="shop-grid">
      <ShopCard
        v-for="shop in visibleShops"
        :key="shop.id"
        :shop="shop"
        :group-label="getShopGroupLabel(shop)"
        @open="openShop"
      />
    </div>
    <ShopTable
      v-else
      :shops="visibleShops"
      :get-shop-group-label="getShopGroupLabel"
      @open="openShop"
    />
  </section>
</template>

<script setup>
import { ref } from 'vue';
import ShopCard from '../components/ShopCard.vue';
import ShopGroupBar from '../components/ShopGroupBar.vue';
import ShopTable from '../components/ShopTable.vue';
import { useShopList } from '../composables/useShopList.js';

const viewMode = ref('card');

const {
  groupOptions,
  visibleShops,
  keyword,
  selectedGroupId,
  loading,
  errorMessage,
  loadShops,
  openShop,
  getShopGroupLabel,
} = useShopList();
</script>
