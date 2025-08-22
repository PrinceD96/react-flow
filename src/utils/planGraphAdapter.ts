import { type Node, type Edge, type XYPosition } from '@xyflow/react';
import { type QueryPlanVisualization, type QueryPlanNode, type QueryPlanEdge } from '../types/insight';

// React Flow node types
export interface FlowNodeData extends Record<string, unknown> {
  label: string;
  recommendation_id?: string;
  type: 'tableNode' | 'operationNode' | 'resultNode';
}

export type FlowNode = Node<FlowNodeData>;
export type FlowEdge = Edge;

const getNodeWidth = (nodeType: string): number => {
  switch (nodeType) {
    case 'tableNode':
      return 180;
    case 'operationNode':
      return 160;
    case 'resultNode':
      return 140;
    default:
      return 150;
  }
};

// Simple layout algorithm that arranges nodes in a left-to-right flow
const createSimpleLayout = (nodes: QueryPlanNode[], edges: QueryPlanEdge[]) => {
  // Create a simple hierarchical layout
  const nodePositions = new Map<string, { x: number; y: number }>();
  const levels = new Map<string, number>();
  const visited = new Set<string>();

  // Build adjacency list
  const adjacencyList = new Map<string, string[]>();
  const incomingEdges = new Map<string, number>();

  nodes.forEach(node => {
    adjacencyList.set(node.id, []);
    incomingEdges.set(node.id, 0);
  });

  edges.forEach(edge => {
    const sources = adjacencyList.get(edge.source) || [];
    sources.push(edge.target);
    adjacencyList.set(edge.source, sources);
    incomingEdges.set(edge.target, (incomingEdges.get(edge.target) || 0) + 1);
  });

  // Find root nodes (nodes with no incoming edges)
  const rootNodes = nodes.filter(node => (incomingEdges.get(node.id) || 0) === 0);

  // Perform BFS to assign levels
  const queue = rootNodes.map(node => ({ id: node.id, level: 0 }));
  
  while (queue.length > 0) {
    const { id, level } = queue.shift()!;
    
    if (visited.has(id)) continue;
    visited.add(id);
    levels.set(id, level);

    const neighbors = adjacencyList.get(id) || [];
    neighbors.forEach(neighborId => {
      if (!visited.has(neighborId)) {
        queue.push({ id: neighborId, level: level + 1 });
      }
    });
  }

  // Assign nodes that weren't reached (isolated nodes)
  nodes.forEach(node => {
    if (!levels.has(node.id)) {
      levels.set(node.id, 0);
    }
  });

  // Group nodes by level
  const nodesByLevel = new Map<number, QueryPlanNode[]>();
  nodes.forEach(node => {
    const level = levels.get(node.id) || 0;
    if (!nodesByLevel.has(level)) {
      nodesByLevel.set(level, []);
    }
    nodesByLevel.get(level)!.push(node);
  });

  // Position nodes
  const levelWidth = 200;
  const nodeHeight = 100;

  nodesByLevel.forEach((levelNodes, level) => {
    const x = level * levelWidth;
    levelNodes.forEach((node, index) => {
      const y = index * nodeHeight;
      nodePositions.set(node.id, { x, y });
    });
  });

  return nodePositions;
};

// React Flow node types  
export interface FlowNodeData extends Record<string, unknown> {
  label: string;
  recommendation_id?: string;
  type: 'tableNode' | 'operationNode' | 'resultNode';
}

export type FlowNode = Node<FlowNodeData>;
export type FlowEdge = Edge;

export const planGraphAdapter = async (
  planVisualization: QueryPlanVisualization
): Promise<{ nodes: FlowNode[]; edges: FlowEdge[] }> => {
  if (!planVisualization.nodes.length) {
    return { nodes: [], edges: [] };
  }

  // Use simple layout algorithm
  const nodePositions = createSimpleLayout(planVisualization.nodes, planVisualization.edges);

  // Convert to React Flow format
  const nodes: FlowNode[] = planVisualization.nodes.map((node) => ({
    id: node.id,
    type: getFlowNodeType(node.type),
    position: nodePositions.get(node.id) || { x: 0, y: 0 },
    data: {
      label: node.data.label,
      recommendation_id: node.data.recommendation_id,
      type: node.type,
    },
    draggable: true,
  }));

  const edges: FlowEdge[] = planVisualization.edges.map((edge: QueryPlanEdge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: 'smoothstep',
    animated: false,
    label: edge.label,
    data: {
      recommendation_id: edge.recommendation_id,
    },
    style: {
      strokeWidth: 2,
      stroke: edge.recommendation_id ? '#f59e0b' : '#6b7280',
    },
    labelStyle: {
      fontSize: 12,
      fontWeight: 500,
    },
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 4,
    labelBgStyle: {
      fill: '#ffffff',
      fillOpacity: 0.9,
      stroke: '#e5e7eb',
    },
  }));

  return { nodes, edges };
};

// Map schema node types to React Flow node types
function getFlowNodeType(schemaType: string): string {
  switch (schemaType) {
    case 'tableNode':
      return 'table';
    case 'operationNode':
      return 'operation';
    case 'resultNode':
      return 'result';
    default:
      return 'default';
  }
}

// Utility to apply highlighting styles
export const applyHighlighting = (
  nodes: FlowNode[],
  edges: FlowEdge[],
  highlightedNodeIds: Set<string>,
  highlightedEdgeIds: Set<string>
): { nodes: FlowNode[]; edges: FlowEdge[] } => {
  const highlightedNodes = nodes.map((node) => ({
    ...node,
    style: {
      ...node.style,
      opacity: highlightedNodeIds.size > 0 && !highlightedNodeIds.has(node.id) ? 0.4 : 1,
      borderColor: highlightedNodeIds.has(node.id) ? '#f59e0b' : undefined,
      borderWidth: highlightedNodeIds.has(node.id) ? 2 : undefined,
    },
    className: highlightedNodeIds.has(node.id) ? 'highlighted' : undefined,
  }));

  const highlightedEdges = edges.map((edge) => ({
    ...edge,
    style: {
      ...edge.style,
      opacity: highlightedEdgeIds.size > 0 && !highlightedEdgeIds.has(edge.id) ? 0.4 : 1,
      stroke: highlightedEdgeIds.has(edge.id) ? '#f59e0b' : edge.style?.stroke,
      strokeWidth: highlightedEdgeIds.has(edge.id) ? 3 : edge.style?.strokeWidth,
    },
    animated: highlightedEdgeIds.has(edge.id),
  }));

  return { nodes: highlightedNodes, edges: highlightedEdges };
};

// Utility to get node positions for manual layout
export const getNodePositions = (nodes: FlowNode[]): Record<string, XYPosition> => {
  return nodes.reduce((acc, node) => {
    acc[node.id] = node.position;
    return acc;
  }, {} as Record<string, XYPosition>);
};

// Helper to restore node positions after re-layout
export const restoreNodePositions = (
  nodes: FlowNode[],
  savedPositions: Record<string, XYPosition>
): FlowNode[] => {
  return nodes.map((node) => ({
    ...node,
    position: savedPositions[node.id] || node.position,
  }));
};
