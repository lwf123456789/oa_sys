import React from 'react';
import { Icon } from '@iconify/react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { defaultAnimateLayoutChanges } from '@dnd-kit/sortable';
import { componentList } from './config/componentConfig';
import type { ComponentConfig } from './config/componentConfig';

// 图标颜色映射
const iconColorMap: Record<string, string> = {
    'input': 'text-blue-500',
    'select': 'text-purple-500',
    'radio': 'text-green-500',
    'checkbox': 'text-indigo-500',
    'timePicker': 'text-orange-500',
    'datePicker': 'text-red-500',
    'grid': 'text-teal-500',
    'title': 'text-yellow-600',
};

// 组件列表
const ComponentList: React.FC = () => {
    return (
        <div className="h-full bg-gray-50 p-4 overflow-hidden">
            <h2 className="text-lg font-medium mb-4">组件列表</h2>
            <div className="grid grid-cols-2 gap-2 relative">
                {componentList.map((component) => (
                    <DraggableComponent key={component.type} component={component} />
                ))}
            </div>
        </div>
    );
};

// 可拖拽组件类型
interface DraggableComponentProps {
    component: ComponentConfig;
}

// 可拖拽组件
const DraggableComponent: React.FC<DraggableComponentProps> = ({ component }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `new-${component.type}`,
        data: {
            type: component.type,
            defaultProps: component.defaultProps,
            isNew: true
        }
    });

    const style:any = {
        transform: CSS.Transform.toString(transform),
        touchAction: 'none',
        transition: isDragging ? 'none' : 'transform 200ms ease-in-out',
        position: 'relative', // 添加相对定位
        maxWidth: '100%',    // 限制最大宽度
    };

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
            className={`
            flex flex-col items-center justify-center p-3
            bg-white rounded-lg border border-gray-200
            cursor-move overflow-hidden
            ${isDragging ? [
                    'opacity-95',
                    'shadow-lg',
                    'border-blue-400',
                    'bg-blue-50',
                    'z-50',
                    'transition-all duration-75'
                ].join(' ') : 'hover:border-blue-500 hover:bg-blue-50 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ease-out'}
        `}
        >
            <div className={`
                relative
                ${isDragging ? 'animate-pulse' : ''}
                transform transition-transform duration-200
            `}>
                <Icon
                    icon={component.icon}
                    className={`
                        text-2xl mb-1.5
                        ${iconColorMap[component.type] || 'text-gray-600'}
                        transition-all duration-200
                        ${isDragging ? '' : 'hover:scale-105'}
                    `}
                />
            </div>
            <span className={`
                text-sm font-medium
                ${isDragging ? 'text-blue-600' : 'text-gray-700'}
                transition-colors duration-150
            `}>
                {component.label}
            </span>
        </div>
    );
};

export default ComponentList;