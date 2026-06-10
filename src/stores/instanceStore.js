import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId, now } from '../utils/id';
import presetInstances from '../mock/instances';

const useInstanceStore = create(
  persist(
    (set, get) => ({
      instances: presetInstances,

      /** 获取所有实例 */
      getAll: () => get().instances,

      /** 按 ID 获取 */
      getById: (id) => get().instances.find((i) => i.id === id) || null,

      /** 按 Workflow ID 筛选 */
      getByWorkflowId: (workflowId) =>
        get().instances.filter((i) => i.workflowId === workflowId),

      /** 添加实例（从 Workflow 创建） */
      addInstance: (instance) => {
        const newInst = {
          ...instance,
          id: instance.id || `inst-${generateId()}`,
          status: instance.status || 'running',
          createdAt: instance.createdAt || now(),
        };
        set({ instances: [...get().instances, newInst] });
        return newInst;
      },

      /** 更新实例状态 */
      updateInstance: (id, data) => {
        set({
          instances: get().instances.map((i) =>
            i.id === id ? { ...i, ...data } : i
          ),
        });
      },

      /** 删除实例 */
      deleteInstance: (id) => {
        set({ instances: get().instances.filter((i) => i.id !== id) });
      },
    }),
    { name: 'workflow-instances' }
  )
);

export default useInstanceStore;
