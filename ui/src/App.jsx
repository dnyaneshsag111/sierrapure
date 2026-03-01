import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

import theme from './styles/theme';
import './styles/globals.css';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import PageLoader from './components/common/PageLoader';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';

// Public pages
const Home            = lazy(() => import('./pages/Home'));
const About           = lazy(() => import('./pages/About'));
const Products        = lazy(() => import('./pages/Products'));
const Clients         = lazy(() => import('./pages/Clients'));
const Customization   = lazy(() => import('./pages/Customization'));
const LabReports      = lazy(() => import('./pages/LabReports'));
const LabReportDetail = lazy(() => import('./pages/LabReportDetail'));
const Contact         = lazy(() => import('./pages/Contact'));
const Login           = lazy(() => import('./pages/Login'));

// Admin pages
const AdminLayout    = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminImages    = lazy(() => import('./pages/admin/AdminImages'));
const AdminProducts  = lazy(() => import('./pages/admin/AdminProducts'));
const AdminClients   = lazy(() => import('./pages/admin/AdminClients'));
const AdminReports   = lazy(() => import('./pages/admin/AdminReports'));
const AdminEnquiries = lazy(() => import('./pages/admin/AdminEnquiries'));
const AdminUsers     = lazy(() => import('./pages/admin/AdminUsers'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function SiteLayout() {
  const location = useLocation();
  const isAdmin  = location.pathname.startsWith('/admin');
  const isLogin  = location.pathname === '/login';
  return (
    <>
      {!isAdmin && !isLogin && <Navbar />}
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public */}
            <Route path="/"                               element={<Home />} />
            <Route path="/about"                          element={<About />} />
            <Route path="/products"                       element={<Products />} />
            <Route path="/clients"                        element={<Clients />} />
            <Route path="/customization"                  element={<Customization />} />
            <Route path="/contact"                        element={<Contact />} />
            <Route path="/lab-reports"                    element={<LabReports />} />
            <Route path="/lab-reports/:id"                element={<LabReportDetail />} />
            <Route path="/lab-reports/batch/:batchNumber" element={<LabReportDetail />} />
            <Route path="/lab-reports/date/:date"         element={<LabReports />} />
            <Route path="/login"                          element={<Login />} />

            {/* Admin — protected, no Navbar/Footer */}
            <Route path="/admin" element={
              <ProtectedRoute roles={['ADMIN', 'LAB_ANALYST']}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index             element={<AdminDashboard />} />
              <Route path="images"     element={<AdminImages />} />
              <Route path="products"   element={<AdminProducts />} />
              <Route path="clients"    element={<AdminClients />} />
              <Route path="reports"    element={<AdminReports />} />
              <Route path="enquiries"  element={<AdminEnquiries />} />
              <Route path="users"      element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminUsers />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
      {!isAdmin && !isLogin && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <BrowserRouter>
                <ScrollToTop />
                <SiteLayout />
              </BrowserRouter>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#0B1F3A', color: 'white', borderRadius: 12,
                    fontFamily: "'Inter', sans-serif", fontSize: '0.9rem',
                    boxShadow: '0 8px 32px rgba(11,31,58,0.3)',
                  },
                  success: { iconTheme: { primary: '#2ECC71', secondary: 'white' } },
                  error:   { iconTheme: { primary: '#E74C3C', secondary: 'white' } },
                }}
              />
            </ThemeProvider>
          </AppProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
