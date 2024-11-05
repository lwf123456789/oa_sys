import React from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { FormComponent, FormComponentType } from '../types';
import { useDesignerStore } from '../store/useDesignerStore';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormRadio from './FormRadio';
import FormCheckbox from './FormCheckbox';
import FormTimePicker from './FormTimePicker';
import FormDatePicker from './FormDatePicker';
import FormGrid from './FormGrid';
import FormTitle from './FormTitle';
import { Button, Tooltip } from 'antd';
interface ComponentRendererProps {
    component: FormComponent;
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({ component }) => {
    const { props } = component;
    const isHorizontal = props.layout === 'horizontal';
    const { selectedId, setSelectedId, removeComponent } = useDesignerStore();

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // 阻止事件冒泡
        setSelectedId(component.id);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        removeComponent(component.id);
    };

    const componentMap: Record<FormComponentType, React.FC<{ component: FormComponent }>> = {
        input: FormInput,
        select: FormSelect,
        radio: FormRadio,
        checkbox: FormCheckbox,
        timePicker: FormTimePicker,
        datePicker: FormDatePicker,
        grid: FormGrid,
        title: FormTitle
    };

    const Component = componentMap[component.type];

    if (!Component) return null;

    return (
        <div
            className={`
                relative group mb-4 p-4 rounded-lg transition-all
                ${selectedId === component.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'}
            `}
            onClick={handleClick}
        >
            {/* 删除按钮 */}
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Tooltip title="删除组件">
                    <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        className="hover:bg-red-50"
                        onClick={handleDelete}
                    />
                </Tooltip>
            </div>

            <div
                style={{
                    display: isHorizontal ? 'flex' : 'block',
                    alignItems: isHorizontal ? 'center' : 'flex-start'
                }}
            >
                <div
                    style={{
                        width: isHorizontal ? `${props.labelWidth}px` : '100%',
                        marginRight: isHorizontal ? '8px' : 0,
                        marginBottom: isHorizontal ? 0 : '4px',
                        flexShrink: 0
                    }}
                    className="text-sm text-gray-600"
                >
                    {props.label}
                    {props.required && <span className="text-red-500 ml-1">*</span>}
                </div>

                <div style={{
                    width: isHorizontal ? `${props.fieldWidth}px` : '100%',
                    flex: isHorizontal ? 'none' : '1'
                }}>
                    <Component component={component} />
                </div>
            </div>
        </div>
    );
};

export default ComponentRenderer;