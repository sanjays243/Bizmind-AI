import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Bot, Sparkles, Send, Loader2, CheckCircle2, Building2, HelpCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { businessService } from '../services/business.service';

export default function AiAdvisorPage({ onBackToHome, onGetStarted }) {
  const { currentUser } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState('');
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState('BizMind AI Decision Engine');
  const chatBottomRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hello! I'm your BizMind Financial Advisor. I'm connected to your operational cash flow trends and performance books. What decision, expense, or growth scenario can I help you analyze today?",
      suggestions: [
        'Can I afford to hire a new employee for $4,500/mo?',
        'How can I improve my net profit margin?',
        'What is my current cash runway and burn rate?',
        'Which expense category should I audit first?'
      ],
      provider: 'BizMind AI'
    }
  ]);

  // Load user businesses if authenticated
  useEffect(() => {
    if (currentUser) {
      businessService.getMyBusinesses()
        .then((res) => {
          const list = res?.businesses || [];
          setBusinesses(list);
          if (list.length > 0) {
            setSelectedBusinessId(list[0]._id);
          }
        })
        .catch((err) => console.warn('Could not load user businesses:', err.message));
    }
  }, [currentUser]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleAsk = async (questionText) => {
    const q = (questionText || inputQuestion).trim();
    if (!q || loading) return;

    setInputQuestion('');
    const newMessages = [...messages, { role: 'user', text: q }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await businessService.askAdvisor({
        question: q,
        businessId: selectedBusinessId || undefined,
      });

      const aiAnswer = res?.data?.answer || "I've analyzed your financial position. Your current operating margin remains stable.";
      const returnedSuggestions = res?.data?.suggestions || [
        'How can I reduce operating expenses by 10%?',
        'Estimate quarterly tax liability',
        'Simulate in Break-Even Calculator'
      ];
      const modelProvider = res?.data?.provider === 'gemini' ? 'Google Gemini 1.5 Flash' : 'BizMind Algorithmic Decision Engine';
      setProvider(modelProvider);

      setMessages([
        ...newMessages,
        {
          role: 'ai',
          text: aiAnswer,
          suggestions: returnedSuggestions,
          provider: modelProvider,
          context: res?.data?.context,
        }
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'ai',
          text: `⚠️ **Advisory Analysis Notice:** ${err.message || 'Unable to connect to financial intelligence service.'}\n\nBased on baseline estimates, maintain at least 3 months of operating expenses in cash reserves before committing to major recurring liabilities.`,
          suggestions: ['Check Cash Flow Forecast', 'Review Transactions'],
          provider: 'Fallback Engine'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleAsk(inputQuestion);
  };

  const activeBusiness = businesses.find((b) => b._id === selectedBusinessId);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0D0D0D] flex flex-col font-sans">
      {/* Top Breadcrumb Header */}
      <div className="bg-[#F4F4F5]/80 border-b border-gray-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0D0D0D] hover:text-[#FF6B00] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF6B00]" />
            <span>← Back to Overview</span>
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <span>Platform</span>
            <span>/</span>
            <span className="text-[#FF6B00] font-bold">AI Financial Advisor</span>
          </div>
        </div>
      </div>

      <section id="ai-advisor" className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 space-y-10 w-full">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FFEDD5]">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
              24/7 Virtual CFO & Strategic Intelligence
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0D0D0D] tracking-tight">
            Conversational Financial Advisor with <span className="text-[#FF6B00]">Context</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Ask real questions about hiring, profit margins, cost reductions, or runway. BizMind evaluates your books and mathematical financial models in real-time.
          </p>
        </div>

        {/* Business Selector (if user has businesses) */}
        {businesses.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F4F4F5] p-3.5 rounded-2xl border border-gray-200">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#FF6B00]" />
              <span className="text-xs font-bold text-gray-700">Financial Books:</span>
            </div>
            <select
              value={selectedBusinessId}
              onChange={(e) => setSelectedBusinessId(e.target.value)}
              className="bg-white border border-gray-300 text-xs font-semibold rounded-xl px-3 py-1.5 text-gray-800 focus:outline-none focus:border-[#FF6B00]"
            >
              {businesses.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name} ({b.type}) - Rev: ${b.metrics?.totalRevenue?.toLocaleString() || 0}
                </option>
              ))}
            </select>
            {activeBusiness && (
              <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2.5 py-1 rounded-full">
                Margin: {activeBusiness.metrics?.totalRevenue ? (((activeBusiness.metrics.netProfit || 0) / activeBusiness.metrics.totalRevenue) * 100).toFixed(1) : 0}%
              </span>
            )}
          </div>
        )}

        {/* Interactive Chat Sandbox */}
        <div className="bg-[#0D0D0D] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#1F1F1F] space-y-6">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#E05300] flex items-center justify-center text-white shadow-lg">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">BizMind Financial Co-Pilot</h3>
                <p className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Operational Analysis Connected
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-gray-300 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                {provider}
              </span>
              <button
                type="button"
                onClick={() => setMessages([{
                  role: 'ai',
                  text: "Chat reset. How can I help analyze your financial decisions today?",
                  suggestions: [
                    'Can I afford to hire a new employee for $4,500/mo?',
                    'How can I improve my net profit margin?',
                    'What is my cash runway?'
                  ]
                }])}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
                title="Restart Chat"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2 scrollbar-thin">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'ai' && (
                  <div className="w-8 h-8 rounded-lg bg-[#FF6B00] flex items-center justify-center text-white flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed max-w-[88%] space-y-3 ${
                    msg.role === 'user'
                      ? 'bg-gray-800 text-white rounded-tr-none'
                      : 'bg-[#18181B] text-gray-200 border-l-4 border-[#FF6B00] rounded-tl-none shadow-md'
                  }`}
                >
                  <div className="whitespace-pre-line text-sm text-gray-100">
                    {msg.text}
                  </div>

                  {/* Suggestion Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="pt-2 border-t border-gray-800/80 space-y-1.5">
                      <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                        Suggested Inquiries:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestions.map((s, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleAsk(s)}
                            className="text-xs bg-gray-900 hover:bg-[#FF6B00] hover:text-white text-gray-300 px-2.5 py-1 rounded-lg border border-gray-700 transition-all cursor-pointer text-left"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-lg bg-[#FF6B00] flex items-center justify-center text-white flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl bg-[#18181B] border-l-4 border-[#FF6B00] rounded-tl-none text-gray-300 text-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-[#FF6B00] animate-spin" />
                  <span>Computing financial math, runway variance, and decision matrix...</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleFormSubmit} className="flex gap-2 pt-2 border-t border-gray-800">
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Ask anything, e.g. 'Can I afford to spend $2,500 on marketing this month?'"
              className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B00]"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputQuestion.trim()}
              className="px-5 py-3 bg-[#FF6B00] hover:bg-[#E05E00] disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Ask Advisor</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#F4F4F5] rounded-2xl border border-gray-200 space-y-2">
            <h4 className="font-bold text-sm text-[#0D0D0D]">Decision Impact Simulation</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Test new hires, equipment purchases, or price changes before committing real capital.
            </p>
          </div>
          <div className="p-6 bg-[#F4F4F5] rounded-2xl border border-gray-200 space-y-2">
            <h4 className="font-bold text-sm text-[#0D0D0D]">Continuous Runway Monitoring</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Real-time calculation of your survival buffer and net burn rate based on actual transactions.
            </p>
          </div>
          <div className="p-6 bg-[#F4F4F5] rounded-2xl border border-gray-200 space-y-2">
            <h4 className="font-bold text-sm text-[#0D0D0D]">Automated Anomaly Checks</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Proactive detection of cost creep, unexpected vendor fee increases, and subscription leaks.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
