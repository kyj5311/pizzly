import type { CostumeItemId } from '../shared/ui/costume-items';

const KEY = 'pizzly.equippedCostumes';

function readAll(): CostumeItemId[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CostumeItemId[]) : [];
  } catch {
    return [];
  }
}

/** 상점이 아닌 설정 화면에서 바로 장착/해제하는 코스튬(모자·스카프) 상태. */
export const costumeStorage = {
  getEquipped: readAll,
  isEquipped: (id: CostumeItemId) => readAll().includes(id),
  toggle: (id: CostumeItemId): boolean => {
    const current = readAll();
    const next = current.includes(id) ? current.filter((v) => v !== id) : [...current, id];
    localStorage.setItem(KEY, JSON.stringify(next));
    return next.includes(id);
  },
  clear: () => localStorage.removeItem(KEY),
};
