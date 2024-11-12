import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Switch, message } from 'antd';
import { useDesignerStore } from '../store/useDesignerStore';

interface SaveTemplateModalProps {
    open: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
    onSave: (data: any) => void;
    initialData?: {
        id?: number;
        name?: string;
        description?: string;
        status?: number;
    };
}

const SaveTemplateModal: React.FC<SaveTemplateModalProps> = ({ 
    open, 
    onClose, 
    mode, 
    onSave,
    initialData 
}) => {
    const [form] = Form.useForm();
    const exportConfig = useDesignerStore(state => state.exportConfig);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (mode === 'edit' && initialData) {
            form.setFieldsValue({
                name: initialData.name,
                description: initialData.description,
                status: initialData.status === 1
            });
        } else {
            form.resetFields();
        }
    }, [mode, initialData, form]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const values = await form.validateFields();
            const config = exportConfig();
            const templateData = {
                ...(initialData?.id ? { id: initialData.id } : {}),
                name: values.name,
                description: values.description,
                config: config.components,
                status: values.status ? 1 : 2
            };

            onSave(templateData);
            form.resetFields();
            onClose();
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={mode === 'create' ? '保存表单模板' : '编辑表单模板'}
            open={open}
            onCancel={onClose}
            onOk={handleSubmit}
            okText="保存"
            cancelText="取消"
            confirmLoading={loading}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{ status: true }}
            >
                <Form.Item
                    name="name"
                    label="表单名称"
                    rules={[{ required: true, message: '请输入表单名称' }]}
                >
                    <Input placeholder="请输入表单名称" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="表单描述"
                >
                    <Input.TextArea
                        placeholder="请输入表单描述"
                        rows={4}
                    />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="表单状态"
                    valuePropName="checked"
                >
                    <Switch
                        checkedChildren="启用"
                        unCheckedChildren="禁用"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SaveTemplateModal;