import React from 'react';
import { ShieldCheck, Key, Lock, Terminal, AlertTriangle, CheckCircle2, Server, Database } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSettingsPage() {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in pb-12">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0D0D0D] tracking-tight">
          System Administration & Security Policies
        </h2>
        <p className="text-xs text-gray-400">
          Server-side role-based access configuration, audit policy enforcement, and credential management.
        </p>
      </div>

      {/* Security Posture Summary */}
      <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0D0D0D]">Security Architecture & RBAC Status</h3>
            <p className="text-xs text-gray-400">Strict server-side role validation in effect</p>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Enforced</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#F4F4F5] border border-gray-200 space-y-1">
            <span className="font-bold text-gray-500 uppercase tracking-wider block">Authentication Standard</span>
            <strong className="text-sm text-[#0D0D0D] block">HMAC-SHA256 JWT</strong>
            <span className="text-gray-400">Signed with server-side secret</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F4F4F5] border border-gray-200 space-y-1">
            <span className="font-bold text-gray-500 uppercase tracking-wider block">Password Cryptography</span>
            <strong className="text-sm text-[#0D0D0D] block">Bcrypt (12 Salt Rounds)</strong>
            <span className="text-gray-400">Never exposed to client state</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F4F4F5] border border-gray-200 space-y-1">
            <span className="font-bold text-gray-500 uppercase tracking-wider block">Role Authorization</span>
            <strong className="text-sm text-[#FF6B00] block">protect + authorizeRoles</strong>
            <span className="text-gray-400">Non-spoofable server middleware</span>
          </div>
        </div>
      </div>

      {/* Admin Credential Seeding & Rotation Documentation */}
      <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h3 className="text-base font-bold text-[#0D0D0D]">Administrator Account Provisioning & Rotation</h3>
          <p className="text-xs text-gray-400">How to initialize or rotate administrator credentials securely</p>
        </div>

        <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
          <p>
            Administrative accounts can <strong>never</strong> be registered via the public signup portal. All public signups are strictly restricted by server-side controllers to the <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-[#0D0D0D]">user</code> role.
          </p>

          <div className="bg-[#0D0D0D] text-gray-300 p-4 rounded-xl font-mono text-xs space-y-2 border border-[#1F1F1F]">
            <div className="flex items-center gap-2 text-[#FF6B00] font-bold">
              <Terminal className="w-4 h-4" />
              <span>Admin Setup Environment Variables (.env)</span>
            </div>
            <pre className="text-gray-200">
{`ADMIN_NAME="Platform Administrator"
ADMIN_EMAIL="admin@bizmind.ai"
ADMIN_PASSWORD="YourStrongSecurePasswordHere2026!"`}
            </pre>
            <div className="pt-2 text-gray-400 border-t border-gray-800">
              # Execute the idempotent seeding script:
              <br />
              <span className="text-white font-bold">npm run seed:admin</span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <strong className="font-bold block">Safety Safeguards:</strong>
              <p>
                1. The seeding script is strictly idempotent: it will not overwrite an existing administrator's password without manual database access.
                <br />
                2. The system prevents an admin from revoking their own privileges if they are the sole administrator on the platform.
                <br />
                3. Audit events are recorded automatically for all catalog changes and user status updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
