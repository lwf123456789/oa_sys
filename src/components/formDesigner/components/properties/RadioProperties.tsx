import React from 'react';
import { Form, Input, Switch, Button, Select, Collapse } from 'antd';
import { FormComponent } from '../../types';
import { useDesignerStore } from '../../store/useDesignerStore';
import BaseProperties from './BaseProperties';
import { useOptionsForm } from '../../hooks/useOptionsForm';

const { Panel } = Collapse;

const RadioProperties: React.FC<{ component: FormComponent }> = ({ component }) => {
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

      <Collapse defaultActiveKey={['basic', 'options', 'advanced']}>
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
          <Form.Item label="展示类型" name="optionType">
            <Select>
              <Select.Option value="default">默认</Select.Option>
              <Select.Option value="button">按钮</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.optionType !== curr.optionType}
          >
            {({ getFieldValue }) => (
              getFieldValue('optionType') === 'button' && (
                <Form.Item label="按钮风格" name="buttonStyle">
                  <Select>
                    <Select.Option value="outline">描边</Select.Option>
                    <Select.Option value="solid">实底</Select.Option>
                  </Select>
                </Form.Item>
              )
            )}
          </Form.Item>

          <Form.Item label="尺寸" name="size">
            <Select>
              <Select.Option value="large">大</Select.Option>
              <Select.Option value="middle">中</Select.Option>
              <Select.Option value="small">小</Select.Option>
            </Select>
          </Form.Item>
        </Panel>

        <Panel header="选项配置" key="options">
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

export default RadioProperties;