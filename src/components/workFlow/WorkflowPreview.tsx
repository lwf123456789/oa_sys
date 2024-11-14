import React from 'react';
import ReactFlow, {
    Background,
    Controls,
    Node,
    Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import WorkflowNode from './components/WorkflowNode';
import { Modal } from 'antd';

interface WorkflowPreviewProps {
    open: boolean;
    onClose: () => void;
    data: {
        nodes: Node[];
        edges: Edge[];
    };
}

const WorkflowPreview: React.FC<WorkflowPreviewProps> = ({
    open,
    onClose,
    data
}) => {
    const nodeTypes = {
        workflowNode: WorkflowNode
    };

    return (
        <Modal
            title="流程预览"
            open={open}
            onCancel={onClose}
            footer={null}
            width="80%"
            style={{ top: 20 }}
            bodyStyle={{ height: 'calc(90vh - 100px)' }}
        >
            <div className="h-full bg-white">
                <ReactFlow
                    nodes={data.nodes}
                    edges={data.edges}
                    nodeTypes={nodeTypes}
                    fitView
                    minZoom={0.2}
                    maxZoom={1.4}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={false}
                >
                    <Background />
                    <Controls />
                </ReactFlow>
            </div>
        </Modal>
    );
};

export default WorkflowPreview;