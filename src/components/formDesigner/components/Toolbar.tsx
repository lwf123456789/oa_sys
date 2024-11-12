import React, { useRef, useState } from 'react';
import { Button, Tooltip, Space, Divider, Modal, message } from 'antd';
import {
    EyeOutlined,
    ClearOutlined,
    ExportOutlined,
    ImportOutlined,
    SaveOutlined,
} from '@ant-design/icons';
import { useDesignerStore } from '../store/useDesignerStore';
import PreviewModal from './PreviewModal';
import SaveTemplateModal from './SaveTemplateModal';
import { $clientReq } from '@/utils/clientRequest';

interface ToolbarProps {
    mode: 'create' | 'edit';
    onSave?: (data: any) => void;
    initialData?: {
        id?: number;
        name?: string;
        description?: string;
        status?: number;
    };
}

const Toolbar: React.FC<ToolbarProps> = ({ mode = 'create', onSave, initialData }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const { clearCanvas, exportConfig, importConfig } = useDesignerStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [saveModalOpen, setSaveModalOpen] = useState(false);

    const handleSave = async (formData: any) => {
        if(mode === 'create'){
            const res = await $clientReq.post('/form-templates/create', formData);
            if(res.message){
                message.success('保存成功');
            }
        }
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const config = JSON.parse(e.target?.result as string);
                    importConfig(config);
                    message.success('导入成功');
                } catch (error) {
                    message.error('导入失败，请检查文件格式');
                }
            };
            reader.readAsText(file);
        }
        // 重置 input 值，允许重复导入相同文件
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleExport = () => {
        const config = exportConfig();
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `form-config-${new Date().getTime()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleClear = () => {
        Modal.confirm({
            title: '确认清空',
            content: '确定要清空画布吗？此操作不可恢复。',
            onOk: clearCanvas
        });
    };


    return (
        <>
            <div className="h-12 px-4 border-b border-gray-200 bg-white flex items-center justify-end">
                <Space split={<Divider type="vertical" />}>
                    <Space>
                        <Tooltip title="预览配置">
                            <Button
                                icon={<EyeOutlined />}
                                onClick={() => setPreviewOpen(true)}
                            >
                            </Button>
                        </Tooltip>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImport}
                            accept=".json"
                            style={{ display: 'none' }}
                        />
                        <Tooltip title="导入配置">
                            <Button
                                icon={<ImportOutlined />}
                                onClick={() => fileInputRef.current?.click()}
                            />
                        </Tooltip>
                        <Tooltip title="导出配置">
                            <Button
                                icon={<ExportOutlined />}
                                onClick={handleExport}
                            >
                            </Button>
                        </Tooltip>
                        <Tooltip title="清空画布">
                            <Button
                                icon={<ClearOutlined />}
                                danger
                                onClick={handleClear}
                            >
                            </Button>
                        </Tooltip>
                        <Tooltip title={mode === 'create' ? '保存模板' : '更新模板'}>
                            <Button
                                icon={<SaveOutlined />}
                                type="primary"
                                onClick={() => setSaveModalOpen(true)}
                            />
                        </Tooltip>
                    </Space>
                </Space>
            </div>

            <PreviewModal
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                isDesign={true}
            />

            <SaveTemplateModal
                open={saveModalOpen}
                onClose={() => setSaveModalOpen(false)}
                mode={mode}
                onSave={handleSave}
                initialData={initialData}
            />
        </>
    );
};

export default Toolbar;