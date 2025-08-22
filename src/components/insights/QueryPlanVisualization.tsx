import { Tag } from 'lucide-react'
import { FlowCanvas } from '../flow/FlowCanvas'
import { type QueryPlanVisualization as QueryPlanVisualizationType } from '../../types/insight'

interface QueryPlanVisualizationProps {
	queryPlan?: QueryPlanVisualizationType
	highlightedNodeIds: Set<string>
	highlightedEdgeIds: Set<string>
}

export const QueryPlanVisualization = ({
	queryPlan,
	highlightedNodeIds,
	highlightedEdgeIds
}: QueryPlanVisualizationProps) => {
	return (
		<div className="h-full w-full">
			{queryPlan ? (
				<FlowCanvas
					queryPlan={queryPlan}
					highlightedNodeIds={highlightedNodeIds}
					highlightedEdgeIds={highlightedEdgeIds}
					className="h-full w-full"
				/>
			) : (
				<div className="h-full flex items-center justify-center text-gray-500 bg-gray-50">
					<div className="text-center">
						<Tag size={48} className="mx-auto mb-4 text-gray-300" />
						<div className="text-lg font-medium text-gray-900 mb-2">
							No visualization available
						</div>
						<div className="text-sm">
							Query plan visualization is not available for this insight.
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
