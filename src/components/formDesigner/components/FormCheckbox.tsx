import React from 'react';
import { Checkbox } from 'antd';
import { FormComponent } from '../types';

interface FormCheckboxProps {
  component: FormComponent;
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({ component }) => {
  return (
    <div className="w-full">
      <div className="mb-1 text-sm text-gray-600">{component.label}</div>
      <Checkbox.Group
        {...component.props}
        options={component.props.options || []}
      />
    </div>
  );
};

export default FormCheckbox;