import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId, now } from '../utils/id';
import presetSteps from '../mock/steps';

const useStepStore = create(
  persist(
    (set, get) => ({
      steps: presetSteps,

      /** 获取所有步骤类型 */
      getAll: () => get().steps,

      /** 获取所有分类（去重） */
      getCategories: () => [...new Set(get().steps.map((s) => s.category))],

      /** 按 ID 获取 */
      getById: (id) => get().steps.find((s) => s.id === id) || null,

      /** 按分类筛选 */
      getByCategory: (category) => {
        if (!category || category === 'all') return get().steps;
        return get().steps.filter((s) => s.category === category);
      },

      /** 添加步骤类型 */
      addStep: (step) => {
        const newStep = {
          ...step,
          id: step.id || `step-${generateId()}`,
          createdAt: step.createdAt || now(),
        };
        set({ steps: [...get().steps, newStep] });
        return newStep;
      },

      /** 更新步骤类型 */
      updateStep: (id, data) => {
        set({
          steps: get().steps.map((s) =>
            s.id === id ? { ...s, ...data } : s
          ),
        });
      },

      /** 删除步骤类型 */
      deleteStep: (id) => {
        set({ steps: get().steps.filter((s) => s.id !== id) });
      },
    }),
    { name: 'workflow-steps' }
  )
);

export default useStepStore;
