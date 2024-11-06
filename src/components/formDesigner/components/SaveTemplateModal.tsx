import React from 'react';
import { Modal, Form, Input, Switch, message } from 'antd';
import { useDesignerStore } from '../store/useDesignerStore';
import { $clientReq } from '@/utils/clientRequest';

interface SaveTemplateModalProps {
    open: boolean;
    onClose: () => void;
}

const SaveTemplateModal: React.FC<SaveTemplateModalProps> = ({ open, onClose }) => {
    const [form] = Form.useForm();
    const exportConfig = useDesignerStore(state => state.exportConfig);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const config = exportConfig();
            const templateData = {
                name: values.name,
                description: values.description,
                config: config.components,
                status: values.status ? 1 : 2
            };

            console.log('保存模板数据:', templateData);

            await $clientReq.post('/form-templates/create', templateData);
            message.success('保存成功');
            form.resetFields();
            onClose();
        } catch (error) {
            console.error('表单验证失败:', error);
        }
    };

    return (
        <Modal
            title="保存表单模板"
            open={open}
            onCancel={onClose}
            onOk={handleSubmit}
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