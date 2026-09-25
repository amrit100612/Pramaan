import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getTableFile(table: string): string {
  return path.join(DATA_DIR, `${table}.json`);
}

function readTable<T>(table: string): T[] {
  const file = getTableFile(table);
  if (!fs.existsSync(file)) return [];
  try {
    const raw = fs.readFileSync(file, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeTable<T>(table: string, items: T[]): void {
  const file = getTableFile(table);
  fs.writeFileSync(file, JSON.stringify(items, null, 2), "utf8");
}

export const localStore = {
  get: <T>(table: string): T[] => readTable<T>(table),
  insert: <T extends Record<string, unknown>>(table: string, record: T): T => {
    const items = readTable<T>(table);
    const id = record.id || `id_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const fullRecord = { ...record, id, created_at: record.created_at || new Date().toISOString() };
    items.unshift(fullRecord);
    writeTable(table, items);
    return fullRecord as T;
  },
  upsert: <T extends Record<string, unknown>>(table: string, record: T, conflictKey: string): T => {
    const items = readTable<T>(table);
    const idx = items.findIndex((i: Record<string, unknown>) => i[conflictKey] === record[conflictKey]);
    if (idx >= 0) {
      items[idx] = { ...items[idx], ...record, updated_at: new Date().toISOString() };
      writeTable(table, items);
      return items[idx];
    } else {
      return localStore.insert(table, record);
    }
  },
  find: <T>(table: string, predicate: (item: T) => boolean): T[] => {
    const items = readTable<T>(table);
    return items.filter(predicate);
  },
};
