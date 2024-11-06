import React from 'react';
import { Modal, Tabs } from 'antd';
import Editor from "@monaco-editor/react";
import { useDesignerStore } from '../store/useDesignerStore';
import JsonVisualizer from './JsonVisualizer';
import FormPreview from './FormPreview';

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  isDesign: boolean;
  template?: any;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ open, onClose, isDesign = false, template }) => {

  let config: any;
  // 如果是表单设计器的预览，则需要从zustand中获取配置
  if (isDesign) {
    const exportConfig = useDesignerStore(state => state.exportConfig);
    config = exportConfig();
  } else {
    config = template;
  }

  return (
    <Modal
      title="表单配置预览"
      open={open}
      onCancel={onClose}
      width={1200}
      footer={null}
    >
      <Tabs
        defaultActiveKey="form"
        items={[
          {
            key: 'form',
            label: '表单预览',
            children: <FormPreview config={config?.components || config} />
          },
          {
            key: 'visual',
            label: '可视化预览',
            children: <JsonVisualizer data={config?.components || config} />
          },
          {
            key: 'json',
            label: 'JSON预览',
            children: (
              <div style={{ height: '80vh' }}>
                <Editor
                  height="100%"
                  defaultLanguage="json"
                  value={JSON.stringify(config, null, 2)}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                  theme="vs-dark"
                />
              </div>
            )
          }
        ]}
      />
    </Modal>
  );
};

export default PreviewModal;