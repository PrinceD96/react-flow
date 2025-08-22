import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { InsightsDashboard } from './pages/InsightsDashboard';
import { QueryInsightDetail } from './pages/QueryInsightDetail';

function App() {
  return (
    <Router>
      <AppShell>
        <Switch>
          <Route path="/insights/QUERY/:id" component={QueryInsightDetail} />
          <Route exact path="/insights" component={InsightsDashboard} />
          <Route exact path="/">
            <Redirect to="/insights" />
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
