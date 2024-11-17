import React, { useEffect } from 'react';
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import ComponentList from './ComponentList';
import DesignCanvas from './DesignCanvas';
import PropertyPanel from './PropertyPanel';
import { useDesignerStore } from './store/useDesignerStore';
import Toolbar from './components/Toolbar';

interface FormDesignerProps {
    mode: 'create' | 'edit';
    initialData?: {
        id?: number;
        name?: string;
        description?: string;
        config?: any;
        status?: number;
    };
    onSave?: (data: any) => void;
    onCancel?: () => void;
}

const FormDesigner: React.FC<FormDesignerProps> = ({
    mode = 'create',
    initialData,
    onSave,
    onCancel
}) => {
    const { addComponent, addComponentToGrid, initializeWithData, clearCanvas, components, reorderComponents } = useDesignerStore();

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            initializeWithData(initialData);
        } else {
            clearCanvas();
        }
    }, [mode, initialData]);

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: { distance: 5 },
        }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 100, tolerance: 5 },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        // 处理新组件的拖入
        if (active.data.current?.isNew) {
            const newComponent = {
                id: `${active.data.current.type}-${Date.now()}`,
                type: active.data.current.type,
                label: active.data.current.label || active.data.current.type,
                props: active.data.current.defaultProps || {}
            };

            if (over.id === 'canvas') {
                addComponent(newComponent);
            } else if (typeof over.id === 'string' && over.id.includes('-cell-')) {
                const [gridId, , , cellIndex] = over.id.split('-');
                addComponentToGrid(`${gridId}`, parseInt(cellIndex), newComponent);
            }
            return;
        }

        // 处理组件排序
        if (active.data.current?.isExisting && over.id !== 'canvas') {
            const oldIndex = components.findIndex(item => item.id === active.id);
            const newIndex = components.findIndex(item => item.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1) {
                reorderComponents(oldIndex, newIndex);
            }
        }
    };

    return (
        <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
                <Toolbar mode={mode} onSave={onSave} initialData={initialData} />
                <div className="flex flex-1 overflow-hidden">
                    <div className="w-64 bg-white border-r border-gray-200">
                        <ComponentList />
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                        <DesignCanvas />
                    </div>
                    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
                        <PropertyPanel />
                    </div>
                </div>
            </div>
        </DndContext>
    );
};

export default FormDesigner;