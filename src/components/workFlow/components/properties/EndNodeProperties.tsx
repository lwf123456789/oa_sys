import React from 'react';
import { Form, Input, Select, Switch, Radio, Space } from 'antd';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { Node } from 'reactflow';
import BaseNodeProperties from './BaseNodeProperties';

interface EndNodePropertiesProps {
    node: Node;
}

const EndNodeProperties: React.FC<EndNodePropertiesProps> = ({ node }) => {
    const { updateNodeData } = useWorkflowStore();
    const [form] = Form.useForm();

    const handleValuesChange = (changedValues: any) => {
        updateNodeData(node.id, changedValues);
    };

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
                    label="结束行为"
                    name="endBehavior"
                    rules={[{ required: true, message: '请选择结束行为' }]}
                >
                    <Radio.Group>
                        <Space direction="vertical">
                            <Radio value="archive">归档流程</Radio>
                            <Radio value="delete">删除流程</Radio>
                            <Radio value="copy">复制新流程</Radio>
                        </Space>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    label="通知设置"
                    name={['notification', 'enabled']}
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                <Form.Item
                    noStyle
                    shouldUpdate={(prev, curr) => 
                        prev?.notification?.enabled !== curr?.notification?.enabled
                    }
                >
                    {({ getFieldValue }) => 
                        getFieldValue(['notification', 'enabled']) && (
                            <Space direction="vertical" className="w-full">
                                <Form.Item
                                    label="通知方式"
                                    name={['notification', 'methods']}
                                    rules={[{ required: true, message: '请选择通知方式' }]}
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder="请选择通知方式"
                                        options={[
                                            { label: '站内消息', value: 'system' },
                                            { label: '邮件', value: 'email' },
                                            { label: '短信', value: 'sms' },
                                            { label: '钉钉', value: 'dingtalk' },
                                            { label: '企业微信', value: 'wecom' }
                                        ]}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="通知对象"
                                    name={['notification', 'receivers']}
                                    rules={[{ required: true, message: '请选择通知对象' }]}
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder="请选择通知对象"
                                        options={[
                                            { label: '发起人', value: 'initiator' },
                                            { label: '所有审批人', value: 'approvers' },
                                            { label: '特定人员', value: 'specific' }
                                        ]}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="通知内容"
                                    name={['notification', 'template']}
                                    rules={[{ required: true, message: '请输入通知内容' }]}
                                >
                                    <Input.TextArea 
                                        rows={4}
                                        placeholder="支持使用${表单字段}作为变量，例如：${userName}的${processName}已结束"
                                    />
                                </Form.Item>
                            </Space>
                        )
                    }
                </Form.Item>
            </Form>
        </div>
    );
};

export default EndNodeProperties;