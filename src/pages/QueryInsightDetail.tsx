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
		<div className="space-y-6">
			{/* Header */}
			<InsightHeader insight={insight} onBack={handleBack} />

			{/* Content Grid */}
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
				{/* Left Column - SQL Queries & Recommendations */}
				<div className="space-y-6">
					{/* Unified Query Block with Tabs */}
					<QueryTabsBlock
						originalQuery={insight.original_query}
						optimizedQuery={insight.optimized_query}
					/>

					{/* Recommendations */}
					<RecommendationList
						recommendations={insight.recommendations}
						onRecommendationHover={setActiveRecommendation}
						activeRecommendation={activeRecommendation}
					/>
				</div>

				{/* Right Column - Query Plan Visualization */}
				<div className="space-y-6">
					<QueryPlanVisualization
						queryPlan={insight.query_plan_visualization}
						highlightedNodeIds={highlightedNodeIds}
						highlightedEdgeIds={highlightedEdgeIds}
					/>
				</div>
			</div>
		</div>
	)
}
