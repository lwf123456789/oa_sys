import { create } from 'zustand';
import { produce } from 'immer';
import {
    Node,
    Edge,
    Connection,
    NodeChange,
    EdgeChange,
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
} from 'reactflow';
import { WorkflowNodeData, WorkflowNodeType } from '../types';
import { nanoid } from 'nanoid';

interface WorkflowStore {
    nodes: Node<WorkflowNodeData>[];
    edges: Edge[];
    addNode: (type: WorkflowNodeType, position: { x: number, y: number }) => void;
    selectedNodeId: string | null;
    setSelectedNodeId: (id: string | null) => void;
    updateNodeData: (id: string, data: Partial<WorkflowNodeData>) => void;
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    deleteNode: (nodeId: string) => void;
    deleteEdge: (edgeId: string) => void;
    validateConnection: (connection: Connection) => boolean;
    onConnect: (connection: Connection) => void;
    clearCanvas: () => void;
    importConfig: (config: any) => void;
    exportConfig: () => { nodes: Node<WorkflowNodeData>[]; edges: Edge[] };
}

const initialNodes: Node<WorkflowNodeData>[] = [
    {
        id: 'start',
        type: 'workflowNode',
        position: { x: 100, y: 100 },
        data: {
            type: 'start',
            label: '开始',
            description: '流程开始节点',
            config: {
                initiatorType: 'all',
                processTitle: '${userName}的审批申请'
            }
        }
    }
];

const initialEdges: Edge[] = [];

// 获取节点默认标签
const getDefaultNodeLabel = (type: WorkflowNodeType): string => {
    const labels: Record<WorkflowNodeType, string> = {
        start: '开始',
        approval: '审批节点',
        condition: '条件节点',
        parallel: '并行节点',
        'parallel-branch': '并行分支',
        subprocess: '子流程',
        cc: '抄送节点',
        end: '结束'
    };
    return labels[type];
};


// 获取节点默认配置
const getDefaultNodeConfig = (type: WorkflowNodeType) => {
    switch (type) {
        case 'approval':
            return {
                approvalMode: 'OR',
                approverType: 'specific',
                timeLimit: 24,
                autoPass: false
            };
        case 'parallel':
            return {
                strategy: 'ALL',
                branches: []
            };
        // ... 其他节点类型的默认配置
        default:
            return {};
    }
};

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
    // 添加节点
    addNode: (type, position) => {
        set(produce((state) => {
            const newNode = {
                id: `node-${nanoid()}`,
                type: 'workflowNode',
                position,
                data: {
                    type,
                    label: getDefaultNodeLabel(type),
                    config: getDefaultNodeConfig(type)
                }
            };
            state.nodes.push(newNode);
        }));
    },

    selectedNodeId: null,

    setSelectedNodeId: (id) => set({ selectedNodeId: id }),

    onNodesChange: (changes) => {
        set(produce((state) => {
            state.nodes = applyNodeChanges(changes, state.nodes);
        }));
    },

    onEdgesChange: (changes) => {
        set((state) => ({
            edges: applyEdgeChanges(changes, state.edges)
        }));
    },

    updateNodeData: (id, data) => {
        set((state) => ({
            nodes: state.nodes.map((node) =>
                node.id === id
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            ...(data.config ? { config: { ...node.data.config, ...data.config } } : data)
                        }
                    }
                    : node
            ),
        }));
    },

    deleteNode: (nodeId: string) => {
        set((state) => ({
            nodes: state.nodes.filter(node => node.id !== nodeId),
            edges: state.edges.filter(
                edge => edge.source !== nodeId && edge.target !== nodeId
            ),
            selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId
        }));
    },

    deleteEdge: (edgeId: string) => {
        set((state) => ({
            edges: state.edges.filter(edge => edge.id !== edgeId)
        }));
    },

    validateConnection: (connection: Connection) => {
        const { source, target } = connection;
        const sourceNode = get().nodes.find(node => node.id === source);
        const targetNode = get().nodes.find(node => node.id === target);

        if (!sourceNode || !targetNode) return false;

        // 开始节点只能作为源节点
        if (targetNode.data.type === 'start') return false;

        // 结束节点只能作为目标节点
        if (sourceNode.data.type === 'end') return false;

        // 一个节点的入口连接数限制
        const targetIncomingEdges = get().edges.filter(edge => edge.target === target);
        if (targetNode.data.type !== 'parallel' && targetIncomingEdges.length >= 1) return false;

        return true;
    },

    onConnect: (connection) => {
        if (!get().validateConnection(connection)) return;

        set((state) => ({
            edges: addEdge(
                {
                    ...connection,
                    id: `edge-${nanoid()}`,
                    type: 'smoothstep',
                    animated: true,
                },
                state.edges
            ),
        }));
    },

    clearCanvas: () => set({
        nodes: initialNodes,
        edges: [],
        selectedNodeId: null
    }),

    importConfig: (config) => {
        if (config.nodes && config.edges) {
            set({
                nodes: config.nodes,
                edges: config.edges,
                selectedNodeId: null
            });
        }
    },

    exportConfig: () => {
        const { nodes, edges } = get();
        return { nodes, edges };
    }
}));