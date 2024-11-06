import React from 'react';
import { Collapse, Form, Input, InputNumber, Select, Switch } from 'antd';
import { FormComponent } from '../../types';
import { useDesignerStore } from '../../store/useDesignerStore';
import BaseProperties from './BaseProperties';
import { usePropertyForm } from '../../hooks/usePropertyForm';

interface InputPropertiesProps {
    component: FormComponent;
}

const { Panel } = Collapse;

const InputProperties: React.FC<InputPropertiesProps> = ({ component }) => {
    const { form, handleValuesChange } = usePropertyForm({
        component,
        watch: {
            // 可选：监听特定字段变化
            type: (value) => {
                // 当类型改变时，重置相关字段
                if (value !== 'textarea') {
                    form.setFieldsValue({ autoSize: false });
                }
            }
        }
    });

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={component.props}
            onValuesChange={handleValuesChange}
        >
            <BaseProperties component={component} />
            <Collapse defaultActiveKey={['basic', 'advanced']}>
                <Panel header="基础配置" key="basic">
                    <Form.Item
                        label="字段标识"
                        name="name"
                        tooltip="流程引擎使用的唯一标识符，用于数据存储和流程条件判断"
                        rules={[
                            { required: true, message: '请输入字段标识' },
                            { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '字段标识只能包含字母、数字和下划线，且必须以字母开头' }
                        ]}
                    >
                        <Input placeholder="例如：leave_reason" />
                    </Form.Item>
                    <Form.Item label="输入框类型" name="type">
                        <Select>
                            <Select.Option value="text">普通文本</Select.Option>
                            <Select.Option value="password">密码输入</Select.Option>
                            <Select.Option value="textarea">多行文本</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="形态" name="variant">
                        <Select>
                            <Select.Option value="outlined">描边</Select.Option>
                            <Select.Option value="borderless">无边框</Select.Option>
                            <Select.Option value="filled">填充</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="占位提示" name="placeholder">
                        <Input />
                    </Form.Item>
                    <Form.Item label="默认值" name="defaultValue">
                        <Input />
                    </Form.Item>
                    <Form.Item label="尺寸" name="size">
                        <Select>
                            <Select.Option value="large">大</Select.Option>
                            <Select.Option value="middle">中</Select.Option>
                            <Select.Option value="small">小</Select.Option>
                        </Select>
                    </Form.Item>
                </Panel>

                {/* 根据类型显示不同的配置项 */}
                {component.props.type === 'textarea' && (
                    <Panel header="文本域配置" key="textarea">
                        <Form.Item label="自适应高度" name={['autoSize']}>
                            <Switch />
                        </Form.Item>
                        {component.props.autoSize && (
                            <>
                                <Form.Item label="最小行数" name={['autoSize', 'minRows']}>
                                    <InputNumber min={1} />
                                </Form.Item>
                                <Form.Item label="最大行数" name={['autoSize', 'maxRows']}>
                                    <InputNumber min={1} />
                                </Form.Item>
                            </>
                        )}
                    </Panel>
                )}

                {component.props.type === 'password' && (
                    <Panel header="密码框配置" key="password">
                        <Form.Item label="显示切换按钮" name="visibilityToggle" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Panel>
                )}

                <Panel header="高级配置" key="advanced">
                    <Form.Item label="前缀" name="prefix">
                        <Input />
                    </Form.Item>
                    <Form.Item label="后缀" name="suffix">
                        <Input />
                    </Form.Item>
                    <Form.Item label="前置标签" name="addonBefore">
                        <Input />
                    </Form.Item>
                    <Form.Item label="后置标签" name="addonAfter">
                        <Input />
                    </Form.Item>
                    <Form.Item label="显示字数" name="showCount" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    {component.props.showCount && (
                        <Form.Item label="最大长度" name="maxLength">
                            <InputNumber min={0} />
                        </Form.Item>
                    )}
                </Panel>

                <Panel header="校验规则" key="validation">
                    <Form.Item label="必填" name="required" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item label="正则校验" name="pattern">
                        <Input placeholder="请输入正则表达式" />
                    </Form.Item>
                    <Form.Item label="校验触发时机" name="validateTrigger">
                        <Select>
                            <Select.Option value="onChange">输入时</Select.Option>
                            <Select.Option value="onBlur">失焦时</Select.Option>
                        </Select>
                    </Form.Item>
                </Panel>

                <Panel header="状态配置" key="state">
                    <Form.Item label="禁用" name="disabled" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    {/* <Form.Item label="显示边框" name="bordered" valuePropName="checked">
                        <Switch />
                    </Form.Item> */}
                    <Form.Item label="允许清除" name="allowClear" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item label="状态" name="status">
                        <Select allowClear>
                            <Select.Option value="error">错误</Select.Option>
                            <Select.Option value="warning">警告</Select.Option>
                        </Select>
                    </Form.Item>
                </Panel>
            </Collapse>
        </Form>
    );
};

export default InputProperties;