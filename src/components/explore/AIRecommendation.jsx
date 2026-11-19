import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AIRecommendation({ business }) {
  const ai = business.aiRecommendation || {};
  const score = ai.score || 85;

  return (
    <div className="space-y-8">
      {/* Hero AI Opportunity Card */}
      <div className="bg-[#0D0D0D] text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-white/10 space-y-8">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF6B00]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BizMind Algorithmic Assessment</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              BizMind AI Opportunity Score
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 max-w-lg leading-relaxed">
              Synthesized from historical cash-flow volatility, barrier to entry, gross margin resilience, and local market demand.
            </p>
          </div>

          {/* Big Score Meter */}
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
            <div className="w-20 h-20 rounded-2xl bg-[#0D0D0D] border-2 border-[#FF6B00] flex flex-col items-center justify-center shadow-lg shadow-orange-500/20">
              <span className="text-2xl font-black text-white font-mono leading-none">
                {score}
              </span>
              <span className="text-[10px] uppercase font-bold text-[#FF6B00] mt-1">
                / 100
              </span>
            </div>
            <div>
              <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> High Viability Rating
              </span>
              <p className="text-xs text-gray-400 mt-1 max-w-[170px]">
                Top quartile cash-on-cash potential across peer small business sectors.
              </p>
            </div>
          </div>
        </div>

        {/* Positive Factors vs Risk Factors */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Positive Factors */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 backdrop-blur-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Key Positive Drivers</span>
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
              {ai.positiveFactors?.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Risk Factors */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 backdrop-blur-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Critical Guardrails & Risks</span>
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
              {ai.riskFactors?.map((rf, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] mt-2 flex-shrink-0" />
                  <span>{rf}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Strategy & Next Action */}
        <div className="relative z-10 bg-[#FF6B00]/10 border border-[#FF6B00]/30 rounded-2xl p-6 space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
              Recommended Executive Strategy
            </span>
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium">
              {ai.recommendedStrategy}
            </p>
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-xs text-gray-300">
              <span className="font-bold text-white">Next Best Action: </span>
              <span>{ai.nextBestAction}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
