import { ArrowLeft, Code2, Zap, TrendingDown, Clock, Tag } from 'lucide-react'
import { type Insight } from '../../types/insight'

interface InsightHeaderProps {
	insight: Insight
	onBack: () => void
}

const getOptimizationIcon = (type: string) => {
	switch (type) {
		case 'COST':
			return <TrendingDown size={16} className="text-green-600" />
		case 'PERFORMANCE':
			return <Zap size={16} className="text-blue-600" />
		default:
			return <Code2 size={16} className="text-gray-600" />
	}
}

const getOptimizationColor = (type: string) => {
	switch (type) {
		case 'COST':
			return 'bg-green-100 text-green-800 border-green-200'
		case 'PERFORMANCE':
			return 'bg-blue-100 text-blue-800 border-blue-200'
		default:
			return 'bg-gray-100 text-gray-800 border-gray-200'
	}
}

const formatTimeAgo = (dateString?: string): string => {
	if (!dateString) return 'Recently'

	const now = new Date()
	const date = new Date(dateString)
	const diffInHours = Math.floor(
		(now.getTime() - date.getTime()) / (1000 * 60 * 60)
	)

	if (diffInHours < 1) return 'Just now'
	if (diffInHours < 24) return `${diffInHours}h ago`

	const diffInDays = Math.floor(diffInHours / 24)
	if (diffInDays < 7) return `${diffInDays}d ago`

	const diffInWeeks = Math.floor(diffInDays / 7)
	return `${diffInWeeks}w ago`
}

export const InsightHeader = ({ insight, onBack }: InsightHeaderProps) => {
	return (
		<div>
			<button
				onClick={onBack}
				className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
			>
				<ArrowLeft size={16} />
				Back to insights
			</button>

			<div className="flex items-start justify-between">
				<div className="flex-1">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						{insight.title}
					</h1>

					<div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
						<div className="flex items-center gap-1">
							<Clock size={14} />
							<span>{formatTimeAgo(insight.created_at)}</span>
						</div>
						<div className="flex items-center gap-1">
							<Tag size={14} />
							<span className="capitalize">{insight.type} Insight</span>
						</div>
					</div>

					<div className="flex flex-wrap gap-2 mb-4">
						{insight.optimization_type.map((type) => (
							<span
								key={type}
								className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium border ${getOptimizationColor(
									type
								)}`}
							>
								{getOptimizationIcon(type)}
								{type}
							</span>
						))}
					</div>

					{insight.estimated_savings && (
						<div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
							<div className="text-sm font-medium text-gray-700 mb-2">
								Estimated Impact
							</div>
							<div className="flex gap-6">
								{insight.estimated_savings.cost && (
									<div className="flex items-center gap-2">
										<TrendingDown size={16} className="text-green-600" />
										<span className="text-sm">
											<span className="font-bold text-green-600 text-lg">
												{insight.estimated_savings.cost}
											</span>
											<span className="text-gray-600 ml-1">cost reduction</span>
										</span>
									</div>
								)}
								{insight.estimated_savings.performance && (
									<div className="flex items-center gap-2">
										<Zap size={16} className="text-blue-600" />
										<span className="text-sm">
											<span className="font-bold text-blue-600 text-lg">
												{insight.estimated_savings.performance}
											</span>
											<span className="text-gray-600 ml-1">
												faster execution
											</span>
										</span>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
