import { Form } from 'antd';
import { useEffect } from 'react';
import { FormComponent } from '../types';
import { useDesignerStore } from '../store/useDesignerStore';

interface UseGridFormOptions {
  component: FormComponent;
}

export const useGridForm = ({ component }: UseGridFormOptions) => {
  const [form] = Form.useForm();
  const updateComponentProps = useDesignerStore(state => state.updateComponentProps);

  useEffect(() => {
    form.setFieldsValue(component.props);
  }, [component.id, form]);

  const handleValuesChange = (changedValues: any, allValues: any) => {
    // 确保数值类型正确
    const processedValues = {
      ...allValues,
      cols: Number(allValues.cols),
      gutter: Number(allValues.gutter)
    };

    updateComponentProps(component.id, processedValues);
  };

  return {
    form,
    handleValuesChange
  };
};