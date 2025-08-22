import { type Insight, type InsightType } from '../types/insight'
import {
	mockInsights,
	getInsightById as getMockInsightById,
	getInsightsByType as getMockInsightsByType
} from '../data/mockInsights'

// Simulate API delays
const API_DELAY = 500

// Simulate network request
const simulateApiCall = <T>(data: T, delay: number = API_DELAY): Promise<T> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(data)
		}, delay)
	})
}

// API functions that simulate real API calls
export const insightsApi = {
	// Get all insights
	getInsights: (): Promise<Insight[]> => {
		console.log('API: Fetching all insights')
		return simulateApiCall(mockInsights)
	},

	// Get insights by type
	getInsightsByType: (type: InsightType): Promise<Insight[]> => {
		console.log('API: Fetching insights by type:', type)
		const filteredInsights = getMockInsightsByType(type)
		return simulateApiCall(filteredInsights)
	},

	// Get insight by ID
	getInsightById: (id: string): Promise<Insight | null> => {
		console.log('API: Fetching insight by id:', id)
		const insight = getMockInsightById(id) || null
		return simulateApiCall(insight, 300)
	}
}

// Query keys for consistent caching
export const insightsQueryKeys = {
	all: ['insights'] as const,
	lists: () => [...insightsQueryKeys.all, 'list'] as const,
	list: (type?: InsightType) => [...insightsQueryKeys.lists(), type] as const,
	details: () => [...insightsQueryKeys.all, 'detail'] as const,
	detail: (id: string) => [...insightsQueryKeys.details(), id] as const
}
