import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Modal, message, Tag, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { $clientReq } from '@/utils/clientRequest';
import PreviewModal from './components/PreviewModal';
import dayjs from 'dayjs';

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

    const fetchData = useCallback(async (page = currentPage, size = pageSize) => {
        try {
            setLoading(true);
            const response = await $clientReq.get(`/form-templates/get?page=${page}&pageSize=${size}`);
            console.log('response:', response);

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
                    await $clientReq.delete(`/form-templates/${id}`);
                    message.success('删除成功');
                    fetchData();
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
                            onClick={() => {/* TODO: 实现编辑功能 */ }}
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
                        <Button type="primary" onClick={() => {/* TODO: 跳转到表单设计器 */ }}>
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
        </div>
    );
};

export default FormManagement;