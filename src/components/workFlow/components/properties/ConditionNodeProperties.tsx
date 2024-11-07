import React, { useEffect, useMemo } from 'react';
import { Form, Input, Select, Button, Space, Radio, Typography, Card, InputNumber, DatePicker, Tag } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Node } from 'reactflow';
import { WorkflowNodeData } from '../../types';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import BaseNodeProperties from './BaseNodeProperties';
import { nanoid } from 'nanoid';
import { ConditionField, ConditionOperator, NumberConditionField, DateConditionField, EnumConditionField, StringConditionField } from '../../types/condition';

const { Title } = Typography;
interface ConditionNodePropertiesProps {
    node: Node<WorkflowNodeData>;
}

const ConditionNodeProperties: React.FC<ConditionNodePropertiesProps> = ({ node }) => {
    const { updateNodeData } = useWorkflowStore();
    const [form] = Form.useForm();

    // 可配置的字段列表
    const fieldsList: ConditionField[] = useMemo(() => [
        // 数字类型
        {
            key: 'amount',
            label: '申请金额',
            type: 'number',
            unit: '元',
            min: 0,
            max: 1000000,
            precision: 2
        } as NumberConditionField,
        {
            key: 'days',
            label: '申请天数',
            type: 'number',
            unit: '天',
            min: 0.5,
            max: 30,
            precision: 1
        } as NumberConditionField,
        // 枚举类型
        {
            key: 'department',
            label: '申请人部门',
            type: 'enum',
            options: [
                { label: '技术部', value: '1' },
                { label: '产品部', value: '2' },
                { label: '市场部', value: '3' },
                { label: '销售部', value: '4' },
                { label: '人事部', value: '5' }
            ]
        } as EnumConditionField,
        {
            key: 'level',
            label: '申请人职级',
            type: 'enum',
            options: [
                { label: 'P1', value: 'p1' },
                { label: 'P2', value: 'p2' },
                { label: 'P3', value: 'p3' },
                { label: 'P4', value: 'p4' },
                { label: 'P5', value: 'p5' }
            ]
        } as EnumConditionField,
        // 日期时间类型
        {
            key: 'submitTime',
            label: '提交时间',
            type: 'datetime',
            format: 'YYYY-MM-DD HH:mm:ss'
        } as DateConditionField,
        {
            key: 'startDate',
            label: '开始日期',
            type: 'date',
            format: 'YYYY-MM-DD'
        } as DateConditionField,
        // 字符串类型
        {
            key: 'reason',
            label: '申请理由',
            type: 'string',
            maxLength: 500
        } as ConditionField
    ], []);

    // 添加条件的默认配置
    const getDefaultCondition = () => ({
        id: nanoid(),
        field: 'amount', // 默认选择申请金额
        operator: 'eq',  // 默认等于操作符
        value: undefined // 值保持为空
    });

    // 根据字段类型获取可用的操作符
    const getOperatorsByFieldType = (fieldType: ConditionField['type']): ConditionOperator[] => {
        const operatorMap: Record<ConditionField['type'], ConditionOperator[]> = {
            number: ['eq', 'neq', 'gt', 'lt', 'gte', 'lte', 'between'],
            string: ['eq', 'neq', 'contains', 'not_contains', 'starts_with', 'ends_with'],
            date: ['eq', 'neq', 'gt', 'lt', 'gte', 'lte', 'between'],
            datetime: ['eq', 'neq', 'gt', 'lt', 'gte', 'lte', 'between'],
            boolean: ['eq', 'neq'],
            enum: ['in', 'not_in']
        };
        return operatorMap[fieldType] || [];
    };

    // 获取字段类型显示文本
    const getFieldTypeLabel = (type: ConditionField['type']): string => {
        const typeLabels: Record<ConditionField['type'], string> = {
            number: '数字',
            string: '文本',
            date: '日期',
            datetime: '日期时间',
            boolean: '是/否',
            enum: '选项'
        };
        return typeLabels[type] || type;
    };

    // 获取操作符显示文本和说明
    const getOperatorInfo = (operator: ConditionOperator) => {
        const operatorInfoMap: Record<ConditionOperator, { label: string; description: string }> = {
            eq: { label: '等于', description: '字段值与指定值完全相等' },
            neq: { label: '不等于', description: '字段值与指定值不相等' },
            gt: { label: '大于', description: '字段值严格大于指定值' },
            lt: { label: '小于', description: '字段值严格小于指定值' },
            gte: { label: '大于等于', description: '字段值大于或等于指定值' },
            lte: { label: '小于等于', description: '字段值小于或等于指定值' },
            contains: { label: '包含', description: '字段值包含指定文本' },
            not_contains: { label: '不包含', description: '字段值不包含指定文本' },
            starts_with: { label: '开头是', description: '字段值以指定文本开头' },
            ends_with: { label: '结尾是', description: '字段值以指定文本结尾' },
            in: { label: '在列表中', description: '字段值在指定的选项列表中' },
            not_in: { label: '不在列表中', description: '字段值不在指定的选项列表中' },
            between: { label: '在区间内', description: '字段值在指定的两个值之间' }
        };
        return operatorInfoMap[operator] || { label: operator, description: '' };
    };

    // 渲染值输入控件
    const renderValueInput = (fieldType: ConditionField['type'], field: ConditionField, operator: ConditionOperator) => {
        switch (fieldType) {
            case 'number': {
                const numberField = field as NumberConditionField;
                if (operator === 'between') {
                    return (
                        <Input.Group compact className="flex">
                            <InputNumber
                                className="flex-1"
                                style={{ minWidth: 100 }}
                                placeholder="最小值"
                                min={numberField.min}
                                max={numberField.max}
                                precision={numberField.precision}
                                controls={true}
                            />
                            <Input
                                className="!w-8 text-center"
                                placeholder="~"
                                disabled
                            />
                            <InputNumber
                                className="flex-1"
                                style={{ minWidth: 100 }}
                                placeholder="最大值"
                                min={numberField.min}
                                max={numberField.max}
                                precision={numberField.precision}
                                controls={true}
                            />
                            {numberField.unit && (
                                <Input
                                    className="!w-10 text-center"
                                    disabled
                                    value={numberField.unit}
                                />
                            )}
                        </Input.Group>
                    );
                }
                return (
                    <InputNumber
                        className="w-full"
                        placeholder={`请输入${field.label}`}
                        min={numberField.min}
                        max={numberField.max}
                        precision={numberField.precision}
                        controls={true}
                        addonAfter={numberField.unit}
                    />
                );
            }

            case 'date':
            case 'datetime': {
                const dateField = field as DateConditionField;
                if (operator === 'between') {
                    return (
                        <Input.Group compact className="flex">
                            <DatePicker
                                className="flex-1"
                                style={{ minWidth: 130 }}
                                showTime={fieldType === 'datetime'}
                                placeholder="起始时间"
                                format={dateField.format}
                            />
                            <Input
                                className="!w-8 text-center"
                                placeholder="~"
                                disabled
                            />
                            <DatePicker
                                className="flex-1"
                                style={{ minWidth: 130 }}
                                showTime={fieldType === 'datetime'}
                                placeholder="结束时间"
                                format={dateField.format}
                            />
                        </Input.Group>
                    );
                }
                return (
                    <DatePicker
                        className="w-full"
                        showTime={fieldType === 'datetime'}
                        placeholder={`请选择${field.label}`}
                        format={dateField.format}
                    />
                );
            }

            case 'enum': {
                const enumField = field as EnumConditionField;
                return (
                    <Select
                        mode={operator === 'in' || operator === 'not_in' ? 'multiple' : undefined}
                        placeholder={`请选择${field.label}`}
                        style={{ width: '100%' }}
                        allowClear
                        showSearch
                        optionFilterProp="children"
                    >
                        {enumField.options?.map(opt => (
                            <Select.Option
                                key={opt.value}
                                value={opt.value}
                                title={opt.label}
                            >
                                {opt.label}
                            </Select.Option>
                        ))}
                    </Select>
                );
            }

            case 'string': {
                const stringField = field as StringConditionField;
                return (
                    <Input
                        className="w-full"
                        placeholder={`请输入${field.label}`}
                        allowClear
                        maxLength={stringField.maxLength}
                        showCount={!!stringField.maxLength}
                    />
                );
            }

            default:
                return <Input placeholder="请输入" allowClear />;
        }
    };

    useEffect(() => {
        form.resetFields();
        const defaultConfig = {
            branches: [],
            defaultBranch: {
                id: nanoid(),
                label: '默认分支',
                description: ''
            }
        };

        const config = {
            ...defaultConfig,
            ...node.data.config,
            branches: node.data.config?.branches?.map((branch: any) => ({
                ...branch,
                conditions: branch.conditions || [],
                relation: branch.relation || 'AND'
            })) || []
        };

        form.setFieldsValue({
            label: node.data.label,
            description: node.data.description,
            config
        });
    }, [node.id]);

    const handleValuesChange = (changedValues: any, allValues: any) => {
        if (changedValues.config) {
            const newConfig = {
                ...node.data.config,
                branches: allValues.config?.branches?.map((branch: any, index: number) => {
                    if (!branch) return null;

                    return {
                        id: branch.id || nanoid(),
                        label: branch.label || '',
                        description: branch.description || '',
                        relation: branch.relation || 'AND',
                        conditions: (branch.conditions || [])
                            .filter((condition: any) => condition)
                            .map((condition: any) => ({
                                id: condition?.id || nanoid(),
                                field: condition?.field || '',
                                operator: condition?.operator || 'eq',
                                value: condition?.value || ''
                            }))
                    };
                }).filter(Boolean) || [],
                defaultBranch: {
                    id: allValues.config?.defaultBranch?.id || nanoid(),
                    label: allValues.config?.defaultBranch?.label || '默认分支',
                    description: allValues.config?.defaultBranch?.description || ''
                }
            };

            updateNodeData(node.id, {
                config: newConfig
            });
        } else {
            updateNodeData(node.id, changedValues);
        }
    };

    // 处理字段变化时的联动
    const handleFieldChange = (fieldName: number[], value: string) => {
        const [configIndex, branchIndex, conditionIndex] = fieldName;

        // 获取当前字段配置
        const fieldConfig = fieldsList.find(f => f.key === value);
        if (!fieldConfig) return;

        // 重置当前条件的操作符和值
        form.setFields([
            {
                name: ['config', 'branches', branchIndex, 'conditions', conditionIndex, 'operator'],
                value: undefined
            },
            {
                name: ['config', 'branches', branchIndex, 'conditions', conditionIndex, 'value'],
                value: undefined
            },
            {
                name: ['config', 'branches', branchIndex, 'conditions', conditionIndex, 'valueStart'],
                value: undefined
            },
            {
                name: ['config', 'branches', branchIndex, 'conditions', conditionIndex, 'valueEnd'],
                value: undefined
            }
        ]);
    };

    // 处理操作符变化时的联动
    const handleOperatorChange = (fieldName: number[], value: string) => {
        const [configIndex, branchIndex, conditionIndex] = fieldName;

        // 重置值相关的字段
        form.setFields([
            {
                name: ['config', 'branches', branchIndex, 'conditions', conditionIndex, 'value'],
                value: undefined
            },
            {
                name: ['config', 'branches', branchIndex, 'conditions', conditionIndex, 'valueStart'],
                value: undefined
            },
            {
                name: ['config', 'branches', branchIndex, 'conditions', conditionIndex, 'valueEnd'],
                value: undefined
            }
        ]);
    };

    return (
        <div className="space-y-6">
            <BaseNodeProperties node={node} />

            {/* 
            如果 申请金额 > 10000，走分支1：总经理审批
            如果 申请金额 > 5000，走分支2：部门经理审批
            默认分支：直接主管审批
            */}

            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    config: node.data.config
                }}
                onValuesChange={handleValuesChange}
            >
                <Form.List name={['config', 'branches']}>
                    {(fields, { add, remove }) => (
                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <Card
                                    key={field.key}
                                    className="border-2 border-blue-200"
                                    title={
                                        <div className="flex items-center justify-between">
                                            <Title level={5} className="!mb-0">分支 {index + 1}</Title>
                                            <Form.Item
                                                noStyle
                                                name={[field.name, 'label']}
                                            >
                                                <Input
                                                    placeholder="分支名称"
                                                    className="w-48"
                                                />
                                            </Form.Item>
                                        </div>
                                    }
                                    extra={
                                        <Button
                                            type="text"
                                            danger
                                            icon={<MinusCircleOutlined />}
                                            onClick={() => remove(field.name)}
                                        >
                                            删除分支
                                        </Button>
                                    }
                                >
                                    <Space direction="vertical" className="w-full">
                                        <Form.Item name={[field.name, 'description']}>
                                            <Input.TextArea
                                                placeholder="分支描述（选填）"
                                                rows={2}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name={[field.name, 'relation']}
                                            className="mb-4"
                                        >
                                            <Radio.Group>
                                                <Radio value="AND">满足所有条件</Radio>
                                                <Radio value="OR">满足任一条件</Radio>
                                            </Radio.Group>
                                        </Form.Item>

                                        <Form.List name={[field.name, 'conditions']}>
                                            {(exprFields, { add: addExpr, remove: removeExpr }) => (
                                                <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                                                    <Title level={5}>条件列表</Title>

                                                    {exprFields.map((exprField, exprIndex) => (
                                                        <Card
                                                            key={exprField.key}
                                                            size="small"
                                                            className="mb-2 border-dashed"
                                                        >
                                                            <Form.Item
                                                                noStyle
                                                                shouldUpdate={(prev, curr) => {
                                                                    const prevField = prev.config?.branches?.[index]?.conditions?.[exprIndex]?.field;
                                                                    const currField = curr.config?.branches?.[index]?.conditions?.[exprIndex]?.field;
                                                                    return prevField !== currField;
                                                                }}
                                                            >
                                                                {({ getFieldValue }) => {
                                                                    const fieldKey = getFieldValue([
                                                                        'config',
                                                                        'branches',
                                                                        index,
                                                                        'conditions',
                                                                        exprIndex,
                                                                        'field'
                                                                    ]);
                                                                    const operatorValue = getFieldValue([
                                                                        'config',
                                                                        'branches',
                                                                        index,
                                                                        'conditions',
                                                                        exprIndex,
                                                                        'operator'
                                                                    ]);
                                                                    const fieldConfig = fieldsList.find(f => f.key === fieldKey);

                                                                    return (
                                                                        <Space align="start" className="w-full">
                                                                            {/* 字段选择 */}
                                                                            <Form.Item
                                                                                {...exprField}
                                                                                name={[exprField.name, 'field']}
                                                                                rules={[{ required: true, message: '请选择字段' }]}
                                                                                className="!mb-0"
                                                                                style={{ width: '30%', minWidth: 120 }}
                                                                            >
                                                                                <Select
                                                                                    placeholder="选择字段"
                                                                                    onChange={(value) => handleFieldChange([index, field.name, exprField.name], value)}
                                                                                    options={fieldsList.map(f => ({
                                                                                        label: f.label,
                                                                                        value: f.key,
                                                                                        description: getFieldTypeLabel(f.type)
                                                                                    }))}
                                                                                />
                                                                            </Form.Item>

                                                                            {/* 操作符选择 */}
                                                                            <Form.Item
                                                                                {...exprField}
                                                                                name={[exprField.name, 'operator']}
                                                                                rules={[{ required: true, message: '请选择操作符' }]}
                                                                                className="!mb-0"
                                                                                style={{ width: '25%', minWidth: 100 }}
                                                                            >
                                                                                <Select
                                                                                    placeholder="选择操作符"
                                                                                    onChange={(value) => handleOperatorChange([index, field.name, exprField.name], value)}
                                                                                    options={fieldConfig ?
                                                                                        getOperatorsByFieldType(fieldConfig.type).map(op => {
                                                                                            const info = getOperatorInfo(op);
                                                                                            return {
                                                                                                label: info.label,
                                                                                                value: op,
                                                                                                description: info.description
                                                                                            };
                                                                                        }) : []
                                                                                    }
                                                                                />
                                                                            </Form.Item>

                                                                            {/* 值输入 */}
                                                                            <Form.Item
                                                                                {...exprField}
                                                                                name={[exprField.name, 'value']}
                                                                                rules={[{ required: true, message: '请输入值' }]}
                                                                                className="!mb-0 flex-1"
                                                                                style={{ minWidth: 150 }}
                                                                            >
                                                                                {fieldConfig && renderValueInput(
                                                                                    fieldConfig.type,
                                                                                    fieldConfig,
                                                                                    operatorValue as ConditionOperator
                                                                                )}
                                                                            </Form.Item>

                                                                            <Button
                                                                                type="text"
                                                                                danger
                                                                                icon={<MinusCircleOutlined />}
                                                                                onClick={() => removeExpr(exprField.name)}
                                                                                className="!ml-2"
                                                                            />
                                                                        </Space>
                                                                    );
                                                                }}
                                                            </Form.Item>
                                                        </Card>
                                                    ))}

                                                    <Button
                                                        type="dashed"
                                                        onClick={() => addExpr(getDefaultCondition())}
                                                        block
                                                        icon={<PlusOutlined />}
                                                    >
                                                        添加条件
                                                    </Button>
                                                </div>
                                            )}
                                        </Form.List>
                                    </Space>
                                </Card>
                            ))}

                            <Button
                                type="dashed"
                                onClick={() => add({
                                    id: nanoid(),
                                    label: `分支 ${fields.length + 1}`,
                                    description: '',
                                    relation: 'AND',
                                    conditions: []
                                })}
                                block
                                icon={<PlusOutlined />}
                            >
                                添加条件分支
                            </Button>
                        </div>
                    )}
                </Form.List>

                {/* 默认分支配置 */}
                <Card
                    className="mt-4"
                    title={
                        <div className="flex items-center">
                            <span className="mr-2">默认分支</span>
                            <Tag color="orange">当以上所有条件都不满足时，将进入此分支</Tag>
                        </div>
                    }
                >
                    <Form.Item
                        name={['config', 'defaultBranch', 'label']}
                        label="分支名称"
                        rules={[{ required: true, message: '请输入默认分支名称' }]}
                    >
                        <Input placeholder="例如：直接主管审批" />
                    </Form.Item>
                    <Form.Item
                        name={['config', 'defaultBranch', 'description']}
                        label="分支说明"
                    >
                        <Input.TextArea
                            placeholder="请描述在什么情况下会进入此分支（选填）"
                            rows={2}
                        />
                    </Form.Item>
                </Card>
            </Form>
        </div>
    );
};

export default ConditionNodeProperties;