import { FormComponentType } from '../types';

export interface ComponentConfig {
    type: FormComponentType;
    label: string;
    icon: string;
    defaultProps: Record<string, any>;
}

export const componentList: ComponentConfig[] = [
    {
        type: 'input',
        label: '输入框',
        icon: 'material-symbols:input',
        defaultProps: {
            // 基础属性
            label: '输入框',
            name: '',
            layout: 'vertical',
            labelWidth: 100,
            fieldWidth: 240,

            variant: 'outlined', // 'outlined' | 'borderless' | 'filled'
            type: 'text', // 'text' | 'password' | 'textarea'

            // Input.TextArea 特有属性
            autoSize: false, // boolean | { minRows: number, maxRows: number }

            // Input.Password 特有属性
            visibilityToggle: true,
            iconRender: undefined,

            // Input 组件属性
            addonAfter: '',
            addonBefore: '',
            allowClear: false,
            // bordered: true,
            defaultValue: '',
            disabled: false,
            maxLength: undefined,
            showCount: false,
            status: '', // '' | 'error' | 'warning'
            prefix: '',
            suffix: '',
            size: 'middle', // 'large' | 'middle' | 'small'
            placeholder: '请输入',

            // 校验相关
            required: false,
            pattern: '',
            validateTrigger: 'onChange',

            // 事件处理
            onChange: undefined,
            onPressEnter: undefined,
        }
    },
    {
        type: 'select',
        label: '选择框',
        icon: 'material-symbols:select-check-box',
        defaultProps: {
            // 基础属性
            label: '选择框',
            name: '',
            layout: 'vertical',
            labelWidth: 100,
            fieldWidth: 240,

            // Select 组件属性
            allowClear: true,
            bordered: true,
            defaultValue: undefined,
            disabled: false,
            loading: false,
            maxTagCount: undefined,
            mode: undefined, // 'multiple' | 'tags'
            placeholder: '请选择',
            showSearch: false,
            size: 'middle',
            status: '',
            options: [],

            // 搜索相关
            filterOption: true,
            optionFilterProp: 'label',

            // 校验相关
            required: false,
            validateTrigger: 'onChange',
        }
    },
    {
        type: 'radio',
        label: '单选框组',
        icon: 'material-symbols:radio-button-checked',
        defaultProps: {
            // 基础属性
            label: '单选框组',
            name: '',
            layout: 'vertical',
            labelWidth: 100,
            fieldWidth: 240,

            // Radio.Group 属性
            buttonStyle: 'outline', // 'outline' | 'solid'
            defaultValue: undefined,
            disabled: false,
            optionType: 'default', // 'default' | 'button'
            size: 'middle',
            options: [],

            // 校验相关
            required: false,
            validateTrigger: 'onChange',
        }
    },
    {
        type: 'checkbox',
        label: '复选框组',
        icon: 'material-symbols:check-box',
        defaultProps: {
            // 基础属性
            label: '复选框组',
            name: '',
            layout: 'vertical',
            labelWidth: 100,
            fieldWidth: 240,

            // Checkbox.Group 属性
            defaultValue: [],
            disabled: false,
            options: [],

            // 校验相关
            required: false,
            validateTrigger: 'onChange',
        }
    },
    {
        type: 'timePicker',
        label: '时间选择器',
        icon: 'material-symbols:schedule',
        defaultProps: {
            // 基础属性
            label: '时间选择器',
            name: '',
            layout: 'vertical',
            labelWidth: 100,
            fieldWidth: 240,

            // TimePicker 组件属性
            allowClear: true,
            autoFocus: false,
            bordered: true,
            className: '',
            disabled: false,
            format: 'HH:mm:ss',
            hourStep: 1,
            minuteStep: 1,
            secondStep: 1,
            inputReadOnly: false,
            open: undefined,
            placeholder: '请选择时间',
            placement: 'bottomLeft',
            size: 'middle',
            status: '',
            use12Hours: false,

            // 校验相关
            required: false,
            validateTrigger: 'onChange'
        }
    },
    {
        type: 'datePicker',
        label: '日期选择器',
        icon: 'material-symbols:calendar-month',
        defaultProps: {
            // 基础属性
            label: '日期选择器',
            name: '',
            layout: 'vertical',
            labelWidth: 100,
            fieldWidth: 240,

            // DatePicker 组件属性
            allowClear: true,
            autoFocus: false,
            bordered: true,
            disabled: false,
            inputReadOnly: false,
            format: 'YYYY-MM-DD',
            picker: 'date', // date | week | month | quarter | year
            placeholder: '请选择日期',
            placement: 'bottomLeft',
            size: 'middle',
            status: '',
            showToday: true,
            showTime: false,

            // 校验相关
            required: false,
            validateTrigger: 'onChange'
        }
    },
    {
        type: 'grid',
        label: '栅格布局',
        icon: 'material-symbols:grid-view',
        defaultProps: {
            cols: 2,
            gutter: 16
        }
    },
    {
        type: 'title',
        label: '标题',
        icon: 'material-symbols:title',
        defaultProps: {
            content: '标题文本',
            level: 3, // 1-6
            align: 'left',
            style: {
                marginBottom: 16,
                color: '#000000',
                fontWeight: 'bold'
            }
        }
    }
];