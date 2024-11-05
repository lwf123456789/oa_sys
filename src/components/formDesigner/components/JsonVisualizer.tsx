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

const JsonVisualizer: React.FC<{ data: any }> = ({ data }) => {
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let nodeId = 0;

    const processObject = (obj: any, parentId?: string, key?: string, level = 0): string => {
      const currentId = `node-${nodeId++}`;
      const isArray = Array.isArray(obj);
      const isObject = typeof obj === 'object' && obj !== null;
      
      nodes.push({
        id: currentId,
        type: 'jsonNode',
        position: { x: nodeId * 250, y: level * 150 },
        data: {
          label: key || 'Root',
          type: isArray ? 'array' : (isObject ? 'object' : 'value'),
          value: isArray ? `${obj.length} items` : (!isObject ? String(obj) : undefined),
        },
      });

      if (parentId) {
        edges.push({
          id: `edge-${parentId}-${currentId}`,
          source: parentId,
          target: currentId,
          type: 'smoothstep',
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: '#94a3b8' },
        });
      }

      if (isObject) {
        Object.entries(obj).forEach(([k, v], index) => {
          processObject(v, currentId, k, level + 1);
        });
      }

      return currentId;
    };

    processObject(data);
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