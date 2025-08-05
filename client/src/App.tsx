import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './components/Layout';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useState } from 'react';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import SettingsPage from './pages/SettingsPage';

function App(): JSX.Element {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light'
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected routes with layout */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout toggleDarkMode={() => {
                      const newValue = !darkMode;
                      localStorage.setItem('darkMode', String(newValue));
                      setDarkMode(newValue);
                    }} />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="analysis" element={<Analysis />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
