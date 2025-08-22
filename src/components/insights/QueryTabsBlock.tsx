import { useState } from 'react'
import {
	ArrowDown,
	AlertTriangle,
	CheckCircle2,
	Copy,
	Check
} from 'lucide-react'

interface QueryTabsBlockProps {
	originalQuery?: string
	optimizedQuery?: string
}

export const QueryTabsBlock = ({
	originalQuery,
	optimizedQuery
}: QueryTabsBlockProps) => {
	const [copiedQuery, setCopiedQuery] = useState<string | null>(null)

	const copyToClipboard = async (text: string, queryType: string) => {
		try {
			await navigator.clipboard.writeText(text)
			setCopiedQuery(queryType)
			setTimeout(() => setCopiedQuery(null), 2000)
		} catch (err) {
			console.error('Failed to copy text: ', err)
		}
	}

	if (!originalQuery || !optimizedQuery) {
		return null
	}

	return (
		<div className="h-full flex flex-col bg-white">
			{/* Content Area - Optimized for vertical stack */}
			<div className="flex-1 overflow-y-auto p-3 space-y-3">
				{/* Current Query */}
				<div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
					<div className="flex items-start gap-2 mb-2">
						<AlertTriangle
							size={14}
							className="text-red-600 mt-0.5 flex-shrink-0"
						/>
						<div className="min-w-0 flex-1">
							<h4 className="text-sm font-medium text-red-900">Current</h4>
							<p className="text-xs text-red-700 mt-1">Needs optimization</p>
						</div>
					</div>
					<div className="bg-gray-100 border border-gray-200 rounded p-2 mt-2 overflow-x-auto relative group">
						<button
							onClick={() => copyToClipboard(originalQuery, 'original')}
							className="absolute top-2 right-2 p-1 bg-white border border-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
							title="Copy query"
						>
							{copiedQuery === 'original' ? (
								<Check size={14} className="text-green-600" />
							) : (
								<Copy size={14} className="text-gray-600" />
							)}
						</button>
						<pre className="text-xs whitespace-pre-wrap pr-8">
							{originalQuery}
						</pre>
					</div>
				</div>

				{/* Arrow indicator */}
				<div className="flex justify-center py-1">
					<div className="flex items-center gap-2 text-xs text-gray-500">
						<ArrowDown size={14} />
						<span>Optimized</span>
					</div>
				</div>

				{/* Optimized Query */}
				<div className="bg-green-50 border-l-4 border-green-400 p-3 rounded">
					<div className="flex items-start gap-2 mb-2">
						<CheckCircle2
							size={14}
							className="text-green-600 mt-0.5 flex-shrink-0"
						/>
						<div className="min-w-0 flex-1">
							<h4 className="text-sm font-medium text-green-900">Improved</h4>
							<p className="text-xs text-green-700 mt-1">Better performance</p>
						</div>
					</div>
					<div className="bg-gray-100 border border-gray-200 rounded p-2 mt-2 overflow-x-auto relative group">
						<button
							onClick={() => copyToClipboard(optimizedQuery, 'optimized')}
							className="absolute top-2 right-2 p-1 bg-white border border-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
							title="Copy query"
						>
							{copiedQuery === 'optimized' ? (
								<Check size={14} className="text-green-600" />
							) : (
								<Copy size={14} className="text-gray-600" />
							)}
						</button>
						<pre className="text-xs whitespace-pre-wrap pr-8">
							{optimizedQuery}
						</pre>
					</div>
				</div>
			</div>
		</div>
	)
}
