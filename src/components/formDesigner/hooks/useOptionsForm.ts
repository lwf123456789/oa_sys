import { Form } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { useEffect } from 'react';
import { FormComponent } from '../types';
import { useDesignerStore } from '../store/useDesignerStore';

interface UseOptionsFormOptions {
  component: FormComponent;
  defaultOption?: {
    label: string;
    value: string | number;
  };
}

export const useOptionsForm = ({ component, defaultOption = { label: '', value: '' } }: UseOptionsFormOptions) => {
  const [form] = Form.useForm();
  const updateComponentProps = useDesignerStore(state => state.updateComponentProps);

  // 监听组件变化，更新表单值
  useEffect(() => {
    form.setFieldsValue(component.props);
  }, [component.id, form]);

  // 处理表单值变化
  const handleValuesChange = (changedValues: any, allValues: any) => {
    updateComponentProps(component.id, allValues);
  };

  // 添加选项
  const handleAddOption = () => {
    const options = form.getFieldValue('options') || [];
    form.setFieldsValue({
      options: [...options, { ...defaultOption }]
    });
  };

  // 删除选项
  const handleRemoveOption = (index: number) => {
    const options = form.getFieldValue('options') || [];
    form.setFieldsValue({
      options: options.filter((_: any, i: number) => i !== index)
    });
  };

  return {
    form,
    handleValuesChange,
    handleAddOption,
    handleRemoveOption
  };
};