import { Form } from 'antd';
import { getWidgetDefinition } from '@/components/form-widgets/registry';
import { FormWidgetConfig } from '@/app/form-designer/store/formDesignerSlice';
import { Icon } from '@iconify/react';

interface WidgetRendererProps {
  widget: FormWidgetConfig;
}

const WidgetRenderer: React.FC<WidgetRendererProps> = ({ widget }) => {
  const widgetDef = getWidgetDefinition(widget.type);
  const Component = widgetDef.component;

  // 处理前缀和后缀图标以及宽度
  const props = {
    ...widget.props,
    prefix: widget.props.prefix ? <Icon icon={widget.props.prefix} /> : undefined,
    suffix: widget.props.suffix ? <Icon icon={widget.props.suffix} /> : undefined,
    style: {
      width: widget.props.width ? `${widget.props.width}%` : '100%'
    }
  };

  // 检查是否有必填规则
  const isRequired = widget.rules?.some(rule => rule.type === 'required');

  return (
    <Form.Item
      label={widget.label}
      required={isRequired}
      tooltip={widget.props.tooltip}
    >
      <Component {...props} />
    </Form.Item>
  );
};
export default WidgetRenderer;