import { Code2, Zap, TrendingDown, Clock, Tag } from 'lucide-react'
import { type Insight } from '../../types/insight'

interface InsightHeaderProps {
	insight: Insight
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

export const InsightHeader = ({ insight }: InsightHeaderProps) => {
	return (
		<div className="space-y-6">
			{/* Title and Metadata */}
			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
					{insight.title}
				</h3>
				<div className="flex items-center gap-3 text-xs text-gray-500">
					<div className="flex items-center gap-1">
						<Clock size={12} />
						<span>{formatTimeAgo(insight.created_at)}</span>
					</div>
					<div className="flex items-center gap-1">
						<Tag size={12} />
						<span className="capitalize">{insight.type} Insight</span>
					</div>
				</div>
			</div>

			{/* Optimization Types */}
			<div className="flex flex-wrap gap-2">
				{insight.optimization_type.map((type) => (
					<span
						key={type}
						className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getOptimizationColor(
							type
						)}`}
					>
						{getOptimizationIcon(type)}
						{type}
					</span>
				))}
			</div>

			{/* Impact Metrics */}
			{insight.estimated_savings && (
				<div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
					<div className="text-xs font-medium text-gray-700 mb-3 uppercase tracking-wide">
						Estimated Impact
					</div>
					<div className="space-y-3">
						{insight.estimated_savings.cost && (
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
										<TrendingDown size={12} className="text-green-600" />
									</div>
									<span className="text-xs text-gray-600">Cost Reduction</span>
								</div>
								<span className="font-bold text-green-700 text-base">
									{insight.estimated_savings.cost}
								</span>
							</div>
						)}
						{insight.estimated_savings.performance && (
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
										<Zap size={12} className="text-blue-600" />
									</div>
									<span className="text-xs text-gray-600">Performance</span>
								</div>
								<span className="font-bold text-blue-700 text-base">
									{insight.estimated_savings.performance}
								</span>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	)
}
