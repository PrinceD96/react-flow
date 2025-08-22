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
import { Info, Code, Play, X } from 'lucide-react'

interface QueryInsightDetailParams {
	id: string
}

type TabType = 'overview' | 'queries' | 'recommendations'

export const QueryInsightDetail = () => {
	const { id } = useParams<QueryInsightDetailParams>()
	const history = useHistory()
	const [activeTab, setActiveTab] = useState<TabType>('overview')
	const [isPanelOpen, setIsPanelOpen] = useState(true)

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
			{/* Main Content Area - Query Plan Visualization */}
			<div className="h-full relative">
				<QueryPlanVisualization
					queryPlan={insight.query_plan_visualization}
					highlightedNodeIds={highlightedNodeIds}
					highlightedEdgeIds={highlightedEdgeIds}
					onTogglePanel={() => setIsPanelOpen(!isPanelOpen)}
					isPanelOpen={isPanelOpen}
				/>

				{/* Right Sliding Panel */}
				<div
					className={`fixed top-20 right-4 bottom-4 w-96 bg-white rounded-xl border border-gray-200 shadow-2xl transform transition-all duration-300 ease-in-out z-40 ${
						isPanelOpen
							? 'translate-x-0 opacity-100 visible'
							: 'translate-x-[calc(100%+2rem)] opacity-0 invisible'
					}`}
				>
					<div className="h-full flex flex-col rounded-xl overflow-hidden">
						{/* Panel Header with Close Button */}
						<div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 rounded-t-xl">
							<div className="flex items-center justify-between">
								<h2 className="text-lg font-semibold text-gray-900">
									Insight Details
								</h2>
								<button
									onClick={() => setIsPanelOpen(false)}
									className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
								>
									<X size={20} />
								</button>
							</div>
						</div>

						{/* Tab Navigation */}
						<div className="flex-shrink-0 bg-white border-b border-gray-200">
							<nav className="flex px-4" aria-label="Tabs">
								<button
									onClick={() => setActiveTab('overview')}
									className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors flex-1 ${
										activeTab === 'overview'
											? 'border-blue-500 text-blue-600'
											: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
									}`}
								>
									<div className="flex items-center justify-center gap-2">
										<Info size={16} />
										Overview
									</div>
								</button>
								<button
									onClick={() => setActiveTab('queries')}
									className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors flex-1 ${
										activeTab === 'queries'
											? 'border-blue-500 text-blue-600'
											: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
									}`}
								>
									<div className="flex items-center justify-center gap-2">
										<Code size={16} />
										Queries
									</div>
								</button>
								<button
									onClick={() => setActiveTab('recommendations')}
									className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors flex-1 ${
										activeTab === 'recommendations'
											? 'border-blue-500 text-blue-600'
											: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
									}`}
								>
									<div className="flex items-center justify-center gap-2">
										<Play size={16} />
										Actions
									</div>
								</button>
							</nav>
						</div>

						{/* Tab Content - Scrollable */}
						<div className="flex-1 overflow-y-auto bg-gray-50 rounded-b-xl">
							{activeTab === 'overview' && (
								<div className="p-4">
									<InsightHeader insight={insight} />
								</div>
							)}

							{activeTab === 'queries' && (
								<QueryTabsBlock
									originalQuery={insight.original_query}
									optimizedQuery={insight.optimized_query}
								/>
							)}

							{activeTab === 'recommendations' && (
								<div className="p-4">
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
