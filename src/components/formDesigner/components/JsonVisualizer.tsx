import React, { useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  NodeProps,
  Handle,
  Position,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

const JsonNode: React.FC<NodeProps> = ({ data }) => {
  const getNodeStyle = () => {
    switch (data.type) {
      case 'root':
        return 'bg-blue-50 border-blue-200';
      case 'array':
        return 'bg-purple-50 border-purple-200';
      case 'object':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`px-4 py-2 shadow-md rounded-lg border-2 ${getNodeStyle()}`}>
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      <div className="flex flex-col gap-1">
        <div className="text-sm font-semibold text-gray-700">{data.label}</div>
        {data.value && (
          <div className="text-xs bg-white px-2 py-1 rounded text-gray-600">
            {data.value}
          </div>
        )}
        {data.type && (
          <div className="text-xs text-gray-500 italic">
            {data.type}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />
    </div>
  );
};

const JsonVisualizer: React.FC<{ data: any[] }> = ({ data }) => {
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let nodeId = 0;

    // 添加根节点
    const rootId = 'root';
    nodes.push({
      id: rootId,
      type: 'jsonNode',
      position: { x: 400, y: 0 },
      data: {
        label: 'Form Components',
        type: 'root',
        value: `${data.length} components`
      },
    });

    // 处理每个组件
    data.forEach((component, index) => {
      const componentId = `component-${nodeId++}`;
      const xOffset = (index - (data.length - 1) / 2) * 300;

      // 添加组件节点
      nodes.push({
        id: componentId,
        type: 'jsonNode',
        position: { x: xOffset + 400, y: 150 },
        data: {
          label: component.type,
          type: 'component',
          value: component.id
        },
      });

      // 连接到根节点
      edges.push({
        id: `edge-${rootId}-${componentId}`,
        source: rootId,
        target: componentId,
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#94a3b8' },
      });

      // 处理组件的属性
      const propsId = `props-${nodeId++}`;
      nodes.push({
        id: propsId,
        type: 'jsonNode',
        position: { x: xOffset + 400, y: 300 },
        data: {
          label: 'props',
          type: 'object',
          value: Object.keys(component.props).length + ' properties'
        },
      });

      edges.push({
        id: `edge-${componentId}-${propsId}`,
        source: componentId,
        target: propsId,
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#94a3b8' },
      });
    });

    return { nodes, edges };
  }, [data]);

  return (
    <div style={{ height: '80vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={{ jsonNode: JsonNode }}
        fitView
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
        }}
        minZoom={0.2}
        maxZoom={1.5}
      >
        <Background color="#94a3b8" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default JsonVisualizer;