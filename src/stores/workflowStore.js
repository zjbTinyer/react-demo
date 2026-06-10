import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId, now } from '../utils/id';
import presetWorkflows from '../mock/workflows';

const useWorkflowStore = create(
  persist(
    (set, get) => ({
      workflows: presetWorkflows,

      /** 获取所有工作流 */
      getAll: () => get().workflows,

      /** 按 ID 获取 */
      getById: (id) => get().workflows.find((w) => w.id === id) || null,

      /** 添加工作流 */
      addWorkflow: (workflow) => {
        const newWf = {
          ...workflow,
          id: workflow.id || `wf-${generateId()}`,
          status: workflow.status || 'draft',
          nodes: workflow.nodes || [],
          edges: workflow.edges || [],
          createdAt: workflow.createdAt || now(),
          updatedAt: workflow.updatedAt || now(),
        };
        set({ workflows: [...get().workflows, newWf] });
        return newWf;
      },

      /** 更新工作流 */
      updateWorkflow: (id, data) => {
        set({
          workflows: get().workflows.map((w) =>
            w.id === id ? { ...w, ...data, updatedAt: now() } : w
          ),
        });
      },

      /** 删除工作流 */
      deleteWorkflow: (id) => {
        set({ workflows: get().workflows.filter((w) => w.id !== id) });
      },
    }),
    { name: 'workflow-workflows' }
  )
);

export default useWorkflowStore;
