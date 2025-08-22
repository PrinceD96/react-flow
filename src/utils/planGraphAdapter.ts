import { type Node, type Edge, type XYPosition } from '@xyflow/react'
import {
	type QueryPlanVisualization,
	type QueryPlanNode,
	type QueryPlanEdge
} from '../types/insight'

// Fallback simple layout that creates a proper left-to-right hierarchical layout
const createLayoutedElements = (
	nodes: QueryPlanNode[],
	edges: QueryPlanEdge[]
): { nodes: FlowNode[]; edges: FlowEdge[] } => {
	// Build graph structure
	const incomingEdges = new Map<string, number>()
	const adjacencyList = new Map<string, string[]>()

	nodes.forEach((node) => {
		incomingEdges.set(node.id, 0)
		adjacencyList.set(node.id, [])
	})

	edges.forEach((edge) => {
		incomingEdges.set(edge.target, (incomingEdges.get(edge.target) || 0) + 1)
		adjacencyList.get(edge.source)?.push(edge.target)
	})

	// Find root nodes (no incoming edges) and assign levels using BFS
	const levels = new Map<string, number>()
	const queue: Array<{ id: string; level: number }> = []
	const visited = new Set<string>()

	nodes.forEach((node) => {
		if ((incomingEdges.get(node.id) || 0) === 0) {
			queue.push({ id: node.id, level: 0 })
		}
	})

	while (queue.length > 0) {
		const { id, level } = queue.shift()!
		if (visited.has(id)) continue

		visited.add(id)
		levels.set(id, level)

		const neighbors = adjacencyList.get(id) || []
		neighbors.forEach((neighborId) => {
			if (!visited.has(neighborId)) {
				queue.push({ id: neighborId, level: level + 1 })
			}
		})
	}

	// Group nodes by level for positioning
	const nodesByLevel = new Map<number, QueryPlanNode[]>()
	nodes.forEach((node) => {
		const level = levels.get(node.id) ?? 0
		if (!nodesByLevel.has(level)) {
			nodesByLevel.set(level, [])
		}
		nodesByLevel.get(level)!.push(node)
	})

	// Position nodes with proper spacing (PRD requirements)
	const layerSpacing = 350 // Space between layers (left-to-right) - increased for better edge separation
	const nodeSpacing = 180 // Space between nodes in same layer (top-to-bottom) - increased for better label separation

	const flowNodes: FlowNode[] = []
	nodesByLevel.forEach((levelNodes, level) => {
		const x = level * layerSpacing

		// Center nodes vertically within their layer
		const totalHeight = (levelNodes.length - 1) * nodeSpacing
		const startY = -totalHeight / 2

		levelNodes.forEach((node, index) => {
			const y = startY + index * nodeSpacing

			flowNodes.push({
				id: node.id,
				type: getFlowNodeType(node.type),
				position: { x, y },
				data: {
					label: node.data.label,
					recommendation_id: node.data.recommendation_id,
					type: node.type
				},
				draggable: true
			})
		})
	})

	// Create edges with offset positioning to prevent overlapping
	const flowEdges: FlowEdge[] = edges.map((edge, index) => {
		// Find the source and target nodes to determine optimal label positioning
		const sourceNode = flowNodes.find((n) => n.id === edge.source)
		const targetNode = flowNodes.find((n) => n.id === edge.target)

		// Calculate position and offset based on edge characteristics
		let labelPosition = 0.5
		let yOffset = 0

		if (sourceNode && targetNode) {
			const sourceY = sourceNode.position.y
			const targetY = targetNode.position.y
			const avgY = (sourceY + targetY) / 2

			// Create vertical offset based on edge position to separate labels
			if (avgY < -50) {
				// Top edges
				yOffset = -15 - index * 8
				labelPosition = 0.3
			} else if (avgY > 50) {
				// Bottom edges
				yOffset = 15 + index * 8
				labelPosition = 0.7
			} else {
				// Middle edges - alternate above and below
				yOffset = index % 2 === 0 ? -12 : 12
				labelPosition = 0.5
			}
		}

		// Special handling for specific problematic edges with more aggressive separation
		if (edge.label?.includes('1.58B') || edge.label?.includes('→')) {
			labelPosition = 0.25
			yOffset = -20 // Move significantly up
		} else if (edge.label?.includes('18M')) {
			labelPosition = 0.75
			yOffset = 20 // Move significantly down
		}

		return {
			id: edge.id,
			source: edge.source,
			target: edge.target,
			type: 'smoothstep',
			animated: false,
			label: edge.label,
			labelShowBg: true,
			labelPosition,
			labelBgStyle: {
				fill: '#ffffff',
				fillOpacity: 0.98,
				stroke: '#d1d5db',
				strokeWidth: 1,
				transform: `translateY(${yOffset}px)` // Apply vertical offset to avoid overlaps
			},
			data: {
				recommendation_id: edge.recommendation_id
			},
			style: {
				strokeWidth: 2,
				stroke: edge.recommendation_id ? '#f59e0b' : '#6b7280'
			},
			labelStyle: {
				fontSize: 10,
				fontWeight: 500,
				color: '#374151',
				transform: `translateY(${yOffset}px)` // Apply same offset to text
			},
			labelBgPadding: [8, 4],
			labelBgBorderRadius: 6
		}
	})

	return { nodes: flowNodes, edges: flowEdges }
}

