import React from 'react';
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import ComponentList from './ComponentList';
import DesignCanvas from './DesignCanvas';
import PropertyPanel from './PropertyPanel';
import { useDesignerStore } from './store/useDesignerStore';
import Toolbar from './components/Toolbar';

const FormDesigner: React.FC = () => {
    const { addComponent, addComponentToGrid } = useDesignerStore();

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: { distance: 10 },
    });

    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: { delay: 300, tolerance: 5 },
    });

    const sensors = useSensors(mouseSensor, touchSensor);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || !active.data.current?.isNew) return;

        const newComponent = {
            id: `${active.data.current.type}-${Date.now()}`,
            type: active.data.current.type,
            label: active.data.current.label || active.data.current.type,
            props: active.data.current.defaultProps || {}
        };

        if (typeof over.id === 'string' && over.id.includes('-cell-')) {
            // 格式: "grid-1234567-cell-0。"
            const parts = over.id.split('-');
            const gridId = `${parts[0]}-${parts[1]}`; // 重新组合 gridId
            const cellIndex = parseInt(parts[3]); // 获取单元格索引
            addComponentToGrid(gridId, cellIndex, newComponent);
        } else if (over.id === 'canvas') {
            addComponent(newComponent);
        }
    };

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
                {/* 工具栏 */}
                <Toolbar />

                {/* 主要内容区域 */}
                <div className="flex flex-1 overflow-hidden">
                    {/* 左侧组件列表 */}
                    <div className="w-64 bg-white border-r border-gray-200 overflow-hidden">
                        <ComponentList />
                    </div>

                    {/* 中间画布区域 */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="min-h-full">
                            <DesignCanvas />
                        </div>
                    </div>

                    {/* 右侧属性面板 */}
                    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
                        <PropertyPanel />
                    </div>
                </div>
            </div>
        </DndContext>
    );
};

export default FormDesigner;