import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public Components & Pages
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import WhyBizMindPage from './pages/WhyBizMindPage';
import SolutionsPage from './pages/SolutionsPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ExploreBusinessesPage from './pages/ExploreBusinessesPage';
import FeaturesPage from './pages/FeaturesPage';
import AiAdvisorPage from './pages/AiAdvisorPage';
import CalculatorPage from './pages/CalculatorPage';
import AuthPage from './pages/AuthPage';
import BusinessDetailPage from './pages/BusinessDetailPage';

// User Dashboard Layout & Pages
import UserDashboardLayout from './components/dashboard/UserDashboardLayout';
import UserDashboardOverview from './pages/dashboard/UserDashboardOverview';
import UserProfilePage from './pages/dashboard/UserProfilePage';
import UserBusinessesPage from './pages/dashboard/UserBusinessesPage';
import UserTransactionsPage from './pages/dashboard/UserTransactionsPage';
import UserInvoicesPage from './pages/dashboard/UserInvoicesPage';

// Admin Dashboard Layout & Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminBusinessesPage from './pages/admin/AdminBusinessesPage';
import AdminAddBusinessPage from './pages/admin/AdminAddBusinessPage';
import AdminEditBusinessPage from './pages/admin/AdminEditBusinessPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminUserDetailPage from './pages/admin/AdminUserDetailPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

import { Sparkles, CheckCircle2 } from 'lucide-react';

/**
 * Public Site Layout wrapper with persistent top Navbar and Action Modal
 */
