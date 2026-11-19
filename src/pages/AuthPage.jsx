import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Brain,
  Mail,
  Lock,
  User,
  Building2,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Briefcase,
  HelpCircle
} from 'lucide-react';

export default function AuthPage({
  initialMode = 'login',
  onBackToHome,
  onLoginSuccess,
  currentUser: propUser,
  onLogout: propLogout
}) {
  const navigate = useNavigate();
  const { login, register, currentUser: contextUser, logout: contextLogout } = useAuth();
  const effectiveUser = propUser || contextUser;

  const [mode, setMode] = useState(initialMode); // 'login' | 'signup' | 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('Retail & Commerce');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Form Errors
  const [errors, setErrors] = useState({});

  // Password strength calculator
  const calculateStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const strength = calculateStrength(password);

  const getStrengthLabel = (s) => {
    if (s === 0) return { label: 'Empty', color: 'bg-gray-200' };
    if (s <= 25) return { label: 'Weak', color: 'bg-red-500' };
    if (s <= 50) return { label: 'Fair', color: 'bg-yellow-500' };
    if (s <= 75) return { label: 'Good', color: 'bg-blue-500' };
    return { label: 'Bank-Grade (Strong)', color: 'bg-[#FF6B00]' };
  };

  // 1-Click Demo Credentials loader for testing
  const handleLoadDemoCredentials = (targetRole = 'admin') => {
    if (targetRole === 'admin') {
      setEmail('admin@bizmind.ai');
      setPassword('Admin@BizMind2026!');
      setMode('login');
      setErrors({});
      setNotification({
        type: 'info',
        message: 'Admin credentials loaded! Click "Sign In to Workspace" to access Admin Dashboard.',
      });
    } else {
      setEmail('founder@apexretail.com');
      setPassword('Founder2026!');
      setMode('login');
      setErrors({});
      setNotification({
        type: 'info',
        message: 'User credentials loaded! Click "Sign In to Workspace" to access User Dashboard.',
      });
    }
    setTimeout(() => setNotification(null), 5000);
  };

  // Form Submission via real Node.js / Express backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (mode === 'login') {
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Please enter a valid business email address.';
      }
      if (!password || password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters.';
      }
    } else if (mode === 'signup') {
      if (!fullName || fullName.trim().length < 2) {
        newErrors.fullName = 'Please enter your full name.';
      }
      if (!businessName || businessName.trim().length < 2) {
        newErrors.businessName = 'Please enter your business or legal entity name.';
      }
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Please enter a valid business email address.';
      }
      if (!password || password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters.';
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
      }
      if (!termsAccepted) {
        newErrors.terms = 'You must accept the Terms of Service & Privacy Policy.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email.trim().toLowerCase(), password);
        const user = res?.user;
        const role = user?.role || 'user';

        if (onLoginSuccess) {
          onLoginSuccess(user);
        }

        // Role-Based Redirection: Admins to /admin/dashboard, users to /dashboard
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        // Signup: Normal registrations always receive the "user" role
        const [firstName, ...rest] = fullName.trim().split(' ');
        const lastName = rest.join(' ') || 'User';

        const res = await register({
          firstName,
          lastName,
          email: email.trim().toLowerCase(),
          password,
          businessName: businessName.trim(),
          industry,
        });

        if (onLoginSuccess) {
          onLoginSuccess(res?.user);
        }

        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Authentication request error:', err);
      setNotification({
        type: 'error',
        message: err.message || 'Authentication failed. Please verify your credentials.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail || !/\S+@\S+\.\S+/.test(forgotEmail)) {
      setErrors({ forgotEmail: 'Please enter a valid registered email address.' });
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setForgotSent(true);
    }, 1000);
  };

  // If already logged in, show official workspace session card with role-aware redirection
  if (effectiveUser) {
    const isAdmin = effectiveUser.role === 'admin';
    return (
      <div className="min-h-[85vh] bg-[#F4F4F5]/60 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="bg-[#FFFFFF] border border-gray-200 rounded-3xl max-w-xl w-full p-8 sm:p-10 shadow-2xl space-y-8 animate-fade-in text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#0D0D0D] border-2 border-[#FF6B00] text-[#FF6B00] flex items-center justify-center mx-auto shadow-xl">
            <ShieldCheck className="w-10 h-10 text-[#FF6B00]" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FF6B00]/10 text-[#FF6B00] uppercase tracking-wider">
              ● Official Session Active
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D]">
              Welcome back, {effectiveUser.firstName || effectiveUser.fullName || effectiveUser.name || 'User'}!
            </h2>
            <p className="text-gray-500 text-sm">
              You are signed in as <span className="font-semibold text-[#0D0D0D]">{effectiveUser.email}</span>
            </p>
          </div>

          <div className="bg-[#F4F4F5] p-5 rounded-2xl border border-gray-200/80 text-left space-y-3">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Account Email:</span>
              <span className="font-semibold text-[#0D0D0D]">{effectiveUser.email}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Verified System Role:</span>
              <span className="font-bold text-[#FF6B00] uppercase">{effectiveUser.role || 'user'}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Access Level:</span>
              <span className="font-semibold text-[#0D0D0D]">
                {isAdmin ? 'Super Administrator (Full System)' : 'Registered Founder / Member'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to={isAdmin ? '/admin/dashboard' : '/dashboard'}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#FF6B00] hover:bg-[#E05300] text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all cursor-pointer text-sm"
            >
              <span>{isAdmin ? 'Open Admin Console' : 'Go to User Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={async () => {
                await contextLogout();
                if (propLogout) propLogout();
              }}
              className="py-3 px-6 bg-[#0D0D0D] hover:bg-black text-white font-semibold rounded-xl transition-colors cursor-pointer text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F5] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      {/* ─── Top Header Navigation ────────────────────────────────────── */}
      <div className="w-full max-w-6xl mb-6 flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#0D0D0D] transition-colors py-2 px-3 rounded-lg hover:bg-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to BizMind AI</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-gray-200">
          <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
          <span>256-Bit Bank-Grade SSL Encryption</span>
        </div>
      </div>

      {/* ─── Main Auth Portal Card ───────────────────────────────────── */}
      <div className="w-full max-w-6xl bg-[#FFFFFF] rounded-3xl border border-gray-200/80 shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* ─── LEFT COLUMN: Official FinTech Showcase (Desktop) ────────── */}
        <div className="hidden lg:flex lg:w-5/12 bg-[#0D0D0D] text-white p-10 xl:p-12 flex-col justify-between relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF6B00]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Info */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white border border-gray-200/90 flex items-center justify-center p-1 shadow-lg shadow-orange-500/20">
                <img
                  src="/images/logo_transparent.png"
                  alt="BizMind AI Official Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                BizMind <span className="text-[#FF6B00]">AI</span>
              </span>
            </div>

            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/30">
                Official Business Portal
              </span>
              <h1 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight">
                {mode === 'signup'
                  ? 'Join 10,000+ business owners making confident financial decisions.'
                  : 'Welcome back to your financial intelligence headquarters.'}
              </h1>
              <p className="text-gray-400 text-sm xl:text-base leading-relaxed">
                Connect your business accounts, see real cash velocity, and receive automated executive decisions 24/7.
              </p>
            </div>

            {/* Live KPI Metric Snippet */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 xl:p-5 backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#FF6B00]" />
                  Live Intelligence Preview
                </span>
                <span className="text-[#FF6B00] font-mono font-bold">+28.4% Margin</span>
              </div>
              <p className="text-xs text-gray-300 italic">
                "BizMind flagged a supplier overcharge pattern within 48 hours of onboarding, saving us $7,400 this quarter."
              </p>
              <div className="flex items-center gap-2 pt-1 border-t border-white/10">
                <div className="w-6 h-6 rounded-full bg-[#FF6B00] text-white flex items-center justify-center text-xs font-bold">
                  D
                </div>
                <span className="text-xs text-gray-400">David R., Managing Partner — Vertex Logistics</span>
              </div>
            </div>
          </div>

          {/* Bottom Security / Trust Guarantees */}
          <div className="relative z-10 space-y-4 pt-8 border-t border-white/10">
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF6B00] flex-shrink-0" />
                <span>Zero Hidden Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF6B00] flex-shrink-0" />
                <span>Read-Only Bank Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF6B00] flex-shrink-0" />
                <span>SOC2 Type II Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF6B00] flex-shrink-0" />
                <span>Cancel Anytime</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Built exclusively for Small Business Owners & Founders</span>
            </div>
          </div>
        </div>

        {/* ─── RIGHT COLUMN: Official Authentication Card Form ─────────── */}
        <div className="lg:w-7/12 p-6 sm:p-10 xl:p-14 flex flex-col justify-center">
          
          {/* Notification banner */}
          {notification && (
            <div className="mb-6 p-4 rounded-xl bg-orange-50 border border-orange-200 text-[#0D0D0D] text-xs font-medium flex items-center gap-3 animate-fade-in">
              <Sparkles className="w-4 h-4 text-[#FF6B00] flex-shrink-0" />
              <span>{notification.message}</span>
            </div>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {mode === 'forgot' ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setForgotSent(false); setErrors({}); }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6B00] hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </button>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D]">
                  Reset Your Password
                </h2>
                <p className="text-sm text-gray-500">
                  Enter your registered work email and we will send you a secure verification link to regain access.
                </p>
              </div>

              {forgotSent ? (
                <div className="p-6 rounded-2xl bg-[#FFF7ED] border border-orange-200 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0D0D0D]">Password Reset Email Sent</h3>
                  <p className="text-xs text-gray-600">
                    We have dispatched a reset link to <span className="font-semibold text-[#0D0D0D]">{forgotEmail}</span>. Please check your inbox and spam folder.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setForgotSent(false); }}
                    className="w-full py-3 bg-[#0D0D0D] hover:bg-black text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
                      Work Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent text-sm bg-white"
                      />
                    </div>
                    {errors.forgotEmail && (
                      <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.forgotEmail}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#FF6B00] hover:bg-[#E05E00] text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <span>Sending Instructions...</span>
                    ) : (
                      <>
                        <span>Send Password Reset Link</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* STANDARD LOGIN / SIGN UP VIEW */
            <div className="space-y-6">
              
              {/* Mode Switcher Pill */}
              <div className="flex bg-[#F4F4F5] p-1.5 rounded-2xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrors({}); }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                    mode === 'login'
                      ? 'bg-[#0D0D0D] text-white shadow-md'
                      : 'text-gray-600 hover:text-[#0D0D0D]'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Log In</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setErrors({}); }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/25'
                      : 'text-gray-600 hover:text-[#0D0D0D]'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Sign Up / Register</span>
                </button>
              </div>

              {/* Heading */}
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D]">
                  {mode === 'login' ? 'Sign in to BizMind AI' : 'Create your Business Account'}
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm">
                  {mode === 'login'
                    ? 'Enter your credentials or use Single Sign-On to access your dashboard.'
                    : 'Get started in under 2 minutes. No credit card required.'}
                </p>
              </div>

              {/* Fast Single Sign-On (Google & Microsoft) */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleLoadDemoCredentials}
                    className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-gray-200 hover:border-[#0D0D0D] bg-white hover:bg-gray-50 text-xs font-bold text-[#0D0D0D] transition-colors cursor-pointer"
                  >
                    {/* Google SVG */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                    <span>Google SSO</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLoadDemoCredentials}
                    className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-gray-200 hover:border-[#0D0D0D] bg-white hover:bg-gray-50 text-xs font-bold text-[#0D0D0D] transition-colors cursor-pointer"
                  >
                    {/* Microsoft SVG */}
                    <svg className="w-4 h-4" viewBox="0 0 23 23">
                      <path fill="#f35325" d="M1 1h10v10H1z"/>
                      <path fill="#81bc06" d="M12 1h10v10H12z"/>
                      <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                      <path fill="#ffba08" d="M12 12h10v10H12z"/>
                    </svg>
                    <span>Microsoft Work</span>
                  </button>
                </div>

                {/* 1-Click Demo Fill Banners */}
                {mode === 'login' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleLoadDemoCredentials('admin')}
                      className="p-2.5 rounded-xl bg-orange-50/70 border border-orange-200/80 flex items-center justify-between cursor-pointer hover:bg-orange-100/70 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#0D0D0D]">
                        <span className="w-5 h-5 rounded-full bg-[#0D0D0D] text-[#FF6B00] flex items-center justify-center text-[10px] font-bold">👑</span>
                        <span>Autofill Admin</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#FF6B00]">admin@ →</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLoadDemoCredentials('user')}
                      className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#0D0D0D]">
                        <span className="w-5 h-5 rounded-full bg-[#FF6B00] text-white flex items-center justify-center text-[10px] font-bold">⚡</span>
                        <span>Autofill Founder</span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-500">user@ →</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-gray-200 w-full" />
                <span className="bg-white px-3 text-xs font-medium text-gray-400 uppercase tracking-wider absolute">
                  Or official credentials
                </span>
              </div>

              {/* Main Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* SIGN UP ADDITIONAL FIELDS */}
                {mode === 'signup' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Alex Morgan"
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] text-xs sm:text-sm bg-white"
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
                        Business Entity Name *
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="Apex Solutions LLC"
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] text-xs sm:text-sm bg-white"
                        />
                      </div>
                      {errors.businessName && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.businessName}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Industry Selector for Signup */}
                {mode === 'signup' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
                      Business Sector
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] text-xs sm:text-sm bg-white cursor-pointer"
                      >
                        <option value="Retail & Commerce">Retail & Physical Commerce</option>
                        <option value="E-Commerce & DTC">E-Commerce & Online Store</option>
                        <option value="Restaurant & Hospitality">Restaurant, Cafe & Hospitality</option>
                        <option value="Professional Services & Agency">Professional Services & Agency</option>
                        <option value="Trades, Construction & Logistics">Trades, Construction & Logistics</option>
                        <option value="Tech Startup & Software">Tech Startup & Software</option>
                        <option value="Manufacturing & Wholesale">Manufacturing & Wholesale</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Work Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
                    Work Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="founder@company.com"
                      autoComplete="email"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] text-xs sm:text-sm bg-white"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
                      Password *
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => { setMode('forgot'); setForgotSent(false); }}
                        className="text-xs font-semibold text-[#FF6B00] hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === 'login' ? '••••••••' : 'Min. 8 characters'}
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] text-xs sm:text-sm bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.password}</p>
                  )}

                  {/* Password Strength Meter (Signup Mode) */}
                  {mode === 'signup' && password.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex">
                        <div
                          className={`h-full transition-all duration-300 ${getStrengthLabel(strength).color}`}
                          style={{ width: `${Math.max(15, strength)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-500">
                        <span>Security strength:</span>
                        <span className="font-bold text-[#0D0D0D]">{getStrengthLabel(strength).label}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password (Signup Mode) */}
                {mode === 'signup' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        autoComplete="new-password"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] text-xs sm:text-sm bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                )}

                {/* Remember Me / Terms Checkboxes */}
                {mode === 'login' ? (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded accent-[#FF6B00] cursor-pointer"
                      />
                      <span>Keep me securely logged in for 30 days</span>
                    </label>
                  </div>
                ) : (
                  <div className="space-y-1 pt-1">
                    <label className="flex items-start gap-2 cursor-pointer text-xs text-gray-600">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded accent-[#FF6B00] cursor-pointer"
                      />
                      <span className="leading-relaxed">
                        I agree to BizMind AI's{' '}
                        <a href="#terms" className="text-[#FF6B00] font-bold hover:underline">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#privacy" className="text-[#FF6B00] font-bold hover:underline">
                          Financial Privacy Policy
                        </a>.
                      </span>
                    </label>
                    {errors.terms && (
                      <p className="text-[11px] text-red-600">{errors.terms}</p>
                    )}
                  </div>
                )}

                {/* Primary Submit Action */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-[#FF6B00] hover:bg-[#E05E00] shadow-orange-500/25 hover:shadow-orange-500/40'
                      : 'bg-[#0D0D0D] hover:bg-black shadow-black/20'
                  }`}
                >
                  {loading ? (
                    <span>Authenticating Workspace...</span>
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Sign In to Workspace' : 'Create Free Account & Start'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Mode Switch Link */}
              <div className="pt-4 border-t border-gray-100 text-center">
                {mode === 'login' ? (
                  <p className="text-xs text-gray-600">
                    Don't have a BizMind AI account yet?{' '}
                    <button
                      type="button"
                      onClick={() => { setMode('signup'); setErrors({}); }}
                      className="font-bold text-[#FF6B00] hover:underline cursor-pointer"
                    >
                      Sign up for free
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-gray-600">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setMode('login'); setErrors({}); }}
                      className="font-bold text-[#0D0D0D] hover:underline cursor-pointer"
                    >
                      Sign in here
                    </button>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Footer Trust Badges ─────────────────────────────────────── */}
      <div className="mt-8 text-center space-y-2">
        <p className="text-xs text-gray-400">
          BizMind AI uses read-only, AES-256 encrypted protocols. We never share or sell your business data.
        </p>
        <p className="text-[11px] text-gray-400">
          © {new Date().getFullYear()} BizMind AI Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
}