// React Flow node types
export interface FlowNodeData extends Record<string, unknown> {
	label: string
	recommendation_id?: string
	type: 'tableNode' | 'operationNode' | 'resultNode'
}

export type FlowNode = Node<FlowNodeData>
export type FlowEdge = Edge

// Map schema node types to React Flow node types
function getFlowNodeType(schemaType: string): string {
	switch (schemaType) {
		case 'tableNode':
			return 'table'
		case 'operationNode':
			return 'operation'
		case 'resultNode':
			return 'result'
		default:
			return 'default'
	}
}

export const planGraphAdapter = async (
	planVisualization: QueryPlanVisualization
): Promise<{ nodes: FlowNode[]; edges: FlowEdge[] }> => {
	if (!planVisualization.nodes.length) {
		return { nodes: [], edges: [] }
	}

	// Use the fallback layout algorithm for now (elkjs can be added back later when import issues are resolved)
	return createLayoutedElements(
		planVisualization.nodes,
		planVisualization.edges
	)
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
			opacity:
				highlightedNodeIds.size > 0 && !highlightedNodeIds.has(node.id)
					? 0.4
					: 1,
			borderColor: highlightedNodeIds.has(node.id) ? '#f59e0b' : undefined,
			borderWidth: highlightedNodeIds.has(node.id) ? 2 : undefined
		},
		className: highlightedNodeIds.has(node.id) ? 'highlighted' : undefined
	}))

	const highlightedEdges = edges.map((edge) => ({
		...edge,
		style: {
			...edge.style,
			opacity:
				highlightedEdgeIds.size > 0 && !highlightedEdgeIds.has(edge.id)
					? 0.4
					: 1,
			stroke: highlightedEdgeIds.has(edge.id) ? '#f59e0b' : edge.style?.stroke,
			strokeWidth: highlightedEdgeIds.has(edge.id) ? 3 : edge.style?.strokeWidth
		},
		animated: highlightedEdgeIds.has(edge.id)
	}))

	return { nodes: highlightedNodes, edges: highlightedEdges }
}

// Utility to get node positions for manual layout
export const getNodePositions = (
	nodes: FlowNode[]
): Record<string, XYPosition> => {
	return nodes.reduce((acc, node) => {
		acc[node.id] = node.position
		return acc
	}, {} as Record<string, XYPosition>)
}

// Helper to restore node positions after re-layout
export const restoreNodePositions = (
	nodes: FlowNode[],
	savedPositions: Record<string, XYPosition>
): FlowNode[] => {
	return nodes.map((node) => ({
		...node,
		position: savedPositions[node.id] || node.position
	}))
}
