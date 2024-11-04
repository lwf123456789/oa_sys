// 表单配置定义
export interface FormConfig {
    id: string;
    name: string;
    title: string;
    description?: string;
    layout: 'horizontal' | 'vertical' | 'inline';
    labelWidth?: number;
    labelAlign?: 'left' | 'right';
    widgets: FormWidgetConfig[];
  }
  
  // 组件配置定义
  export interface FormWidgetConfig {
    id: string;
    type: string;
    label: string;
    field: string;
    props: {
      placeholder?: string;
      width?: number;
      prefix?: string;
      suffix?: string;
      maxLength?: number;
      allowClear?: boolean;
      [key: string]: any;
    };
    rules?: FormValidationRule[];
    required?: boolean;
    tooltip?: string;
  }
  
  // 验证规则定义
  export interface FormValidationRule {
    type: 'required' | 'min' | 'max' | 'pattern' | 'email' | 'url' | 'custom';
    message: string;
    value?: any;
    pattern?: string;
    validator?: string; // 自定义验证器名称
  }