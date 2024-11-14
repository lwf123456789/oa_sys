import React from 'react';
import { Modal, Tabs, Spin } from 'antd';
import Editor, { loader } from "@monaco-editor/react";

interface WorkflowPreviewModalProps {
    open: boolean;
    onClose: () => void;
    config: any;
}

// 配置 Monaco Editor 的 CDN
loader.config({
    paths: {
        vs: 'https://cdn.bootcdn.net/ajax/libs/monaco-editor/0.34.0/min/vs'
        // 或者使用 npmmirror 的镜像
        // vs: 'https://registry.npmmirror.com/-/binary/monaco-editor/0.34.0/min/vs'
    }
});

const WorkflowPreviewModal: React.FC<WorkflowPreviewModalProps> = ({
    open,
    onClose,
    config
}) => {

    return (
        <Modal
            title="工作流配置预览"
            open={open}
            onCancel={onClose}
            width={1200}
            footer={null}
            style={{ top: 20 }}
        >
            <Tabs
                defaultActiveKey="json"
                items={[
                    {
                        key: 'json',
                        label: 'JSON预览',
                        children: (
                            <div style={{ height: '70vh' }}>
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
                                    loading={<Spin size="large" />}
                                />
                            </div>
                        )
                    }
                ]}
            />
        </Modal>
    );
};

export default WorkflowPreviewModal;