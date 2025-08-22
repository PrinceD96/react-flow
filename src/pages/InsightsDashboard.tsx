import { useHistory } from 'react-router-dom';
import { InsightList } from '../components/insights/InsightList';
import { useInsightsList } from '../hooks/useInsights';

export const InsightsDashboard = () => {
  const history = useHistory();
  const { insights, loading, error, filterByType, currentFilter } = useInsightsList();

  const handleInsightClick = (id: string) => {
    history.push(`/insights/QUERY/${id}`);
  };

  return (
    <InsightList
      insights={insights}
      loading={loading}
      error={error}
      currentFilter={currentFilter}
      onFilterChange={filterByType}
      onInsightClick={handleInsightClick}
    />
  );
};
