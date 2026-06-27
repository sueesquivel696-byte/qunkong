<template>
  <article class="shop-card">
    <header class="shop-card-header">
      <div>
        <h3>{{ shop.name }}</h3>
        <p>{{ shop.id }}</p>
      </div>
      <span class="status-pill" :class="shop.ready ? 'online' : 'offline'">
        {{ shop.ready ? '在线' : '离线' }}
      </span>
    </header>

    <dl class="shop-meta-grid">
      <div>
        <dt>分组</dt>
        <dd>{{ groupLabel }}</dd>
      </div>
      <div>
        <dt>真实店铺 ID</dt>
        <dd>{{ shop.realShopId || '-' }}</dd>
      </div>
      <div>
        <dt>更新时间</dt>
        <dd>{{ shop.updatedAt || '-' }}</dd>
      </div>
      <div>
        <dt>授权状态</dt>
        <dd>{{ shop.authInvalidReason || '正常' }}</dd>
      </div>
    </dl>

    <footer class="shop-actions">
      <button type="button" class="primary" @click="$emit('open', shop.id)">进入店铺</button>
      <button type="button" disabled title="后续接入保护层后启用">重新登录</button>
      <button type="button" disabled title="后续接入保护层后启用">移除</button>
    </footer>
  </article>
</template>

<script setup>
defineProps({
  shop: { type: Object, required: true },
  groupLabel: { type: String, default: '未分组' },
});

defineEmits(['open']);
</script>
