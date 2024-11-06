import React from 'react';
import { Form, Input, Select, DatePicker, Typography, Row, Col } from 'antd';

const { Title } = Typography;

interface FormPreviewProps {
    config: any[];
}

const FormPreview: React.FC<FormPreviewProps> = ({ config }) => {
    const renderFormItem = (item: any) => {
        const { type, props, id, children } = item;

        const formItemProps = {
            key: id,
            label: props.label,
            name: props.name,
            required: props.required,
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        const commonProps = {
            style: { width: '100%' },
            placeholder: props.placeholder,
            disabled: props.disabled,
            allowClear: props.allowClear,
            ...props,
        };

        const componentMap: any = {
            grid: () => (
                <div key={id} className="mb-4">
                    <Row gutter={props.gutter}>
                        {Array(props.cols).fill(0).map((_, index) => (
                            <Col key={`${id}-${index}`} span={24 / props.cols}>
                                <div className="p-2">
                                    {children?.[index] && renderFormItem(children[index])}
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            ),

            title: () => (
                <Title
                    level={props.level}
                    style={{
                        textAlign: props.align,
                        ...props.style
                    }}
                >
                    {props.content}
                </Title>
            ),

            input: () => (
                <Form.Item {...formItemProps}>
                    {props.type === 'textarea' ? (
                        <Input.TextArea {...commonProps} />
                    ) : (
                        <Input {...commonProps} />
                    )}
                </Form.Item>
            ),

            select: () => (
                <Form.Item {...formItemProps}>
                    <Select {...commonProps} />
                </Form.Item>
            ),

            datePicker: () => (
                <Form.Item {...formItemProps}>
                    <DatePicker {...commonProps} />
                </Form.Item>
            ),
        };

        return componentMap[type]?.() || null;
    };

    return (
        <div className="flex justify-center">
            <div style={{ width: '800px' }}>
                <Form layout="horizontal">
                    {config.map(renderFormItem)}
                </Form>
            </div>
        </div>
    );
};

export default FormPreview;