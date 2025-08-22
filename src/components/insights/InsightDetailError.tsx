interface InsightDetailErrorProps {
	error?: string | null
	onBack: () => void
}

export const InsightDetailError = ({
	error,
	onBack
}: InsightDetailErrorProps) => {
	return (
		<div className="text-center py-12">
			<div className="text-red-600 mb-4 text-lg font-medium">
				{error || 'Insight not found'}
			</div>
			<button
				onClick={onBack}
				className="text-blue-600 hover:text-blue-700 font-medium"
			>
				← Back to insights
			</button>
		</div>
	)
}
