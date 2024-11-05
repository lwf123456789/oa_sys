import React from 'react';
import { Modal, Tabs } from 'antd';
import Editor from "@monaco-editor/react";
import { useDesignerStore } from '../store/useDesignerStore';
import JsonVisualizer from './JsonVisualizer';

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ open, onClose }) => {
  const exportConfig = useDesignerStore(state => state.exportConfig);
  const config = exportConfig();

  return (
    <Modal
      title="表单配置预览"
      open={open}
      onCancel={onClose}
      width={1200}
      footer={null}
    >
      <Tabs
        defaultActiveKey="visual"
        items={[
          {
            key: 'visual',
            label: '可视化预览',
            children: <JsonVisualizer data={config} />
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