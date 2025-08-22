import { useState } from 'react'
import { Code2, Zap } from 'lucide-react'

interface QueryTabsBlockProps {
	originalQuery?: string
	optimizedQuery?: string
}

export const QueryTabsBlock = ({
	originalQuery,
	optimizedQuery
}: QueryTabsBlockProps) => {
	const [activeQueryTab, setActiveQueryTab] = useState<'current' | 'optimized'>(
		'current'
	)

	if (!originalQuery && !optimizedQuery) {
		return null
	}

	return (
		<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
			{/* Tab Navigation */}
			<div className="flex border-b border-gray-200 bg-gray-50">
				{originalQuery && (
					<button
						onClick={() => setActiveQueryTab('current')}
						className={`flex-1 px-6 py-4 text-left font-medium transition-all duration-200 ${
							activeQueryTab === 'current'
								? 'bg-white text-red-900 border-b-2 border-red-500 shadow-sm -mb-px'
								: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
						}`}
					>
						<div className="flex items-center gap-3">
							<Code2
								size={20}
								className={
									activeQueryTab === 'current'
										? 'text-red-600'
										: 'text-gray-400'
								}
							/>
							<div>
								<div className="font-semibold text-base">Current Query</div>
								<div className="text-xs opacity-75">
									Original query needing optimization
								</div>
							</div>
						</div>
					</button>
				)}
				{optimizedQuery && (
					<button
						onClick={() => setActiveQueryTab('optimized')}
						className={`flex-1 px-6 py-4 text-left font-medium transition-all duration-200 ${
							activeQueryTab === 'optimized'
								? 'bg-white text-green-900 border-b-2 border-green-500 shadow-sm -mb-px'
								: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
						}`}
					>
						<div className="flex items-center gap-3">
							<Zap
								size={20}
								className={
									activeQueryTab === 'optimized'
										? 'text-green-600'
										: 'text-gray-400'
								}
							/>
							<div>
								<div className="font-semibold text-base">Optimized Query</div>
								<div className="text-xs opacity-75">
									Recommended optimized version
								</div>
							</div>
						</div>
					</button>
				)}
			</div>

			{/* Tab Content */}
			<div className="p-6">
				{/* Current Query Content */}
				{activeQueryTab === 'current' && originalQuery && (
					<div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
						<pre className="text-sm text-gray-800 overflow-x-auto">
							<code>{originalQuery}</code>
						</pre>
					</div>
				)}

				{/* Optimized Query Content */}
				{activeQueryTab === 'optimized' && optimizedQuery && (
					<div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
						<pre className="text-sm text-gray-800 overflow-x-auto">
							<code>{optimizedQuery}</code>
						</pre>
					</div>
				)}
			</div>
		</div>
	)
}
