import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Modal, message, Tag, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { $clientReq } from '@/utils/clientRequest';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import WorkflowPreview from './WorkflowPreview';

interface FormTemplate {
    id: number;
    name: string;
    description: string;
    formId: number;
    version?: number;
    creator?: object;
    created_by: number;
    category: string;
    status: number;
    created_at: string;
    updated_at: string;
    config: any;
}

const FormManagement: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<FormTemplate[]>([]);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [currentStatus, setCurrentStatus] = useState<number | undefined>(undefined);
    const [currentCategory, setCurrentCategory] = useState<number | undefined>(undefined);


    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewData, setPreviewData] = useState<any>(null);

    const fetchData = useCallback(async (page = currentPage, size = pageSize, status = currentStatus, category = currentCategory) => {
        try {
            setLoading(true);
            const response = await $clientReq.get(`/workflows/get?page=${page}&pageSize=${size}&status=${status}&category=${category}`);

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
                    const res = await $clientReq.delete(`/workflows/del?id=${id}`);
                    if (res?.message) {
                        message.success('删除成功');
                    }
                } catch (error) {
                    message.error('删除失败');
                } finally {
                    fetchData()
                }
            }
        });
    };

    const handlePreview = (record: FormTemplate) => {
        setPreviewData(record.config);
        setPreviewVisible(true);
    };

    const columns: any = [
        {
            title: '流程名称',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            align: 'center',
        },
        {
            title: '流程描述',
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
                <Tag color={status === 2 ? 'success' : 'error'}>
                    {status === 2 ? '已发布' : '已禁用'}
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
                        <span className="text-lg font-medium">流程管理</span>
                        <Button type="primary" onClick={() => { router.push('/workFlow/index') }}>
                            新建流程
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

            {previewData && (
                <WorkflowPreview
                    open={previewVisible}
                    onClose={() => setPreviewVisible(false)}
                    data={previewData}
                />
            )}
        </div>
    );
};

export default FormManagement;