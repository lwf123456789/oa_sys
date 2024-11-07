'use client'
import React, { useEffect } from 'react';
import { Form, Input, Select, Radio, Switch } from 'antd';
import { useWorkflowStore } from '../../store/useWorkflowStore'
import { Node } from 'reactflow';
import { WorkflowNodeData } from '../../types';
import BaseNodeProperties from './BaseNodeProperties';

interface ApprovalNodePropertiesProps {
    node: Node<WorkflowNodeData>;
}

const ApprovalNodeProperties: React.FC<ApprovalNodePropertiesProps> = ({ node }) => {
    const { updateNodeData } = useWorkflowStore();
    const [form] = Form.useForm();

    // 只在节点ID变化时重置表单
    useEffect(() => {
        form.resetFields();
        form.setFieldsValue({
            label: node.data.label,
            description: node.data.description,
            config: node.data.config
        });
    }, [node.id]); // 只监听节点ID变化

    const handleValuesChange = (changedValues: any) => {
        if (changedValues.config) {
            updateNodeData(node.id, {
                config: {
                    ...node.data.config,
                    ...changedValues.config
                }
            });
        } else {
            updateNodeData(node.id, changedValues);
        }
    };

    return (
        <div className="space-y-6">
            <BaseNodeProperties node={node} />

            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    config: node.data.config // 修改初始值结构
                }}
                onValuesChange={handleValuesChange}
            >
                <Form.Item
                    label="审批方式"
                    name={['config', 'approvalMode']}
                    rules={[{ required: true, message: '请选择审批方式' }]}
                >
                    <Radio.Group>
                        <Radio value="AND">会签（需所有人同意）</Radio>
                        <Radio value="OR">或签（一人同意即可）</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    label="审批人类型"
                    name={['config', 'approverType']}
                    rules={[{ required: true, message: '请选择审批人类型' }]}
                >
                    <Select>
                        <Select.Option value="specific">指定成员</Select.Option>
                        <Select.Option value="leader">上级领导</Select.Option>
                        <Select.Option value="role">指定角色</Select.Option>
                        <Select.Option value="department">指定部门</Select.Option>
                    </Select>
                </Form.Item>

                {/* 根据审批人类型显示不同的选择器 */}
                <Form.Item
                    noStyle
                    shouldUpdate={(prev, curr) =>
                        prev.config?.approverType !== curr.config?.approverType
                    }
                >
                    {({ getFieldValue }) => {
                        const approverType = getFieldValue(['config', 'approverType']);
                        if (approverType === 'specific' || approverType === 'role' || approverType === 'department') {
                            return (
                                <Form.Item
                                    label={`选择${approverType === 'specific' ? '成员' : approverType === 'role' ? '角色' : '部门'}`}
                                    name={['config', 'approvers']}
                                    rules={[{ required: true, message: '请选择审批人' }]}
                                >
                                    <Select mode="multiple">
                                        {/* 这里可以根据类型加载不同的选项 */}
                                    </Select>
                                </Form.Item>
                            );
                        }
                        return null;
                    }}
                </Form.Item>

                <Form.Item
                    label="审批表单"
                    name={['config', 'formId']}
                    tooltip="审批时需要填写的表单"
                >
                    <Select
                        placeholder="请选择审批表单"
                        allowClear
                    />
                </Form.Item>

                <Form.Item
                    label="审批超时设置"
                    name={['config', 'timeout', 'enabled']}
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                <Form.Item
                    noStyle
                    shouldUpdate={(prev, curr) =>
                        prev.config?.timeout?.enabled !== curr.config?.timeout?.enabled
                    }
                >
                    {({ getFieldValue }) => (
                        getFieldValue(['config', 'timeout', 'enabled']) && (
                            <>
                                <Form.Item
                                    label="超时时间(小时)"
                                    name={['config', 'timeout', 'hours']}
                                    rules={[{ required: true, message: '请设置超时时间' }]}
                                >
                                    <Input type="number" min={1} />
                                </Form.Item>

                                <Form.Item
                                    label="超时处理"
                                    name={['config', 'timeout', 'action']}
                                    rules={[{ required: true, message: '请选择超时处理方式' }]}
                                >
                                    <Select>
                                        <Select.Option value="pass">自动通过</Select.Option>
                                        <Select.Option value="reject">自动拒绝</Select.Option>
                                        <Select.Option value="notify">仅提醒</Select.Option>
                                    </Select>
                                </Form.Item>
                            </>
                        )
                    )}
                </Form.Item>
            </Form>
        </div>
    );
};

export default ApprovalNodeProperties;