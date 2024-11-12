import React from 'react';
import { Form, Input, Select, DatePicker, Typography } from 'antd';
import type { FormInstance } from 'antd/es/form';

const { Title } = Typography;
const { TextArea } = Input;

interface DynamicFormProps {
  config: any[];
  form?: FormInstance;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ config, form }) => {
  const renderFormItem = (item: any) => {
    const { id, type, props } = item;
    const {
      label,
      name,
      required,
      placeholder,
      fieldWidth,
      validateTrigger,
      ...restProps
    } = props;

    const commonProps = {
      style: { width: fieldWidth },
      placeholder,
      ...restProps
    };

    const formItemProps = {
      label,
      name,
      required,
      validateTrigger,
      rules: required ? [{ required: true, message: `请${placeholder}` }] : undefined
    };

    switch (type) {
      case 'title':
        return (
          <Title
            key={id}
            level={props.level}
            style={props.style}
            {...restProps}
          >
            {props.content}
          </Title>
        );

      case 'input':
        return (
          <Form.Item key={id} {...formItemProps}>
            {props.type === 'textarea' ? (
              <TextArea {...commonProps} />
            ) : (
              <Input {...commonProps} />
            )}
          </Form.Item>
        );

      case 'select':
        return (
          <Form.Item key={id} {...formItemProps}>
            <Select {...commonProps} />
          </Form.Item>
        );

      case 'datePicker':
        return (
          <Form.Item key={id} {...formItemProps}>
            <DatePicker {...commonProps} />
          </Form.Item>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dynamic-form">
      {config.map(item => renderFormItem(item))}
    </div>
  );
};

export default DynamicForm;