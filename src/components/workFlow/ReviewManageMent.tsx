import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Card, Space, Modal, Tag, Row, Col, Select, Form, Input, Drawer, Steps, Avatar, Divider, message } from 'antd';
import { SearchOutlined, ReloadOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, TeamOutlined, IdcardOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { $clientReq } from '@/utils/clientRequest';
import DynamicForm from '../form/DynamicForm';
import WorkflowViewer from './WorkflowViewer';
import { useSession } from 'next-auth/react';

const ReviewManagement: React.FC = () => {
    const { data: session } = useSession();
    // 查询参数
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [taskRecords, setTaskRecords] = useState<any[]>([]);
    const [category, setCategory] = useState<string | null>(null);
    const [status, setStatus] = useState<number | null>(null);
    const [categoryOptions, setCategoryOptions] = useState<any[]>([]);

    // 审批操作相关
    const [approvalModalVisible, setApprovalModalVisible] = useState(false);
    const [currentTask, setCurrentTask] = useState<any>(null);
    const [approvalForm] = Form.useForm();
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [formConfig, setFormConfig] = useState<any[]>([]);


    // 获取待审批任务列表
    const fetchTaskRecords = useCallback(async (page: number, size: number) => {
        setLoading(true);
        try {
            const res = await $clientReq.get(`/workflows/getTaskReviews?page=${page}&pageSize=${size}`);
            setTaskRecords(res.data.list);
            setTotal(res.data.total);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, category, status]);

    // 获取流程类型列表
    const fetchCategoryList = async () => {
        const res = await $clientReq.get('/dicts?type=APPLY_CATEGORY')
        setCategoryOptions(res.data.list)
    }

    const formatInitialValues = (formData: any) => {
        if (!formData) return {};

        const result = { ...formData };

        // 处理日期字段，确保使用正确的 dayjs 格式
        if (formData.start_date) {
            const startDate = dayjs(formData.start_date);
            result.start_date = startDate.isValid() ? startDate : null;
        }

        if (formData.end_date) {
            const endDate = dayjs(formData.end_date);
            result.end_date = endDate.isValid() ? endDate : null;
        }

        // 移除不需要的字段
        delete result.workflowId;
        delete result.category;

        return result;
    };

    // 获取表单配置
    const fetchFormConfig = async (formId: number) => {
        try {
            const res = await $clientReq.get(`/form-templates/getConfig?id=${formId}`);
            setFormConfig(res.data.config);
        } catch (error) {
            message.error('获取表单配置失败');
        }
    };

    useEffect(() => {
        fetchTaskRecords(1, 10);
        fetchCategoryList();
    }, []);

    // 重置搜索条件
    const resetSearchForm = () => {
        setCurrentPage(1);
        setPageSize(10);
        setCategory(null);
        setStatus(null);
        fetchTaskRecords(1, 10);
    }

    const handleDetail = async (record: any) => {
        setCurrentTask(record);
        setDrawerVisible(true);
        // 获取表单配置
        await fetchFormConfig(record.instance.workflow.formId);
    };


    // 处理审批
    const handleApproval = (record: any, action: 'approve' | 'reject') => {
        setCurrentTask(record);
        approvalForm.setFieldsValue({
            action,
            comment: ''
        });
        setApprovalModalVisible(true);
    };

    // 提交审批
    const handleApprovalSubmit = async (values: any) => {
        try {
            await $clientReq.post('/workflows/approve', {
                instance_id: currentTask.instance.id,
                task_id: currentTask.id,
                action: values.action,
                comment: values.comment
            });
            message.success('审批提交成功');
            setApprovalModalVisible(false);
            setDrawerVisible(false);
            fetchTaskRecords(currentPage, pageSize);
        } catch (error) {
            message.error('审批提交失败');
        }
    };

    const columns: ColumnsType<any> = [
        {
            title: '流程名称',
            dataIndex: ['instance', 'workflow', 'name'],
            width: 200,
        },
        {
            title: '申请人',
            dataIndex: ['instance', 'initiator', 'name'],
            width: 120,
            render: (_, record) => (
                <div className="flex items-center gap-2">
                    <Avatar size="small" className="bg-blue-500">
                        {record.instance.initiator.name[0]}
                    </Avatar>
                    <span>{record.instance.initiator.name}</span>
                </div>
            )
        },
        {
            title: '当前节点',
            dataIndex: 'node_name',
            width: 150,
        },
        {
            title: '申请时间',
            dataIndex: ['instance', 'created_at'],
            width: 180,
            render: (time) => dayjs(time).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '操作',
            key: 'action',
            width: 200,
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => handleDetail(record)}
                    >
                        查看详情
                    </Button>
                    {/* <Button
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        onClick={() => handleApproval(record, 'approve')}
                    >
                        同意
                    </Button>
                    <Button
                        danger
                        icon={<CloseCircleOutlined />}
                        onClick={() => handleApproval(record, 'reject')}
                    >
                        拒绝
                    </Button> */}
                </Space>
            )
        }
    ];

    // 审批表单弹窗
    const renderApprovalModal = () => (
        <Modal
            title="审批处理"
            open={approvalModalVisible}
            onCancel={() => setApprovalModalVisible(false)}
            onOk={() => approvalForm.submit()}
            confirmLoading={loading}
        >
            <Form
                form={approvalForm}
                onFinish={handleApprovalSubmit}
                layout="vertical"
            >
                <Form.Item
                    name="comment"
                    label="审批意见"
                    rules={[{ required: true, message: '请填写审批意见' }]}
                >
                    <Input.TextArea rows={4} placeholder="请输入审批意见..." />
                </Form.Item>
                <Form.Item name="action" hidden>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );

    const canApprove = (task: any, session: any) => {
        // 检查流程是否在进行中
        if (task.instance.status !== 1) return false;

        // 获取当前节点
        const currentNode = task.instance.workflow.config.nodes.find(
            (node: any) => node.id === task.instance.current_node_id
        );

        // 检查是否是有效的审批节点
        if (!currentNode || currentNode.data.type !== 'approval') return false;

        // 检查当前用户是否是审批人
        const isApprover = currentNode.data.config.approvers.includes(session?.user?.id);

        // 检查该节点的任务记录是否已经有当前用户的审批操作
        const hasApproved = task.instance.task_records?.some(
            (record: any) =>
                record.node_id === currentNode.id &&
                record.assignee_id === session?.user?.id &&
                ['approve', 'reject'].includes(record.action)
        );

        return isApprover && !hasApproved;
    };

    // 详情抽屉
    const renderDetailDrawer = () => (
        <Drawer
            title="流程详情"
            width="100%"
            height="100%"
            placement="right"
            open={drawerVisible}
            onClose={() => setDrawerVisible(false)}
            bodyStyle={{ padding: 0 }}
        >
            {currentTask && formConfig && (
                <div className="h-full flex flex-col">
                    {/* 基本信息 */}
                    <div className="p-4 border-b">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Avatar size="large">{currentTask.instance.initiator.name[0]}</Avatar>
                                <div>
                                    <div className="text-lg font-medium">
                                        {currentTask.instance.initiator.name}的{currentTask.instance.workflow.name}
                                    </div>
                                    <div className="text-gray-500">
                                        申请时间：{dayjs(currentTask.instance.created_at).format('YYYY-MM-DD HH:mm:ss')}
                                    </div>
                                </div>
                            </div>
                            {canApprove(currentTask, session) && (
                                <Space>
                                    <Button
                                        type="primary"
                                        icon={<CheckCircleOutlined />}
                                        onClick={() => handleApproval(currentTask, 'approve')}
                                    >
                                        同意
                                    </Button>
                                    <Button
                                        danger
                                        icon={<CloseCircleOutlined />}
                                        onClick={() => handleApproval(currentTask, 'reject')}
                                    >
                                        拒绝
                                    </Button>
                                </Space>
                            )}
                        </div>
                    </div>

                    {/* 流程图区域 */}
                    <div className="flex-1 bg-gray-50">
                        <WorkflowViewer
                            edges={currentTask.instance.workflow.config.edges}
                            nodes={currentTask.instance.workflow.config.nodes}
                            currentNodeId={currentTask.instance.current_node_id}
                            formConfig={formConfig}
                            formData={formatInitialValues(currentTask.instance.form_data)}
                            taskRecords={currentTask.instance.task_records || []}
                        />
                    </div>
                </div>
            )}
        </Drawer>
    );

    return (
        <div className="p-4 space-y-6">
            <Card>
                {/* 搜索区域 */}
                <div className="mb-4">
                    <Row gutter={18}>
                        <Col span={6}>
                            <Select
                                placeholder="选择流程类型"
                                style={{ width: '100%' }}
                                value={category}
                                onChange={value => setCategory(value)}
                                allowClear
                                options={categoryOptions}
                            />
                        </Col>
                        <Col span={4}>
                            <Space>
                                <Button
                                    type="primary"
                                    icon={<SearchOutlined />}
                                    onClick={() => fetchTaskRecords(1, pageSize)}
                                >
                                    搜索
                                </Button>
                                <Button
                                    icon={<ReloadOutlined />}
                                    onClick={resetSearchForm}
                                >
                                    重置
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </div>

                {/* 表格 */}
                <Table
                    columns={columns}
                    dataSource={taskRecords}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        current: currentPage,
                        pageSize,
                        total,
                        onChange: (page) => {
                            setCurrentPage(page);
                            fetchTaskRecords(page, pageSize);
                        }
                    }}
                />
            </Card>

            {renderApprovalModal()}
            {renderDetailDrawer()}
        </div>
    );
};

export default ReviewManagement;