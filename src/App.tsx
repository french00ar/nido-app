// Rutas de la app, generadas por Cosmos a partir del plan. Cada pantalla vive en su propio archivo.
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import RequireSession from './components/RequireSession';
import LoginScreen from './components/LoginScreen';
import FinanceDashboard from './components/FinanceDashboard';
import FinanceLayout from './components/FinanceLayout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route element={<RequireSession redirectTo="/login" />}>
          <Route element={<FinanceLayout />}>
            <Route path="/app" element={<FinanceDashboard />} />
          </Route>
        </Route>
        <Route path="/" element={<Navigate to="/app" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
