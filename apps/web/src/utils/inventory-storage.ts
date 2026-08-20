const KEY = 'pizzly.ownedShopItems';

function readAll(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/** 상점 구매 아이템 보유 여부(프론트 로컬 저장). 실제 인벤토리는 BE 연동 전까지 임시 처리. */
export const inventoryStorage = {
  getOwned: readAll,
  isOwned: (itemId: string) => readAll().includes(itemId),
  markOwned: (itemId: string) => {
    const current = readAll();
    if (!current.includes(itemId)) {
      localStorage.setItem(KEY, JSON.stringify([...current, itemId]));
    }
  },
  clear: () => localStorage.removeItem(KEY),
};
