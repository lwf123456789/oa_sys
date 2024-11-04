import { Input, Select } from 'antd';
import { FormOutlined, SelectOutlined } from '@ant-design/icons';
import { WidgetDefinition } from '@/types/form-widgets';

export const widgetRegistry: Record<string, WidgetDefinition> = {
  input: {
    type: 'input',
    title: '输入框',
    icon: <FormOutlined />,
    category: 'basic',
    component: Input,
    defaultProps: {
      placeholder: '请输入',
      allowClear: true
    },
    properties: [
      {
        type: 'input',
        label: '标签名称',
        field: 'label',
        defaultValue: '输入框'
      },
      {
        type: 'input',
        label: '字段名',
        field: 'field'
      },
      {
        type: 'switch',
        label: '是否必填',
        field: 'required',
        defaultValue: false
      },
      {
        type: 'input',
        label: '占位提示',
        field: 'props.placeholder'
      },
      {
        type: 'number',
        label: '宽度(%)',
        field: 'props.width',
        min: 0,
        max: 100,
        defaultValue: 100
      },
      {
        type: 'icon',
        label: '前缀图标',
        field: 'props.prefix'
      },
      {
        type: 'icon',
        label: '后缀图标',
        field: 'props.suffix'
      },
      {
        type: 'number',
        label: '最大长度',
        field: 'props.maxLength',
        min: 0
      }
    ],
    validations: [
      {
        type: 'required',
        message: '该字段不能为空'
      },
      {
        type: 'min',
        message: '最小长度为 {value} 个字符'
      },
      {
        type: 'max',
        message: '最大长度为 {value} 个字符'
      },
      {
        type: 'pattern',
        message: '请输入正确的格式'
      }
    ]
  },
  select: {
    type: 'select',
    title: '下拉选择框',
    icon: <SelectOutlined />,
    category: 'basic',
    component: Select,
    defaultProps: {
      placeholder: '请选择',
      allowClear: true,
      options: [],
      width: 100,
      fieldNames: { label: 'label', value: 'value' }
    },
    properties: [
      {
        type: 'input',
        label: '标签名称',
        field: 'label',
        defaultValue: '下拉选择'
      },
      {
        type: 'input',
        label: '字段名',
        field: 'field'
      },
      {
        type: 'switch',
        label: '是否必填',
        field: 'required',
        defaultValue: false
      },
      {
        type: 'input',
        label: '占位提示',
        field: 'props.placeholder'
      },
      {
        type: 'number',
        label: '宽度(%)',
        field: 'props.width',
        min: 0,
        max: 100,
        defaultValue: 100
      },
      {
        type: 'switch',
        label: '允许清除',
        field: 'props.allowClear',
        defaultValue: true
      },
      {
        type: 'switch',
        label: '允许搜索',
        field: 'props.showSearch',
        defaultValue: false
      },
      {
        type: 'optionList',  // 新增选项配置类型
        label: '选项配置',
        field: 'props.options',
        defaultValue: []
      }
    ],
    validations: [
      {
        type: 'required',
        message: '请选择一个选项'
      },
      {
        type: 'min',
        message: '至少选择 {value} 项'  // 用于多选模式
      },
      {
        type: 'max',
        message: '最多选择 {value} 项'  // 用于多选模式
      },
      {
        type: 'enum',
        message: '请选择有效的选项'  // 用于验证值是否在指定范围内
      },
      {
        type: 'custom',
        message: '选项不符合要求'  // 用于自定义验证逻辑
      }
    ]
  }
};

export const getWidgetDefinition = (type: string): WidgetDefinition => {
  const widgetDef = widgetRegistry[type];
  if (!widgetDef) {
    throw new Error(`Widget type "${type}" not found in registry`);
  }
  return widgetDef;
};