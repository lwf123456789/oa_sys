import { Layout, Button, Space, Tooltip, Modal } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  UndoOutlined,
  RedoOutlined,
  EyeOutlined,
  CodeOutlined,
  SaveOutlined,
  ImportOutlined,
  ExportOutlined,
  ClearOutlined
} from '@ant-design/icons';
import { RootState } from '../../store/types';
import { FormConfig } from '@/types/form-designer';
import { nanoid } from '@reduxjs/toolkit';

const { Header } = Layout;

const ToolBar = () => {
  const dispatch = useDispatch();
  const widgets = useSelector((state: RootState) => state.formDesigner.widgets);
  const { past, future } = useSelector((state: RootState) => state.formDesigner.history);

  const handlePreview = () => {
    // TODO: 实现预览功能
  };

  const handleViewCode = () => {
    // TODO: 实现查看代码功能
  };

  const handleSave = () => {
    // TODO: 实现保存功能
  };

  const handleImport = () => {
    // TODO: 实现导入功能
  };

  const handleExport = () => {
    const timestamp = new Date().toISOString().split('T')[0];

    const formConfig: FormConfig = {
      id: nanoid(),
      name: `form_${timestamp}`,
      title: '表单标题',
      description: '表单描述',
      layout: 'vertical',
      widgets: widgets.map(widget => {
        const props = JSON.parse(JSON.stringify(widget.props || {}));

        if (widget.type === 'select') {
          props.options = (widget.props?.options || [])
            .filter((option: any) => option && option.label && option.value)
            .map((option: any) => ({
              label: String(option.label || '').trim(),
              value: String(option.value || '').trim()
            }))
            .filter((option: any) => option.label && option.value);
        }

        return {
          id: widget.id,
          type: widget.type,
          label: widget.label,
          field: widget.field,
          props,
          validations: widget.rules?.map(rule => ({
            type: rule.type,
            message: rule.message,
            required: rule.type === 'required'
          })) || [],
          layout: {
            span: props.width || 24,
            offset: 0,
            order: 0
          },
          advanced: {
            dependencies: [],
            hidden: false,
            disabled: false
          }
        };
      })
    };

    // 美化 JSON 输出
    const jsonContent = JSON.stringify(formConfig, null, 2);
    console.log('Exporting form config:', formConfig); // 添加日志

    const blob = new Blob([jsonContent], {
      type: 'application/json;charset=utf-8'
    });

    const fileName = `${formConfig.name}_${timestamp}.json`;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    Modal.confirm({
      title: '确认清空',
      content: '是否确认清空当前设计器中的所有组件？此操作不可恢复。',
      onOk: () => {
        // TODO: 实现清空功能
      }
    });
  };

  return (
    <Header className="bg-white shadow-sm px-4 flex items-center justify-between">
      <div className="text-lg font-medium">表单设计器</div>
      <Space>
        <Tooltip title="撤销">
          <Button
            icon={<UndoOutlined />}
            disabled={past.length === 0}
          />
        </Tooltip>
        <Tooltip title="重做">
          <Button
            icon={<RedoOutlined />}
            disabled={future.length === 0}
          />
        </Tooltip>
        <Tooltip title="预览">
          <Button
            icon={<EyeOutlined />}
            onClick={handlePreview}
            disabled={widgets.length === 0}
          />
        </Tooltip>
        <Tooltip title="查看代码">
          <Button
            icon={<CodeOutlined />}
            onClick={handleViewCode}
            disabled={widgets.length === 0}
          />
        </Tooltip>
        <Tooltip title="保存">
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            disabled={widgets.length === 0}
          />
        </Tooltip>
        <Tooltip title="导入">
          <Button
            icon={<ImportOutlined />}
            onClick={handleImport}
          />
        </Tooltip>
        <Tooltip title="导出">
          <Button
            icon={<ExportOutlined />}
            onClick={handleExport}
            disabled={widgets.length === 0}
          />
        </Tooltip>
        <Tooltip title="清空">
          <Button
            danger
            icon={<ClearOutlined />}
            onClick={handleClear}
            disabled={widgets.length === 0}
          />
        </Tooltip>
      </Space>
    </Header>
  );
};

export default ToolBar;