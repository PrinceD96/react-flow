import { useParams, useHistory } from 'react-router-dom'
import {
	useInsightDetail,
	useHighlightRecommendations
} from '../hooks/useInsights'
import { RecommendationList } from '../components/insights/RecommendationList'
import { InsightHeader } from '../components/insights/InsightHeader'
import { QueryTabsBlock } from '../components/insights/QueryTabsBlock'
import { QueryPlanVisualization } from '../components/insights/QueryPlanVisualization'
import { InsightDetailLoading } from '../components/insights/InsightDetailLoading'
import { InsightDetailError } from '../components/insights/InsightDetailError'

interface QueryInsightDetailParams {
	id: string
}

export const QueryInsightDetail = () => {
	const { id } = useParams<QueryInsightDetailParams>()
	const history = useHistory()

	console.log('QueryInsightDetail mounted with id:', id)

	const { insight, loading, error } = useInsightDetail(id)
	const {
		highlightedNodeIds,
		highlightedEdgeIds,
		setActiveRecommendation,
		activeRecommendation
	} = useHighlightRecommendations(insight)

	const handleBack = () => {
		history.push('/insights')
	}

	if (loading) {
		return <InsightDetailLoading />
	}

	if (error || !insight) {
		return <InsightDetailError error={error} onBack={handleBack} />
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<InsightHeader insight={insight} onBack={handleBack} />

			{/* Top Section - SQL Queries in a horizontal layout */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<QueryTabsBlock
					originalQuery={insight.original_query}
					optimizedQuery={insight.optimized_query}
				/>
			</div>

			{/* Middle Section - Full Width Query Plan Visualization */}
			<div className="w-full">
				<QueryPlanVisualization
					queryPlan={insight.query_plan_visualization}
					highlightedNodeIds={highlightedNodeIds}
					highlightedEdgeIds={highlightedEdgeIds}
				/>
			</div>

			{/* Bottom Section - Recommendations */}
			<div className="max-w-4xl">
				<RecommendationList
					recommendations={insight.recommendations}
					onRecommendationHover={setActiveRecommendation}
					activeRecommendation={activeRecommendation}
				/>
			</div>
		</div>
	)
}
