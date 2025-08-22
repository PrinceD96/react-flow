import { memo } from 'react';
import { Filter, Search } from 'lucide-react';
import { InsightCard } from './InsightCard';
import { type Insight, type InsightType } from '../../types/insight';

interface InsightListProps {
  insights: Insight[];
  loading: boolean;
  error: string | null;
  currentFilter: InsightType | 'ALL';
  onFilterChange: (type: InsightType | 'ALL') => void;
  onInsightClick: (id: string) => void;
}

const filterOptions: Array<{ value: InsightType | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'All Insights' },
  { value: 'QUERY', label: 'Query Insights' },
  { value: 'TABLE', label: 'Table Insights' },
  { value: 'RCA', label: 'Root Cause Analysis' },
];

export const InsightList = memo(({ 
  insights, 
  loading, 
  error, 
  currentFilter, 
  onFilterChange, 
  onInsightClick 
}: InsightListProps) => {
  
  if (loading) {
    return (
      <div className="space-y-4">
        {/* Loading skeleton */}
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                <div className="h-6 bg-gray-200 rounded-full w-24"></div>
              </div>
              <div className="h-16 bg-gray-100 rounded-lg mb-4"></div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2 text-lg font-medium">Failed to load insights</div>
        <div className="text-gray-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Snowflake Insights</h1>
          <p className="text-gray-600 mt-1">
            Proactive query optimization and cost management recommendations
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Search (placeholder for future implementation) */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search insights..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-64"
              disabled
            />
          </div>
          
          {/* Filter dropdown */}
          <div className="relative">
            <select
              value={currentFilter}
              onChange={(e) => onFilterChange(e.target.value as InsightType | 'ALL')}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Filter size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {insights.length} insight{insights.length !== 1 ? 's' : ''} found
          {currentFilter !== 'ALL' && (
            <span className="ml-1">
              for <span className="font-medium capitalize">{currentFilter.toLowerCase()}</span> category
            </span>
          )}
        </div>
      </div>

      {/* Insights grid */}
      {insights.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {insights.map((insight) => (
            <InsightCard
              key={insight.id}
              insight={insight}
              onClick={onInsightClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search size={48} className="mx-auto" />
          </div>
          <div className="text-lg font-medium text-gray-900 mb-2">No insights found</div>
          <div className="text-gray-600">
            {currentFilter === 'ALL' 
              ? 'There are no insights available at the moment.'
              : `No ${currentFilter.toLowerCase()} insights match your criteria.`
            }
          </div>
          {currentFilter !== 'ALL' && (
            <button
              onClick={() => onFilterChange('ALL')}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              View all insights
            </button>
          )}
        </div>
      )}
    </div>
  );
});

InsightList.displayName = 'InsightList';
