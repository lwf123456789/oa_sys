import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import ComponentRenderer from './components/ComponentRenderer';
import { useDesignerStore } from './store/useDesignerStore';

const DesignCanvas: React.FC = () => {
    const { setNodeRef, isOver } = useDroppable({ id: 'canvas' });
    const { selectedId, setSelectedId, components } = useDesignerStore();

    return (
        <div
            ref={setNodeRef}
            className={`
        h-full min-h-[600px] bg-white rounded-lg 
        border-2 border-dashed 
        ${isOver ? 'border-blue-400 bg-blue-50/30' : 'border-gray-300'}
        p-4 transition-colors duration-200
      `}
        >
            {components.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                    拖拽组件到这里
                </div>
            ) : (
                <div className="space-y-4">
                    {components.map((component) => (
                        <div
                            key={component.id}
                            onClick={() => setSelectedId(component.id)}
                            className={`p-4 border rounded transition-all cursor-pointer
                ${selectedId === component.id
                                    ? 'border-blue-500 shadow-sm'
                                    : 'border-gray-200 hover:border-blue-300'
                                }`}
                        >
                            <ComponentRenderer component={component} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DesignCanvas;