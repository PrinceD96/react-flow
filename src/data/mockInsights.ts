import { type Insight } from '../types/insight';

export const mockInsights: Insight[] = [
  {
    id: 'mock123',
    type: 'QUERY',
    title: 'Top Cost Driver: Daily Reporting Query',
    optimization_type: ['COST', 'PERFORMANCE'],
    original_query: `SELECT 
  users.name, 
  COUNT(orders.id) 
FROM users 
JOIN orders ON users.id = orders.user_id 
GROUP BY 1;`,
    optimized_query: `SELECT 
  u.name, 
  COUNT(o.id) 
FROM users u 
JOIN orders o ON u.id = o.user_id 
WHERE o.order_date > '2025-01-01' 
GROUP BY 1;`,
    created_at: '2025-01-15T10:30:00Z',
    estimated_savings: {
      cost: '-85%',
      performance: '-92%'
    },
    recommendations: [
      {
        id: 'rec_001',
        title: 'Add a Date Filter',
        description: `Add a WHERE clause to filter the 'orders' table by \`order_date\`. This is a recommended best practice for large, time-series datasets.`,
        evidence_source: 'SNOWFLAKE_BEST_PRACTICE',
        expected_outcome: {
          metric: 'Rows Scanned',
          improvement: '-99.7%',
          notes: 'Reduces rows scanned from ~1.58B to ~5M, leading to significant cost and performance gains.'
        }
      }
    ],
    query_plan_visualization: {
      nodes: [
        {
          id: 'table_users',
          type: 'tableNode',
          data: { label: 'Users Table' }
        },
        {
          id: 'table_orders',
          type: 'tableNode',
          data: { label: 'Orders Table' }
        },
        {
          id: 'op_filter',
          type: 'operationNode',
          data: { label: 'DATE FILTER', recommendation_id: 'rec_001' }
        },
        {
          id: 'op_join',
          type: 'operationNode',
          data: { label: 'INNER JOIN' }
        },
        {
          id: 'op_group',
          type: 'operationNode',
          data: { label: 'GROUP BY' }
        },
        {
          id: 'result',
          type: 'resultNode',
          data: { label: 'Final Result' }
        }
      ],
      edges: [
        {
          id: 'edge1',
          source: 'table_users',
          target: 'op_join',
          label: '18M rows'
        },
        {
          id: 'edge2',
          source: 'table_orders',
          target: 'op_filter',
          label: '1.58B rows → 5M rows',
          recommendation_id: 'rec_001'
        },
        {
          id: 'edge3',
          source: 'op_filter',
          target: 'op_join',
          label: '5M rows'
        },
        {
          id: 'edge4',
          source: 'op_join',
          target: 'op_group',
          label: '2.1M rows'
        },
        {
          id: 'edge5',
          source: 'op_group',
          target: 'result',
          label: '156K rows'
        }
      ]
    }
  },
  {
    id: 'mock456',
    type: 'QUERY',
    title: 'Inefficient Window Function Usage',
    optimization_type: ['PERFORMANCE'],
    original_query: `SELECT 
  product_id,
  sale_date,
  amount,
  ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY sale_date) as rn
FROM sales
ORDER BY product_id, sale_date;`,
    optimized_query: `WITH ranked_sales AS (
  SELECT 
    product_id,
    sale_date,
    amount,
    ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY sale_date) as rn
  FROM sales
  WHERE sale_date >= '2024-01-01'
)
SELECT * FROM ranked_sales
ORDER BY product_id, sale_date;`,
    created_at: '2025-01-14T15:45:00Z',
    estimated_savings: {
      performance: '-67%'
    },
    recommendations: [
      {
        id: 'rec_002',
        title: 'Use CTE with Date Filtering',
        description: 'Move window functions into a Common Table Expression (CTE) and add date filtering to reduce the dataset size before applying the window function.',
        evidence_source: 'PERFORMANCE_ANALYSIS',
        expected_outcome: {
          metric: 'Query Runtime',
          improvement: '-67%',
          notes: 'Window function processing time reduced from 45s to 15s by filtering data first.'
        }
      }
    ],
    query_plan_visualization: {
      nodes: [
        {
          id: 'table_sales',
          type: 'tableNode',
          data: { label: 'Sales Table' }
        },
        {
          id: 'op_date_filter',
          type: 'operationNode',
          data: { label: 'DATE FILTER', recommendation_id: 'rec_002' }
        },
        {
          id: 'op_window',
          type: 'operationNode',
          data: { label: 'WINDOW FUNCTION' }
        },
        {
          id: 'op_sort',
          type: 'operationNode',
          data: { label: 'ORDER BY' }
        },
        {
          id: 'result',
          type: 'resultNode',
          data: { label: 'Final Result' }
        }
      ],
      edges: [
        {
          id: 'edge1',
          source: 'table_sales',
          target: 'op_date_filter',
          label: '890M rows → 120M rows',
          recommendation_id: 'rec_002'
        },
        {
          id: 'edge2',
          source: 'op_date_filter',
          target: 'op_window',
          label: '120M rows'
        },
        {
          id: 'edge3',
          source: 'op_window',
          target: 'op_sort',
          label: '120M rows'
        },
        {
          id: 'edge4',
          source: 'op_sort',
          target: 'result',
          label: '120M rows'
        }
      ]
    }
  },
  {
    id: 'mock789',
    type: 'QUERY',
    title: 'Excessive Data Scanning in Analytics',
    optimization_type: ['COST', 'PERFORMANCE'],
    original_query: `SELECT 
  region,
  AVG(revenue),
  COUNT(*)
FROM monthly_sales
GROUP BY region;`,
    optimized_query: `SELECT 
  region,
  AVG(revenue),
  COUNT(*)
FROM monthly_sales
WHERE month_year >= '2024-01-01'
GROUP BY region;`,
    created_at: '2025-01-13T09:20:00Z',
    estimated_savings: {
      cost: '-73%',
      performance: '-81%'
    },
    recommendations: [
      {
        id: 'rec_003',
        title: 'Add Temporal Partitioning',
        description: 'Add a WHERE clause to limit the scan to recent data. Most analytics queries only need current year data.',
        evidence_source: 'COST_ANALYSIS',
        expected_outcome: {
          metric: 'Data Scanned',
          improvement: '-73%',
          notes: 'Reduces scanned data from 2.4TB to 650GB by filtering to current year only.'
        }
      }
    ],
    query_plan_visualization: {
      nodes: [
        {
          id: 'table_monthly_sales',
          type: 'tableNode',
          data: { label: 'Monthly Sales' }
        },
        {
          id: 'op_time_filter',
          type: 'operationNode',
          data: { label: 'TIME FILTER', recommendation_id: 'rec_003' }
        },
        {
          id: 'op_aggregate',
          type: 'operationNode',
          data: { label: 'AGGREGATE' }
        },
        {
          id: 'result',
          type: 'resultNode',
          data: { label: 'Final Result' }
        }
      ],
      edges: [
        {
          id: 'edge1',
          source: 'table_monthly_sales',
          target: 'op_time_filter',
          label: '2.4TB → 650GB',
          recommendation_id: 'rec_003'
        },
        {
          id: 'edge2',
          source: 'op_time_filter',
          target: 'op_aggregate',
          label: '650GB'
        },
        {
          id: 'edge3',
          source: 'op_aggregate',
          target: 'result',
          label: '12 rows'
        }
      ]
    }
  }
];

export const getInsightById = (id: string): Insight | undefined => {
  return mockInsights.find(insight => insight.id === id);
};

export const getInsightsByType = (type: string): Insight[] => {
  return mockInsights.filter(insight => insight.type === type);
};
