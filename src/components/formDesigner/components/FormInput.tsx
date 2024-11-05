import React from 'react';
import { Input } from 'antd';
import { FormComponent } from '../types';

interface FormInputProps {
  component: FormComponent;
}

const FormInput: React.FC<FormInputProps> = ({ component }) => {
  const { type, ...props } = component.props;

  switch (type) {
    case 'password':
      return <Input.Password {...props} />;
    case 'textarea':
      return <Input.TextArea {...props} />;
    default:
      return <Input {...props} />;
  }
};

export default FormInput;