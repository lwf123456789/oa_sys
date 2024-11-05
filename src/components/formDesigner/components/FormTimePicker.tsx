import React from 'react';
import { TimePicker, ConfigProvider } from 'antd';
import { FormComponent } from '../types';
import dayjs from 'dayjs';

interface FormTimePickerProps {
  component: FormComponent;
}

const FormTimePicker: React.FC<FormTimePickerProps> = ({ component }) => {
  const { props } = component;
  const defaultValue = props.defaultValue ? dayjs(props.defaultValue) : undefined;

  return (
    <ConfigProvider>
      <div style={{ width: '100%' }}>
        <TimePicker
          {...props}
          defaultValue={defaultValue}
          style={{ width: '100%' }}
        />
      </div>
    </ConfigProvider>
  );
};

export default FormTimePicker;