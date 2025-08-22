import { useParams, useHistory } from 'react-router-dom'
import { useState } from 'react'
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
import { Info, Code, Lightbulb } from 'lucide-react'

interface QueryInsightDetailParams {
	id: string
}

type TabType = 'overview' | 'queries' | 'recommendations'

export const QueryInsightDetail = () => {
	const { id } = useParams<QueryInsightDetailParams>()
	const history = useHistory()
	const [activeTab, setActiveTab] = useState<TabType>('overview')

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
		<div
			className="fixed top-16 right-0 bottom-0 z-40 bg-gray-50 border-l border-gray-200"
			style={{ left: 'var(--sidebar-width)' }}
		>
			{/* Top Section - Query Plan Visualization (55% of remaining viewport height) - Edge to Edge */}
			<div className="absolute top-0 left-0 right-0 h-[55%] z-0 transition-all duration-300 ease-in-out">
				<QueryPlanVisualization
					queryPlan={insight.query_plan_visualization}
					highlightedNodeIds={highlightedNodeIds}
					highlightedEdgeIds={highlightedEdgeIds}
				/>
			</div>

			{/* Bottom Section - Dock Panel (45% of remaining viewport height) - Positioned below the fixed visualization */}
			<div className="absolute bottom-0 left-0 right-0 h-[45%] bg-gray-50 border-t border-gray-200 overflow-hidden transition-all duration-300 ease-in-out z-10">
				<div className="h-full flex flex-col">
					{/* Tab Navigation */}
					<div className="flex-shrink-0 bg-white border-b border-gray-200">
						<div className="px-6">
							<div className="flex items-center justify-between">
								<nav className="flex space-x-8" aria-label="Tabs">
									<button
										onClick={() => setActiveTab('overview')}
										className={`py-4 px-1 border-b-2 font-medium text-sm ${
											activeTab === 'overview'
												? 'border-orange-500 text-orange-600'
												: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
										}`}
									>
										<div className="flex items-center gap-2">
											<Info size={16} />
											Overview
										</div>
									</button>
									<button
										onClick={() => setActiveTab('queries')}
										className={`py-4 px-1 border-b-2 font-medium text-sm ${
											activeTab === 'queries'
												? 'border-orange-500 text-orange-600'
												: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
										}`}
									>
										<div className="flex items-center gap-2">
											<Code size={16} />
											SQL Queries
										</div>
									</button>
									<button
										onClick={() => setActiveTab('recommendations')}
										className={`py-4 px-1 border-b-2 font-medium text-sm ${
											activeTab === 'recommendations'
												? 'border-orange-500 text-orange-600'
												: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
										}`}
									>
										<div className="flex items-center gap-2">
											<Lightbulb size={16} />
											Recommendations ({insight.recommendations.length})
										</div>
									</button>
								</nav>
							</div>
						</div>
					</div>

					{/* Tab Content */}
					<div className="flex-1 overflow-y-auto">
						<div className="p-6">
							{activeTab === 'overview' && (
								<div className="max-w-4xl">
									<InsightHeader insight={insight} />
								</div>
							)}

							{activeTab === 'queries' && (
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
									<QueryTabsBlock
										originalQuery={insight.original_query}
										optimizedQuery={insight.optimized_query}
									/>
								</div>
							)}

							{activeTab === 'recommendations' && (
								<div className="max-w-4xl">
									<RecommendationList
										recommendations={insight.recommendations}
										onRecommendationHover={setActiveRecommendation}
										activeRecommendation={activeRecommendation}
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
