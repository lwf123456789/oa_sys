import React from 'react';
import { Form, Input, Radio, Slider, Space } from 'antd';
import { FormComponent } from '../../types';

interface BasePropertiesProps {
  component: FormComponent;
}

const BaseProperties: React.FC<BasePropertiesProps> = () => {
  return (
    <>
      <Form.Item label="标签名称" name="label">
        <Input />
      </Form.Item>
      
      <Form.Item label="布局方式" name="layout">
        <Radio.Group>
          <Radio value="vertical">垂直</Radio>
          <Radio value="horizontal">水平</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item 
        noStyle 
        shouldUpdate={(prev, curr) => prev.layout !== curr.layout}
      >
        {({ getFieldValue }) => (
          getFieldValue('layout') === 'horizontal' && (
            <Space direction="vertical" className="w-full">
              <Form.Item 
                label="标签宽度" 
                name="labelWidth"
                tooltip="调整标签的宽度（单位：像素）"
              >
                <Slider
                  min={80}
                  max={200}
                  step={10}
                  marks={{
                    80: '80px',
                    120: '120px',
                    160: '160px',
                    200: '200px'
                  }}
                />
              </Form.Item>

              <Form.Item 
                label="组件宽度" 
                name="fieldWidth"
                tooltip="调整输入框的宽度（单位：像素）"
              >
                <Slider
                  min={100}
                  max={500}
                  step={20}
                  marks={{
                    100: '100px',
                    300: '300px',
                    500: '500px'
                  }}
                />
              </Form.Item>
            </Space>
          )
        )}
      </Form.Item>
    </>
  );
};

export default BaseProperties;