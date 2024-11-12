import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Space, Modal, Badge, Tooltip, message, Row, Col, Input, Select, DatePicker, Form, Spin, Divider, Empty } from 'antd';
import { PlusOutlined, EyeOutlined, DeleteOutlined, UndoOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { $clientReq } from '@/utils/clientRequest';
import { mockData } from '@/data/mockData';
import DynamicForm from '../form/DynamicForm';

interface ApplyRecord {
  id: string;
  title: string;
  processName: string;
  status: 'draft' | 'running' | 'completed' | 'rejected';
  currentNode: string;
  createTime: string;
  updateTime: string;
  progress: number;
  approvalRecords: {
    node: string;
    operator: string;
    action: 'approve' | 'reject';
    comment: string;
    time: string;
  }[];
}

const ApplyManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApplyRecord[]>([]);
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

  const handleCategoryChange = (value: string) => {
    setCurrentCategory(value);
    fetchWorkFlowsList(value);
  }

  // 处理工作流选择
  const handleWorkflowSelect = async (workflowId: string) => {
    console.log('workflowOptions', workflowOptions);
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

  const [searchForm, setSearchForm] = useState({
    keyword: '',
    status: undefined,
    dateRange: [],
  });

  const fetchTaskRecords = async () => {
    setLoading(true);
    try {
      const res = await $clientReq.get(`/workflows/getTaskRecords?page=${currentPage}&pageSize=${pageSize}`);
      const records = res.data.list.map((item: any) => ({
        id: item.id,
        title: item.workflow.name,
        processName: item.workflow.category,
        status: item.status === 1 ? 'running' : 'completed', // 假设status 1为进行中
        currentNode: item.current_node_id,
        createTime: item.created_at,
        updateTime: item.updated_at,
        progress: 0, // 这里可以根据需要计算进度
        approvalRecords: item.task_records.map((record: any) => ({
          node: record.node_name,
          operator: record.assignee_id,
          action: record.action,
          comment: record.comment,
          time: record.created_at,
        })),
      }));
      setData(records);
      setTotal(res.data.total);
    } catch (error) {
      message.error('获取任务记录失败');
    } finally {
      setLoading(false);
    }
  };

  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     // 模拟API调用
  //     await new Promise(resolve => setTimeout(resolve, 1000));
  //     setData(mockData);
  //   } catch (error) {
  //     message.error('获取数据失败');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
    fetchTaskRecords();
    fetchCategoryList();
  }, []);

  const handleInitiate = () => {
    setInitiateModalVisible(true);
  };

  const handleRevoke = (record: ApplyRecord) => {
    Modal.confirm({
      title: '确认撤回',
      content: '确定要撤回该申请吗？',
      onOk: async () => {
        message.success('撤回成功');
        await fetchTaskRecords();
      }
    });
  };

  const handleDelete = (record: ApplyRecord) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该申请记录吗？',
      onOk: async () => {
        message.success('删除成功');
        await fetchTaskRecords();
      }
    });
  };

  const statusMap = {
    draft: { text: '草稿', status: 'default' },
    running: { text: '进行中', status: 'processing' },
    completed: { text: '已完成', status: 'success' },
    rejected: { text: '已拒绝', status: 'error' }
  };

  const columns: ColumnsType<ApplyRecord> = [
    {
      title: '申请标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: '流程类型',
      dataIndex: 'processName',
      key: 'processName',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: keyof typeof statusMap) => (
        <Badge
          status={statusMap[status].status as any}
          text={statusMap[status].text}
        />
      ),
    },
    {
      title: '当前节点',
      dataIndex: 'currentNode',
      key: 'currentNode',
      width: 150,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: (time) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 180,
      render: (time) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {/* TODO */ }}
            />
          </Tooltip>
          {record.status === 'running' && (
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
  const handleSubmit = async (values: any) => {
    const params = {
      workflow_id: workflowId,
      form_data: values
    }
    console.log('params', params);
    const res = await $clientReq.post('/workflows/start', params);
    console.log('res', res);
    message.success('提交成功');
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
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        className="space-y-4"
      >
        <div className="p-4 border rounded-lg bg-gray-50">
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
                  <DynamicForm config={currentFormConfig} />
                ) : (
                  <Empty description="暂无表单配置" />
                )}
              </div>
            </Spin>
          </div>
        )}

        {currentFormConfig.length > 0 && (
          <Form.Item className="text-right mt-4">
            <Space>
              <Button onClick={() => setInitiateModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                提交申请
              </Button>
            </Space>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );

  return (
    <div className="p-6 space-y-6">
      {/* 主要内容卡片 */}
      <Card>
        {/* 搜索区域 */}
        <div className="mb-4">
          <Row gutter={16} className="mb-4">
            <Col span={6}>
              <Input
                placeholder="搜索申请标题"
                prefix={<SearchOutlined />}
                value={searchForm.keyword}
                onChange={e => setSearchForm(prev => ({ ...prev, keyword: e.target.value }))}
                allowClear
              />
            </Col>
            <Col span={6}>
              <Select
                placeholder="选择状态"
                style={{ width: '100%' }}
                value={searchForm.status}
                onChange={value => setSearchForm(prev => ({ ...prev, status: value }))}
                allowClear
                options={[
                  { label: '进行中', value: 'running' },
                  { label: '已完成', value: 'completed' },
                  { label: '已拒绝', value: 'rejected' },
                ]}
              />
            </Col>
            <Col span={8}>
              <DatePicker.RangePicker
                style={{ width: '100%' }}
                onChange={(dates: any) => setSearchForm(prev => ({ ...prev, dateRange: dates }))}
              />
            </Col>
            <Col span={4}>
              <Space>
                <Button type="primary" icon={<SearchOutlined />}>
                  搜索
                </Button>
                <Button icon={<ReloadOutlined />} onClick={() => {
                  setSearchForm({ keyword: '', status: undefined, dateRange: [] });
                  fetchTaskRecords();
                }}>
                  重置
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        {/* 操作栏 */}
        <div className="flex justify-between mb-4">
          <span className="text-lg font-medium">我的申请</span>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleInitiate}
            className="hover:scale-105 transition-transform"
          >
            发起申请
          </Button>
        </div>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          className="border border-gray-200 rounded-lg"
          rowClassName="hover:bg-gray-50"
        />
      </Card>

      {/* 发起申请模态框 */}
      {/* 选中的category后，再去选择工作流，然后需要工作流中的start节点的表单填写即可发起审批 */}
      {renderInitiateModal()}
    </div>
  );
};

export default ApplyManagement;