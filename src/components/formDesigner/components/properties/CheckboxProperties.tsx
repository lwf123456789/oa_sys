import React from 'react';
import { Form, Input, Switch, Button, Collapse } from 'antd';
import { FormComponent } from '../../types';
import { useDesignerStore } from '../../store/useDesignerStore';
import BaseProperties from './BaseProperties';
import { useOptionsForm } from '../../hooks/useOptionsForm';

const { Panel } = Collapse;

const CheckboxProperties: React.FC<{ component: FormComponent }> = ({ component }) => {
  const { form, handleValuesChange, handleAddOption, handleRemoveOption } = useOptionsForm({
    component,
    defaultOption: { label: '', value: '' }
  });

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={component.props}
      onValuesChange={handleValuesChange}
    >
      <BaseProperties component={component} />

      <Collapse defaultActiveKey={['options', 'advanced']}>
        <Panel header="选项配置" key="options">
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
          <Form.List name="options">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <div key={field.key} className="flex mb-2">
                    <Form.Item
                      name={[field.name, 'label']}
                      noStyle
                    >
                      <Input placeholder="选项名称" className="mr-2" />
                    </Form.Item>
                    <Form.Item
                      name={[field.name, 'value']}
                      noStyle
                    >
                      <Input placeholder="选项值" className="mr-2" />
                    </Form.Item>
                    <Button
                      type="link"
                      danger
                      onClick={() => remove(index)}
                    >
                      删除
                    </Button>
                  </div>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add({ label: '', value: '' })}
                  block
                >
                  添加选项
                </Button>
              </>
            )}
          </Form.List>
        </Panel>

        <Panel header="高级配置" key="advanced">
          <Form.Item label="禁用" name="disabled" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="必填" name="required" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Panel>
      </Collapse>
    </Form>
  );
};

export default CheckboxProperties;