import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Rocket } from 'lucide-react';

export default function RiskAnalysis({ business }) {
  return (
    <div className="space-y-8">
      {/* Advantages vs Disadvantages 2-Col */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Advantages */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
            <CheckCircle2 className="w-4 h-4 text-[#FF6B00]" />
            <span>Strategic Advantages</span>
          </div>
          <h4 className="text-lg font-extrabold text-[#0D0D0D]">
            Why This Model Outperforms
          </h4>
          <ul className="space-y-3">
            {business.advantages?.map((adv, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-700">
                <div className="w-5 h-5 rounded-full bg-orange-100 text-[#FF6B00] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="leading-relaxed">{adv}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Disadvantages / Operational Challenges */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-gray-500">
            <XCircle className="w-4 h-4 text-gray-500" />
            <span>Operational Challenges</span>
          </div>
          <h4 className="text-lg font-extrabold text-[#0D0D0D]">
            Realities & Pain Points
          </h4>
          <ul className="space-y-3">
            {business.disadvantages?.map((dis, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-700">
                <div className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <XCircle className="w-3.5 h-3.5" />
                </div>
                <span className="leading-relaxed">{dis}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Major Risks & Mitigations */}
      <div className="bg-[#FFFFFF] border border-gray-200/90 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-rose-600">
          <AlertTriangle className="w-4 h-4" />
          <span>Risk Matrix & Threat Assessment</span>
        </div>
        <h4 className="text-lg font-extrabold text-[#0D0D0D]">
          Identified Market & Execution Risks
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {business.risks?.map((risk, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 space-y-2"
            >
              <div className="flex items-center gap-2 text-xs font-extrabold text-rose-800">
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                <span>Risk Factor #{idx + 1}</span>
              </div>
              <p className="text-xs text-rose-950 leading-relaxed font-medium">
                {risk}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Competitor Factors & Growth Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#F4F4F5]/60 border border-gray-200/80 rounded-2xl p-6 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0D0D0D]">
            Competitive Moat & Landscape
          </span>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {business.competitorFactors}
          </p>
        </div>

        <div className="bg-[#FFF7ED] border border-orange-200/80 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
            <Rocket className="w-4 h-4" />
            <span>Scale & Multi-Unit Expansion</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium">
            {business.growthOpportunities}
          </p>
        </div>
      </div>
    </div>
  );
}