function PublicLayout({ children, activeModal, setActiveModal }) {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0D0D0D] flex flex-col font-sans selection:bg-[#FF6B00]/20 selection:text-[#FF6B00]">
      <Navbar
        onAuth={(mode) => navigate(mode === 'signup' ? '/register' : '/login')}
        onLogin={() => navigate('/login')}
        onSignUp={() => navigate('/register')}
        onLiveDemo={() =>
          setActiveModal({
            title: 'Live FinTech Intelligence Sandbox Active',
            message: 'Experience real-time cash flow graphs, AI recommendations, and margin analysis in sample mode.',
            icon: Sparkles
          })
        }
        onNavigate={(pageId) => {
          if (pageId === 'businesses' || pageId === 'explore-businesses') {
            navigate('/businesses');
          } else if (pageId === 'auth' || pageId === 'login') {
            navigate('/login');
          } else if (pageId === 'signup') {
            navigate('/register');
          } else if (pageId === 'home') {
            navigate('/');
            window.location.hash = '';
          } else {
            navigate(`/#${pageId}`);
          }
        }}
        currentUser={currentUser}
        onLogout={logout}
      />

      {/* Action Notification Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFFFF] border border-gray-100 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center mx-auto">
              {activeModal.icon ? <activeModal.icon className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
            </div>
            <h3 className="text-xl font-bold text-[#0D0D0D]">
              {typeof activeModal === 'string' ? activeModal : activeModal.title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {activeModal.message || 'The action was triggered cleanly through the platform controls.'}
            </p>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 px-4 bg-[#0D0D0D] hover:bg-black text-white font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

/**
 * Landing Page supporting interactive hash-based views & sections
 */
function MainLandingPage({ setActiveModal }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getPageFromHash = () => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (hash === 'problem' || hash === 'why-bizmind') return 'problem';
    if (hash === 'solutions') return 'solutions';
    if (hash === 'how-it-works') return 'how-it-works';
    if (hash === 'features') return 'features';
    if (hash === 'ai-advisor' || hash === 'advisor') return 'ai-advisor';
    if (hash === 'calculator') return 'calculator';
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState(getPageFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      const page = getPageFromHash();
      setCurrentPage(page);
      if (page !== 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [location]);

  const handleNavigate = (pageId) => {
    if (pageId === 'businesses' || pageId === 'explore-businesses') {
      navigate('/businesses');
      return;
    }
    if (pageId === 'login') {
      navigate('/login');
      return;
    }
    if (pageId === 'signup') {
      navigate('/register');
      return;
    }

    let targetPage = pageId;
    if (pageId === 'why-bizmind' || pageId === 'problem') targetPage = 'problem';
    if (pageId === 'advisor') targetPage = 'ai-advisor';

    setCurrentPage(targetPage);

    if (targetPage === 'home') {
      window.location.hash = '';
      window.history.pushState(null, '', window.location.pathname);
    } else {
      window.location.hash = `#${targetPage}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLiveDemo = () => {
    setActiveModal({
      title: 'Live FinTech Intelligence Sandbox Active',
      message: 'Experience real-time cash flow graphs, AI recommendations, and margin analysis in sample mode.',
      icon: Sparkles
    });
  };

  switch (currentPage) {
    case 'problem':
      return (
        <WhyBizMindPage
          onBackToHome={() => handleNavigate('home')}
          onExploreBizMind={() => handleNavigate('solutions')}
          onExploreIdeas={() => navigate('/businesses')}
        />
      );
    case 'solutions':
      return (
        <SolutionsPage
          onBackToHome={() => handleNavigate('home')}
          onGetStarted={() => navigate('/register')}
        />
      );
    case 'how-it-works':
      return (
        <HowItWorksPage
          onBackToHome={() => handleNavigate('home')}
          onGetStarted={() => navigate('/register')}
        />
      );
    case 'features':
      return (
        <FeaturesPage
          onBackToHome={() => handleNavigate('home')}
          onGetStarted={() => navigate('/register')}
        />
      );
    case 'ai-advisor':
      return (
        <AiAdvisorPage
          onBackToHome={() => handleNavigate('home')}
          onGetStarted={() => navigate('/register')}
        />
      );
    case 'calculator':
      return (
        <CalculatorPage
          onBackToHome={() => handleNavigate('home')}
          onGetStarted={() => navigate('/register')}
        />
      );
    default:
      return (
        <HomePage
          onNavigate={handleNavigate}
          onSignUp={() => navigate('/register')}
          onLiveDemo={handleLiveDemo}
          onExploreBizMind={() => handleNavigate('solutions')}
          onExploreIdeas={() => navigate('/businesses')}
        />
      );
  }
}

/**
 * Main Application Routes Definition
 */
export default function App() {
  const [activeModal, setActiveModal] = useState(null);
  const navigate = useNavigate();

  return (
    <AuthProvider>
      <Routes>
        {/* ─── PUBLIC ROUTES ─────────────────────────────────────────── */}
        <Route
          path="/"
          element={
            <PublicLayout activeModal={activeModal} setActiveModal={setActiveModal}>
              <MainLandingPage setActiveModal={setActiveModal} />
            </PublicLayout>
          }
        />

        <Route
          path="/businesses"
          element={
            <PublicLayout activeModal={activeModal} setActiveModal={setActiveModal}>
              <ExploreBusinessesPage
                onBackToHome={() => navigate('/')}
                onGetStarted={() => navigate('/register')}
              />
            </PublicLayout>
          }
        />

        <Route
          path="/businesses/:slug"
          element={
            <PublicLayout activeModal={activeModal} setActiveModal={setActiveModal}>
              <BusinessDetailPage />
            </PublicLayout>
          }
        />

        <Route
          path="/login"
          element={
            <AuthPage
              initialMode="login"
              onBackToHome={() => navigate('/')}
            />
          }
        />

        <Route
          path="/register"
          element={
            <AuthPage
              initialMode="signup"
              onBackToHome={() => navigate('/')}
            />
          }
        />

        {/* ─── USER DASHBOARD ROUTES ──────────────────────────────────── */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserDashboardOverview />} />
          <Route path="advisor" element={<AiAdvisorPage onBackToHome={() => navigate('/dashboard')} onGetStarted={() => navigate('/dashboard')} />} />
          <Route path="profile" element={<UserProfilePage />} />
          <Route path="businesses" element={<UserBusinessesPage />} />
          <Route path="transactions" element={<UserTransactionsPage />} />
          <Route path="invoices" element={<UserInvoicesPage />} />
        </Route>

        {/* ─── ADMIN DASHBOARD ROUTES ─────────────────────────────────── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="businesses" element={<AdminBusinessesPage />} />
          <Route path="businesses/add" element={<AdminAddBusinessPage />} />
          <Route path="businesses/edit/:id" element={<AdminEditBusinessPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="users/:id" element={<AdminUserDetailPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* ─── FALLBACK / CATCH-ALL ROUTE ────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
