import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId, now } from '../utils/id';
import presetDicts from '../mock/dicts';

const useDictStore = create(
  persist(
    (set, get) => ({
      dicts: presetDicts,

      /** 获取所有字典 */
      getAll: () => get().dicts,

      /** 按 ID 获取 */
      getById: (id) => get().dicts.find((d) => d.id === id) || null,

      /** 获取字典的所有数据行 */
      getRows: (dictId) => {
        const dict = get().dicts.find((d) => d.id === dictId);
        return dict ? dict.rows : [];
      },

      /** 获取字典某列的所有去重值（用于下拉选择） */
      getColumnValues: (dictId, columnName) => {
        const rows = get().getRows(dictId);
        return [...new Set(rows.map((r) => r[columnName]).filter(Boolean))];
      },

      /** 添加字典 */
      addDict: (dict) => {
        const newDict = {
          ...dict,
          id: dict.id || `dict-${generateId()}`,
          rows: dict.rows || [],
        };
        set({ dicts: [...get().dicts, newDict] });
        return newDict;
      },

      /** 更新字典基本信息（名称、描述、列定义） */
      updateDict: (id, data) => {
        set({
          dicts: get().dicts.map((d) =>
            d.id === id ? { ...d, ...data } : d
          ),
        });
      },

      /** 删除字典 */
      deleteDict: (id) => {
        set({ dicts: get().dicts.filter((d) => d.id !== id) });
      },

      // ===== 数据行操作 =====

      /** 添加数据行 */
      addRow: (dictId, row) => {
        set({
          dicts: get().dicts.map((d) => {
            if (d.id !== dictId) return d;
            const maxId = d.rows.reduce((max, r) => Math.max(max, r.id || 0), 0);
            return {
              ...d,
              rows: [...d.rows, { id: maxId + 1, ...row }],
            };
          }),
        });
      },

      /** 更新数据行 */
      updateRow: (dictId, rowIndex, row) => {
        set({
          dicts: get().dicts.map((d) => {
            if (d.id !== dictId) return d;
            const newRows = [...d.rows];
            newRows[rowIndex] = { ...newRows[rowIndex], ...row };
            return { ...d, rows: newRows };
          }),
        });
      },

      /** 删除数据行 */
      deleteRow: (dictId, rowIndex) => {
        set({
          dicts: get().dicts.map((d) => {
            if (d.id !== dictId) return d;
            const newRows = d.rows.filter((_, i) => i !== rowIndex);
            return { ...d, rows: newRows };
          }),
        });
      },
    }),
    { name: 'workflow-dicts' }
  )
);

export default useDictStore;
