import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import LiveDetectionPage from './pages/LiveDetectionPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ModelInfoPage from './pages/ModelInfoPage';
import SettingsPage from './pages/SettingsPage';
import DemoOne from './components/demo';
import { clearToken } from './api/predict';

function App() {
  // Always start unauthenticated so the user sees the Login page first
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => setIsAuthenticated(true);

  const handleLogout = () => {
    clearToken();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <DemoOne onLogin={handleLogin} />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="live" element={<LiveDetectionPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="model" element={<ModelInfoPage />} />
        <Route path="settings" element={<SettingsPage onLogout={handleLogout} />} />
      </Route>
    </Routes>
  );
}

export default App;