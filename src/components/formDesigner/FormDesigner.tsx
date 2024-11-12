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
    const { addComponent, addComponentToGrid, initializeWithData, clearCanvas } = useDesignerStore();

    // 初始化数据
    useEffect(() => {
        if (mode === 'edit' && initialData) {
            initializeWithData(initialData);
        } else {
            clearCanvas(); // 新建模式时清空画布
        }
    }, [mode, initialData]);

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
            const parts = over.id.split('-');
            const gridId = `${parts[0]}-${parts[1]}`;
            const cellIndex = parseInt(parts[3]);
            addComponentToGrid(gridId, cellIndex, newComponent);
        } else if (over.id === 'canvas') {
            addComponent(newComponent);
        }
    };

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
                <Toolbar 
                    mode={mode}
                    onSave={onSave}
                    initialData={initialData}
                />

                <div className="flex flex-1 overflow-hidden">
                    <div className="w-64 bg-white border-r border-gray-200 overflow-hidden">
                        <ComponentList />
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="min-h-full">
                            <DesignCanvas />
                        </div>
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