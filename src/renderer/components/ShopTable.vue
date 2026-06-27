<template>
  <div class="shop-table-wrap">
    <table class="shop-table">
      <thead>
        <tr>
          <th>店铺</th>
          <th>状态</th>
          <th>分组</th>
          <th>真实店铺 ID</th>
          <th>更新时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="shop in shops" :key="shop.id">
          <td>
            <strong>{{ shop.name }}</strong>
            <small>{{ shop.id }}</small>
          </td>
          <td>
            <span class="status-pill" :class="shop.ready ? 'online' : 'offline'">
              {{ shop.ready ? '在线' : '离线' }}
            </span>
          </td>
          <td>{{ getShopGroupLabel(shop) }}</td>
          <td>{{ shop.realShopId || '-' }}</td>
          <td>{{ shop.updatedAt || '-' }}</td>
          <td class="table-actions">
            <button type="button" class="primary" @click="$emit('open', shop.id)">进入</button>
            <button type="button" disabled>重登</button>
            <button type="button" disabled>移除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  shops: { type: Array, default: () => [] },
  getShopGroupLabel: { type: Function, required: true },
});

defineEmits(['open']);
</script>
