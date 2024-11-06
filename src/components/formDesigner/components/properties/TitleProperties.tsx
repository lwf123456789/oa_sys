import React from 'react';
import { Form, Input, Select, ColorPicker, Slider } from 'antd';
import { FormComponent } from '../../types';
import type { Color } from 'antd/es/color-picker';
import { useTitleForm } from '../../hooks/useTitleForm';

interface TitlePropertiesProps {
    component: FormComponent;
}

const TitleProperties: React.FC<TitlePropertiesProps> = ({ component }) => {
    const { form, handleValuesChange } = useTitleForm({ component });

    const handleColorChange = (color: Color) => {
        const updatedProps = {
            ...component.props,
            style: {
                ...component.props.style,
                color: color.toHexString()
            }
        };
        handleValuesChange(component.id, updatedProps);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={{
                ...component.props,
                style: {
                    ...component.props.style,
                    color: component.props.style?.color || '#000000'
                }
            }}
            onValuesChange={handleValuesChange}
        >
            <Form.Item label="标题内容" name="content">
                <Input />
            </Form.Item>

            <Form.Item label="标题级别" name="level">
                <Select>
                    <Select.Option value={1}>h1</Select.Option>
                    <Select.Option value={2}>h2</Select.Option>
                    <Select.Option value={3}>h3</Select.Option>
                    <Select.Option value={4}>h4</Select.Option>
                    <Select.Option value={5}>h5</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item label="对齐方式" name="align">
                <Select>
                    <Select.Option value="left">左对齐</Select.Option>
                    <Select.Option value="center">居中</Select.Option>
                    <Select.Option value="right">右对齐</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item label="下边距" name={['style', 'marginBottom']}>
                <Slider min={0} max={100} />
            </Form.Item>

            <Form.Item label="文字颜色">
                <ColorPicker
                    value={component.props.style?.color}
                    onChange={handleColorChange}
                />
            </Form.Item>
        </Form>
    );
};

export default TitleProperties;