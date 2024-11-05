import { Form } from 'antd';
import { useEffect } from 'react';
import { FormComponent } from '../types';
import { useDesignerStore } from '../store/useDesignerStore';

interface UsePropertyFormOptions {
  component: FormComponent;
  watch?: Record<string, (value: any) => void>; // 可选的监听特定字段变化
}

export const usePropertyForm = ({ component, watch }: UsePropertyFormOptions) => {
  const [form] = Form.useForm();
  const updateComponentProps = useDesignerStore(state => state.updateComponentProps);

  // 监听组件变化，更新表单值
  useEffect(() => {
    form.setFieldsValue(component.props);
  }, [component.id, form]);

  // 处理表单值变化
  const handleValuesChange = (changedValues: any, allValues: any) => {
    // 更新组件属性
    updateComponentProps(component.id, changedValues);

    // 执行字段变化的监听回调
    if (watch) {
      Object.keys(changedValues).forEach(field => {
        if (watch[field]) {
          watch[field](changedValues[field]);
        }
      });
    }
  };

  return {
    form,
    handleValuesChange
  };
};