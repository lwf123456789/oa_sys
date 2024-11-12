import React from 'react';
import { Form, Input, Switch, Button, Select, InputNumber, Collapse } from 'antd';
import { FormComponent } from '../../types';
import { useDesignerStore } from '../../store/useDesignerStore';
import BaseProperties from './BaseProperties';
import { useOptionsForm } from '../../hooks/useOptionsForm';

const { Panel } = Collapse;

const SelectProperties: React.FC<{ component: FormComponent }> = ({ component }) => {
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
          <Form.Item label="选择模式" name="mode">
            <Select>
              <Select.Option value={undefined}>单选</Select.Option>
              <Select.Option value="multiple">多选</Select.Option>
              <Select.Option value="tags">标签</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="占位提示" name="placeholder">
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
          <Form.Item label="必填" name="required" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="允许清除" name="allowClear" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="显示边框" name="bordered" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="允许搜索" name="showSearch" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.mode !== curr.mode}
          >
            {({ getFieldValue }) => (
              getFieldValue('mode') === 'multiple' && (
                <Form.Item label="最大标签数" name="maxTagCount">
                  <InputNumber min={0} />
                </Form.Item>
              )
            )}
          </Form.Item>

          <Form.Item label="加载状态" name="loading" valuePropName="checked">
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

export default SelectProperties;