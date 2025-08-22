import { memo } from 'react'
import { Lightbulb, TrendingUp, AlertCircle } from 'lucide-react'
import { type Recommendation, type EvidenceSource } from '../../types/insight'

interface RecommendationListProps {
	recommendations: Recommendation[]
	onRecommendationHover: (recommendationId: string | null) => void
	activeRecommendation: string | null
}

const getEvidenceIcon = (source: EvidenceSource) => {
	switch (source) {
		case 'SNOWFLAKE_BEST_PRACTICE':
			return <Lightbulb size={16} className="text-yellow-600" />
		case 'PERFORMANCE_ANALYSIS':
			return <TrendingUp size={16} className="text-blue-600" />
		case 'COST_ANALYSIS':
			return <AlertCircle size={16} className="text-red-600" />
		default:
			return <Lightbulb size={16} className="text-gray-600" />
	}
}

const getEvidenceColor = (source: EvidenceSource) => {
	switch (source) {
		case 'SNOWFLAKE_BEST_PRACTICE':
			return 'bg-yellow-50 border-yellow-200 text-yellow-800'
		case 'PERFORMANCE_ANALYSIS':
			return 'bg-blue-50 border-blue-200 text-blue-800'
		case 'COST_ANALYSIS':
			return 'bg-red-50 border-red-200 text-red-800'
		default:
			return 'bg-gray-50 border-gray-200 text-gray-800'
	}
}

const formatEvidenceLabel = (source: EvidenceSource) => {
	switch (source) {
		case 'SNOWFLAKE_BEST_PRACTICE':
			return 'Best Practice'
		case 'PERFORMANCE_ANALYSIS':
			return 'Performance Analysis'
		case 'COST_ANALYSIS':
			return 'Cost Analysis'
		default:
			return 'Analysis'
	}
}

export const RecommendationList = memo(
	({
		recommendations,
		onRecommendationHover,
		activeRecommendation
	}: RecommendationListProps) => {
		if (recommendations.length === 0) {
			return (
				<div className="bg-white rounded-lg border border-gray-200 p-6">
					<div className="text-center text-gray-500">
						<Lightbulb size={48} className="mx-auto mb-4 text-gray-300" />
						<div className="text-lg font-medium text-gray-900 mb-2">
							No recommendations available
						</div>
						<div className="text-sm">
							This insight doesn't have any specific recommendations yet.
						</div>
					</div>
				</div>
			)
		}

		return (
			<div className="space-y-4">
				<div className="space-y-4">
					{recommendations.map((recommendation, index) => (
						<div
							key={recommendation.id}
							className={`bg-white rounded-lg border-2 p-6 transition-all duration-200 cursor-pointer ${
								activeRecommendation === recommendation.id
									? 'border-orange-300 bg-orange-50 shadow-lg'
									: 'border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-lg'
							}`}
							onMouseEnter={() => onRecommendationHover(recommendation.id)}
							onMouseLeave={() => onRecommendationHover(null)}
							role="button"
							tabIndex={0}
							aria-label={`Recommendation ${index + 1}: ${
								recommendation.title
							}`}
						>
							{/* Header */}
							<div className="flex items-start justify-between mb-4">
								<div className="flex-1">
									<h3 className="text-lg font-medium text-gray-900 mb-2">
										{recommendation.title}
									</h3>
									<div className="flex items-center gap-2">
										<span
											className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getEvidenceColor(
												recommendation.evidence_source
											)}`}
										>
											{getEvidenceIcon(recommendation.evidence_source)}
											{formatEvidenceLabel(recommendation.evidence_source)}
										</span>
									</div>
								</div>
							</div>

							{/* Description */}
							<p className="text-gray-700 mb-4 leading-relaxed">
								{recommendation.description}
							</p>

							{/* Expected outcome */}
							<div className="bg-gray-50 rounded-lg p-4">
								<h4 className="font-medium text-gray-900 mb-2">
									Expected Impact
								</h4>
								<div className="flex items-center gap-3 mb-2">
									<span className="text-sm font-medium text-gray-700">
										{recommendation.expected_outcome.metric}:
									</span>
									<span className="text-sm font-bold text-green-600">
										{recommendation.expected_outcome.improvement}
									</span>
								</div>
								<p className="text-sm text-gray-600 leading-relaxed">
									{recommendation.expected_outcome.notes}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		)
	}
)

RecommendationList.displayName = 'RecommendationList'
