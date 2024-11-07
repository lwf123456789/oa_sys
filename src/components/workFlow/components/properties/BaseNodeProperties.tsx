import React, { useEffect } from 'react';
import { Form, Input } from 'antd';
import { Node } from 'reactflow';
import { WorkflowNodeData } from '../../types';
import { useWorkflowStore } from '../../store/useWorkflowStore';

interface BaseNodePropertiesProps {
    node: Node<WorkflowNodeData>;
}

const BaseNodeProperties: React.FC<BaseNodePropertiesProps> = ({ node }) => {
    const { updateNodeData } = useWorkflowStore();
    const [form] = Form.useForm();

    // 只在节点ID变化时重置表单
    useEffect(() => {
        form.resetFields();
        form.setFieldsValue({
            label: node.data.label,
            description: node.data.description
        });
    }, [node.id]); // 只监听节点ID变化

    const handleValuesChange = (changedValues: any) => {
        // 直接更新节点数据，不触发表单重置
        updateNodeData(node.id, changedValues);
    };


    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={{
                label: node.data.label,
                description: node.data.description
            }}
            onValuesChange={handleValuesChange}
        >
            <Form.Item
                label="节点名称"
                name="label"
                rules={[
                    { required: true, message: '请输入节点名称' },
                    { max: 20, message: '节点名称不能超过20个字符' }
                ]}
            >
                <Input placeholder="请输入节点名称" />
            </Form.Item>

            <Form.Item
                label="节点描述"
                name="description"
                rules={[
                    { max: 100, message: '节点描述不能超过100个字符' }
                ]}
            >
                <Input.TextArea
                    rows={4}
                    showCount
                    maxLength={100}
                    allowClear
                    placeholder="请输入节点描述（选填）"
                />
            </Form.Item>
        </Form>
    );
};

export default BaseNodeProperties;