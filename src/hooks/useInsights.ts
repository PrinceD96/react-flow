import { useState, useEffect } from 'react';
import { type Insight, type InsightType } from '../types/insight';
import { mockInsights, getInsightById, getInsightsByType } from '../data/mockInsights';

export interface UseInsightsListResult {
  insights: Insight[];
  loading: boolean;
  error: string | null;
  filterByType: (type: InsightType | 'ALL') => void;
  currentFilter: InsightType | 'ALL';
}

export const useInsightsList = (): UseInsightsListResult => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<InsightType | 'ALL'>('ALL');

  useEffect(() => {
    // Simulate API loading
    setLoading(true);
    const timer = setTimeout(() => {
      try {
        if (currentFilter === 'ALL') {
          setInsights(mockInsights);
        } else {
          setInsights(getInsightsByType(currentFilter));
        }
        setError(null);
      } catch (err) {
        setError('Failed to load insights');
        setInsights([]);
      } finally {
        setLoading(false);
      }
    }, 500); // Simulate network delay

    return () => clearTimeout(timer);
  }, [currentFilter]);

  const filterByType = (type: InsightType | 'ALL') => {
    setCurrentFilter(type);
  };

  return {
    insights,
    loading,
    error,
    filterByType,
    currentFilter
  };
};

export interface UseInsightDetailResult {
  insight: Insight | null;
  loading: boolean;
  error: string | null;
}

export const useInsightDetail = (id: string): UseInsightDetailResult => {
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      try {
        const foundInsight = getInsightById(id);
        if (foundInsight) {
          setInsight(foundInsight);
          setError(null);
        } else {
          setError('Insight not found');
          setInsight(null);
        }
      } catch (err) {
        setError('Failed to load insight details');
        setInsight(null);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [id]);

  return {
    insight,
    loading,
    error
  };
};

export interface UseHighlightRecommendationsResult {
  highlightedNodeIds: Set<string>;
  highlightedEdgeIds: Set<string>;
  setActiveRecommendation: (recommendationId: string | null) => void;
  activeRecommendation: string | null;
}

export const useHighlightRecommendations = (insight: Insight | null): UseHighlightRecommendationsResult => {
  const [activeRecommendation, setActiveRecommendation] = useState<string | null>(null);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<Set<string>>(new Set());
  const [highlightedEdgeIds, setHighlightedEdgeIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!insight?.query_plan_visualization || !activeRecommendation) {
      setHighlightedNodeIds(new Set());
      setHighlightedEdgeIds(new Set());
      return;
    }

    const { nodes, edges } = insight.query_plan_visualization;
    
    const nodeIds = new Set(
      nodes
        .filter(node => node.data.recommendation_id === activeRecommendation)
        .map(node => node.id)
    );
    
    const edgeIds = new Set(
      edges
        .filter(edge => edge.recommendation_id === activeRecommendation)
        .map(edge => edge.id)
    );

    setHighlightedNodeIds(nodeIds);
    setHighlightedEdgeIds(edgeIds);
  }, [insight, activeRecommendation]);

  return {
    highlightedNodeIds,
    highlightedEdgeIds,
    setActiveRecommendation,
    activeRecommendation
  };
};
