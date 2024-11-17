import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Card, Space, Modal, Badge, Tooltip, message, Row, Col, Input, Select, Form, Spin, Divider, Empty, Tag, Drawer, Steps, Avatar } from 'antd';
import { PlusOutlined, EyeOutlined, DeleteOutlined, UndoOutlined, SearchOutlined, ReloadOutlined, SyncOutlined, CheckCircleOutlined, CloseCircleOutlined, StopOutlined, TeamOutlined, IdcardOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { $clientReq } from '@/utils/clientRequest';
import DynamicForm from '../form/DynamicForm';

const ApplyManagement: React.FC = () => {

  // 查询参数-start
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [taskRecords, setTaskRecords] = useState<any[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  // 查询参数-end

  const [initiateModalVisible, setInitiateModalVisible] = useState(false);
  const [workflowId, setWorkflowId] = useState<string | undefined>(undefined);
  const [workflowOptions, setWorkflowOptions] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [formLoading, setFormLoading] = useState(false);
  // 当前选中的category
  const [currentCategory, setCurrentCategory] = useState<string | undefined>(undefined);
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);

  // 当前的表单配置
  const [currentFormConfig, setCurrentFormConfig] = useState<any[]>([]);

  // 详情抽屉要有
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [taskRecordList, setTaskRecordList] = useState<any[]>([]);

  const handleCategoryChange = (value: string) => {
    setCurrentCategory(value);
    fetchWorkFlowsList(value);
  }

  // 处理工作流选择
  const handleWorkflowSelect = async (workflowId: string) => {
    setFormLoading(true);
    setWorkflowId(workflowId);
    const formId = workflowOptions.find(item => item.id === workflowId)?.formId;
    try {
      const res = await $clientReq.get(`/form-templates/getConfig?id=${formId}`);
      setCurrentFormConfig(res.data.config);
    } catch (error) {
    } finally {
      setFormLoading(false);
    }
  };


  const fetchTaskRecords = useCallback(async (page: number, size: number, category: string | null, status: number | null) => {
    setLoading(true);
    try {
      const res = await $clientReq.get(`/workflows/getInstances?page=${page}&page_size=${size}&category=${category}&status=${status}`);
      setTaskRecords(res.data.list);
      setTotal(res.data.total);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, category, status]);

  const resetSearchForm = () => {
    setCurrentPage(1);
    setPageSize(10);
    setCategory(null);
    setStatus(null);
    fetchTaskRecords(1, 10, null, null);
  }

  // 获取流程审批的类型列表
  const fetchCategoryList = async () => {
    const res = await $clientReq.get('/dicts?type=APPLY_CATEGORY')
    setCategoryOptions(res.data.list)
  }

  // 选中category后获取到可用的流程列表来选择
  const fetchWorkFlowsList = async (category: string) => {
    const res = await $clientReq.get(`/workflows/get?category=${category}`);
    setWorkflowOptions(res.data.list)
  }

  useEffect(() => {
    fetchTaskRecords(currentPage, pageSize, null, null);
    fetchCategoryList();
  }, []);

  const handleInitiate = () => {
    setInitiateModalVisible(true);
  };

  const handleRevoke = (record: any) => {
    Modal.confirm({
      title: '确认撤回',
      content: '确定要撤回该申请吗？',
      onOk: async () => {
        const res = await $clientReq.post('/workflows/cancelApply', {
          instance_id: record.id
        });
        if (res) {
          message.success('撤回成功');
          await fetchTaskRecords(1, 10, category, status);
        }
      }
    });
  };

  const handleDetail = async (id: string) => {
    try {
      const res = await $clientReq.get(`/workflows/getTaskRecords?id=${id}`);
      if (res.data) {
        setTaskRecordList(res.data);

        setDrawerVisible(true);
      }
    } catch (error) {
    }
  };

  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该申请记录吗？',
      onOk: async () => {
        message.success('删除成功');
        await fetchTaskRecords(1, 10, category, status);
      }
    });
  };

  const statusMap = {
    1: {
      text: '进行中',
      color: 'processing',
      icon: <SyncOutlined spin />,
    },
    2: {
      text: '已完成',
      color: 'success',
      icon: <CheckCircleOutlined />,
    },
    3: {
      text: '已拒绝',
      color: 'error',
      icon: <CloseCircleOutlined />,
    },
    4: {
      text: '已撤销',
      color: 'default',
      icon: <StopOutlined />,
    }
  };

  const getCategoryType = (category: string) => {
    return categoryOptions.find(item => item.value === category)?.label;
  }

  const columns: ColumnsType<any> = [
    {
      title: '流程类型',
      dataIndex: ['form_data', 'category'], // 使用数组形式访问嵌套属性
      key: 'form_data.category',
      width: 150,
      align: 'center',
      render: (_, record) => getCategoryType(record['form_data']['category']),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center',
      render: (status: keyof typeof statusMap) => {
        const statusInfo = statusMap[status];
        return (
          <Tag
            icon={statusInfo.icon}
            color={statusInfo.color}
          >
            {statusInfo.text}
          </Tag>
        );
      },
    },
    {
      title: '当前节点',
      dataIndex: 'current_node_id',
      key: 'current_node_id',
      width: 150,
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: (time) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
      align: 'center',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 180,
      render: (time) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <Space>
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleDetail(record.id)}
            />
          </Tooltip>
          {record.status === 1 && (
            <Tooltip title="撤回申请">
              <Button
                type="text"
                icon={<UndoOutlined />}
                onClick={() => handleRevoke(record)}
              />
            </Tooltip>
          )}
          {['completed', 'rejected'].includes(record.status) && (
            <Tooltip title="删除记录">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  // 提交申请
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const params = {
        workflow_id: workflowId,
        form_data: {
          ...values,
          category: currentCategory || '',
        }
      };
      const res = await $clientReq.post('/workflows/start', params);
      message.success('提交成功');
      setInitiateModalVisible(false);
      form.resetFields(); // 重置表单
      await fetchTaskRecords(1, 10, category, status);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 发起申请模态框
  const renderInitiateModal = () => (
    <Modal
      title="发起申请"
      open={initiateModalVisible}
      onCancel={() => {
        setInitiateModalVisible(false);
        form.resetFields();
        setWorkflowId(undefined);
        setCurrentFormConfig([]);
      }}
      footer={null}
      width={800}
    >
      <div className="space-y-4">
        <div className="p-4 rounded-lg">
          <Form.Item
            label="流程类型"
            name="category"
            rules={[{ required: true, message: '请选择流程类型' }]}
          >
            <Select
              options={categoryOptions}
              onChange={handleCategoryChange}
              placeholder="请选择流程类型"
            />
          </Form.Item>

          {currentCategory && (
            <Form.Item
              label="流程模板"
              name="workflowId"
              rules={[{ required: true, message: '请选择流程模板' }]}
            >
              <Select
                options={workflowOptions.map(item => ({
                  label: item.name,
                  value: item.id
                }))}
                onChange={handleWorkflowSelect}
                placeholder="请选择流程模板"
              />
            </Form.Item>
          )}
        </div>

        {workflowId && (
          <div className="mt-4">
            <Divider>表单信息</Divider>
            <Spin spinning={formLoading} tip="加载中...">
              <div className="p-4 border rounded-lg">
                {currentFormConfig.length > 0 ? (
                  <DynamicForm
                    config={currentFormConfig}
                    form={form}
                  />
                ) : (
                  <Empty description="暂无表单配置" />
                )}
              </div>
            </Spin>
          </div>
        )}

        {currentFormConfig.length > 0 && (
          <div className="text-right mt-4">
            <Space>
              <Button onClick={() => setInitiateModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" onClick={handleSubmit}>
                提交申请
              </Button>
            </Space>
          </div>
        )}
      </div>
    </Modal>
  );

  // 抽屉组件
  const renderDetailDrawer = () => (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <span className="text-lg font-medium">审批详情</span>
          <Tag color="blue">共 {taskRecordList.length} 个节点</Tag>
        </div>
      }
      width={680}
      open={drawerVisible}
      onClose={() => setDrawerVisible(false)}
      className="custom-drawer"
    >
      <Steps
        direction="vertical"
        current={taskRecordList.length - 1}
        className="px-4"
      >
        {taskRecordList.map((record: any) => {
          const stepStatus = !record.action ? 'process' :
            record.action === 'start' ? 'finish' :
              record.action === 'approve' ? 'finish' :
                record.action === 'reject' ? 'error' : 'wait';

          return (
            <Steps.Step
              key={record.id}
              status={stepStatus}
              title={
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{record.node_name}</span>
                    {record.action && (
                      <Tag color={
                        record.action === 'start' ? 'processing' :
                          record.action === 'approve' ? 'success' :
                            record.action === 'reject' ? 'error' : 'default'
                      }>
                        {record.action === 'start' ? '发起申请' :
                          record.action === 'approve' ? '同意' :
                            record.action === 'reject' ? '拒绝' :
                              record.action === 'end' ? '流程结束' : '已撤销'
                        }
                      </Tag>
                    )}
                  </div>
                  <span className="text-gray-400 text-sm">
                    {dayjs(record.approval_at || record.created_at).format('YYYY-MM-DD HH:mm:ss')}
                  </span>
                </div>
              }
              description={
                <div className="text-sm space-y-3 pt-2">
                  {/* 非结束节点显示审批人信息 */}
                  {record.action !== 'end' && (
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Avatar size="small" className="bg-blue-500">
                          {record.assignee?.name?.[0]}
                        </Avatar>
                        <span className="text-gray-700">{record.assignee?.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <TeamOutlined />
                        <span>{record.assignee?.department?.name}</span>
                        <Divider type="vertical" className="bg-gray-300" />
                        <IdcardOutlined />
                        <span>{record.assignee?.roles?.map((role: any) => role.name).join('、')}</span>
                      </div>
                    </div>
                  )}

                  {/* 所有节点都显示审批意见（如果有） */}
                  {record.comment && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-gray-500 mb-1">审批意见</div>
                      <div className="text-gray-700">{record.comment}</div>
                    </div>
                  )}
                </div>
              }
            />
          );
        })}
      </Steps>
    </Drawer>
  );
  return (
    <div className="p-4 space-y-6">
      <Card>
        {/* 搜索区域  */}
        <div className="mb-4">
          <Row gutter={18} className="mb-4">
            <Col span={6}>
              <Select
                placeholder="选择类型"
                style={{ width: '100%' }}
                value={category}
                onChange={value => setCategory(value)}
                allowClear
                options={categoryOptions}
              />
            </Col>
            <Col span={6}>
              <Select
                placeholder="选择状态"
                style={{ width: '100%' }}
                value={status}
                onChange={value => setStatus(value)}
                allowClear
                options={[
                  { label: '进行中', value: 1 },
                  { label: '已完成', value: 2 },
                  { label: '已拒绝', value: 3 },
                  { label: '已撤销', value: 4 },
                ]}
              />
            </Col>
            <Col span={4}>
              <Space>
                <Button type="primary" icon={<SearchOutlined />} onClick={() => fetchTaskRecords(currentPage, pageSize, category, status)}>
                  搜索
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    resetSearchForm();
                  }}
                >
                  重置
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleInitiate}
                >
                  发起申请
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        {/* 表格部分保持不变 */}
        <Table
          columns={columns}
          dataSource={taskRecords}
          rowKey="id"
          loading={loading}
          pagination={false}
          className="rounded-lg"
          rowClassName="hover:bg-gray-50"
        />
      </Card>

      {/* 发起申请模态框 */}
      {renderInitiateModal()}

      {/* 详情抽屉 */}
      {renderDetailDrawer()}
    </div>
  );
};

export default ApplyManagement;