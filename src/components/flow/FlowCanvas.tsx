import { useEffect, useState, useCallback } from 'react'
import {
	ReactFlow,
	Controls,
	Background,
	BackgroundVariant,
	useNodesState,
	useEdgesState,
	type OnConnect,
	addEdge,
	ControlButton
} from '@xyflow/react'
import { Eye, EyeOff } from 'lucide-react'
import { TableNode, OperationNode, ResultNode } from './CustomNodes'
import {
	planGraphAdapter,
	type FlowNode,
	type FlowEdge
} from '../../utils/planGraphAdapter'
import { type QueryPlanVisualization } from '../../types/insight'

interface FlowCanvasProps {
	queryPlan: QueryPlanVisualization
	highlightedNodeIds: Set<string>
	highlightedEdgeIds: Set<string>
	className?: string
	onTogglePanel?: () => void
	isPanelOpen?: boolean
}

const nodeTypes = {
	table: TableNode,
	operation: OperationNode,
	result: ResultNode
}

export const FlowCanvas = ({
	queryPlan,
	highlightedNodeIds,
	highlightedEdgeIds,
	className = 'h-96',
	onTogglePanel,
	isPanelOpen = true
}: FlowCanvasProps) => {
	const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>([])
	const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([])
	const [isLoading, setIsLoading] = useState(true)

	const onConnect: OnConnect = useCallback(
		(params) => setEdges((eds) => addEdge(params, eds)),
		[setEdges]
	)

	// Load and layout the query plan
	const loadQueryPlan = useCallback(async () => {
		if (!queryPlan?.nodes?.length) {
			setNodes([])
			setEdges([])
			setIsLoading(false)
			return
		}

		setIsLoading(true)
		try {
			const { nodes: layoutedNodes, edges: layoutedEdges } =
				await planGraphAdapter(queryPlan)
			setNodes(layoutedNodes)
			setEdges(layoutedEdges)
		} catch (error) {
			console.error('Failed to layout query plan:', error)
			setNodes([])
			setEdges([])
		} finally {
			setIsLoading(false)
		}
	}, [queryPlan, setNodes, setEdges])

	// Initial load
	useEffect(() => {
		loadQueryPlan()
	}, [loadQueryPlan])

	// Apply highlighting when selection changes
	useEffect(() => {
		if (nodes.length === 0) return

		// Only update nodes if there are highlighted nodes to show
		// Don't interfere with React Flow's built-in selection system
		if (highlightedNodeIds.size === 0) return

		// Use React Flow's built-in selection for nodes, but add custom data for highlighting
		const updatedNodes = nodes.map((node) => ({
			...node,
			data: {
				...node.data,
				isHighlighted: highlightedNodeIds.has(node.id)
			}
			// Don't override the 'selected' property - let React Flow manage it
		}))

		// Check if highlighting actually changed to avoid unnecessary updates
		const hasNodeChanges = updatedNodes.some(
			(node, index) =>
				node.data.isHighlighted !== nodes[index]?.data.isHighlighted
		)

		if (hasNodeChanges) {
			setNodes(updatedNodes)
		}
	}, [highlightedNodeIds, nodes, setNodes])

	// Apply edge highlighting when selection changes
	useEffect(() => {
		if (edges.length === 0) return

		// Apply custom highlighting to edges
		const updatedEdges = edges.map((edge) => ({
			...edge,
			style: {
				...edge.style,
				opacity:
					highlightedEdgeIds.size > 0 && !highlightedEdgeIds.has(edge.id)
						? 0.4
						: 1,
				stroke: highlightedEdgeIds.has(edge.id)
					? '#f59e0b'
					: edge.style?.stroke,
				strokeWidth: highlightedEdgeIds.has(edge.id)
					? 3
					: edge.style?.strokeWidth
			},
			animated: highlightedEdgeIds.has(edge.id)
		}))

		// Check if edge styles actually changed to avoid unnecessary updates
		const hasEdgeChanges = updatedEdges.some(
			(edge, index) =>
				JSON.stringify(edge.style) !== JSON.stringify(edges[index]?.style) ||
				edge.animated !== edges[index]?.animated
		)

		if (hasEdgeChanges) {
			setEdges(updatedEdges)
		}
	}, [highlightedEdgeIds, edges, setEdges])

	if (isLoading) {
		return (
			<div
				className={`${className} bg-gray-50 flex items-center justify-center`}
			>
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
					<div className="text-sm text-gray-600">Loading query plan...</div>
				</div>
			</div>
		)
	}

	if (!queryPlan?.nodes?.length) {
		return (
			<div
				className={`${className} bg-gray-50 flex items-center justify-center`}
			>
				<div className="text-center text-gray-500">
					<div className="text-lg mb-2">No query plan available</div>
					<div className="text-sm">
						The query plan visualization is not available for this insight.
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className={`${className}`} style={{ width: '100%', height: '100%' }}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				nodeTypes={nodeTypes}
				fitView
				fitViewOptions={{
					padding: 0.3,
					includeHiddenNodes: false
				}}
				defaultEdgeOptions={{
					type: 'smoothstep'
				}}
				proOptions={{ hideAttribution: true }}
			>
				<Background
					variant={BackgroundVariant.Dots}
					gap={16}
					size={1}
					color="#e5e7eb"
				/>
				<Controls
					position="bottom-center"
					orientation="horizontal"
					showInteractive={false}
					className="bg-white border border-gray-300 rounded-lg shadow-sm"
				>
					{onTogglePanel && (
						<ControlButton
							onClick={onTogglePanel}
							title={isPanelOpen ? 'Hide details panel' : 'Show details panel'}
							aria-label={
								isPanelOpen ? 'Hide details panel' : 'Show details panel'
							}
						>
							{isPanelOpen ? <EyeOff size={16} /> : <Eye size={16} />}
						</ControlButton>
					)}
				</Controls>
			</ReactFlow>
		</div>
	)
}
