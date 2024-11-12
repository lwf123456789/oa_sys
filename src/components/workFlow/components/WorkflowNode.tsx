import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { WorkflowNodeData, WorkflowNodeType } from '../types';
import { Icon } from '@iconify/react';

type NodeStyleConfig = {
    icon: string;
    style: string;
    iconColor: string;
};

export const nodeConfigs: Record<WorkflowNodeType, NodeStyleConfig> = {
    start: {
        icon: 'mdi:play-circle',
        style: 'bg-blue-50 border-blue-500 text-blue-600',
        iconColor: '#2563eb'
    },
    approval: {
        icon: 'mdi:account-check',
        style: 'bg-green-50 border-green-500 text-green-600',
        iconColor: '#16a34a'
    },
    condition: {
        icon: 'mdi:rhombus-outline',
        style: 'bg-yellow-50 border-yellow-500 text-yellow-600',
        iconColor: '#ca8a04'
    },
    parallel: {
        icon: 'mdi:call-split',
        style: 'bg-purple-50 border-purple-500 text-purple-600',
        iconColor: '#9333ea'
    },
    subprocess: {
        icon: 'mdi:sitemap',
        style: 'bg-indigo-50 border-indigo-500 text-indigo-600',
        iconColor: '#4f46e5'
    },
    cc: {
        icon: 'mdi:account-multiple',
        style: 'bg-pink-50 border-pink-500 text-pink-600',
        iconColor: '#db2777'
    },
    end: {
        icon: 'mdi:stop-circle',
        style: 'bg-red-50 border-red-500 text-red-600',
        iconColor: '#dc2626'
    }
};

const WorkflowNode: React.FC<NodeProps<WorkflowNodeData>> = ({ data }) => {
    const config = nodeConfigs[data.type];

    return (
        <div className={`px-4 py-3 rounded-lg border-2 shadow-sm hover:shadow-md transition-shadow ${config.style}`}>
            <Handle
                type="target"
                position={Position.Top}
                className="!bg-gray-400 !w-2 !h-2"
            />
            <div className="flex items-center space-x-2">
                <Icon
                    icon={config.icon}
                    className="w-5 h-5"
                    style={{ color: config.iconColor }}
                />
                <div>
                    <div className="text-sm font-medium">{data.label}</div>
                    {data.description && (
                        <div className="text-xs text-gray-500 mt-0.5">{data.description}</div>
                    )}
                </div>
            </div>
            <Handle
                type="source"
                position={Position.Bottom}
                className="!bg-gray-400 !w-2 !h-2"
            />
        </div>
    );
};

export default memo(WorkflowNode);