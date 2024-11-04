import { useCallback, useMemo } from 'react';
import { Layout, Form, Input, Switch, InputNumber, Select, Tabs, Button, Card, Space } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { updateWidget } from '../../store/formDesignerSlice';
import { getWidgetDefinition, widgetRegistry } from '@/components/form-widgets/registry';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { WidgetPropertyConfig } from '@/types/form-widgets';
import { Icon } from '@iconify/react';
import { RootState } from '../../store';

const { Sider } = Layout;

const commonIcons = [
    'mdi:account',
    'mdi:email',
    'mdi:phone',
    'mdi:lock',
    'mdi:calendar',
    'mdi:clock',
    // 添加更多图标
];

// 图标选择组件
const IconSelect = ({ value, onChange }: any) => {
    return (
        <Select
            value={value}
            onChange={onChange}
            style={{ width: '100%' }}
            allowClear
        >
            {commonIcons.map(iconName => (
                <Select.Option key={iconName} value={iconName}>
                    <div className="flex items-center gap-2">
                        <Icon icon={iconName} />
                        <span>{iconName}</span>
                    </div>
                </Select.Option>
            ))}
        </Select>
    );
};


const ConfigPanel = () => {
    const selectedWidget = useSelector((state: RootState) => {
        const selectedId = state.formDesigner.selectedId;
        return state.formDesigner.widgets.find(w => w.id === selectedId);
    });
    const dispatch = useDispatch();
    const widgetDef = selectedWidget ? getWidgetDefinition(selectedWidget.type) : null;

    const handleOptionsChange = useCallback((options: any[]) => {
        if (!selectedWidget) return;

        // 过滤掉完全空的选项
        const validOptions = options.filter(opt => opt.label || opt.value);

        dispatch(updateWidget({
            ...selectedWidget,
            props: {
                ...selectedWidget.props,
                options: validOptions
            }
        }));
    }, [selectedWidget, dispatch]);

    const renderOptionList = (prop: WidgetPropertyConfig) => (
        <Form.List
            name={prop.field}
            initialValue={selectedWidget?.props?.options || []}
        >
            {(fields, { add, remove }) => (
                <div className="space-y-2">
                    {fields.map((field, index) => {
                        const { key, ...restField } = field;
                        return (
                            <Card
                                key={key}
                                size="small"
                                className="bg-gray-50"
                                extra={
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => {
                                            const newOptions = [...(selectedWidget?.props?.options || [])];
                                            newOptions.splice(index, 1);
                                            handleOptionsChange(newOptions);
                                            remove(field.name);
                                        }}
                                    />
                                }
                            >
                                <div className="space-y-2">
                                    <Form.Item
                                        {...restField}
                                        label="选项文本"
                                        name={[field.name, 'label']}
                                        rules={[{ required: true, message: '请输入选项文本' }]}
                                    >
                                        <Input
                                            placeholder="请输入选项文本"
                                            onChange={(e) => {
                                                const newOptions = [...(selectedWidget?.props?.options || [])];
                                                if (!newOptions[index]) {
                                                    newOptions[index] = {};
                                                }
                                                newOptions[index] = {
                                                    ...newOptions[index],
                                                    label: e.target.value.trim()
                                                };
                                                handleOptionsChange(newOptions);
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        label="选项值"
                                        name={[field.name, 'value']}
                                        rules={[{ required: true, message: '请输入选项值' }]}
                                    >
                                        <Input
                                            placeholder="请输入选项值"
                                            onChange={(e) => {
                                                const newOptions = [...(selectedWidget?.props?.options || [])];
                                                if (!newOptions[index]) {
                                                    newOptions[index] = {};
                                                }
                                                newOptions[index] = {
                                                    ...newOptions[index],
                                                    value: e.target.value.trim()
                                                };
                                                handleOptionsChange(newOptions);
                                            }}
                                        />
                                    </Form.Item>
                                </div>
                            </Card>
                        );
                    })}
                    <Button
                        type="dashed"
                        onClick={() => {
                            const newOption = { label: '', value: '' };
                            const newOptions = [...(selectedWidget?.props?.options || []), newOption];
                            handleOptionsChange(newOptions);
                            add(newOption);
                        }}
                        block
                        icon={<PlusOutlined />}
                    >
                        添加选项
                    </Button>
                </div>
            )}
        </Form.List>
    );

    // 渲染不同类型的属性字段
    const renderPropertyField = (prop: WidgetPropertyConfig, selectedWidget: any) => {
        switch (prop.type) {
            case 'input':
                return <Input placeholder={`请输入${prop.label}`} />;
            case 'number':
                return (
                    <InputNumber
                        min={prop.min}
                        max={prop.max}
                        step={prop.step}
                        style={{ width: '100%' }}
                    />
                );
            case 'switch':
                return <Switch checked={prop.value} />;
            case 'select':
                return (
                    <Select style={{ width: '100%' }}>
                        {prop.options?.map(opt => (
                            <Select.Option key={opt.value} value={opt.value}>
                                {opt.label}
                            </Select.Option>
                        ))}
                    </Select>
                );
            case 'icon':
                return <IconSelect />;
            // 修改 Form.List 的实现
            case 'optionList':
                return (
                    <Form.List
                        name={prop.field}
                        initialValue={selectedWidget?.props?.options || []}
                    >
                        {(fields, { add, remove }) => (
                            <div className="space-y-2">
                                {fields.map((field, index) => {
                                    const { key, ...restField } = field;
                                    const currentOption = selectedWidget?.props?.options?.[index] || {};

                                    return (
                                        <Card
                                            key={key}
                                            size="small"
                                            className="bg-gray-50"
                                            extra={
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => {
                                                        const newOptions = [...(selectedWidget?.props?.options || [])];
                                                        newOptions.splice(index, 1);
                                                        dispatch(updateWidget({
                                                            ...selectedWidget,
                                                            props: {
                                                                ...selectedWidget.props,
                                                                options: newOptions
                                                            }
                                                        }));
                                                        remove(field.name);
                                                    }}
                                                />
                                            }
                                        >
                                            <div className="space-y-2">
                                                <Form.Item
                                                    {...restField}
                                                    label="选项文本"
                                                    name={[field.name, 'label']}
                                                    initialValue={currentOption.label}
                                                    rules={[{ required: true, message: '请输入选项文本' }]}
                                                >
                                                    <Input
                                                        placeholder="请输入选项文本"
                                                        onChange={(e) => {
                                                            const newOptions = [...(selectedWidget?.props?.options || [])];
                                                            newOptions[index] = {
                                                                ...newOptions[index],
                                                                label: e.target.value.trim()
                                                            };
                                                            dispatch(updateWidget({
                                                                ...selectedWidget,
                                                                props: {
                                                                    ...selectedWidget.props,
                                                                    options: newOptions
                                                                }
                                                            }));
                                                        }}
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    label="选项值"
                                                    name={[field.name, 'value']}
                                                    initialValue={currentOption.value}
                                                    rules={[{ required: true, message: '请输入选项值' }]}
                                                >
                                                    <Input
                                                        placeholder="请输入选项值"
                                                        onChange={(e) => {
                                                            const newOptions = [...(selectedWidget?.props?.options || [])];
                                                            newOptions[index] = {
                                                                ...newOptions[index],
                                                                value: e.target.value.trim()
                                                            };
                                                            dispatch(updateWidget({
                                                                ...selectedWidget,
                                                                props: {
                                                                    ...selectedWidget.props,
                                                                    options: newOptions
                                                                }
                                                            }));
                                                        }}
                                                    />
                                                </Form.Item>
                                            </div>
                                        </Card>
                                    );
                                })}
                                <Button
                                    type="dashed"
                                    onClick={() => {
                                        const newOption = { label: '', value: '' };
                                        const newOptions = [...(selectedWidget?.props?.options || []), newOption];
                                        dispatch(updateWidget({
                                            ...selectedWidget,
                                            props: {
                                                ...selectedWidget.props,
                                                options: newOptions
                                            }
                                        }));
                                        add(newOption);
                                    }}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    添加选项
                                </Button>
                            </div>
                        )}
                    </Form.List>
                );
            default:
                return null;
        }
    };

    // 表单初始值处理
    const initialValues = useMemo(() => {
        if (!selectedWidget) return {};
        return {
            ...selectedWidget,
            required: selectedWidget.rules?.some((rule: any) => rule.type === 'required'),
            props: {
                ...selectedWidget.props,
                options: selectedWidget.props?.options || []
            }
        };
    }, [selectedWidget]);

    const handleValuesChange = useCallback((changedValues: Record<string, any>, allValues: any) => {
        if (!selectedWidget) return;

        let processedValues: any = { ...selectedWidget };

        // 统一处理所有规则
        const updateRules = (type: string, value: any, message?: string) => {
            const rules = [...(processedValues.rules || [])];
            const ruleIndex = rules.findIndex(rule => rule.type === type);

            if (value) {
                const rule = {
                    type,
                    ...(typeof value === 'boolean' ? {} : { value }),
                    message: message || `请输入正确的${selectedWidget.label}`
                };

                if (ruleIndex === -1) {
                    rules.push(rule);
                } else {
                    rules[ruleIndex] = rule;
                }
            } else if (ruleIndex !== -1) {
                rules.splice(ruleIndex, 1);
            }

            return rules;
        };

        // 处理所有变更
        Object.entries(changedValues).forEach(([key, value]) => {
            // 处理必填规则
            if (key === 'required') {
                processedValues.rules = updateRules('required', value, '该字段不能为空');
                return;
            }

            // 处理验证规则
            if (key === 'validations') {
                const validations = value || {};
                let rules = [...(processedValues.rules || [])];

                Object.entries(validations).forEach(([type, val]) => {
                    if (type !== 'message' && val) {
                        rules = updateRules(type, val, validations.message);
                    }
                });

                processedValues.rules = rules;
                return;
            }

            // 处理选项配置
            if (key === 'props.options') {
                processedValues = {
                    ...processedValues,
                    props: {
                        ...processedValues.props,
                        options: (value || []).map((option: any) => ({
                            label: option.label || '',
                            value: option.value || ''
                        })),
                        fieldNames: { label: 'label', value: 'value' }
                    }
                };
                return;
            }

            // 处理其他属性
            if (key.includes('.')) {
                const [parent, child] = key.split('.');
                processedValues = {
                    ...processedValues,
                    [parent]: {
                        ...processedValues[parent],
                        [child]: value
                    }
                };
            } else {
                processedValues[key] = value;
            }
        });

        dispatch(updateWidget(processedValues));
    }, [selectedWidget, dispatch]);


    return (
        <Sider width={300} className="bg-white">
            <div className="p-6 h-full overflow-y-auto">
                {selectedWidget && (
                    <Form
                        layout="vertical"
                        initialValues={initialValues}
                        onValuesChange={handleValuesChange}
                    >
                        <Tabs defaultActiveKey="props">
                            <Tabs.TabPane tab="属性配置" key="props">
                                {widgetDef?.properties.map(prop => (
                                    <Form.Item
                                        key={prop.field}
                                        label={prop.label}
                                        name={prop.field}
                                    >
                                        {prop.type === 'optionList'
                                            ? renderOptionList(prop)
                                            : renderPropertyField(prop, selectedWidget)}
                                    </Form.Item>
                                ))}
                            </Tabs.TabPane>

                            <Tabs.TabPane tab="验证规则" key="validations">
                                <Form.Item
                                    label="是否必填"
                                    name="required"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>

                                {selectedWidget.type === 'input' && (
                                    <>
                                        <Form.Item
                                            label="最小长度"
                                            name={['validations', 'min']}
                                        >
                                            <InputNumber
                                                min={0}
                                                placeholder="请输入最小长度"
                                                style={{ width: '100%' }}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label="最大长度"
                                            name={['validations', 'max']}
                                        >
                                            <InputNumber
                                                min={0}
                                                placeholder="请输入最大长度"
                                                style={{ width: '100%' }}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label="正则表达式"
                                            name={['validations', 'pattern']}
                                        >
                                            <Input placeholder="请输入正则表达式" />
                                        </Form.Item>

                                        <Form.Item
                                            label="错误提示"
                                            name={['validations', 'message']}
                                        >
                                            <Input placeholder="请输入错误提示信息" />
                                        </Form.Item>
                                    </>
                                )}

                                {selectedWidget.type === 'select' && (
                                    <>
                                        {(selectedWidget.props?.mode === 'multiple' || selectedWidget.props?.mode === 'tags') && (
                                            <>
                                                <Form.Item
                                                    label="最少选择数"
                                                    name={['validations', 'min']}
                                                >
                                                    <InputNumber
                                                        min={0}
                                                        placeholder="请输入最少选择数"
                                                        style={{ width: '100%' }}
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label="最多选择数"
                                                    name={['validations', 'max']}
                                                >
                                                    <InputNumber
                                                        min={1}
                                                        placeholder="请输入最多选择数"
                                                        style={{ width: '100%' }}
                                                    />
                                                </Form.Item>
                                            </>
                                        )}

                                        <Form.Item
                                            label="错误提示"
                                            name={['validations', 'message']}
                                        >
                                            <Input placeholder="请输入错误提示信息" />
                                        </Form.Item>

                                        <Form.Item
                                            label="自定义验证"
                                            name={['validations', 'custom']}
                                            tooltip="可以输入自定义的验证函数"
                                        >
                                            <Input.TextArea
                                                placeholder="请输入自定义验证函数"
                                                rows={4}
                                            />
                                        </Form.Item>
                                    </>
                                )}
                            </Tabs.TabPane>
                        </Tabs>
                    </Form>
                )}
            </div>
        </Sider >
    );
};

export default ConfigPanel;