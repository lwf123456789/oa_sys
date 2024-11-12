import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Form, Input, Select, Radio, Switch, Space, Tag, Button } from 'antd';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { Node } from 'reactflow';
import { WorkflowNodeData } from '../../types';
import BaseNodeProperties from './BaseNodeProperties';
import { Icon } from '@iconify/react';
import TableSelector from '../TableSelector';
import { $clientReq } from '@/utils/clientRequest';
import FormSelect from '../FormSelect';

interface ApprovalNodePropertiesProps {
    node: Node<WorkflowNodeData>;
}

const ApprovalNodeProperties: React.FC<ApprovalNodePropertiesProps> = ({ node }) => {
    const { updateNodeData } = useWorkflowStore();
    const [form] = Form.useForm();

    // 只在节点ID变化时重置表单
    useEffect(() => {
        form.resetFields();
        form.setFieldsValue({
            label: node.data.label,
            description: node.data.description,
            config: node.data.config
        });
    }, [node.id]); // 只监听节点ID变化

    const initialState = useMemo(() => ({
        page: 1,
        pageSize: 10,
        keyword: ''
    }), []);

    const [lists, setLists] = useState({
        departments: [] as Array<{ id: string; name: string }>,
        roles: [] as Array<{ id: string; name: string }>,
        users: [] as Array<{ id: string; name: string }>
    });

    const [searchParams, setSearchParams] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [selectorVisible, setSelectorVisible] = useState(false);
    const [selectorType, setSelectorType] = useState<'department' | 'role' | 'user' | null>(null);
    const [selectedItemsCache, setSelectedItemsCache] = useState<Record<string, any>>({});

    // 监听审批人类型变化
    const approverType = Form.useWatch(['config', 'approverType'], form);
    useEffect(() => {
        if (approverType) {
            // 如果选择"所有人"，清空审批人列表
            if (approverType === 'all') {
                form.setFieldsValue({ 'config': { approvers: [] } });
                setSelectedItemsCache({});
            } else {
                // 切换到其他类型时，也清空之前的选择
                form.setFieldsValue({ 'config': { approvers: [] } });
                setSelectedItemsCache({});
                setSearchParams(initialState);
                setLists(prev => ({
                    ...prev,
                    departments: [],
                    roles: [],
                    users: []
                }));
            }
            // 关闭选择器（如果打开的话）
            setSelectorVisible(false);
            setSelectorType(null);
            // 通知工作流数据更新
            handleValuesChange({ 'config': { approvers: [] } });
        }
    }, [approverType]);

    // 复用数据源选择逻辑
    const dataSource = useMemo(() => {
        switch (selectorType) {
            case 'department':
                return lists.departments;
            case 'role':
                return lists.roles;
            case 'user':
                return lists.users;
            default:
                return [];
        }
    }, [selectorType, lists]);

    // 复用数据加载逻辑
    const loadData = useCallback(async () => {
        if (!selectorType || !selectorVisible) return;

        setLoading(true);
        try {
            const endpoints = {
                department: '/departments/get',
                role: '/roles/get',
                user: '/users/get'
            };

            const { data } = await $clientReq.get(
                `${endpoints[selectorType]}?page=${searchParams.page}&pageSize=${searchParams.pageSize}&name=${searchParams.keyword}`
            );

            setLists(prev => ({
                ...prev,
                [selectorType + 's']: data.list
            }));

            const newCache = { ...selectedItemsCache };
            data.list.forEach((item: any) => {
                if (form.getFieldValue(['config', 'approvers'])?.includes(item.id)) {
                    newCache[item.id] = item;
                }
            });
            setSelectedItemsCache(newCache);

            setTotal(data.total);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }, [selectorType, selectorVisible, searchParams, selectedItemsCache, form]);

    // 复用处理函数
    const handleSelect = useCallback((type: 'department' | 'role' | 'user') => {
        setSelectorType(type);
        setSelectorVisible(true);
    }, []);

    const handleSearch = useCallback((value: string) => {
        setSearchParams(prev => ({
            ...prev,
            page: 1,
            keyword: value
        }));
    }, []);

    const handleSelectorOk = (rows: any[]) => {
        const newCache = { ...selectedItemsCache };
        rows.forEach(row => {
            newCache[row.id] = row;
        });
        setSelectedItemsCache(newCache);

        const newValues = rows.map(row => row.id);
        form.setFieldsValue({
            config: {
                ...node.data.config,
                approvers: newValues
            }
        });
        handleValuesChange({ config: { approvers: newValues } });
        setSelectorVisible(false);
    };

    const handlePageChange = useCallback((page: number, pageSize: number) => {
        setSearchParams(prev => ({
            ...prev,
            page,
            pageSize
        }));
    }, []);

    // 根据发起人类型加载对应数据
    useEffect(() => {
        if (selectorVisible) {
            if (selectorType === 'department') {
                loadData();
            } else if (selectorType === 'role') {
                loadData();
            } else if (selectorType === 'user') {
                loadData();
            }
        }
    }, [selectorVisible, selectorType, searchParams]);

    const handleValuesChange = (changedValues: any) => {
        if (changedValues.config) {
            updateNodeData(node.id, {
                config: {
                    ...node.data.config,
                    ...changedValues.config
                }
            });
        } else {
            updateNodeData(node.id, changedValues);
        }
    };

    // 获取选中项
    const getSelectedItems = () => {
        const approvers = form.getFieldValue(['config', 'approvers']) || [];
        return approvers.map((id: any) => selectedItemsCache[id]).filter(Boolean);
    };

    const handleRemoveTag = (id: string) => {
        const approvers = form.getFieldValue(['config', 'approvers']) || [];
        const newApprovers = approvers.filter((item: string) => item !== id);

        const newCache = { ...selectedItemsCache };
        delete newCache[id];
        setSelectedItemsCache(newCache);

        form.setFieldsValue({
            config: {
                ...node.data.config,
                approvers: newApprovers
            }
        });
        handleValuesChange({ config: { approvers: newApprovers } });
    };

    useEffect(() => {
        if (selectorVisible && selectorType) {
            const approvers = form.getFieldValue(['config', 'approvers']) || [];
            // 如果有已选项但缓存为空，则需要加载数据
            if (approvers.length > 0 && Object.keys(selectedItemsCache).length === 0) {
                loadData();
            }
        }
    }, [selectorVisible, selectorType]);

    return (
        <div className="space-y-6">
            <BaseNodeProperties node={node} />

            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    config: node.data.config
                }}
                onValuesChange={handleValuesChange}
            >
                <Form.Item
                    label="是否为默认审批节点"
                    name={['config', 'isDefault']}
                    valuePropName="checked"
                    initialValue={false}
                >
                    <Switch />
                </Form.Item>

                <Form.Item
                    noStyle
                    shouldUpdate={(prev, curr) =>
                        prev.config?.isDefault !== curr.config?.isDefault
                    }
                >
                    {({ getFieldValue }) => (
                        getFieldValue(['config', 'isDefault']) && (
                            <Form.Item
                                label="汇聚规则"
                                name={['config', 'mergeRule']}
                                rules={[{ required: true, message: '请选择汇聚规则' }]}
                            >
                                <Radio.Group>
                                    <Radio value="any">任一分支到达即可触发</Radio>
                                    <Radio value="all">所有分支到达后触发</Radio>
                                </Radio.Group>
                            </Form.Item>
                        )
                    )}
                </Form.Item>

                <Form.Item
                    label="审批方式"
                    name={['config', 'approvalMode']}
                    rules={[{ required: true, message: '请选择审批方式' }]}
                >
                    <Radio.Group>
                        <Radio value="AND">会签（需所有人同意）</Radio>
                        <Radio value="OR">或签（一人同意即可）</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    label="审批人类型"
                    name={['config', 'approverType']}
                    rules={[{ required: true, message: '请选择审批人类型' }]}
                >
                    <Radio.Group>
                        <Space direction="vertical">
                            <Radio value="all">所有人</Radio>
                            <Radio value="department">指定部门</Radio>
                            <Radio value="role">指定角色</Radio>
                            <Radio value="user">指定用户</Radio>
                        </Space>
                    </Radio.Group>
                </Form.Item>

                {approverType && (
                    <Form.Item
                        label={`已选${approverType === 'department' ? '部门' : approverType === 'role' ? '角色' : '用户'}`}
                        name={['config', 'approvers']}
                        rules={[{ required: true, message: '请选择审批人' }]}
                    >
                        <div className="space-y-4">
                            <div className="min-h-[32px] p-2 bg-gray-50 rounded-md border border-gray-200">
                                {getSelectedItems().length > 0 ? (
                                    <Space size={[0, 8]} wrap>
                                        {getSelectedItems().map((item: any) => (
                                            <Tag
                                                key={item.id}
                                                className="px-2 py-1 flex items-center gap-1"
                                                color="blue"
                                                closable
                                                onClose={() => handleRemoveTag(item.id)}
                                            >
                                                {item.name}
                                            </Tag>
                                        ))}
                                    </Space>
                                ) : (
                                    <div className="text-gray-400">未选择</div>
                                )}
                            </div>
                            <Button
                                type="primary"
                                ghost
                                className="w-full"
                                icon={<Icon icon="mdi:plus" />}
                                onClick={() => handleSelect(approverType)}
                            >
                                选择{approverType === 'department' ? '部门' : approverType === 'role' ? '角色' : '用户'}
                            </Button>
                        </div>
                    </Form.Item>
                )}

                <TableSelector
                    visible={selectorVisible}
                    title={`选择${selectorType === 'department' ? '部门' : selectorType === 'role' ? '角色' : '用户'}`}
                    onCancel={() => setSelectorVisible(false)}
                    onOk={handleSelectorOk}
                    onSearch={handleSearch}
                    multiple
                    loading={loading}
                    defaultSelectedRows={getSelectedItems()}
                    pagination={{
                        current: searchParams.page,
                        pageSize: searchParams.pageSize,
                        total: total,
                        onChange: handlePageChange
                    }}
                    tableProps={{
                        columns: [
                            { title: 'ID', dataIndex: 'id' },
                            { title: '名称', dataIndex: 'name' }
                        ],
                        dataSource: dataSource
                    }}
                />

                {/* 保留原有的其他配置项 */}
                <Form.Item
                    label="审批表单"
                    name={['config', 'formId']}
                    tooltip="审批时需要填写的表单"
                >
                    <FormSelect showSearch allowClear placeholder="请选择表单" />
                </Form.Item>

                <Form.Item
                    label="审批超时设置"
                    name={['config', 'timeout', 'enabled']}
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                <Form.Item
                    noStyle
                    shouldUpdate={(prev, curr) =>
                        prev.config?.timeout?.enabled !== curr.config?.timeout?.enabled
                    }
                >
                    {({ getFieldValue }) => (
                        getFieldValue(['config', 'timeout', 'enabled']) && (
                            <>
                                <Form.Item
                                    label="超时时间(小时)"
                                    name={['config', 'timeout', 'hours']}
                                    rules={[{ required: true, message: '请设置超时时间' }]}
                                >
                                    <Input type="number" min={1} />
                                </Form.Item>

                                <Form.Item
                                    label="超时处理"
                                    name={['config', 'timeout', 'action']}
                                    rules={[{ required: true, message: '请选择超时处理方式' }]}
                                >
                                    <Select>
                                        <Select.Option value="pass">自动通过</Select.Option>
                                        <Select.Option value="reject">自动拒绝</Select.Option>
                                        <Select.Option value="notify">仅提醒</Select.Option>
                                    </Select>
                                </Form.Item>
                            </>
                        )
                    )}
                </Form.Item>
            </Form>
        </div>
    );
};

export default ApprovalNodeProperties;