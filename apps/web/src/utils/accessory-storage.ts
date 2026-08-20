const KEY = 'pizzly.equippedAccessories';

function readAll(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/** 액세서리(모자·가방·장식 등)는 몸 전체 옷과 달리 여러 개를 동시에 착용할 수 있다. */
export const accessoryStorage = {
  getEquipped: readAll,
  isEquipped: (id: string) => readAll().includes(id),
  toggle: (id: string): boolean => {
    const current = readAll();
    const next = current.includes(id) ? current.filter((v) => v !== id) : [...current, id];
    localStorage.setItem(KEY, JSON.stringify(next));
    return next.includes(id);
  },
};
