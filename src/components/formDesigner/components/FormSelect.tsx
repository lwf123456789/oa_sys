import React from 'react';
import { Select } from 'antd';
import { FormComponent } from '../types';

interface FormSelectProps {
  component: FormComponent;
}

const FormSelect: React.FC<FormSelectProps> = ({ component }) => {
  return (
    <div className="w-full">
      <Select
        className="w-full"
        {...component.props}
        options={component.props.options || []}
      />
    </div>
  );
};

export default FormSelect;