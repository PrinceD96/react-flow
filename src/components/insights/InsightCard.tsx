import { memo } from 'react';
import { Clock, TrendingDown, Zap, Database, Tag } from 'lucide-react';
import { type Insight, type OptimizationType } from '../../types/insight';

interface InsightCardProps {
  insight: Insight;
  onClick: (id: string) => void;
}

const getOptimizationIcon = (type: OptimizationType) => {
  switch (type) {
    case 'COST':
      return <TrendingDown size={16} className="text-green-600" />;
    case 'PERFORMANCE':
      return <Zap size={16} className="text-blue-600" />;
    default:
      return <Database size={16} className="text-gray-600" />;
  }
};

const getOptimizationColor = (type: OptimizationType) => {
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

export const InsightCard = memo(({ insight, onClick }: InsightCardProps) => {
  const handleClick = () => {
    onClick(insight.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(insight.id);
    }
  };

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group hover:border-gray-300"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View insight: ${insight.title}`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
              {insight.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock size={14} />
              <span>{formatTimeAgo(insight.created_at)}</span>
              <span className="mx-1">•</span>
              <Tag size={14} />
              <span className="capitalize">{insight.type} Insight</span>
            </div>
          </div>
        </div>

        {/* Optimization tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {insight.optimization_type.map((type) => (
            <span
              key={type}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getOptimizationColor(type)}`}
            >
              {getOptimizationIcon(type)}
              {type}
            </span>
          ))}
        </div>

        {/* Estimated savings */}
        {insight.estimated_savings && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Estimated Impact</div>
            <div className="flex gap-4">
              {insight.estimated_savings.cost && (
                <div className="flex items-center gap-2">
                  <TrendingDown size={14} className="text-green-600" />
                  <span className="text-sm">
                    <span className="font-medium text-green-600">
                      {insight.estimated_savings.cost}
                    </span>
                    <span className="text-gray-600 ml-1">cost reduction</span>
                  </span>
                </div>
              )}
              {insight.estimated_savings.performance && (
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-blue-600" />
                  <span className="text-sm">
                    <span className="font-medium text-blue-600">
                      {insight.estimated_savings.performance}
                    </span>
                    <span className="text-gray-600 ml-1">faster</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recommendations count */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {insight.recommendations.length} recommendation{insight.recommendations.length !== 1 ? 's' : ''}
          </span>
          <div className="text-blue-600 text-sm font-medium group-hover:underline">
            View details →
          </div>
        </div>
      </div>
    </div>
  );
});

InsightCard.displayName = 'InsightCard';
