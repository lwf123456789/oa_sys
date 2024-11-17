import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Modal, message, Tag, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { $clientReq } from '@/utils/clientRequest';
import PreviewModal from './components/PreviewModal';
import dayjs from 'dayjs';
import FormDesigner from './FormDesigner';

interface FormTemplate {
    id: number;
    name: string;
    description: string;
    status: number;
    created_at: string;
    updated_at: string;
    config: any;
}

const FormManagement: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<FormTemplate[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState<FormTemplate | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    // 点击编辑弹出表单设计器
    const [editOpen, setEditOpen] = useState(false)
    const [designerMode, setDesignerMode] = useState<'create' | 'edit'>('create');
    const [editingTemplate, setEditingTemplate] = useState<FormTemplate | null>(null);

    // 处理保存逻辑
    const handleSave = async (formData: any) => {
        console.log('formData:', formData);
        
        try {
            if (designerMode === 'edit' && editingTemplate) {
                const res = await $clientReq.put(`/form-templates/update?id=${editingTemplate.id}`, formData);
                if (res.message) {
                    message.success('更新成功');
                }
            } else {
                await $clientReq.post('/form-templates/create', formData);
                message.success('创建成功');
            }
            setEditOpen(false);
            setEditingTemplate(null);
            fetchData();
        } catch (error) {
        }
    };

    // 处理编辑按钮点击
    const handleEdit = (record: FormTemplate) => {
        setEditingTemplate(record);
        setDesignerMode('edit');
        setEditOpen(true);
    };

    // 处理新建按钮点击
    const handleCreate = () => {
        setDesignerMode('create');
        setEditingTemplate(null);
        setEditOpen(true);
    };

    const fetchData = useCallback(async (page = currentPage, size = pageSize) => {
        try {
            setLoading(true);
            const response = await $clientReq.get(`/form-templates/get?page=${page}&pageSize=${size}`);
            setData(response.data.list);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这个表单模板吗？此操作不可恢复。',
            cancelText: '取消',
            okText: '确定',
            onOk: async () => {
                try {
                    const res = await $clientReq.delete(`/form-templates/del?id=${id}`);
                    if (res.message) {
                        message.success('删除成功');
                        fetchData();
                    }
                } catch (error) {
                    message.error('删除失败');
                }
            }
        });
    };

    const handlePreview = (record: FormTemplate) => {
        console.log('record:', record);

        setCurrentTemplate(record.config);
        setPreviewOpen(true);
    }

    const columns: any = [
        {
            title: '表单名称',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            align: 'center',
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            width: 250,
            ellipsis: true,
            align: 'center',
            render: (description: string) => description ? <Tooltip title={description}>{description}</Tooltip> : '无描述',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            align: 'center',
            render: (status: number) => (
                <Tag color={status === 1 ? 'success' : 'default'}>
                    {status === 1 ? '启用' : '禁用'}
                </Tag>
            ),
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            key: 'created_at',
            align: 'center',
            render: (createdAt: string) => dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: '更新时间',
            dataIndex: 'updated_at',
            key: 'updated_at',
            align: 'center',
            render: (updatedAt: string) => dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: '操作',
            key: 'action',
            width: 250,
            fixed: 'right',
            align: 'center',
            render: (_: any, record: FormTemplate) => (
                <Space>
                    <Tooltip title="预览">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => handlePreview(record)}
                        />
                    </Tooltip>
                    <Tooltip title="编辑">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="删除">
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record.id)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b border-gray-200">
                    <Space className="flex justify-between">
                        <span className="text-lg font-medium">表单模板管理</span>
                        <Button type="primary" onClick={handleCreate}>
                            新建表单
                        </Button>
                    </Space>
                </div>
                <div className="p-4">
                    <Table
                        columns={columns}
                        dataSource={data}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total) => `共 ${total} 条`,
                        }}
                    />
                </div>
            </div>

            {currentTemplate && (
                <PreviewModal
                    isDesign={false}
                    template={currentTemplate}
                    open={previewOpen}
                    onClose={() => {
                        setPreviewOpen(false);
                        setCurrentTemplate(null);
                    }}
                />
            )}


            {/* 表单设计器模态框 */}
            <Modal
                title={designerMode === 'create' ? '新建表单' : '编辑表单'}
                open={editOpen}
                onCancel={() => {
                    setEditOpen(false);
                    setEditingTemplate(null);
                }}
                width="100vw"
                style={{
                    top: 0,
                    maxHeight: '100vh',
                    overflow: 'auto'
                }}
                bodyStyle={{
                    overflow: 'auto'
                }}
                footer={null}
            >
                <FormDesigner
                    mode={designerMode}
                    initialData={editingTemplate || undefined}
                    onSave={handleSave}
                    onCancel={() => {
                        setEditOpen(false);
                        setEditingTemplate(null);
                    }}
                />
            </Modal>
        </div>
    );
};

export default FormManagement;