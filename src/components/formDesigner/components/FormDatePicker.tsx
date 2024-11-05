import React from 'react';
import { DatePicker } from 'antd';
import { FormComponent } from '../types';
import dayjs, { Dayjs } from 'dayjs';

interface FormDatePickerProps {
  component: FormComponent;
}

const FormDatePicker: React.FC<FormDatePickerProps> = ({ component }) => {
  const { props } = component;

  // 处理默认值
  const defaultValue = props.defaultValue ? dayjs(props.defaultValue) : undefined;

  // 通用属性
  const commonProps = {
    ...props,
    defaultValue,
    style: { width: '100%' },
    onChange: (date: Dayjs | null, dateString: string | string[]) => {
      if (props.onChange) {
        props.onChange(date, dateString);
      }
    }
  };

  // 根据 picker 类型选择不同的日期选择器
  const renderDatePicker = () => {
    switch (props.picker) {
      case 'week':
        return <DatePicker.WeekPicker {...commonProps} />;
      case 'month':
        return <DatePicker.MonthPicker {...commonProps} />;
      case 'quarter':
        return <DatePicker.QuarterPicker {...commonProps} />;
      case 'year':
        return <DatePicker.YearPicker {...commonProps} />;
      default:
        return <DatePicker {...commonProps} />;
    }
  };

  return (
    <div className="w-full">
      {renderDatePicker()}
    </div>
  );
};

export default FormDatePicker;