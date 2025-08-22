import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { InsightsDashboard } from './pages/InsightsDashboard';
import { QueryInsightDetail } from './pages/QueryInsightDetail';

function App() {
  return (
    <Router>
      <AppShell>
        <Switch>
          <Route exact path="/">
            <Redirect to="/insights" />
          </Route>
          <Route exact path="/insights">
            <InsightsDashboard />
          </Route>
          <Route exact path="/insights/QUERY/:id">
            <QueryInsightDetail />
          </Route>
          <Route path="*">
            <Redirect to="/insights" />
          </Route>
        </Switch>
      </AppShell>
    </Router>
  );
}

export default App;
