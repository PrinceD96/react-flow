import { useEffect, useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  type OnConnect,
  addEdge,
  Panel,
} from '@xyflow/react';
import { RefreshCw } from 'lucide-react';
import { TableNode, OperationNode, ResultNode } from './CustomNodes';
import { 
  planGraphAdapter, 
  applyHighlighting, 
  type FlowNode, 
  type FlowEdge 
} from '../../utils/planGraphAdapter';
import { type QueryPlanVisualization } from '../../types/insight';

interface FlowCanvasProps {
  queryPlan: QueryPlanVisualization;
  highlightedNodeIds: Set<string>;
  highlightedEdgeIds: Set<string>;
  className?: string;
}

const nodeTypes = {
  table: TableNode,
  operation: OperationNode,
  result: ResultNode,
};

export const FlowCanvas = ({ 
  queryPlan, 
  highlightedNodeIds, 
  highlightedEdgeIds, 
  className = "h-96"
}: FlowCanvasProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([]);
  const [isLoading, setIsLoading] = useState(true);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Load and layout the query plan
  const loadQueryPlan = useCallback(async () => {
    if (!queryPlan?.nodes?.length) {
      setNodes([]);
      setEdges([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { nodes: layoutedNodes, edges: layoutedEdges } = await planGraphAdapter(queryPlan);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    } catch (error) {
      console.error('Failed to layout query plan:', error);
      setNodes([]);
      setEdges([]);
    } finally {
      setIsLoading(false);
    }
  }, [queryPlan, setNodes, setEdges]);

  // Initial load
  useEffect(() => {
    loadQueryPlan();
  }, [loadQueryPlan]);

  // Apply highlighting when selection changes
  useEffect(() => {
    if (nodes.length === 0 || edges.length === 0) return;

    const { nodes: highlightedNodes, edges: highlightedEdges } = applyHighlighting(
      nodes,
      edges,
      highlightedNodeIds,
      highlightedEdgeIds
    );

    // Only update if highlighting actually changed
    const hasChanges = highlightedNodes.some((node, index) => 
      JSON.stringify(node.style) !== JSON.stringify(nodes[index]?.style) ||
      node.className !== nodes[index]?.className
    ) || highlightedEdges.some((edge, index) => 
      JSON.stringify(edge.style) !== JSON.stringify(edges[index]?.style) ||
      edge.animated !== edges[index]?.animated
    );

    if (hasChanges) {
      setNodes(highlightedNodes);
      setEdges(highlightedEdges);
    }
  }, [highlightedNodeIds, highlightedEdgeIds, nodes, edges, setNodes, setEdges]);

  if (isLoading) {
    return (
      <div className={`${className} bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <div className="text-sm text-gray-600">Loading query plan...</div>
        </div>
      </div>
    );
  }

  if (!queryPlan?.nodes?.length) {
    return (
      <div className={`${className} bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center`}>
        <div className="text-center text-gray-500">
          <div className="text-lg mb-2">No query plan available</div>
          <div className="text-sm">The query plan visualization is not available for this insight.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} bg-white rounded-lg border border-gray-200 overflow-hidden`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
        }}
        defaultEdgeOptions={{
          type: 'smoothstep',
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#e5e7eb" />
        <Controls 
          showInteractive={false}
          className="bg-white border border-gray-300 rounded-lg shadow-sm"
        />
        <Panel position="top-right" className="m-2">
          <button
            onClick={loadQueryPlan}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200 text-sm font-medium text-gray-700 disabled:opacity-50"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            Reflow Layout
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
};
