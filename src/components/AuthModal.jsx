import React, { useState, useEffect, useRef } from "react";
import { Brain, X, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle2, Mail, Lock, User, Building2, AlertCircle } from "lucide-react";

export default function AuthModal({ isOpen, defaultTab = "login", onClose }) {
  const [tab, setTab] = useState(defaultTab);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) { setTab(defaultTab); setErrors({}); setSuccess(false); setLoading(false); }
  }, [isOpen, defaultTab]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    const errs = {};
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) errs.email = "Valid email required.";
    if (tab === "login") {
      if (!data.password || data.password.length < 6) errs.password = "Password must be at least 6 characters.";
    } else {
      if (!data.name || data.name.trim().length < 2) errs.name = "Full name required.";
      if (!data.password || data.password.length < 8) errs.password = "Password must be at least 8 characters.";
      if (data.password !== data.confirm) errs.confirm = "Passwords do not match.";
    }
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({}); setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1500);
  };

  const switchTab = (t) => { setTab(t); setErrors({}); setSuccess(false); setShowPass(false); setShowConfirm(false); };

  const features = [
    "Real-time financial visibility",
    "AI-powered business decisions",
    "Predictive cash flow alerts",
    "Smart expense intelligence",
    "Growth opportunity insights",
  ];

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose?.(); }}
      style={{ position:"fixed", inset:0, zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px", background:"rgba(0,0,0,0.75)", backdropFilter:"blur(12px)", animation:"authFadeIn 0.2s ease" }}
    >
      <div style={{ position:"relative", width:"100%", maxWidth:"880px", borderRadius:"24px", overflow:"hidden", boxShadow:"0 40px 100px rgba(0,0,0,0.55)", display:"flex", maxHeight:"95vh", animation:"authScaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}>

        {/* LEFT PANEL */}
        <div style={{ display:"flex", flexDirection:"column", justifyContent:"space-between", width:"42%", background:"#0D0D0D", padding:"40px", position:"relative", overflow:"hidden", flexShrink:0 }} className="hidden-on-mobile">
          <div style={{ position:"absolute", top:0, right:0, width:"200px", height:"200px", borderRadius:"50%", background:"rgba(255,107,0,0.18)", filter:"blur(60px)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", bottom:0, left:0, width:"260px", height:"260px", borderRadius:"50%", background:"rgba(255,107,0,0.09)", filter:"blur(60px)", pointerEvents:"none" }} />
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"48px" }}>
              <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:"#FF6B00", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 8px 24px rgba(255,107,0,0.35)" }}>
                <Brain style={{ width:"22px", height:"22px", color:"#fff" }} />
              </div>
              <span style={{ fontWeight:800, fontSize:"20px", color:"#fff", letterSpacing:"-0.5px" }}>BizMind <span style={{ color:"#FF6B00" }}>AI</span></span>
            </div>
            <h2 style={{ fontSize:"26px", fontWeight:800, color:"#fff", lineHeight:1.25, marginBottom:"12px" }}>
              {tab === "login" ? "Welcome back!" : "Start your journey"}
            </h2>
            <p style={{ fontSize:"13px", color:"#9CA3AF", lineHeight:1.65, marginBottom:"32px" }}>
              {tab === "login" ? "Sign in to your financial intelligence dashboard." : "Join thousands of small business owners making smarter decisions."}
            </p>
            <ul style={{ listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:"12px" }}>
              {features.map((f) => (
                <li key={f} style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                  <div style={{ width:"22px", height:"22px", borderRadius:"50%", background:"rgba(255,107,0,0.18)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <CheckCircle2 style={{ width:"13px", height:"13px", color:"#FF6B00" }} />
                  </div>
                  <span style={{ fontSize:"13px", color:"#D1D5DB" }}>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:"8px", padding:"10px 14px", borderRadius:"14px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.10)", width:"fit-content" }}>
            <Sparkles style={{ width:"15px", height:"15px", color:"#FF6B00" }} />
            <span style={{ fontSize:"12px", color:"#9CA3AF", fontWeight:500 }}>AI-Powered Financial Intelligence</span>
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div style={{ flex:1, background:"#FFFFFF", display:"flex", flexDirection:"column", overflowY:"auto", maxHeight:"95vh" }}>
          <button
            onClick={onClose}
            style={{ position:"absolute", top:"16px", right:"16px", zIndex:20, width:"36px", height:"36px", borderRadius:"50%", background:"#F4F4F5", border:"none", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"background 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background="#E5E7EB"}
            onMouseLeave={e => e.currentTarget.style.background="#F4F4F5"}
            aria-label="Close"
          >
            <X style={{ width:"16px", height:"16px", color:"#0D0D0D" }} />
          </button>

          <div style={{ flex:1, padding:"36px 36px 28px" }}>
            {/* Mobile logo */}
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"24px" }} className="show-on-mobile">
              <div style={{ width:"36px", height:"36px", borderRadius:"10px", background:"#0D0D0D", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Brain style={{ width:"18px", height:"18px", color:"#FF6B00" }} />
              </div>
              <span style={{ fontWeight:800, fontSize:"17px", color:"#0D0D0D" }}>BizMind <span style={{ color:"#FF6B00" }}>AI</span></span>
            </div>

            {/* Tab switcher */}
            <div style={{ display:"flex", background:"#F4F4F5", borderRadius:"16px", padding:"4px", marginBottom:"28px" }}>
              {["login", "signup"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => switchTab(t)}
                  style={{
                    flex:1, padding:"10px", borderRadius:"12px", border:"none", fontWeight:700, fontSize:"13px", cursor:"pointer", transition:"all 0.2s",
                    background: tab === t ? (t === "login" ? "#0D0D0D" : "#FF6B00") : "transparent",
                    color: tab === t ? "#fff" : "#6B7280",
                    boxShadow: tab === t ? "0 2px 12px rgba(0,0,0,0.2)" : "none",
                  }}
                >
                  {t === "login" ? "Login" : "Sign Up"}
                </button>
              ))}
            </div>

            {/* Success state */}
            {success ? (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", padding:"32px 0", gap:"20px" }}>
                <div style={{ width:"80px", height:"80px", borderRadius:"50%", background:"rgba(255,107,0,0.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <CheckCircle2 style={{ width:"42px", height:"42px", color:"#FF6B00" }} />
                </div>
                <div>
                  <h3 style={{ fontSize:"22px", fontWeight:800, color:"#0D0D0D", marginBottom:"8px" }}>
                    {tab === "login" ? "Welcome back! 🎉" : "Account Created! 🚀"}
                  </h3>
                  <p style={{ fontSize:"13px", color:"#6B7280", lineHeight:1.65 }}>
                    {tab === "login" ? "You're now logged in. Redirecting to your dashboard…" : "Your BizMind AI account is ready. Check your email to verify!"}
                  </p>
                </div>
                <button onClick={onClose} style={{ padding:"12px 32px", background:"#0D0D0D", color:"#fff", border:"none", borderRadius:"14px", fontWeight:700, fontSize:"14px", cursor:"pointer" }}>
                  {tab === "login" ? "Go to Dashboard" : "Got it!"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                {tab === "signup" && (
                  <>
                    <Field id="auth-name" name="name" label="Full Name" required icon={<User style={{width:"15px",height:"15px",color:"#9CA3AF"}}/>} placeholder="John Smith" error={errors.name} />
                    <Field id="auth-company" name="company" label="Business Name" optional icon={<Building2 style={{width:"15px",height:"15px",color:"#9CA3AF"}}/>} placeholder="Your Business Co." />
                  </>
                )}
                <Field id="auth-email" name="email" label="Email Address" required type="email" autoComplete="email" icon={<Mail style={{width:"15px",height:"15px",color:"#9CA3AF"}}/>} placeholder="you@business.com" error={errors.email} />
                <PasswordField
                  id="auth-password" name="password"
                  label="Password" required
                  show={showPass} onToggle={() => setShowPass(p=>!p)}
                  placeholder={tab === "login" ? "Your password" : "Min. 8 characters"}
                  autoComplete={tab === "login" ? "current-password" : "new-password"}
                  error={errors.password}
                  extra={tab === "login" && <button type="button" style={{fontSize:"11px",color:"#FF6B00",background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Forgot password?</button>}
                />
                {tab === "signup" && (
                  <PasswordField
                    id="auth-confirm" name="confirm"
                    label="Confirm Password" required
                    show={showConfirm} onToggle={() => setShowConfirm(p=>!p)}
                    placeholder="Re-enter your password" autoComplete="new-password"
                    error={errors.confirm}
                  />
                )}
                {tab === "signup" && (
                  <label style={{ display:"flex", alignItems:"flex-start", gap:"10px", cursor:"pointer" }}>
                    <input type="checkbox" name="terms" required style={{ width:"15px", height:"15px", marginTop:"2px", accentColor:"#FF6B00", cursor:"pointer" }} />
                    <span style={{ fontSize:"11.5px", color:"#6B7280", lineHeight:1.6 }}>
                      I agree to BizMind AI's <span style={{ color:"#FF6B00", fontWeight:700, cursor:"pointer" }}>Terms of Service</span> and <span style={{ color:"#FF6B00", fontWeight:700, cursor:"pointer" }}>Privacy Policy</span>
                    </span>
                  </label>
                )}
                <button
                  type="submit" disabled={loading}
                  style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", padding:"14px", borderRadius:"14px", border:"none", fontWeight:700, fontSize:"14px", color:"#fff", background:"#FF6B00", boxShadow:"0 4px 20px rgba(255,107,0,0.35)", cursor:loading?"not-allowed":"pointer", opacity:loading?0.75:1, transition:"all 0.2s", marginTop:"4px" }}
                  onMouseEnter={e => { if(!loading) e.currentTarget.style.background="#E05E00"; }}
                  onMouseLeave={e => { if(!loading) e.currentTarget.style.background="#FF6B00"; }}
                >
                  {loading ? (
                    <><Spinner /> <span>{tab === "login" ? "Signing in…" : "Creating account…"}</span></>
                  ) : (
                    <><span>{tab === "login" ? "Sign In to Dashboard" : "Create My Account"}</span><ArrowRight style={{ width:"16px", height:"16px" }} /></>
                  )}
                </button>

                <div style={{ display:"flex", alignItems:"center", gap:"12px", margin:"2px 0" }}>
                  <div style={{ flex:1, height:"1px", background:"#E5E7EB" }} />
                  <span style={{ fontSize:"11px", color:"#9CA3AF", fontWeight:500 }}>or continue with</span>
                  <div style={{ flex:1, height:"1px", background:"#E5E7EB" }} />
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
                  <SocialBtn icon="google" label="Google" />
                  <SocialBtn icon="microsoft" label="Microsoft" />
                </div>

                <p style={{ textAlign:"center", fontSize:"12px", color:"#6B7280", marginTop:"4px" }}>
                  {tab === "login" ? "Don't have an account? " : "Already have an account? "}
                  <button type="button" onClick={() => switchTab(tab === "login" ? "signup" : "login")} style={{ color:"#FF6B00", fontWeight:700, background:"none", border:"none", cursor:"pointer" }}>
                    {tab === "login" ? "Sign Up Free" : "Sign In"}
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes authFadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes authScaleIn { from { opacity:0; transform:scale(0.93) translateY(14px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @media (max-width: 767px) { .hidden-on-mobile { display:none !important; } }
        @media (min-width: 768px) { .show-on-mobile { display:none !important; } }
      `}</style>
    </div>
  );
}

function Field({ id, name, label, required, optional, type="text", autoComplete, icon, placeholder, error }) {
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"6px" }}>
        <label htmlFor={id} style={{ fontSize:"12px", fontWeight:600, color:"#0D0D0D" }}>
          {label} {required && <span style={{ color:"#FF6B00" }}>*</span>}
          {optional && <span style={{ color:"#9CA3AF", fontWeight:400 }}> (optional)</span>}
        </label>
      </div>
      <div style={{ position:"relative" }}>
        <div style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)" }}>{icon}</div>
        <input id={id} name={name} type={type} autoComplete={autoComplete} placeholder={placeholder}
          style={{ width:"100%", paddingLeft:"40px", paddingRight:"14px", paddingTop:"12px", paddingBottom:"12px", borderRadius:"12px", border:`1.5px solid ${error ? "#F87171" : "transparent"}`, background: error ? "#FEF2F2" : "#F4F4F5", fontSize:"13px", color:"#0D0D0D", outline:"none", boxSizing:"border-box", transition:"all 0.15s" }}
          onFocus={e => { e.target.style.border="1.5px solid #FF6B00"; e.target.style.background="#FFFBF5"; }}
          onBlur={e => { e.target.style.border=`1.5px solid ${error ? "#F87171" : "transparent"}`; e.target.style.background=error?"#FEF2F2":"#F4F4F5"; }}
        />
      </div>
      {error && <p style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"11px", color:"#EF4444", marginTop:"5px", fontWeight:500 }}><AlertCircle style={{width:"12px",height:"12px"}}/>{error}</p>}
    </div>
  );
}

function PasswordField({ id, name, label, required, show, onToggle, placeholder, autoComplete, error, extra }) {
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"6px" }}>
        <label htmlFor={id} style={{ fontSize:"12px", fontWeight:600, color:"#0D0D0D" }}>
          {label} {required && <span style={{ color:"#FF6B00" }}>*</span>}
        </label>
        {extra}
      </div>
      <div style={{ position:"relative" }}>
        <div style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)" }}>
          <Lock style={{ width:"15px", height:"15px", color:"#9CA3AF" }} />
        </div>
        <input id={id} name={name} type={show?"text":"password"} autoComplete={autoComplete} placeholder={placeholder}
          style={{ width:"100%", paddingLeft:"40px", paddingRight:"44px", paddingTop:"12px", paddingBottom:"12px", borderRadius:"12px", border:`1.5px solid ${error ? "#F87171" : "transparent"}`, background:error?"#FEF2F2":"#F4F4F5", fontSize:"13px", color:"#0D0D0D", outline:"none", boxSizing:"border-box", transition:"all 0.15s" }}
          onFocus={e => { e.target.style.border="1.5px solid #FF6B00"; e.target.style.background="#FFFBF5"; }}
          onBlur={e => { e.target.style.border=`1.5px solid ${error?"#F87171":"transparent"}`; e.target.style.background=error?"#FEF2F2":"#F4F4F5"; }}
        />
        <button type="button" onClick={onToggle} style={{ position:"absolute", right:"14px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#9CA3AF", padding:0 }}>
          {show ? <EyeOff style={{width:"16px",height:"16px"}}/> : <Eye style={{width:"16px",height:"16px"}}/>}
        </button>
      </div>
      {error && <p style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"11px", color:"#EF4444", marginTop:"5px", fontWeight:500 }}><AlertCircle style={{width:"12px",height:"12px"}}/>{error}</p>}
    </div>
  );
}

function SocialBtn({ icon, label }) {
  const icons = {
    google: (<svg style={{width:"16px",height:"16px"}} viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>),
    microsoft: (<svg style={{width:"16px",height:"16px"}} viewBox="0 0 23 23"><path fill="#f3f3f3" d="M0 0h23v23H0z"/><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>),
  };
  return (
    <button type="button"
      style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", padding:"11px", borderRadius:"12px", border:"1.5px solid #E5E7EB", background:"#fff", fontSize:"12px", fontWeight:600, color:"#0D0D0D", cursor:"pointer", transition:"all 0.15s" }}
      onMouseEnter={e => { e.currentTarget.style.background="#F4F4F5"; e.currentTarget.style.borderColor="#D1D5DB"; }}
      onMouseLeave={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.borderColor="#E5E7EB"; }}
    >
      {icons[icon]} <span>{label}</span>
    </button>
  );
}

function Spinner() {
  return (
    <svg style={{width:"16px",height:"16px",animation:"spin 1s linear infinite"}} viewBox="0 0 24 24" fill="none">
      <circle style={{opacity:0.25}} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path style={{opacity:0.75}} fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      <style>{"@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}"}</style>
    </svg>
  );
}
