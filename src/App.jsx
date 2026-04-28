import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Layouts (loaded eagerly since they wrap routes)
import PublicLayout from './components/shared/PublicLayout';
import ArmoryLayout from './components/shared/ArmoryLayout';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Public pages
const HomePage = lazy(() => import('./pages/public/HomePage'));
const SchedulePage = lazy(() => import('./pages/public/SchedulePage'));
const RolesPage = lazy(() => import('./pages/public/RolesPage'));
const AccountabilityPage = lazy(() => import('./pages/public/AccountabilityPage'));
const ResourcesPage = lazy(() => import('./pages/public/ResourcesPage'));

// Auth pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));

// Armory (authenticated) pages
const DashboardPage = lazy(() => import('./pages/armory/DashboardPage'));
const TreasuryPage = lazy(() => import('./pages/armory/TreasuryPage'));
const ScriptureMemoryPage = lazy(() => import('./pages/armory/ScriptureMemoryPage'));
const DisciplineDenPage = lazy(() => import('./pages/armory/DisciplineDenPage'));
const StatsPage = lazy(() => import('./pages/armory/StatsPage'));
const ProfilePage = lazy(() => import('./pages/armory/ProfilePage'));

// Admin pages
const ManageUsersPage = lazy(() => import('./pages/admin/ManageUsersPage'));
const AwardCoinsPage = lazy(() => import('./pages/admin/AwardCoinsPage'));
const RelationshipsPage = lazy(() => import('./pages/admin/RelationshipsPage'));

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh', color: 'var(--parchment-dim)' }}>
    Loading...
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="accountability" element={<AccountabilityPage />} />
          <Route path="resources" element={<ResourcesPage />} />
        </Route>

        {/* Redirect old gamification route */}
        <Route path="gamification" element={<Navigate to="/accountability" replace />} />

        {/* Auth routes */}
        <Route path="armory/login" element={<LoginPage />} />
        <Route path="armory/register" element={<RegisterPage />} />

        {/* The Armory link redirects to login */}
        <Route path="armory" element={<Navigate to="/armory/login" replace />} />

        {/* Protected Armory routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<ArmoryLayout />}>
            <Route path="armory/dashboard" element={<DashboardPage />} />
            <Route path="armory/treasury" element={<TreasuryPage />} />
            <Route path="armory/scripture-memory" element={<ScriptureMemoryPage />} />
            <Route path="armory/discipline-den" element={<DisciplineDenPage />} />
            <Route path="armory/stats" element={<StatsPage />} />
            <Route path="armory/profile" element={<ProfilePage />} />

            {/* Admin routes */}
            <Route path="armory/admin/users" element={<ManageUsersPage />} />
            <Route path="armory/admin/award" element={<AwardCoinsPage />} />
            <Route path="armory/admin/relationships" element={<RelationshipsPage />} />
          </Route>
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
