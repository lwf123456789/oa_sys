import React from 'react';
import { useDesignerStore } from './store/useDesignerStore';
import InputProperties from './components/properties/InputProperties';
import SelectProperties from './components/properties/SelectProperties';
import RadioProperties from './components/properties/RadioProperties';
import CheckboxProperties from './components/properties/CheckboxProperties';
import TimePickerProperties from './components/properties/TimePickerProperties';
import DatePickerProperties from './components/properties/DatePickerProperties';
import GridProperties from './components/properties/GridProperties';
import TitleProperties from './components/properties/TitleProperties';
import { FormComponentType } from './types';

const PropertyPanel: React.FC = () => {
    const { selectedId, components } = useDesignerStore();

    // 递归查找选中的组件
    const findSelectedComponent = (items: any[], id: string): any => {
        for (const item of items) {
            if (item.id === id) return item;
            if (item.children?.length) {
                const found = findSelectedComponent(item.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const selectedComponent = selectedId ? findSelectedComponent(components, selectedId) : null;

    const componentMap: Record<FormComponentType, React.FC<{ component: any }>> = {
        input: InputProperties,
        select: SelectProperties,
        radio: RadioProperties,
        checkbox: CheckboxProperties,
        timePicker: TimePickerProperties,
        datePicker: DatePickerProperties,
        grid: GridProperties,
        title: TitleProperties
    };

    if (!selectedComponent) {
        return (
            <div className="p-4">
                <div className="text-gray-400 text-center">请选择一个组件进行配置</div>
            </div>
        );
    }

    const PropertyComponent = componentMap[selectedComponent.type as FormComponentType];

    return (
        <div className="p-4">
            <h2 className="text-lg font-medium mb-4">属性配置</h2>
            {PropertyComponent && <PropertyComponent component={selectedComponent} />}
        </div>
    );
};

export default PropertyPanel;