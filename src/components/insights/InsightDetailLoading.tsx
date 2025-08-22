export const InsightDetailLoading = () => {
	return (
		<div className="space-y-6">
			<div className="animate-pulse">
				<div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
				<div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div className="space-y-6">
						<div className="h-64 bg-gray-100 rounded-lg"></div>
						<div className="h-64 bg-gray-100 rounded-lg"></div>
					</div>
					<div className="h-96 bg-gray-100 rounded-lg"></div>
				</div>
			</div>
		</div>
	)
}
