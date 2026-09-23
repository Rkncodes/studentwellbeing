import { Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './routes/index';
import { NewRequestPage } from './routes/new-request';
import { TriageResultPage } from './routes/triage-result';
import { MyRequestsPage } from './routes/my-requests';
import { RequestDetailPage } from './routes/request-detail';

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/new-request" element={<NewRequestPage />} />
        <Route path="/new-request/triage" element={<TriageResultPage />} />
        <Route path="/my-requests" element={<MyRequestsPage />} />
        <Route path="/requests/:id" element={<RequestDetailPage />} />
      </Routes>
    </AppShell>
  );
}

export default App;
