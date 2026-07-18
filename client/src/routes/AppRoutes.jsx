import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import { PublicLayout } from '../layouts/PublicLayout.jsx';
import { AuthLayout } from '../layouts/AuthLayout.jsx';
import { DashboardLayout } from '../layouts/DashboardLayout.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { PublicOnlyRoute } from './PublicOnlyRoute.jsx';
import { PageLoader } from '../components/ui/Loader.jsx';

import { Home } from '../pages/public/Home.jsx';
import { Login } from '../pages/auth/Login.jsx';
import { Register } from '../pages/auth/Register.jsx';

// The marketing and app sections are split out of the initial bundle — a
// visitor landing on Home should not download the dashboard and Chart.js.
const About = lazy(() => import('../pages/public/About.jsx').then((m) => ({ default: m.About })));
const Products = lazy(() => import('../pages/public/Products.jsx').then((m) => ({ default: m.Products })));
const Pricing = lazy(() => import('../pages/public/Pricing.jsx').then((m) => ({ default: m.Pricing })));
const Support = lazy(() => import('../pages/public/Support.jsx').then((m) => ({ default: m.Support })));

const Dashboard = lazy(() => import('../pages/app/Dashboard.jsx').then((m) => ({ default: m.Dashboard })));
const Portfolio = lazy(() => import('../pages/app/Portfolio.jsx').then((m) => ({ default: m.Portfolio })));
const Holdings = lazy(() => import('../pages/app/Holdings.jsx').then((m) => ({ default: m.Holdings })));
const Watchlist = lazy(() => import('../pages/app/Watchlist.jsx').then((m) => ({ default: m.Watchlist })));
const Orders = lazy(() => import('../pages/app/Orders.jsx').then((m) => ({ default: m.Orders })));
const Positions = lazy(() => import('../pages/app/Positions.jsx').then((m) => ({ default: m.Positions })));
const Funds = lazy(() => import('../pages/app/Funds.jsx').then((m) => ({ default: m.Funds })));
const Profile = lazy(() => import('../pages/app/Profile.jsx').then((m) => ({ default: m.Profile })));
const Settings = lazy(() => import('../pages/app/Settings.jsx').then((m) => ({ default: m.Settings })));
const StockDetails = lazy(() => import('../pages/app/StockDetails.jsx').then((m) => ({ default: m.StockDetails })));
const NotFound = lazy(() => import('../pages/NotFound.jsx').then((m) => ({ default: m.NotFound })));

export const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/support" element={<Support />} />
      </Route>

      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/holdings" element={<Holdings />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/positions" element={<Positions />} />
          <Route path="/funds" element={<Funds />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/stocks/:symbol" element={<StockDetails />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);
