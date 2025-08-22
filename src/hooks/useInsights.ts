import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { type Insight, type InsightType } from '../types/insight'
import { insightsApi, insightsQueryKeys } from '../services/insightsApi'

export interface UseInsightsListResult {
	insights: Insight[]
	loading: boolean
	error: string | null
	filterByType: (type: InsightType | 'ALL') => void
	currentFilter: InsightType | 'ALL'
}

export const useInsightsList = (): UseInsightsListResult => {
	const [currentFilter, setCurrentFilter] = useState<InsightType | 'ALL'>('ALL')

	// Query for all insights or filtered insights
	const {
		data: insights = [],
		isLoading: loading,
		error
	} = useQuery({
		queryKey: insightsQueryKeys.list(
			currentFilter === 'ALL' ? undefined : currentFilter
		),
		queryFn: () => {
			if (currentFilter === 'ALL') {
				return insightsApi.getInsights()
			} else {
				return insightsApi.getInsightsByType(currentFilter)
			}
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		cacheTime: 10 * 60 * 1000 // 10 minutes
	})

	const filterByType = (type: InsightType | 'ALL') => {
		setCurrentFilter(type)
	}

	return {
		insights,
		loading,
		error: error ? 'Failed to load insights' : null,
		filterByType,
		currentFilter
	}
}

export interface UseInsightDetailResult {
	insight: Insight | null
	loading: boolean
	error: string | null
}

export const useInsightDetail = (id: string): UseInsightDetailResult => {
	const {
		data: insight = null,
		isLoading: loading,
		error
	} = useQuery({
		queryKey: insightsQueryKeys.detail(id),
		queryFn: () => insightsApi.getInsightById(id),
		enabled: !!id, // Only run query if id exists
		staleTime: 10 * 60 * 1000, // 10 minutes - details are less likely to change
		cacheTime: 15 * 60 * 1000 // 15 minutes
	})

	return {
		insight,
		loading,
		error: error ? 'Failed to load insight details' : null
	}
}

export interface UseHighlightRecommendationsResult {
	highlightedNodeIds: Set<string>
	highlightedEdgeIds: Set<string>
	setActiveRecommendation: (recommendationId: string | null) => void
	activeRecommendation: string | null
}

export const useHighlightRecommendations = (
	insight: Insight | null
): UseHighlightRecommendationsResult => {
	const [activeRecommendation, setActiveRecommendation] = useState<
		string | null
	>(null)
	const [highlightedNodeIds, setHighlightedNodeIds] = useState<Set<string>>(
		new Set()
	)
	const [highlightedEdgeIds, setHighlightedEdgeIds] = useState<Set<string>>(
		new Set()
	)

	useEffect(() => {
		if (!insight?.query_plan_visualization || !activeRecommendation) {
			setHighlightedNodeIds(new Set())
			setHighlightedEdgeIds(new Set())
			return
		}

		const { nodes, edges } = insight.query_plan_visualization

		const nodeIds = new Set(
			nodes
				.filter((node) => node.data.recommendation_id === activeRecommendation)
				.map((node) => node.id)
		)

		const edgeIds = new Set(
			edges
				.filter((edge) => edge.recommendation_id === activeRecommendation)
				.map((edge) => edge.id)
		)

		setHighlightedNodeIds(nodeIds)
		setHighlightedEdgeIds(edgeIds)
	}, [insight, activeRecommendation])

	return {
		highlightedNodeIds,
		highlightedEdgeIds,
		setActiveRecommendation,
		activeRecommendation
	}
}
