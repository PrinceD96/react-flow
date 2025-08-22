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
	// Always use gradient-wrapper structure to prevent layout jumps
	const baseWrapper = 'gradient-wrapper'

	if (isHighlighted) {
		// Add node-type-specific gradient classes
		let gradientClass = ''
		switch (nodeType) {
			case 'tableNode':
				gradientClass = 'table-gradient'
				break
			case 'operationNode':
				gradientClass = 'operation-gradient'
				break
			case 'resultNode':
				gradientClass = 'result-gradient'
				break
			default:
				// For default/unknown node types, use table gradient as fallback
				gradientClass = 'table-gradient'
		}
		return `${baseWrapper} selected ${gradientClass}`
	}

	return baseWrapper
}

const getInnerNodeStyles = (nodeType: string, isHighlighted: boolean) => {
	// Always provide the same base styling for consistent layout
	const baseInnerClasses =
		'px-4 py-3 rounded-lg bg-white shadow-lg min-w-[140px] relative flex-grow border-2'

	if (isHighlighted) {
		// Selected nodes: transparent border to maintain same dimensions as unselected
		return `${baseInnerClasses} border-transparent`
	}

	// Unselected nodes: visible type-specific borders
	switch (nodeType) {
		case 'tableNode':
			return `${baseInnerClasses} border-blue-200 hover:border-blue-300 transition-all duration-200 hover:shadow-xl`
		case 'operationNode':
			return `${baseInnerClasses} border-purple-200 hover:border-purple-300 transition-all duration-200 hover:shadow-xl`
		case 'resultNode':
			return `${baseInnerClasses} border-green-200 hover:border-green-300 transition-all duration-200 hover:shadow-xl`
		default:
			return `${baseInnerClasses} border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-xl`
	}
}

const TableNode = memo(({ data, selected }: NodeProps) => {
	const nodeData = data as FlowNodeData
	const isHighlighted = selected

	return (
		<>
			<div className={getNodeStyles(nodeData.type, isHighlighted)}>
				<div className={getInnerNodeStyles(nodeData.type, isHighlighted)}>
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
				<div className={getInnerNodeStyles(nodeData.type, isHighlighted)}>
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
				<div className={getInnerNodeStyles(nodeData.type, isHighlighted)}>
					<div className="flex items-center gap-2">
						{getNodeIcon(nodeData.type)}
						<div className="flex-1">
							<div className="font-medium text-sm text-gray-900 leading-tight">
								{nodeData.label}
							</div>
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
