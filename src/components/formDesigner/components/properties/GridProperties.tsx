import React from 'react';
import { Form, InputNumber, Slider } from 'antd';
import { FormComponent } from '../../types';
import { useGridForm } from '../../hooks/useGridForm';

interface GridPropertiesProps {
  component: FormComponent;
}

const GridProperties: React.FC<GridPropertiesProps> = ({ component }) => {
  const { form, handleValuesChange } = useGridForm({ component });
  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={component.props}
      onValuesChange={handleValuesChange}
    >
      <Form.Item label="列数" name="cols">
        <InputNumber min={1} max={24} />
      </Form.Item>

      <Form.Item label="栅格间隔" name="gutter">
        <Slider
          marks={{
            0: '0',
            8: '8',
            16: '16',
            24: '24',
            32: '32',
            40: '40',
          }}
          min={0}
          max={40}
          step={8}
        />
      </Form.Item>
    </Form>
  );
};

export default GridProperties;