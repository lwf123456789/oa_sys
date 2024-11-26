
import React, { useCallback, useEffect } from 'react';
import { Form, Radio, InputNumber, Input, Card } from 'antd';
import { Node } from 'reactflow';
import { WorkflowNodeData } from '../../types';
import BaseNodeProperties from './BaseNodeProperties';
import { useWorkflowStore } from '../../store/useWorkflowStore';

interface ParallelNodePropertiesProps {
    node: Node<WorkflowNodeData>;
}

const ParallelNodeProperties: React.FC<ParallelNodePropertiesProps> = ({ node }) => {
    const { updateNodeData, nodes, edges } = useWorkflowStore();
    const [form] = Form.useForm();

    // 初始化表单数据
    useEffect(() => {
        if (node.data.config) {
            form.setFieldsValue({
                config: {
                    strategy: node.data.config.strategy || 'ALL',
                    branches: node.data.config.branches || []
                }
            });
        }
    }, [node.id]);

    const handleValuesChange = useCallback((changedValues: any) => {
        const newData = {
            config: {
                ...node.data.config,
                ...changedValues.config
            }
        };
        updateNodeData(node.id, newData);
    }, [node.id, node.data.config, updateNodeData]);

    const calculateBranches = useCallback(() => {
        const outgoingEdges = edges.filter(edge => edge.source === node.id);
        const existingBranches = node.data.config?.branches || [];

        return outgoingEdges.map(edge => {
            const targetNode = nodes.find(n => n.id === edge.target);
            const existingBranch = existingBranches.find(b => b.id === edge.target);

            return {
                id: edge.target,
                label: targetNode?.data.label || '未命名分支',
                description: targetNode?.data.description,
                nodeIds: [edge.target],
                // 保留已有的配置
                ...existingBranch
            };
        });
    }, [edges, node.id, nodes, node.data.config?.branches]);

    useEffect(() => {
        const branches = calculateBranches();
        const currentBranches = node.data.config?.branches || [];

        if (JSON.stringify(branches.map(b => b.id)) !== JSON.stringify(currentBranches.map(b => b.id))) {
            updateNodeData(node.id, {
                config: {
                    ...node.data.config,
                    strategy: node.data.config?.strategy || 'ALL',
                    branches
                }
            });
        }
    }, [calculateBranches, node.id, node.data.config, updateNodeData]);

    return (
        <div className="space-y-6">
            <BaseNodeProperties node={node} />
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    config: {
                        strategy: node.data.config?.strategy || 'ALL',
                        branches: node.data.config?.branches || []
                    }
                }}
                onValuesChange={handleValuesChange}
            >
                <Form.Item
                    label="并行策略"
                    name={['config', 'strategy']}
                    rules={[{ required: true, message: '请选择并行策略' }]}
                >
                    <Radio.Group>
                        <Radio value="ALL">所有分支通过</Radio>
                        <Radio value="ANY">任一分支通过</Radio>
                    </Radio.Group>
                </Form.Item>

                <div className="mt-4">
                    <div className="text-gray-500 mb-2">分支信息</div>
                    <div className="space-y-2">
                        {node.data.config?.branches?.map(branch => (
                            <Card
                                size="small"
                                key={branch.id}
                                title={branch.label}
                                className="bg-gray-50"
                            >
                                {branch.description && (
                                    <div className="text-gray-500 text-sm">
                                        {branch.description}
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default ParallelNodeProperties;