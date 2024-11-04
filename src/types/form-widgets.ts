import { ReactNode } from "react";

export interface BaseWidgetProps {
  id: string;
  type: string;
  label: string;
  field: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  onChange?: (value: any) => void;
}

// 组件属性配置项
export interface WidgetPropertyConfig {
  type: 'input' | 'number' | 'switch' | 'select' | 'radio' | 'icon' | 'slider' | 'optionList';
  label: string;
  field: string;
  value?: any;
  defaultValue?: any;
  options?: Array<{ label: string; value: any }>;
  min?: number;
  max?: number;
  step?: number;
  tooltip?: string;
}

// 组件验证规则配置
export interface WidgetValidationConfig {
  type: 'required' | 'min' | 'max' | 'pattern' | 'enum' | 'custom';
  message: string;
  value?: any;
}

// 组件定义
export interface WidgetDefinition {
  type: string;
  title: string;
  icon: ReactNode;
  category: 'basic' | 'layout' | 'advanced';
  component: React.ComponentType<any>;
  defaultProps: Record<string, any>;
  properties: WidgetPropertyConfig[];
  validations: WidgetValidationConfig[];
}