import React, { use, useCallback, useEffect, useMemo, useState } from 'react';
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
        const initializeApprovers = async () => {
            const approvers = form.getFieldValue(['config', 'approvers']) || [];
            if (approvers.length > 0) {
                setLoading(true);
                try {
                    const { data } = await $clientReq.get(
                        `/users/get?ids=${approvers.join(',')}`
                    );
                    const newCache = { ...selectedItemsCache };
                    data.list.forEach((item: any) => {
                        newCache[item.id] = item;
                    });
                    setSelectedItemsCache(newCache);
                } catch (error) {
                } finally {
                    setLoading(false);
                }
            }
        };

        initializeApprovers();
    }, [node.id]);


    const [users, setUsers] = useState<Array<{ id: string; name: string }>>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [keyword, setKeyword] = useState<string | null>('')
    const [total, setTotal] = useState(0);
    const [selectorVisible, setSelectorVisible] = useState(false);
    const [selectedItemsCache, setSelectedItemsCache] = useState<Record<string, any>>({});

    // 加载用户数据
    const loadUsers = useCallback(async (page: number, pageSize: number, keyword: string | null) => {
        setLoading(true);
        try {
            const { data } = await $clientReq.get(
                `/users/get?page=${page}&pageSize=${pageSize}&name=${keyword}`
            );

            setUsers(data.list);
            setTotal(data.total);

            // 更新已选用户缓存
            const newCache = { ...selectedItemsCache };
            data.list.forEach((item: any) => {
                if (form.getFieldValue(['config', 'approvers'])?.includes(item.id)) {
                    newCache[item.id] = item;
                }
            });
            setSelectedItemsCache(newCache);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, keyword, selectedItemsCache, form]);

    const handleSearch = useCallback((value: string) => {
        setPage(1)
        loadUsers(1, 10, value)
    }, []);

    // 处理分页
    const handlePageChange = useCallback((page: number, pageSize: number) => {
        setPage(page)
        loadUsers(page, pageSize, keyword)
    }, []);

    const handleApproverList = () => {
        loadUsers(1, 10, keyword)
        setSelectorVisible(true);
    }

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
        return approvers.map((id: string) => selectedItemsCache[id]).filter(Boolean);
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
                    label="审批人"
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
                                <div className="text-gray-400">未选择审批人</div>
                            )}
                        </div>
                        <Button
                            type="primary"
                            ghost
                            className="w-full"
                            icon={<Icon icon="mdi:plus" />}
                            onClick={handleApproverList}
                        >
                            选择审批人
                        </Button>
                    </div>
                </Form.Item>

                <TableSelector
                    visible={selectorVisible}
                    title="选择审批人"
                    onCancel={() => setSelectorVisible(false)}
                    onOk={handleSelectorOk}
                    onSearch={handleSearch}
                    multiple
                    loading={loading}
                    defaultSelectedRows={getSelectedItems()}
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        total: total,
                        onChange: handlePageChange
                    }}
                    tableProps={{
                        columns: [
                            { title: 'ID', dataIndex: 'id' },
                            { title: '名称', dataIndex: 'name' }
                        ],
                        dataSource: users
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