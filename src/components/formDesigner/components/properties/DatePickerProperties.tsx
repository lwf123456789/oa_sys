import React from 'react';
import { Form, Switch, Select, Collapse } from 'antd';
import { FormComponent } from '../../types';
import { useDesignerStore } from '../../store/useDesignerStore';
import BaseProperties from './BaseProperties';

const { Panel } = Collapse;

const DatePickerProperties: React.FC<{ component: FormComponent }> = ({ component }) => {
  const updateComponentProps = useDesignerStore(state => state.updateComponentProps);
  const [form] = Form.useForm();

  return (
    <Form 
      form={form}
      layout="vertical" 
      initialValues={component.props}
      onValuesChange={(_, allValues) => {
        updateComponentProps(component.id, allValues);
      }}
    >
      <BaseProperties component={component} />
      
      <Collapse defaultActiveKey={['basic', 'advanced']}>
        <Panel header="基础配置" key="basic">
          <Form.Item label="选择器类型" name="picker">
            <Select>
              <Select.Option value="date">日期</Select.Option>
              <Select.Option value="week">周</Select.Option>
              <Select.Option value="month">月</Select.Option>
              <Select.Option value="quarter">季度</Select.Option>
              <Select.Option value="year">年</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="日期格式" name="format">
            <Select>
              <Select.Option value="YYYY-MM-DD">YYYY-MM-DD</Select.Option>
              <Select.Option value="YYYY/MM/DD">YYYY/MM/DD</Select.Option>
              <Select.Option value="YYYY年MM月DD日">YYYY年MM月DD日</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="弹出位置" name="placement">
            <Select>
              <Select.Option value="bottomLeft">下左</Select.Option>
              <Select.Option value="bottomRight">下右</Select.Option>
              <Select.Option value="topLeft">上左</Select.Option>
              <Select.Option value="topRight">上右</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="尺寸" name="size">
            <Select>
              <Select.Option value="large">大</Select.Option>
              <Select.Option value="middle">中</Select.Option>
              <Select.Option value="small">小</Select.Option>
            </Select>
          </Form.Item>
        </Panel>

        <Panel header="高级配置" key="advanced">
          <Form.Item label="显示今天按钮" name="showToday" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="显示时间选择" name="showTime" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="允许清除" name="allowClear" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="显示边框" name="bordered" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="禁用" name="disabled" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="输入框只读" name="inputReadOnly" valuePropName="checked">
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

export default DatePickerProperties;