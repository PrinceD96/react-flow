import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Database, Settings, Target } from 'lucide-react'
import { type FlowNodeData } from '../../utils/planGraphAdapter'

const getNodeIcon = (nodeType: string) => {
	switch (nodeType) {
		case 'tableNode':
			return <Database size={16} className="text-blue-600" />
		case 'operationNode':
			return <Settings size={16} className="text-purple-600" />
		case 'resultNode':
			return <Target size={16} className="text-green-600" />
		default:
			return <Settings size={16} className="text-gray-600" />
	}
}

const getNodeStyles = (nodeType: string, isHighlighted: boolean) => {
	const baseClasses =
		'px-4 py-3 rounded-lg border-2 bg-white shadow-lg transition-all duration-200 hover:shadow-xl min-w-[140px]'

	if (isHighlighted) {
		return `${baseClasses} border-orange-400 bg-orange-50 ring-2 ring-orange-200`
	}

	switch (nodeType) {
		case 'tableNode':
			return `${baseClasses} border-blue-200 hover:border-blue-300`
		case 'operationNode':
			return `${baseClasses} border-purple-200 hover:border-purple-300`
		case 'resultNode':
			return `${baseClasses} border-green-200 hover:border-green-300`
		default:
			return `${baseClasses} border-gray-200 hover:border-gray-300`
	}
}

const TableNode = memo(({ data, selected }: NodeProps) => {
	const nodeData = data as FlowNodeData
	// Use React Flow's built-in selection system for clean highlighting
	const isHighlighted = selected

	return (
		<>
			<div className={getNodeStyles(nodeData.type, isHighlighted)}>
				<div className="flex items-center gap-2">
					{getNodeIcon(nodeData.type)}
					<div className="flex-1">
						<div className="font-medium text-sm text-gray-900 leading-tight">
							{nodeData.label}
						</div>
						{nodeData.recommendation_id && (
							<div className="text-xs text-orange-600 mt-1 font-medium">
								Optimization Available
							</div>
						)}
					</div>
				</div>
			</div>
			<Handle
				type="target"
				position={Position.Left}
				className="w-2 h-2 bg-blue-500 border-2 border-white"
			/>
			<Handle
				type="source"
				position={Position.Right}
				className="w-2 h-2 bg-blue-500 border-2 border-white"
			/>
		</>
	)
})

const OperationNode = memo(({ data, selected }: NodeProps) => {
	const nodeData = data as FlowNodeData
	const isHighlighted = selected

	return (
		<>
			<div className={getNodeStyles(nodeData.type, isHighlighted)}>
				<div className="flex items-center gap-2">
					{getNodeIcon(nodeData.type)}
					<div className="flex-1">
						<div className="font-medium text-sm text-gray-900 leading-tight">
							{nodeData.label}
						</div>
						{nodeData.recommendation_id && (
							<div className="text-xs text-orange-600 mt-1 font-medium">
								Recommended Change
							</div>
						)}
					</div>
				</div>
			</div>
			<Handle
				type="target"
				position={Position.Left}
				className="w-2 h-2 bg-purple-500 border-2 border-white"
			/>
			<Handle
				type="source"
				position={Position.Right}
				className="w-2 h-2 bg-purple-500 border-2 border-white"
			/>
		</>
	)
})

const ResultNode = memo(({ data, selected }: NodeProps) => {
	const nodeData = data as FlowNodeData
	const isHighlighted = selected

	return (
		<>
			<div className={getNodeStyles(nodeData.type, isHighlighted)}>
				<div className="flex items-center gap-2">
					{getNodeIcon(nodeData.type)}
					<div className="flex-1">
						<div className="font-medium text-sm text-gray-900 leading-tight">
							{nodeData.label}
						</div>
					</div>
				</div>
			</div>
			<Handle
				type="target"
				position={Position.Left}
				className="w-2 h-2 bg-green-500 border-2 border-white"
			/>
		</>
	)
})

TableNode.displayName = 'TableNode'
OperationNode.displayName = 'OperationNode'
ResultNode.displayName = 'ResultNode'

export { TableNode, OperationNode, ResultNode }
