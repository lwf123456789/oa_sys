import { Form } from 'antd';
import { useEffect } from 'react';
import { FormComponent } from '../types';
import { useDesignerStore } from '../store/useDesignerStore';
import dayjs from 'dayjs';

interface UseDateTimeFormOptions {
  component: FormComponent;
  type: 'date' | 'time';
}

export const useDateTimeForm = ({ component, type }: UseDateTimeFormOptions) => {
  const [form] = Form.useForm();
  const updateComponentProps = useDesignerStore(state => state.updateComponentProps);

  // 监听组件变化，更新表单值
  useEffect(() => {
    const values = { ...component.props };
    
    // 处理默认值转换
    if (values.defaultValue) {
      values.defaultValue = dayjs(values.defaultValue);
    }
    
    form.setFieldsValue(values);
  }, [component.id, form]);

  // 处理表单值变化
  const handleValuesChange = (changedValues: any, allValues: any) => {
    // 处理特殊字段
    const processedValues = { ...allValues };
    
    // 处理默认值
    if (processedValues.defaultValue) {
      processedValues.defaultValue = processedValues.defaultValue.format(
        type === 'date' ? processedValues.format || 'YYYY-MM-DD' : 
        processedValues.format || 'HH:mm:ss'
      );
    }

    // 处理数字类型的值
    if (type === 'time') {
      ['hourStep', 'minuteStep', 'secondStep'].forEach(key => {
        if (processedValues[key]) {
          processedValues[key] = Number(processedValues[key]);
        }
      });
    }

    updateComponentProps(component.id, processedValues);
  };

  return {
    form,
    handleValuesChange
  };
};