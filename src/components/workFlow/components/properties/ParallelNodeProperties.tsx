
import React, { useEffect } from 'react';
import { Form, Radio, InputNumber, Input } from 'antd';
import { Node } from 'reactflow';
import { WorkflowNodeData } from '../../types';
import BaseNodeProperties from './BaseNodeProperties';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { Edge } from 'reactflow';
import { nanoid } from 'nanoid';

interface ParallelNodePropertiesProps {
    node: Node<WorkflowNodeData>;
}

const ParallelNodeProperties: React.FC<ParallelNodePropertiesProps> = ({ node }) => {
    const { updateNodeData, nodes, edges } = useWorkflowStore();
    const [form] = Form.useForm();


    const handleValuesChange = (changedValues: any) => {
        updateNodeData(node.id, changedValues);
    };

    // useEffect(() => {
    //     const branches = calculateBranches(node.id, nodes, edges);
    //     updateNodeData(node.id, {
    //         config: {
    //             ...node.data.config,
    //             branches
    //         }
    //     });
    // }, [edges]);

    return (
        <div className="space-y-6">
            <BaseNodeProperties node={node} />

            <Form
                form={form}
                layout="vertical"
                initialValues={node.data.config}
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
                        <Radio value="VOTE">投票通过</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    noStyle
                    shouldUpdate={(prev, curr) =>
                        prev.config?.strategy !== curr.config?.strategy
                    }
                >
                    {({ getFieldValue }) => (
                        getFieldValue(['config', 'strategy']) === 'VOTE' && (
                            <Form.Item
                                label="通过票数"
                                name={['config', 'votePass']}
                                rules={[{ required: true, message: '请设置通过票数' }]}
                            >
                                <InputNumber min={1} />
                            </Form.Item>
                        )
                    )}
                </Form.Item>
            </Form>
        </div>
    );
};

export default ParallelNodeProperties;