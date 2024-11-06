import { Form } from 'antd';
import { useEffect } from 'react';
import { FormComponent } from '../types';
import { useDesignerStore } from '../store/useDesignerStore';

interface UseTitleFormOptions {
  component: FormComponent;
}

export const useTitleForm = ({ component }: UseTitleFormOptions) => {
  const [form] = Form.useForm();
  const updateComponentProps = useDesignerStore(state => state.updateComponentProps);

  useEffect(() => {
    form.setFieldsValue(component.props);
  }, [component.id, form]);

  const handleValuesChange = (changedValues: any, allValues: any) => {
    // 处理样式对象
    const processedValues = {
      ...allValues,
      style: {
        ...allValues.style,
        color: allValues.style?.color || '#000000',
        fontWeight: allValues.style?.fontWeight || 'normal',
        marginBottom: Number(allValues.style?.marginBottom || 0)
      }
    };

    updateComponentProps(component.id, processedValues);
  };

  return {
    form,
    handleValuesChange
  };
};