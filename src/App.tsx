import { Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { LandingPage } from './routes/landing';
import { DashboardPage } from './routes/index';
import { NewRequestPage } from './routes/new-request';
import { TriageResultPage } from './routes/triage-result';
import { MyRequestsPage } from './routes/my-requests';
import { RequestDetailPage } from './routes/request-detail';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/dashboard"
        element={
          <AppShell>
            <DashboardPage />
          </AppShell>
        }
      />
      <Route
        path="/new-request"
        element={
          <AppShell>
            <NewRequestPage />
          </AppShell>
        }
      />
      <Route
        path="/new-request/triage"
        element={
          <AppShell>
            <TriageResultPage />
          </AppShell>
        }
      />
      <Route
        path="/my-requests"
        element={
          <AppShell>
            <MyRequestsPage />
          </AppShell>
        }
      />
      <Route
        path="/requests/:id"
        element={
          <AppShell>
            <RequestDetailPage />
          </AppShell>
        }
      />
    </Routes>
  );
}

export default App;
