import React from 'react';
import { CheckCircle2, ListOrdered, Wrench, GraduationCap } from 'lucide-react';

export default function StartupPlan({ business }) {
  const steps = [
    {
      phase: 'Phase 1: Feasibility & Regulatory Setup',
      time: 'Weeks 1 – 4',
      items: [
        'Form legal business entity (LLC / Corp) and register trademark.',
        'Acquire municipal permits, fire/health inspections, and commercial insurance.',
        'Finalize 5-mile demographic demand study and local competitor price matrix.'
      ]
    },
    {
      phase: 'Phase 2: Location & Supply Chain Procurement',
      time: 'Weeks 5 – 8',
      items: [
        'Negotiate lease terms with tenant improvement allowance.',
        'Secure core equipment suppliers and initial wholesale inventory contracts.',
        'Establish merchant accounts, business bank accounts, and payment gateways.'
      ]
    },
    {
      phase: 'Phase 3: Operational Fitout & Systems Integration',
      time: 'Weeks 9 – 12',
      items: [
        'Complete interior fitout, electrical/plumbing lines, and aesthetic branding.',
        'Deploy cloud POS, automated inventory management, and BizMind monitoring.',
        'Recruit and train opening team on standard operating procedures (SOPs).'
      ]
    },
    {
      phase: 'Phase 4: Soft Launch & Growth Acceleration',
      time: 'Weeks 13+',
      items: [
        'Host invitation-only soft launch for local business partners and creators.',
        'Ignite hyper-local Google Ads & Meta campaigns with promotional opening offer.',
        'Monitor daily unit economics, customer feedback, and review velocity.'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* 4-Phase Milestone Timeline */}
      <div className="bg-[#FFFFFF] border border-gray-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
            <ListOrdered className="w-4 h-4" />
            <span>Step-by-Step Launch Blueprint</span>
          </div>
          <span className="text-xs font-extrabold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Est. Timeframe: 90 – 120 Days
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#F4F4F5]/60 border border-gray-200/80 space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-[#FF6B00] uppercase">
                  Step 0{idx + 1}
                </span>
                <span className="text-[11px] font-semibold text-gray-500">
                  {step.time}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-extrabold text-[#0D0D0D]">
                {step.phase}
              </h4>
              <ul className="space-y-2 text-xs text-gray-600 leading-relaxed">
                {step.items.map((it, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B00] mt-0.5 flex-shrink-0" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Skills & Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Required Skills */}
        <div className="bg-[#FFFFFF] border border-gray-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5 text-[#0D0D0D] font-extrabold text-base">
            <div className="w-8 h-8 rounded-lg bg-[#0D0D0D] text-[#FF6B00] flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span>Essential Founder Skills</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700">
            {business.requiredSkills?.map((skill, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] mt-2 flex-shrink-0" />
                <span>{skill}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Required Resources */}
        <div className="bg-[#FFFFFF] border border-gray-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5 text-[#0D0D0D] font-extrabold text-base">
            <div className="w-8 h-8 rounded-lg bg-[#FF6B00] text-white flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <span>Critical Tools & Capital Equipment</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700">
            {business.requiredResources?.map((res, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0D0D0D] mt-2 flex-shrink-0" />
                <span>{res}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
