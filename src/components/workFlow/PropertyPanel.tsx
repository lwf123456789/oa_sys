import React from 'react';
import { useWorkflowStore } from './store/useWorkflowStore';
import StartNodeProperties from './components/properties/StartNodeProperties';
import ApprovalNodeProperties from './components/properties/ApprovalNodeProperties';
import EndNodeProperties from './components/properties/EndNodeProperties';
// import ParallelNodeProperties from './components/properties/ParallelNodeProperties';
// import ConditionNodeProperties from './components/properties/ConditionNodeProperties';
import { Node } from 'reactflow';
import { Tabs } from 'antd';
import ParallelNodeProperties from './components/properties/ParallelNodeProperties';
import ConditionNodeProperties from './components/properties/ConditionNodeProperties';

const PropertyPanel: React.FC = () => {
    const { nodes, selectedNodeId } = useWorkflowStore();

    if (!selectedNodeId) {
        return (
            <div className="p-4 text-gray-500 text-center">
                请选择一个节点进行配置
            </div>
        );
    }

    const selectedNode = nodes.find(node => node.id === selectedNodeId);
    if (!selectedNode) return null;

    const renderProperties = (node: Node) => {
        switch (node.data.type) {
            case 'start':
                return <StartNodeProperties node={node} />;
            case 'approval':
                return <ApprovalNodeProperties node={node} />;
            case 'condition':
                return <ConditionNodeProperties node={node} />;
            case 'parallel':
                return <ParallelNodeProperties node={node} />;
            case 'end':
                return <EndNodeProperties node={node} />;
            default:
                return null;
        }
    };

    const getNodeTitle = (type: string) => {
        const titles: Record<string, string> = {
            start: '开始节点',
            approval: '审批节点',
            condition: '条件节点',
            parallel: '并行节点',
            end: '结束节点'
        };
        return titles[type] || '未知节点';
    };

    return (
        <div className="h-full">
            <div className="px-4">
                <Tabs
                    defaultActiveKey="basic"
                    items={[
                        {
                            key: 'basic',
                            label: '基础配置',
                            children: renderProperties(selectedNode)
                        },
                        {
                            key: 'advanced',
                            label: '高级配置',
                            children: (
                                <div className="p-4 text-gray-500">
                                    高级配置开发中...
                                </div>
                            )
                        }
                    ]}
                />
            </div>
        </div>
    );
};

export default PropertyPanel;