import React from 'react';
import {
  ArrowRight,
  Play,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

/**
 * HeroSection Component
 * 
 * Strict Design System:
 * - Rich Black: #0D0D0D
 * - White: #FFFFFF
 * - Orange: #FF6B00
 * - Dark Border: #1F1F1F
 * - Light Gray: #F4F4F5
 * 
 * Features:
 * - Normal background image (hero_bg.png) with no overlapping dashboard card
 * - Left-aligned crisp typography with high-contrast ambient gradient
 * - Unobstructed 3D isometric financial circuit visual on the right
 */
export default function HeroSection({ onSignUp, onLiveDemo }) {
  return (
    <section className="relative w-full bg-[#0D0D0D] text-white overflow-hidden border-b border-[#1F1F1F]">
      {/* Background Image Layer (Unobstructed 3D Isometric Art) */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-right lg:bg-[right_center] opacity-95 pointer-events-none"
        style={{ backgroundImage: "url('/images/hero_bg.png')" }}
        aria-hidden="true"
      />

      {/* Atmospheric dark gradient overlays to guarantee crisp text readability on the left */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D] via-[#0D0D0D]/90 sm:via-[#0D0D0D]/75 lg:via-[#0D0D0D]/65 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-[#0D0D0D]/40 pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-36 min-h-[620px] lg:min-h-[680px] flex items-center">
        
        {/* Left-Aligned Headline & CTAs (Leaves the right side open for the background artwork) */}
        <div className="max-w-2xl space-y-7 text-left">
          
          {/* 1. Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F1F1F]/90 border border-[#FF6B00]/40 text-[#FF6B00] text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
            <span>NEXT-GEN FINANCIAL INTELLIGENCE FOR SMALL BUSINESS</span>
          </div>

          {/* 2. Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
            Make{' '}
            <span className="text-[#FF6B00] drop-shadow-[0_0_25px_rgba(255,107,0,0.35)]">
              Confident Financial Decisions
            </span>{' '}
            with BizMind AI
          </h1>

          {/* 3. Supporting Text */}
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-xl">
            See where your money is going, understand what is affecting your profits, and discover what to do next — all with AI-powered business intelligence built for small business owners.
          </p>

          {/* 4. Primary and Secondary CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onSignUp}
              className="px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-[#FF6B00] hover:bg-[#E05E00] rounded-xl shadow-[0_4px_25px_rgba(255,107,0,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer inline-flex items-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={onLiveDemo}
              className="px-7 py-3.5 text-sm sm:text-base font-semibold text-white border border-white/20 bg-white/5 backdrop-blur-sm hover:border-[#FF6B00] hover:text-[#FF6B00] hover:bg-white/10 rounded-xl transition-all duration-200 cursor-pointer inline-flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Explore Live Demo</span>
            </button>
          </div>

          {/* 5. Trust / Value Points (4 items) */}
          <div className="pt-6 border-t border-[#1F1F1F] grid grid-cols-2 gap-3.5 text-xs sm:text-sm text-gray-300 font-medium max-w-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00] flex-shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B00]" />
              </div>
              <span>No complex setup</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00] flex-shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B00]" />
              </div>
              <span>90-Day Cash Flow Forecast</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00] flex-shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B00]" />
              </div>
              <span>AI-Powered Decision Engine</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00] flex-shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B00]" />
              </div>
              <span>Built for Small Businesses</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
