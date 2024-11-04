'use client';
import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Input, Popconfirm, message, Space, Drawer, InputNumber, Tag, Badge, Tooltip, Row, Col } from 'antd';
import Notification from '@/components/Notification'
import Pagination from '@/components/Pagination'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import { useLayout } from '@/contexts/layoutContext';
import { $clientReq } from '@/utils/clientRequest';
import { Icon } from '@iconify/react';

interface DictItem {
    id: number;
    type: string;
    label: string;
    value: string;
    sort: number;
    description: string;
    created_at: string;
    updated_at: string;
}

const DictManagement: React.FC = () => {
    const { setUseDefaultLayout } = useLayout();
    const [dictItems, setDictItems] = useState<DictItem[]>([]);
    /** 查询条件-start */
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(50);
    const [searchType, setSearchType] = useState('');
    const [searchLabel, setSearchLabel] = useState('');
    /** 查询条件-end */
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingItem, setEditingItem] = useState<DictItem | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [form] = Form.useForm();
    /** 用于表格展开和折叠唯一 */
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
    const onExpand = (expanded: boolean, record: any) => {
        if (expanded) {
            setExpandedRowKeys([record.type]);
        } else {
            setExpandedRowKeys([]);
        }
    };

    const handleExpandAll = () => {
        const allTypes = dictItems.map(item => item.type);
        setExpandedRowKeys(allTypes);
    };

    const handleCollapseAll = () => {
        setExpandedRowKeys([]);
    };

    useEffect(() => {
        return () => setUseDefaultLayout(true);
    }, [setUseDefaultLayout]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    const fetchDictItems = async (type = searchType, label = searchLabel) => {
        setLoading(true);
        try {
            const url = `/dicts/all?page=${currentPage}&pageSize=${pageSize}&type=${type}&label=${label}`;
            const data = await $clientReq.get(url);

            if (data) {
                const groupedData = data.data.list.reduce((acc: any, item: DictItem) => {
                    if (!acc[item.type]) {
                        acc[item.type] = { type: item.type, items: [], count: 0 };
                    }
                    acc[item.type].items.push(item);
                    acc[item.type].count++;
                    return acc;
                }, {});
                const processedData: any = Object.values(groupedData);
                setDictItems(processedData);
                setTotalItems(data.data.total);

                // 如果是初始加载且有数据，展开第一项
                if (isInitialLoad && processedData.length > 0) {
                    setExpandedRowKeys([processedData[0].type]);
                    setIsInitialLoad(false);
                }
            }
        } catch (error) {
            console.error('获取字典数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSearchType('');
        setSearchLabel('');
        setCurrentPage(1);
        setIsInitialLoad(true); // 重置时重新启用初始展开
        fetchDictItems('', '');
    };

    useEffect(() => {
        fetchDictItems();
    }, [currentPage, pageSize]);

    const handleAdd = (type?: string) => {
        setEditingItem(null);
        setIsEditing(false);
        setIsDrawerOpen(true);
        form.resetFields();
        if (type) {
            form.setFieldsValue({ type });
        }
    };

    const handleEdit = (record: DictItem) => {
        setEditingItem(record);
        setIsEditing(true);
        setIsDrawerOpen(true);
        form.setFieldsValue(record);
    };

    const [saveLoading, setSaveLoading] = useState<boolean>(false);
    const handleSave = async () => {
        form.validateFields().then(async values => {
            setSaveLoading(true);
            try {
                const url = editingItem ? '/dicts/update' : '/dicts/create';
                const method = editingItem ? 'put' : 'post';

                const result = await $clientReq[method](url, {
                    ...values,
                    id: editingItem?.id
                });

                if (!result.data) {
                    message.error(result);
                    return;
                }

                Notification({
                    type: 'success',
                    message: editingItem ? '更新成功!' : '添加成功!',
                    description: editingItem ? '字典项已成功更新。' : '新字典项已成功添加。',
                    placement: 'topRight',
                });
            } catch (error) {
            } finally {
                setSaveLoading(false);
                setIsDrawerOpen(false);
                fetchDictItems();
            }
        });
    };

    const handleDelete = async (id: number) => {
        try {
            await $clientReq.delete(`/dicts/del?id=${id}`);
            Notification({
                type: 'success',
                message: '删除成功!',
                description: '字典项已删除',
                placement: 'topRight'
            });
        } catch (error) {
        } finally {
            fetchDictItems();
        }
    };

    const columns: any[] = [
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            align: 'center',
            render: (text: string) => <Tag color="blue">{text}</Tag>
        },
        {
            title: '数量',
            dataIndex: 'count',
            key: 'count',
            align: 'center',
            render: (count: number) => <Badge count={count} overflowCount={999} />
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (_: any, record: any) => (
                <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd(record.type)}>
                    添加
                </Button>
            ),
        },
    ];

    const expandedRowRender = (record: any) => {
        const columns: any = [
            {
                title: '标签',
                dataIndex: 'label',
                key: 'label',
                align: 'center',
                render: (text: string) => <Tag color="green">{text}</Tag>
            },
            {
                title: '值',
                dataIndex: 'value',
                key: 'value',
                align: 'center',
                render: (text: string) => <code>{text}</code>
            },
            {
                title: '排序',
                dataIndex: 'sort',
                key: 'sort',
                align: 'center',
                sorter: (a: DictItem, b: DictItem) => a.sort - b.sort,
            },
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                align: 'center',
                ellipsis: true,
            },
            {
                title: '创建时间',
                dataIndex: 'created_at',
                key: 'created_at',
                align: 'center',
                render: (text: string) => {
                    const date = new Date(text);
                    return (
                        <Tooltip title={date.toLocaleString('zh-CN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false
                        })}>
                            {date.toLocaleDateString('zh-CN')}
                        </Tooltip>
                    );
                }
            },
            {
                title: '操作',
                key: 'action',
                align: 'center',
                render: (_: any, item: DictItem) => (
                    <Space size="middle">
                        <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(item)}>
                            编辑
                        </Button>
                        <Popconfirm
                            title="确定要删除吗?"
                            onConfirm={() => handleDelete(item.id)}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button type="link" danger icon={<DeleteOutlined />}>
                                删除
                            </Button>
                        </Popconfirm>
                    </Space>
                ),
            },
        ];

        return <Table columns={columns} rowKey={(item) => item.id} dataSource={record.items} pagination={false} />;
    };

    return (
        <div className="p-4">
            <Form>
                <Row gutter={[24, 24]}>
                    <Col span={6}>
                        <Form.Item label="类型">
                            <Input
                                placeholder="搜索类型"
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                                prefix={<SearchOutlined />}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="标签">
                            <Input
                                placeholder="搜索标签"
                                value={searchLabel}
                                onChange={(e) => setSearchLabel(e.target.value)}
                                prefix={<SearchOutlined />}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="">
                            <div className='space-x-4'>
                                <Button type="primary" icon={<SearchOutlined />} onClick={() => fetchDictItems()}>
                                    搜索
                                </Button>
                                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                                    重置
                                </Button>
                                <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd()}>
                                    添加字典项
                                </Button>
                                {dictItems.length > 0 && (
                                    <>
                                        <Button
                                            onClick={handleExpandAll}
                                            icon={<SettingOutlined />}
                                        >
                                            展开所有
                                        </Button>
                                        <Button
                                            onClick={handleCollapseAll}
                                            icon={<SettingOutlined />}
                                        >
                                            收起所有
                                        </Button>
                                    </>
                                )}
                            </div>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Table
                columns={columns}
                bordered={false}
                expandable={{
                    expandedRowRender,
                    expandedRowKeys,
                    onExpand,
                }}
                dataSource={dictItems}
                rowKey={(record) => record.type}
                loading={loading}
                pagination={false}
                className="mt-4 shadow-sm rounded-lg overflow-hidden"
                rowClassName={(record) => `
        hover:bg-blue-50 transition-colors duration-200
        dark:hover:bg-gray-700
    `}
                locale={{
                    emptyText: (
                        <div className="py-8 flex flex-col items-center">
                            <Icon
                                icon="arcticons:thai-dict"
                                className="text-4xl text-gray-300 mb-2"
                            />
                            <div className="text-gray-500">暂无字典数据</div>
                        </div>
                    )
                }}
            />
            {
                totalItems > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        pageSize={pageSize}
                        totalItems={totalItems}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                    />
                )
            }
            <Drawer
                title={editingItem ? '编辑字典项' : '添加字典项'}
                placement="right"
                onClose={() => setIsDrawerOpen(false)}
                open={isDrawerOpen}
                width={400}
                footer={
                    <div style={{ textAlign: 'right' }}>
                        <Button onClick={() => setIsDrawerOpen(false)} style={{ marginRight: 8 }}>
                            取消
                        </Button>
                        <Button onClick={handleSave} type="primary" loading={saveLoading}>
                            保存
                        </Button>
                    </div>
                }
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="type" label="类型" rules={[{ required: true, message: '请输入类型' }]}>
                        <Input disabled={!isEditing && !!form.getFieldValue('type')} />
                    </Form.Item>
                    <Form.Item name="label" label="标签" rules={[{ required: true, message: '请输入标签' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="value" label="值" rules={[{ required: true, message: '请输入值' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="sort" label="排序" rules={[{ required: true, message: '请输入排序' }]}>
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="description" label="描述">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default DictManagement;