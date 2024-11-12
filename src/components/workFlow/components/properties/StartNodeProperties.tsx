import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Form, Input, Select, Radio, Space, Tooltip, Button, Divider, Tag } from 'antd';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { Node } from 'reactflow';
import BaseNodeProperties from './BaseNodeProperties';
import FormSelect from '../FormSelect';
import { Icon } from '@iconify/react';
import TableSelector from '../TableSelector';
import { $clientReq } from '@/utils/clientRequest';

interface StartNodePropertiesProps {
    node: Node;
}

const StartNodeProperties: React.FC<StartNodePropertiesProps> = ({ node }) => {
    const { updateNodeData } = useWorkflowStore();
    const [form] = Form.useForm();

    // 使用 useMemo 缓存初始状态
    const initialState = useMemo(() => ({
        page: 1,
        pageSize: 10,
        keyword: ''
    }), []);

    // 状态管理
    const [lists, setLists] = useState({
        departments: [] as Array<{ id: string; name: string }>,
        roles: [] as Array<{ id: string; name: string }>,
        users: [] as Array<{ id: string; name: string }>
    });

    // 部门、角色、用户列表
    const [searchParams, setSearchParams] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [selectorVisible, setSelectorVisible] = useState(false);
    const [selectorType, setSelectorType] = useState<'department' | 'role' | 'user' | null>(null);
    // 缓存所有选中项的完整数据
    const [selectedItemsCache, setSelectedItemsCache] = useState<Record<string, any>>({});

    // 监听发起人类型变化
    const initiatorType = Form.useWatch('initiatorType', form);
    useEffect(() => {
        // 当类型变化时重置相关数据
        if (initiatorType) {
            // 如果选择"所有人"，清空发起人列表
            if (initiatorType === 'all') {
                form.setFieldsValue({ initiators: [] });
                setSelectedItemsCache({});
            } else {
                // 切换到其他类型时，也清空之前的选择
                form.setFieldsValue({ initiators: [] });
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
            handleValuesChange({ initiators: [] });
        }
    }, [initiatorType]);
    // 记忆化数据源选择
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

    // 优化加载数据函数
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

            // 更新列表数据
            setLists(prev => ({
                ...prev,
                [selectorType + 's']: data.list
            }));

            // 更新缓存
            const newCache = { ...selectedItemsCache };
            data.list.forEach((item: any) => {
                if (form.getFieldValue('initiators')?.includes(item.id)) {
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

    // 优化处理函数
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
        // 更新缓存
        const newCache = { ...selectedItemsCache };
        rows.forEach(row => {
            newCache[row.id] = row;
        });
        setSelectedItemsCache(newCache);

        // 更新表单值
        const newValues = rows.map(row => row.id);
        form.setFieldsValue({
            initiators: newValues
        });
        handleValuesChange({ initiators: newValues });
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
        const newData = {
            config: {
                ...node.data.config,
                ...changedValues
            }
        };
        updateNodeData(node.id, newData);
    };

    // 获取选中项的名称
    const getSelectedItems = () => {
        const initiators = form.getFieldValue('initiators') || [];
        return initiators.map((id: any) => selectedItemsCache[id]).filter(Boolean);
    };

    const handleRemoveTag = (id: string) => {
        const initiators = form.getFieldValue('initiators') || [];
        const newInitiators = initiators.filter((item: string) => item !== id);

        // 更新缓存
        const newCache = { ...selectedItemsCache };
        delete newCache[id];
        setSelectedItemsCache(newCache);

        form.setFieldsValue({ initiators: newInitiators });
        handleValuesChange({ initiators: newInitiators });
    };

    useEffect(() => {
        if (selectorVisible && selectorType) {
            const initiators = form.getFieldValue('initiators') || [];
            // 如果有已选项但缓存为空，则需要加载数据
            if (initiators.length > 0 && Object.keys(selectedItemsCache).length === 0) {
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
                initialValues={node.data.config}
                onValuesChange={handleValuesChange}
            > 
                <Form.Item
                    label="发起人类型"
                    name="initiatorType"
                    rules={[{ required: true, message: '请选择发起人类型' }]}
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

                {initiatorType && initiatorType !== 'all' && (
                    <Form.Item
                        label={`已选${initiatorType === 'department' ? '部门' : initiatorType === 'role' ? '角色' : '用户'}`}
                        name="initiators"
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
                                onClick={() => handleSelect(initiatorType)}
                            >
                                选择{initiatorType === 'department' ? '部门' : initiatorType === 'role' ? '角色' : '用户'}
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

                <Divider />

                <Form.Item
                    label="发起表单"
                    name="formId"
                    tooltip="流程发起时需要填写的表单"
                    rules={[{ required: true, message: '请选择发起表单' }]}
                >
                    <FormSelect placeholder="请选择表单" />
                </Form.Item>

                <Form.Item
                    label="流程标题"
                    name="processTitle"
                    tooltip="支持使用${表单字段}作为变量"
                    rules={[{ required: true, message: '请输入流程标题' }]}
                >
                    <Input.Group compact>
                        <Input
                            style={{ width: 'calc(100% - 32px)' }}
                            placeholder="例如：${userName}的请假申请"
                        />
                        <Tooltip title="选择表单字段">
                            <Button
                                icon={<Icon icon="mdi:bracket" />}
                                onClick={() => {
                                    // TODO: 打开表单字段选择器
                                }}
                            />
                        </Tooltip>
                    </Input.Group>
                </Form.Item>

                {/* <Form.Item
                    label="流程分类"
                    name="category"
                    rules={[{ required: true, message: '请选择流程分类' }]}
                >
                    <Select>
                        <Select.Option value="leave">请假流程</Select.Option>
                        <Select.Option value="expense">报销流程</Select.Option>
                        <Select.Option value="purchase">采购流程</Select.Option>
                        <Select.Option value="business-trip">出差流程</Select.Option>
                    </Select>
                </Form.Item> */}

                <Form.Item
                    label="备注说明"
                    name="remark"
                >
                    <Input.TextArea
                        rows={3}
                        placeholder="请输入流程说明"
                        maxLength={200}
                        showCount
                    />
                </Form.Item>
            </Form>
        </div>
    );
};

export default React.memo(StartNodeProperties);