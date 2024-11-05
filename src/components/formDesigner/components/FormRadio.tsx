import React from 'react';
import { Radio } from 'antd';
import { FormComponent } from '../types';

interface FormRadioProps {
  component: FormComponent;
}

const FormRadio: React.FC<FormRadioProps> = ({ component }) => {
  return (
    <div className="w-full">
      <Radio.Group
        {...component.props}
        options={component.props.options || []}
      />
    </div>
  );
};

export default FormRadio;