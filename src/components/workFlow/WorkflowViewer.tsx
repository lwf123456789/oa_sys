import React from 'react';
import { Card, Steps, Timeline, Tag, Avatar } from 'antd';
import dayjs from 'dayjs';
import DynamicForm from '../form/DynamicForm';
import {
    FlagOutlined,
    AuditOutlined,
    BranchesOutlined,
    SendOutlined,
    FileTextOutlined,
    UserOutlined,
    CheckCircleFilled,
    CloseCircleFilled,
    ClockCircleFilled,
    MinusCircleFilled,
    ApartmentOutlined
} from '@ant-design/icons';

interface WorkflowViewerProps {
    nodes: any[];
    edges: any[];  // 添加 edges 参数
    currentNodeId: string;
    formConfig: any[];
    formData: any;
    taskRecords: any[];
}

const WorkflowViewer: React.FC<WorkflowViewerProps> = ({
    nodes,
    edges,
    currentNodeId,
    formConfig,
    formData,
    taskRecords
}) => {
    // 根据 edges 构建有序节点数组
    const orderedNodes = React.useMemo(() => {
        // 构建节点连接关系图
        const nodeMap = new Map(nodes.map(node => [node.id, node]));
        const incomingEdges = new Map<string, string[]>();
        const outgoingEdges = new Map<string, string[]>();

        // 初始化入边和出边映射
        edges.forEach(edge => {
            if (!outgoingEdges.has(edge.source)) {
                outgoingEdges.set(edge.source, []);
            }
            outgoingEdges.get(edge.source)?.push(edge.target);

            if (!incomingEdges.has(edge.target)) {
                incomingEdges.set(edge.target, []);
            }
            incomingEdges.get(edge.target)?.push(edge.source);
        });

        // 找到开始节点（没有入边的节点）
        const startNode = nodes.find(node =>
            node.data.type === 'start' || !incomingEdges.has(node.id)
        );
        if (!startNode) return nodes;

        const ordered: any[] = [];
        const visited = new Set<string>();

        // 深度优先搜索遍历节点
        const dfs = (nodeId: string) => {
            if (visited.has(nodeId)) return;
            visited.add(nodeId);

            const node = nodeMap.get(nodeId);
            if (node) {
                ordered.push(node);
            }

            // 获取所有出边对应的目标节点
            const nextNodes = outgoingEdges.get(nodeId) || [];
            nextNodes.forEach(nextId => {
                if (!visited.has(nextId)) {
                    dfs(nextId);
                }
            });
        };

        // 从开始节点开始遍历
        dfs(startNode.id);

        return ordered;
    }, [nodes, edges]);

    // 获取节点状态
    const getNodeStatus = (nodeId: string) => {
        if (nodeId === currentNodeId) return 'process';

        const nodeIndex = orderedNodes.findIndex(n => n.id === nodeId);
        const currentIndex = orderedNodes.findIndex(n => n.id === currentNodeId);

        const record = taskRecords?.find(r => r.node_id === nodeId);

        if (record?.action === 'approve' || record?.action === 'start') return 'finish';
        if (record?.action === 'reject') return 'error';
        if (nodeIndex < currentIndex) return 'finish';

        return 'wait';
    };

    return (
        <div className="p-6 min-h-full bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-3 gap-6">
                    {/* 左侧表单 */}
                    <div className="col-span-1">
                        <Card
                            title={
                                <div className="flex items-center space-x-2">
                                    <FileTextOutlined className="text-blue-500" />
                                    <span>申请详情</span>
                                </div>
                            }
                            className="shadow-sm"
                        >
                            <DynamicForm
                                config={formConfig}
                                initialValues={formData}
                                disabled={true}
                            />
                        </Card>
                    </div>

                    {/* 右侧流程 */}
                    <div className="col-span-2">
                        <Card className="shadow-sm">
                            <Steps
                                direction="vertical"
                                current={orderedNodes.findIndex(node => node.id === currentNodeId)}
                                className="px-4"
                                items={orderedNodes.map(node => ({
                                    title: (
                                        <div className="flex items-center space-x-2">
                                            {getNodeIcon(node.data.type)}
                                            <span>{node.data.label}</span>
                                            {node.data.description && (
                                                <Tag color={getNodeTypeColor(node.data.type)}>
                                                    {node.data.description}
                                                </Tag>
                                            )}
                                        </div>
                                    ),
                                    description: renderNodeDescription(node, taskRecords),
                                    status: getNodeStatus(node.id)
                                }))}
                            />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 获取节点图标
const getNodeIcon = (type: string) => {
    switch (type) {
        case 'start':
            return <FlagOutlined style={{ color: '#1890ff' }} />;
        case 'end':
            return <FlagOutlined style={{ color: '#52c41a' }} />;
        case 'approval':
            return <AuditOutlined style={{ color: '#722ed1' }} />;
        case 'condition':
            return <BranchesOutlined style={{ color: '#fa8c16' }} />;
        case 'cc':
            return <SendOutlined style={{ color: '#13c2c2' }} />;
        case 'form':
            return <FileTextOutlined style={{ color: '#1890ff' }} />;
        default:
            return <ApartmentOutlined style={{ color: '#8c8c8c' }} />;
    }
};

// 获取时间线节点图标
const getTimelineDot = (action: string) => {
    switch (action) {
        case 'approve':
            return <CheckCircleFilled style={{ color: '#52c41a' }} />;
        case 'reject':
            return <CloseCircleFilled style={{ color: '#f5222d' }} />;
        case 'start':
            return <CheckCircleFilled style={{ color: '#1890ff' }} />;
        case 'complete':
            return <CheckCircleFilled style={{ color: '#52c41a' }} />;
        case 'pending':
            return <ClockCircleFilled style={{ color: '#1890ff' }} />;
        default:
            return <MinusCircleFilled style={{ color: '#8c8c8c' }} />;
    }
};

// 获取操作状态对应的颜色
const getActionColor = (action: string): string => {
    switch (action) {
        case 'approve':
            return 'success';
        case 'reject':
            return 'error';
        case 'start':
            return 'blue';
        case 'complete':
            return 'success';
        case 'pending':
            return 'processing';
        case 'cc':
            return 'cyan';
        default:
            return 'default';
    }
};

// 获取操作状态对应的文本
const getActionText = (action: string): string => {
    switch (action) {
        case 'approve':
            return '同意';
        case 'reject':
            return '拒绝';
        case 'start':
            return '发起';
        case 'complete':
            return '完成';
        case 'pending':
            return '处理中';
        case 'cc':
            return '已抄送';
        case '':
            return '待处理';
        default:
            return action || '未知状态';
    }
};

// 辅助函数：获取节点类型对应的颜色
const getNodeTypeColor = (type: string) => {
    switch (type) {
        case 'start': return 'blue';
        case 'end': return 'green';
        case 'approval': return 'purple';
        case 'condition': return 'orange';
        default: return 'default';
    }
};

// 辅助函数：渲染节点描述
const renderNodeDescription = (node: any, taskRecords: any[]) => {
    const nodeRecords = taskRecords?.filter(record => record.node_id === node.id);

    return (
        <div className="mt-2">
            {nodeRecords?.length > 0 && (
                <Timeline className="border-l pl-4 mt-2">
                    {nodeRecords.map((record, index) => (
                        <Timeline.Item
                            key={index}
                            dot={getTimelineDot(record.action)}
                        >
                            <div className="flex items-start space-x-3">
                                <Avatar size="small" icon={<UserOutlined />} />
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium">
                                            {record.assignee?.name || '未知用户'}
                                        </span>
                                        <Tag color={getActionColor(record.action)}>
                                            {getActionText(record.action)}
                                        </Tag>
                                    </div>
                                    {record.comment && (
                                        <div className="text-sm text-gray-500 mt-1">
                                            {record.comment}
                                        </div>
                                    )}
                                    <div className="text-xs text-gray-400 mt-1">
                                        {dayjs(record.created_at).format('YYYY-MM-DD HH:mm:ss')}
                                    </div>
                                </div>
                            </div>
                        </Timeline.Item>
                    ))}
                </Timeline>
            )}
        </div>
    );
};

export default WorkflowViewer;