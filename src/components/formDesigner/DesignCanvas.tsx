import React from 'react';
import { DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ComponentRenderer from './components/ComponentRenderer';
import { useDesignerStore } from './store/useDesignerStore';

// 可排序组件
const SortableComponent = ({ component, selectedId, onSelect }: { component: any, selectedId: string | null, onSelect: (id: string) => void }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: component.id,
        data: {
            type: component.type,
            isExisting: true
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onSelect(component.id)}
            className={`p-4 border rounded transition-all cursor-move
                ${selectedId === component.id ? 'border-blue-500 shadow-sm' : 'border-gray-200 hover:border-blue-300'}
                ${isDragging ? 'opacity-50' : ''}
            `}
        >
            <ComponentRenderer component={component} />
        </div>
    );
};

const DesignCanvas = () => {
    const { setNodeRef, isOver } = useDroppable({ id: 'canvas' });
    const { selectedId, setSelectedId, components } = useDesignerStore();

    return (
        <div
            ref={setNodeRef}
            className={`min-h-full rounded-lg ${isOver ? 'bg-blue-50' : 'bg-white'}`}
        >
            {components.length === 0 ? (
                <div className="flex items-center justify-center h-[calc(100vh-200px)] text-gray-400">
                    拖拽组件到这里
                </div>
            ) : (
                <SortableContext items={components} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4 p-4">
                        {components.map((component) => (
                            <SortableComponent
                                key={component.id}
                                component={component}
                                selectedId={selectedId}
                                onSelect={setSelectedId}
                            />
                        ))}
                    </div>
                </SortableContext>
            )}
        </div>
    );
};

export default DesignCanvas;