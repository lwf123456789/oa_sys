'use client';

import React, { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
    Background,
    Controls,
    Edge,
    useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from './store/useWorkflowStore';
import PropertyPanel from './PropertyPanel';
import Toolbar from './components/Toolbar';
import WorkflowNode from './components/WorkflowNode';
import { WorkflowNodeType } from './types';
import { Drawer, Modal, Popconfirm } from 'antd';

const WorkflowCanvas: React.FC = () => {
    const { project } = useReactFlow();
    const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
    const { selectedNodeId } = useWorkflowStore(); // 获取选中节点状态
    const nodeTypes = useMemo(() => ({
        workflowNode: WorkflowNode
    }), []);

    const {
        nodes,
        edges,
        addNode,
        onNodesChange,
        onEdgesChange,
        onConnect,
        setSelectedNodeId,
        deleteEdge
    } = useWorkflowStore();

    const handleNodeClick = useCallback((event: any, node: any) => {
        setSelectedNodeId(node.id);
    }, [setSelectedNodeId]);

    const handlePaneClick = useCallback(() => {
        setSelectedNodeId(null);
    }, [setSelectedNodeId]);

    const onDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    const onDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();

        const type = event.dataTransfer.getData('application/reactflow') as WorkflowNodeType;
        const reactFlowBounds = event.currentTarget.getBoundingClientRect();

        const position = project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top
        });

        addNode(type, position);
    }, [project, addNode]);

    const onEdgeClick = useCallback((event: any, edge: Edge) => {
        event.preventDefault();
        event.stopPropagation();
        setSelectedEdge(edge);
    }, []);

    const handleDeleteEdge = useCallback(() => {
        if (selectedEdge) {
            deleteEdge(selectedEdge.id);
            setSelectedEdge(null);
        }
    }, [deleteEdge, selectedEdge]);

    return (
        <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
            <Toolbar />
            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 bg-white">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={handleNodeClick}
                        onPaneClick={handlePaneClick}
                        onEdgeClick={onEdgeClick}
                        onDragOver={onDragOver}
                        onDrop={onDrop}
                        fitView
                        minZoom={0.2}
                        maxZoom={1.4}
                    >
                        <Background />
                        <Controls />
                    </ReactFlow>
                </div>
                <Drawer
                    title="节点配置"
                    placement="right"
                    width={650}
                    onClose={() => setSelectedNodeId(null)}
                    open={!!selectedNodeId}
                    mask={false}  // 移除蒙版
                    maskClosable={false}  // 禁用蒙版点击关闭
                    style={{ position: 'absolute' }}  // 确保抽屉不会影响其他元素
                >
                    <PropertyPanel />
                </Drawer>
            </div>
            <Modal
                title="删除连线"
                open={!!selectedEdge}
                onOk={handleDeleteEdge}
                onCancel={() => setSelectedEdge(null)}
                okText="确定"
                cancelText="取消"
            >
                <p>确定要删除这条连线吗？</p>
            </Modal>
        </div>
    );
};

export default WorkflowCanvas;