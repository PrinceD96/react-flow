// Core insight types based on the PRD schema
export type InsightType = 'QUERY' | 'TABLE' | 'RCA';

export type OptimizationType = 'COST' | 'PERFORMANCE';

export type EvidenceSource = 'SNOWFLAKE_BEST_PRACTICE' | 'PERFORMANCE_ANALYSIS' | 'COST_ANALYSIS';

export interface ExpectedOutcome {
  metric: string;
  improvement: string;
  notes: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  evidence_source: EvidenceSource;
  expected_outcome: ExpectedOutcome;
}

export interface QueryPlanNode {
  id: string;
  type: 'tableNode' | 'operationNode' | 'resultNode';
  data: {
    label: string;
    recommendation_id?: string;
  };
}

export interface QueryPlanEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  recommendation_id?: string;
}

export interface QueryPlanVisualization {
  nodes: QueryPlanNode[];
  edges: QueryPlanEdge[];
}

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  optimization_type: OptimizationType[];
  original_query?: string;
  optimized_query?: string;
  recommendations: Recommendation[];
  query_plan_visualization?: QueryPlanVisualization;
  created_at?: string;
  estimated_savings?: {
    cost?: string;
    performance?: string;
  };
}

export interface InsightResponse {
  insight: Insight;
}
