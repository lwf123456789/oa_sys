import React, { useCallback, useEffect, useState } from 'react';
import { Button, Divider, Form, message, Modal, Space, Tooltip, Select, Input, Switch } from 'antd';
import { WorkflowNodeType } from '../types';
import WorkflowPreviewModal from './WorkflowPreviewModal';
import {
    DeleteOutlined,
    SaveOutlined,
    ImportOutlined,
    ExportOutlined,
    ClearOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { Icon } from '@iconify/react';
import { nodeConfigs } from './WorkflowNode';
import { $clientReq } from '@/utils/clientRequest';

const Toolbar: React.FC = () => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [addLoading, setAddLoading] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState<Array<{ label: string; value: string }>>([]);

    const [previewVisible, setPreviewVisible] = useState(false);
    // 渲染节点按钮
    const renderNodeButton = (type: WorkflowNodeType, title: string) => {
        const config = nodeConfigs[type];
        return (
            <Button
                draggable
                onDragStart={handleDragStart(type)}
                className={`flex items-center space-x-1 cursor-move hover:shadow-md transition-shadow ${config.style}`}
            >
                <Icon
                    icon={config.icon}
                    className="w-4 h-4"
                    style={{ color: config.iconColor }}
                />
                <span>{title}</span>
            </Button>
        );
    };

    const {
        clearCanvas,
        deleteNode,
        selectedNodeId,
        exportConfig,
        importConfig
    } = useWorkflowStore();

    // 拖拽节点
    const handleDragStart = useCallback((type: WorkflowNodeType) => (event: React.DragEvent) => {
        event.dataTransfer.setData('application/reactflow', type);
        event.dataTransfer.effectAllowed = 'move';

        // 创建一个轻量级的预览元素
        const dragPreview = document.createElement('div');
        const config = nodeConfigs[type];

        // 使用 CSS 类和内联样式优化性能
        dragPreview.className = `px-4 py-2 rounded-lg border-2 shadow-sm ${config.style}`;
        dragPreview.style.cssText = `
            position: fixed;
            left: -9999px;
            top: -9999px;
            opacity: 0.5;
            pointer-events: none;
            z-index: -1;
            display: flex;
            align-items: center;
            gap: 8px;
        `;

        // 优化 DOM 操作，减少重排
        dragPreview.innerHTML = `
            <i class="iconify" data-icon="${config.icon}" style="color: ${config.iconColor}; width: 16px; height: 16px;"></i>
            <span style="color: inherit;">${type}</span>
        `;

        // 使用 Performance API 优化清理时机
        const cleanup = () => {
            if (document.body.contains(dragPreview)) {
                dragPreview.remove();
            }
        };

        // 使用 RAF 优化视觉效果
        requestAnimationFrame(() => {
            document.body.appendChild(dragPreview);
            event.dataTransfer.setDragImage(dragPreview, 0, 0);

            // 使用 Performance API 优化清理时机
            if ('requestIdleCallback' in window) {
                window.requestIdleCallback(cleanup, { timeout: 500 });
            } else {
                setTimeout(cleanup, 100);
            }
        });
    }, []);

    // 导出配置
    const handleExport = () => {
        const config = exportConfig();
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'workflow-config.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // 导入配置
    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const config = JSON.parse(e.target?.result as string);
                        importConfig(config);
                    } catch (error) {
                        message.error('配置文件格式错误');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    const handleOk = async () => {
        setAddLoading(true);
        form.validateFields().then(async values => {
            const config = exportConfig();
            const requestData = {
                ...values,
                status: 2,
                config
            };
            await $clientReq.post('/workflows/create', requestData)
            message.success('保存成功');
            setIsModalVisible(false);
        }).catch(info => {
            console.log('Validate Failed:', info);
        }).finally(() => {
            setAddLoading(false);
        });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const fetchCategory = async () => {
        const res = await $clientReq.get('/dicts?type=APPLY_CATEGORY')
        setCategoryOptions(res.data.list)
    }

    useEffect(() => {
        fetchCategory();
    }, [])

    return (
        <div className="p-4 border-b flex justify-between bg-white">
            <Space size="middle">
                <Space>
                    <Tooltip title="删除节点">
                        <Button
                            icon={<DeleteOutlined />}
                            danger
                            disabled={!selectedNodeId || selectedNodeId === 'start'}
                            onClick={() => selectedNodeId && deleteNode(selectedNodeId)}
                        />
                    </Tooltip>
                    <Tooltip title="清空画布">
                        <Button
                            icon={<ClearOutlined />}
                            onClick={() => clearCanvas()}
                        />
                    </Tooltip>
                </Space>

                <Divider type="vertical" />


                <Space>
                    {renderNodeButton('approval', '审批节点')}
                    {renderNodeButton('parallel', '并行节点')}
                    {renderNodeButton('condition', '条件节点')}
                    {renderNodeButton('cc', '抄送节点')}
                    {renderNodeButton('end', '结束节点')}
                </Space>
            </Space>

            <Space>
                <Tooltip title="预览">
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => setPreviewVisible(true)}
                    />
                </Tooltip>
                <Tooltip title="导入配置">
                    <Button
                        icon={<ImportOutlined />}
                        onClick={handleImport}
                    />
                </Tooltip>
                <Tooltip title="导出配置">
                    <Button
                        icon={<ExportOutlined />}
                        onClick={handleExport}
                    />
                </Tooltip>
                <Tooltip title="保存">
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={() => setIsModalVisible(true)}
                    />
                </Tooltip>
            </Space>


            <Modal
                title="保存工作流"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                cancelText="取消"
                okText="保存"
                confirmLoading={addLoading}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="workflow_form"
                >
                    <Form.Item
                        name="name"
                        label="工作流名称"
                        rules={[{ required: true, message: '请输入工作流名称' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="category"
                        label="分类"
                        rules={[{ required: true, message: '请选择分类' }]}
                    >
                        <Select options={categoryOptions} showSearch allowClear>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="描述"
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        name="formId"
                        label="表单ID"
                        rules={[{ required: true, message: '请输入表单ID' }]}
                        initialValue={exportConfig().nodes.find(node => node.data.type === 'start')?.data.config?.formId}
                    >
                        <Input disabled />
                    </Form.Item>
                    {/* <Form.Item
                        name="status"
                        label="状态"
                        valuePropName="checked"
                        getValueFromEvent={checked => checked ? 2 : 3}
                    >
                        <Switch />

                    </Form.Item> */}
                </Form>
            </Modal>

            <WorkflowPreviewModal
                open={previewVisible}
                onClose={() => setPreviewVisible(false)}
                config={exportConfig()}
            />
        </div>
    );
};

export default Toolbar;