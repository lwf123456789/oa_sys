import { create } from 'zustand';
import { FormComponent } from '../types';
import { produce } from 'immer';

interface DesignerStore {
  components: FormComponent[];
  selectedId: string | null;
  setComponents: (components: FormComponent[]) => void;
  addComponent: (component: FormComponent) => void;
  addComponentToGrid: (gridId: string, cellIndex: number, component: FormComponent) => void;
  removeComponent: (id: string) => void;
  setSelectedId: (id: string | null) => void;
  updateComponentProps: (id: string, props: Partial<Record<string, any>>) => void;
  clearCanvas: () => void;
  importConfig: (config: Record<string, any>) => void;
  exportConfig: () => Record<string, any>;
}

export const useDesignerStore = create<DesignerStore>((set, get) => ({
  components: [],
  selectedId: null,

  setComponents: (components) => set({ components }),

  addComponent: (component) => set(
    produce((state) => {
      state.components.push(component);
      state.selectedId = component.id; // 添加新组件时自动选中
    })
  ),
  // 删除组件需要同时满足可以删除组件和删除组件的子组件
  removeComponent: (id) => set(
    produce((state) => {
      const removeFromArray = (items: FormComponent[]): boolean => {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          // 检查当前项
          if (item.id === id) {
            items.splice(i, 1);
            return true;
          }
          // 递归检查子项
          if (item.children?.length) {
            const removed = removeFromArray(item.children);
            // 移除后清理空的子数组
            if (removed && item.children.length === 0) {
              delete item.children;
            }
            if (removed) return true;
          }
        }
        return false;
      };

      removeFromArray(state.components);
      if (state.selectedId === id) {
        state.selectedId = null;
      }
    })
  ),
  addComponentToGrid: (gridId, cellIndex, component) =>
    set(produce((state) => {
      const findAndAddToGrid = (items: FormComponent[]): boolean => {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.id === gridId) {
            if (!item.children) {
              item.children = [];
            }
            // 确保 children 数组有足够的长度
            while (item.children.length <= cellIndex) {
              item.children.push(null as any);
            }
            item.children[cellIndex] = component;
            return true;
          }
          if (item.children?.length && findAndAddToGrid(item.children)) {
            return true;
          }
        }
        return false;
      };

      findAndAddToGrid(state.components);
    })),

  setSelectedId: (id) => set({ selectedId: id }),

  updateComponentProps: (id, newProps) => set(
    produce((state: DesignerStore) => {
      const updateComponent = (components: FormComponent[]): boolean => {
        for (let i = 0; i < components.length; i++) {
          const component = components[i];

          // 如果找到目标组件，更新其属性
          if (component.id === id) {
            components[i] = {
              ...component,
              props: {
                ...component.props,
                ...newProps
              }
            };
            return true;
          }

          // 如果组件有子组件，递归检查
          if (component.children?.length) {
            const found = updateComponent(component.children);
            if (found) return true;
          }
        }
        return false;
      };

      updateComponent(state.components);
    })
  ),

  // 清除画布
  clearCanvas: () => set({ components: [], selectedId: null }),
  importConfig: (config) => {
    if (config.components) {
      const processImportedComponent = (comp: any) => ({
        id: comp.id || `${comp.type}-${Date.now()}`,
        type: comp.type,
        label: comp.label || comp.type,
        props: comp.props || {},
        children: comp.children?.map((child: any) =>
          child ? processImportedComponent(child) : null
        )
      });

      set({
        components: config.components.map(processImportedComponent),
        selectedId: null
      });
    }
  },
  exportConfig: () => {
    const { components } = get();

    const processComponent = (component: FormComponent) => {
      const result: any = {
        id: component.id,
        type: component.type,
        props: component.props
      };

      // 如果组件有子组件，递归处理
      if (component.children?.length) {
        result.children = component.children.map(child =>
          child ? processComponent(child) : null
        );
      }

      return result;
    };

    return {
      components: components.map(processComponent)
    };
  },
}));