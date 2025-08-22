import { useParams, useHistory } from 'react-router-dom';
import { ArrowLeft, Code2, Zap, TrendingDown, Clock, Tag } from 'lucide-react';
import { useInsightDetail, useHighlightRecommendations } from '../hooks/useInsights';
import { RecommendationList } from '../components/insights/RecommendationList';
import { FlowCanvas } from '../components/flow/FlowCanvas';

interface QueryInsightDetailParams {
  id: string;
}

const getOptimizationIcon = (type: string) => {
  switch (type) {
    case 'COST':
      return <TrendingDown size={16} className="text-green-600" />;
    case 'PERFORMANCE':
      return <Zap size={16} className="text-blue-600" />;
    default:
      return <Code2 size={16} className="text-gray-600" />;
  }
};

const getOptimizationColor = (type: string) => {
  switch (type) {
    case 'COST':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'PERFORMANCE':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatTimeAgo = (dateString?: string): string => {
  if (!dateString) return 'Recently';
  
  const now = new Date();
  const date = new Date(dateString);
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks}w ago`;
};

export const QueryInsightDetail = () => {
  const { id } = useParams<QueryInsightDetailParams>();
  const history = useHistory();
  const { insight, loading, error } = useInsightDetail(id);
  const { 
    highlightedNodeIds, 
    highlightedEdgeIds, 
    setActiveRecommendation, 
    activeRecommendation 
  } = useHighlightRecommendations(insight);

  const handleBack = () => {
    history.push('/insights');
  };

  if (loading) {
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
    );
  }

  if (error || !insight) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4 text-lg font-medium">
          {error || 'Insight not found'}
        </div>
        <button
          onClick={handleBack}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to insights
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
        >
          <ArrowLeft size={16} />
          Back to insights
        </button>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{insight.title}</h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{formatTimeAgo(insight.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Tag size={14} />
                <span className="capitalize">{insight.type} Insight</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {insight.optimization_type.map((type) => (
                <span
                  key={type}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium border ${getOptimizationColor(type)}`}
                >
                  {getOptimizationIcon(type)}
                  {type}
                </span>
              ))}
            </div>

            {insight.estimated_savings && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                <div className="text-sm font-medium text-gray-700 mb-2">Estimated Impact</div>
                <div className="flex gap-6">
                  {insight.estimated_savings.cost && (
                    <div className="flex items-center gap-2">
                      <TrendingDown size={16} className="text-green-600" />
                      <span className="text-sm">
                        <span className="font-bold text-green-600 text-lg">
                          {insight.estimated_savings.cost}
                        </span>
                        <span className="text-gray-600 ml-1">cost reduction</span>
                      </span>
                    </div>
                  )}
                  {insight.estimated_savings.performance && (
                    <div className="flex items-center gap-2">
                      <Zap size={16} className="text-blue-600" />
                      <span className="text-sm">
                        <span className="font-bold text-blue-600 text-lg">
                          {insight.estimated_savings.performance}
                        </span>
                        <span className="text-gray-600 ml-1">faster execution</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Column - SQL Queries */}
        <div className="space-y-6">
          {/* Original Query */}
          {insight.original_query && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-red-50 border-b border-red-200">
                <h2 className="text-lg font-semibold text-red-900 flex items-center gap-2">
                  <Code2 size={20} className="text-red-600" />
                  Current Query
                </h2>
                <p className="text-sm text-red-700 mt-1">This is the original query that needs optimization</p>
              </div>
              <div className="p-6">
                <pre className="text-sm text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto border">
                  <code>{insight.original_query}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Optimized Query */}
          {insight.optimized_query && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-green-50 border-b border-green-200">
                <h2 className="text-lg font-semibold text-green-900 flex items-center gap-2">
                  <Zap size={20} className="text-green-600" />
                  Optimized Query
                </h2>
                <p className="text-sm text-green-700 mt-1">Recommended optimized version</p>
              </div>
              <div className="p-6">
                <pre className="text-sm text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto border">
                  <code>{insight.optimized_query}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Recommendations */}
          <RecommendationList
            recommendations={insight.recommendations}
            onRecommendationHover={setActiveRecommendation}
            activeRecommendation={activeRecommendation}
          />
        </div>

        {/* Right Column - Query Plan Visualization */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Tag size={20} className="text-purple-600" />
                Query Plan Visualization
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Interactive visualization showing the query execution plan
              </p>
            </div>
            <div className="p-6">
              {insight.query_plan_visualization ? (
                <FlowCanvas
                  queryPlan={insight.query_plan_visualization}
                  highlightedNodeIds={highlightedNodeIds}
                  highlightedEdgeIds={highlightedEdgeIds}
                  className="h-[500px]"
                />
              ) : (
                <div className="h-[500px] flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Tag size={48} className="mx-auto mb-4 text-gray-300" />
                    <div className="text-lg font-medium text-gray-900 mb-2">No visualization available</div>
                    <div className="text-sm">Query plan visualization is not available for this insight.</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
