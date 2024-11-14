import React from 'react';
import { Form, Input, Select, DatePicker, Typography } from 'antd';
import type { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs'; // 确保导入 dayjs

const { Title } = Typography;
const { TextArea } = Input;

interface DynamicFormProps {
  config: any[];
  form?: FormInstance;
  disabled?: boolean;
  initialValues?: any;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  config,
  form,
  disabled = false,
  initialValues
}) => {
  // 处理表单初始值
  const processInitialValues = React.useMemo(() => {
    if (!initialValues) return {};

    const processed = { ...initialValues };
    config.forEach(item => {
      if (item.type === 'datePicker' && processed[item.props.name]) {
        try {
          const dateValue = processed[item.props.name];
          processed[item.props.name] = dayjs(dateValue);
        } catch (error) {
          console.error('Date processing error:', error);
          processed[item.props.name] = null;
        }
      }
    });
    return processed;
  }, [initialValues, config]);

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
      style: { width: fieldWidth || '100%' },
      placeholder,
      disabled,
      allowClear: !disabled, // 禁用状态下不允许清除
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
              <TextArea
                {...commonProps}
                readOnly={disabled}
                allowClear={!disabled} // 禁用状态下不允许清除
              />
            ) : (
              <Input
                {...commonProps}
                readOnly={disabled}
                allowClear={!disabled} // 禁用状态下不允许清除
              />
            )}
          </Form.Item>
        );

      case 'select':
        return (
          <Form.Item key={id} {...formItemProps}>
            <Select
              {...commonProps}
              open={disabled ? false : undefined}
              allowClear={!disabled} // 禁用状态下不允许清除
              showSearch={!disabled} // 禁用状态下不允许搜索
            />
          </Form.Item>
        );

      case 'datePicker':
        return (
          <Form.Item key={id} {...formItemProps}>
            <DatePicker
              {...commonProps}
              inputReadOnly={true}
              open={disabled ? false : undefined}
              allowClear={!disabled} // 禁用状态下不允许清除
              showToday={!disabled} // 禁用状态下不显示"今天"按钮
            />
          </Form.Item>
        );

      default:
        return null;
    }
  };

  return (
    <Form
      form={form}
      initialValues={processInitialValues}
      disabled={disabled}
      layout="vertical"
    >
      <div className="space-y-4">
        {config.map(item => renderFormItem(item))}
      </div>
    </Form>
  );
};

export default DynamicForm;