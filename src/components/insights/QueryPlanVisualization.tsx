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
		<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
			<div className="px-6 py-4 border-b border-gray-200">
				<h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
					<Tag size={20} className="text-purple-600" />
					Query Plan Visualization
				</h2>
				<p className="text-sm text-gray-600 mt-1">
					Interactive visualization showing the query execution plan
				</p>
			</div>
			<div className="p-6">
				{queryPlan ? (
					<FlowCanvas
						queryPlan={queryPlan}
						highlightedNodeIds={highlightedNodeIds}
						highlightedEdgeIds={highlightedEdgeIds}
						className="h-[650px]"
					/>
				) : (
					<div className="h-[500px] flex items-center justify-center text-gray-500">
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
		</div>
	)
}
