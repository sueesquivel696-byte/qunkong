import { computed, onMounted, onUnmounted, ref } from 'vue';
import { invokeElectronApi, subscribeElectronApi } from '../api/electronApi.js';

export const ALL_GROUP_ID = '__all__';
export const UNGROUPED_GROUP_ID = '__ungrouped__';

function normalizeShop(shop) {
  const raw = shop && typeof shop === 'object' ? shop : {};
  return {
    id: String(raw.id || ''),
    realShopId: String(raw.realShopId || raw.id || ''),
    switchAppId: String(raw.switchAppId || raw.id || ''),
    name: String(raw.name || raw.id || '未命名店铺'),
    ready: raw.ready === true,
    authInvalidReason: String(raw.authInvalidReason || ''),
    authInvalidAt: String(raw.authInvalidAt || ''),
    createdAt: String(raw.createdAt || ''),
    updatedAt: String(raw.updatedAt || ''),
  };
}

function normalizeGroupState(state) {
  const raw = state && typeof state === 'object' ? state : {};
  const groups = Array.isArray(raw.groups)
    ? raw.groups
        .map((group) => ({
          id: String(group?.id || ''),
          name: String(group?.name || ''),
          order: Number.isFinite(Number(group?.order)) ? Number(group.order) : 0,
        }))
        .filter((group) => group.id && group.name)
        .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, 'zh-CN'))
    : [];

  const assignments = raw.assignments && typeof raw.assignments === 'object' ? raw.assignments : {};
  return { groups, assignments };
}

export function useShopList() {
  const shops = ref([]);
  const groupState = ref({ groups: [], assignments: {} });
  const keyword = ref('');
  const selectedGroupId = ref(ALL_GROUP_ID);
  const loading = ref(false);
  const errorMessage = ref('');

  const groupOptions = computed(() => {
    const baseGroups = [
      { id: ALL_GROUP_ID, name: '全部店铺', system: true },
      { id: UNGROUPED_GROUP_ID, name: '未分组', system: true },
      ...groupState.value.groups.map((group) => ({ ...group, system: false })),
    ];
    return baseGroups.map((group) => ({
      ...group,
      count: shops.value.filter((shop) => isShopInGroup(shop, group.id)).length,
    }));
  });

  const visibleShops = computed(() => {
    const normalizedKeyword = keyword.value.trim().toLowerCase();
    return shops.value
      .filter((shop) => isShopInGroup(shop, selectedGroupId.value))
      .filter((shop) => {
        if (!normalizedKeyword) return true;
        return `${shop.name} ${shop.id} ${shop.realShopId}`.toLowerCase().includes(normalizedKeyword);
      })
      .sort((a, b) => Number(b.ready) - Number(a.ready) || a.name.localeCompare(b.name, 'zh-CN'));
  });

  function getShopGroupId(shop) {
    return groupState.value.assignments?.[shop.id] || '';
  }

  function getShopGroupLabel(shop) {
    const groupId = getShopGroupId(shop);
    if (!groupId) return '未分组';
    return groupState.value.groups.find((group) => group.id === groupId)?.name || '未知分组';
  }

  function isShopInGroup(shop, groupId) {
    if (groupId === ALL_GROUP_ID) return true;
    const assignedGroupId = getShopGroupId(shop);
    if (groupId === UNGROUPED_GROUP_ID) return !assignedGroupId;
    return assignedGroupId === groupId;
  }

  async function loadShops() {
    loading.value = true;
    errorMessage.value = '';
    try {
      const [shopRows, groups] = await Promise.all([
        invokeElectronApi('getShops', [], undefined),
        invokeElectronApi('getShopGroups', { groups: [], assignments: {} }),
      ]);
      shops.value = Array.isArray(shopRows) ? shopRows.map(normalizeShop).filter((shop) => shop.id) : [];
      groupState.value = normalizeGroupState(groups);
    } catch (error) {
      console.error('[ShopList] 加载店铺失败:', error);
      errorMessage.value = error?.message || '加载店铺失败';
    } finally {
      loading.value = false;
    }
  }

  async function openShop(shopId) {
    await invokeElectronApi('openShopWindow', false, shopId);
  }

  let unsubscribeShops = null;
  let unsubscribeGroups = null;

  onMounted(() => {
    loadShops();
    unsubscribeShops = subscribeElectronApi('onShopsUpdated', (nextShops) => {
      shops.value = Array.isArray(nextShops) ? nextShops.map(normalizeShop).filter((shop) => shop.id) : [];
    });
    unsubscribeGroups = subscribeElectronApi('onShopGroupsUpdated', (nextState) => {
      groupState.value = normalizeGroupState(nextState);
    });
  });

  onUnmounted(() => {
    if (typeof unsubscribeShops === 'function') unsubscribeShops();
    if (typeof unsubscribeGroups === 'function') unsubscribeGroups();
  });

  return {
    shops,
    groupOptions,
    visibleShops,
    keyword,
    selectedGroupId,
    loading,
    errorMessage,
    loadShops,
    openShop,
    getShopGroupLabel,
  };
}
