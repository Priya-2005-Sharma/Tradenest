import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { ScrollToTop } from './components/layout/ScrollToTop.jsx';
import { AppRoutes } from './routes/AppRoutes.jsx';

export const App = () => (
  <ErrorBoundary>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <ScrollToTop />
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </ErrorBoundary>
);
