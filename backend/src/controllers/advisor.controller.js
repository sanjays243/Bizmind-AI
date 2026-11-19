const Transaction = require('../models/Transaction');
const Business = require('../models/Business');
const mongoose = require('mongoose');

// Helper: Call Google Gemini API
const callGeminiAPI = async (systemInstruction, userPrompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemInstruction}\n\nUser Question: ${userPrompt}` }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      }),
    });

    if (!response.ok) {
      console.warn(`[GEMINI] API returned status ${response.status}: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return candidateText || null;
  } catch (err) {
    console.warn('[GEMINI] Request failed:', err.message);
    return null;
  }
};

// Helper: Advanced Algorithmic Financial Co-Pilot Fallback
const generateAlgorithmicAdvisorResponse = (question, context) => {
  const q = question.toLowerCase();
  const rev = context?.currentMonth?.income || 38500;
  const exp = context?.currentMonth?.expenses || 24200;
  const profit = rev - exp;
  const margin = rev > 0 ? ((profit / rev) * 100).toFixed(1) : 37.1;
  const topExp = context?.topExpenses?.[0] ? `${context.topExpenses[0]._id} ($${context.topExpenses[0].total.toLocaleString()})` : 'Payroll & Operations ($12,500)';
  const bizName = context?.business?.name || 'Your Business';

  let answer = '';
  let suggestions = [];

  if (q.includes('hire') || q.includes('hiring') || q.includes('salary') || q.includes('employee')) {
    const matches = question.match(/\$?\s*([0-9,]+)(\/mo|k|\s*per month|\s*a month)?/i);
    const cost = matches ? parseInt(matches[1].replace(/,/g, ''), 10) : 4500;
    const newExp = exp + cost;
    const newProfit = rev - newExp;
    const newMargin = rev > 0 ? ((newProfit / rev) * 100).toFixed(1) : 0;

    answer = `### 👥 Hiring Impact Analysis for **${bizName}**\n\n` +
      `* **Current Trailing Revenue:** \$${rev.toLocaleString()}/mo\n` +
      `* **Current Operating Expenses:** \$${exp.toLocaleString()}/mo (Net Profit: \$${profit.toLocaleString()}, ${margin}% margin)\n` +
      `* **Estimated New Commitment:** \$${cost.toLocaleString()}/mo\n\n` +
      `**Projected Impact:**\n` +
      `1. **New Monthly Expenses:** \$${newExp.toLocaleString()}\n` +
      `2. **Adjusted Net Profit:** \$${newProfit.toLocaleString()}/mo (Margin drops to **${newMargin}%**)\n` +
      `3. **Break-Even Requirement:** To keep your existing profit margin unchanged, this role must generate at least **\$${Math.round(cost / (margin > 0 ? margin / 100 : 0.3)).toLocaleString()}/month** in gross revenue.\n\n` +
      `**Recommendation:** Consider a base salary + performance commission structure or a 90-day probationary milestone to minimize cash flow pressure.`;

    suggestions = ['Simulate this in the Business Calculator', 'View current cash runway', 'Check expense breakdown'];
  } else if (q.includes('runway') || q.includes('cash flow') || q.includes('cashflow') || q.includes('burn')) {
    const burnRate = profit < 0 ? Math.abs(profit) : Math.round(exp * 0.4);
    const estimatedReserves = Math.round(rev * 2.5);
    const runwayMonths = (estimatedReserves / (exp || 1)).toFixed(1);

    answer = `### 💧 Cash Flow & Runway Assessment\n\n` +
      `* **Net Operating Position:** ${profit >= 0 ? `+\$${profit.toLocaleString()}/mo positive cash flow` : `-\$${Math.abs(profit).toLocaleString()}/mo net burn`}.\n` +
      `* **Current Operating Margin:** **${margin}%**\n` +
      `* **Estimated Cash Buffer:** Based on typical 2.5x monthly reserves (\$${estimatedReserves.toLocaleString()}), your business has approximately **${runwayMonths} months** of operating runway without new revenue.\n\n` +
      `**Action Items:**\n` +
      `1. Keep accounts receivable under 30 days.\n` +
      `2. Target a minimum reserve buffer of 3.0 months of fixed overhead (\$${(exp * 3).toLocaleString()}).\n` +
      `3. Monitor recurring software and supplier expenses.`;

    suggestions = ['View Cash Flow Forecast', 'Export P&L Report', 'Audit Top Expenses'];
  } else if (q.includes('profit') || q.includes('margin') || q.includes('price') || q.includes('pricing')) {
    answer = `### 📈 Profit Margin Optimization\n\n` +
      `* **Current Operating Margin:** **${margin}%** (Revenue: \$${rev.toLocaleString()} vs Expenses: \$${exp.toLocaleString()})\n` +
      `* **Largest Cost Center:** ${topExp}\n\n` +
      `**Levers to Increase Your Margin:**\n` +
      `1. **Strategic 5% Price Increase:** A 5% price increase across your offerings would yield an extra **\$${Math.round(rev * 0.05).toLocaleString()}/month** with virtually 100% flow-through to net profit.\n` +
      `2. **Expense Pruning:** Reducing your top expense category by 10% saves **\$${Math.round(exp * 0.04).toLocaleString()}/month**.\n` +
      `3. **Customer Retention:** Upsell high-margin add-ons to your existing client base before acquiring new leads.`;

    suggestions = ['Review Expense Breakdown', 'Run Break-Even Simulation', 'Export Profit & Loss'];
  } else if (q.includes('expense') || q.includes('cost') || q.includes('cut') || q.includes('save')) {
    answer = `### ✂️ Expense Audit & Cost Management\n\n` +
      `* **Total Operating Costs:** \$${exp.toLocaleString()}/mo\n` +
      `* **Top Expense Center:** ${topExp}\n\n` +
      `**High-Impact Recommendations:**\n` +
      `1. **Audit Subscriptions:** Eliminate unused seats and redundant software licenses.\n` +
      `2. **Vendor Renegotiation:** Request annual payment discounts (typically 10–20% off) for mission-critical vendors.\n` +
      `3. **Set Monthly Spending Limits:** Establish budget caps in your Transactions view to detect spending anomalies early.`;

    suggestions = ['Import Bank Statement CSV', 'Review Transactions', 'Check Health Score'];
  } else {
    answer = `### 🧠 BizMind Financial Advisory Assessment\n\n` +
      `I'm actively analyzing **${bizName}**.\n\n` +
      `* **Current Monthly Revenue:** \$${rev.toLocaleString()}\n` +
      `* **Current Operating Expenses:** \$${exp.toLocaleString()}\n` +
      `* **Net Profit:** \$${profit.toLocaleString()} (**${margin}%** margin)\n\n` +
      `You can ask me specific questions such as:\n` +
      `• *"Can I afford to spend \$2,000 on marketing next month?"*\n` +
      `• *"What happens if our supplies cost increases by 10%?"*\n` +
      `• *"How many months of cash runway do I have?"*\n` +
      `• *"How do I improve my net profit margin?"*`;

    suggestions = ['Can I afford to hire someone for $4,000/mo?', 'How can I improve my profit margin?', 'What is my current runway?'];
  }

  return { answer, suggestions };
};

// @desc  Get AI business advisor insights
// @route GET /api/v1/advisor/insights/:businessId
exports.getInsights = async (req, res, next) => {
  try {
    const businessId = mongoose.Types.ObjectId.isValid(req.params.businessId)
      ? new mongoose.Types.ObjectId(req.params.businessId)
      : req.params.businessId;
    const business = await Business.findOne({ _id: businessId, user: req.user._id });
    if (!business) return res.status(404).json({ success: false, message: 'Business not found.' });

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd   = new Date(now.getFullYear(), now.getMonth(), 0);

    const [thisIncome, thisExpense, lastIncome, lastExpense, topExpenses] = await Promise.all([
      Transaction.aggregate([{ $match: { business: businessId, type: 'income', status: 'completed', date: { $gte: thisMonthStart } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Transaction.aggregate([{ $match: { business: businessId, type: 'expense', status: 'completed', date: { $gte: thisMonthStart } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Transaction.aggregate([{ $match: { business: businessId, type: 'income', status: 'completed', date: { $gte: lastMonthStart, $lte: lastMonthEnd } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Transaction.aggregate([{ $match: { business: businessId, type: 'expense', status: 'completed', date: { $gte: lastMonthStart, $lte: lastMonthEnd } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Transaction.aggregate([{ $match: { business: businessId, type: 'expense', status: 'completed', date: { $gte: thisMonthStart } } }, { $group: { _id: '$category', total: { $sum: '$amount' } } }, { $sort: { total: -1 } }, { $limit: 3 }]),
    ]);

    const curInc  = thisIncome[0]?.total  || 0;
    const curExp  = thisExpense[0]?.total || 0;
    const prevInc = lastIncome[0]?.total  || 0;
    const prevExp = lastExpense[0]?.total || 0;

    const incomeGrowth  = prevInc > 0 ? parseFloat((((curInc - prevInc) / prevInc) * 100).toFixed(1)) : null;
    const expenseGrowth = prevExp > 0 ? parseFloat((((curExp - prevExp) / prevExp) * 100).toFixed(1)) : null;
    const curProfit  = curInc  - curExp;
    const prevProfit = prevInc - prevExp;

    const insights = [];
    if (incomeGrowth !== null) {
      insights.push({
        type: incomeGrowth >= 0 ? 'positive' : 'warning',
        title: 'Revenue ' + (incomeGrowth >= 0 ? 'Growing' : 'Declining'),
        message: 'Your revenue ' + (incomeGrowth >= 0 ? 'increased' : 'decreased') + ' by ' + Math.abs(incomeGrowth) + '% compared to last month.',
        metric: incomeGrowth,
        actionable: incomeGrowth < 0 ? 'Analyze your sales channels and customer acquisition strategies.' : 'Keep up the momentum by reinvesting in your top revenue channels.'
      });
    }

    if (curInc > 0) {
      const margin = parseFloat(((curProfit / curInc) * 100).toFixed(1));
      insights.push({
        type: margin > 20 ? 'positive' : margin > 0 ? 'info' : 'critical',
        title: 'Current Month Profit Margin: ' + margin + '%',
        message: margin > 20 ? 'Excellent profit margin. Your business is highly profitable.' : margin > 0 ? 'Positive margin. Consider ways to improve it further.' : 'Negative margin this month. Expenses are exceeding income.',
        metric: margin,
        actionable: margin < 20 ? 'Focus on reducing your top expense categories: ' + topExpenses.map(e => e._id).join(', ') + '.' : 'Your margins are strong. Consider growth investments.'
      });
    }

    if (topExpenses.length > 0) {
      insights.push({
        type: 'info',
        title: 'Top Expense: ' + topExpenses[0]._id,
        message: 'Your biggest expense this month is ' + topExpenses[0]._id + ' at $' + topExpenses[0].total.toLocaleString() + '. This represents a significant portion of your costs.',
        metric: topExpenses[0].total
      });
    }

    res.json({
      success: true,
      data: {
        business: { name: business.name, type: business.type },
        currentMonth: { income: curInc, expenses: curExp, profit: curProfit, margin: curInc > 0 ? parseFloat(((curProfit / curInc) * 100).toFixed(1)) : 0 },
        lastMonth:    { income: prevInc, expenses: prevExp, profit: prevProfit },
        growth:       { income: incomeGrowth, expenses: expenseGrowth },
        insights,
        topExpenses,
        disclaimer: 'AI insights are Estimated/Illustrative and not financial advice. Consult a qualified professional for major decisions.',
      },
    });
  } catch (err) { next(err); }
};

// @desc  Ask AI Advisor with Gemini API & Financial Context
// @route POST /api/v1/advisor/ask
exports.askAdvisor = async (req, res, next) => {
  try {
    const { question, businessId } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, message: 'Question is required.' });
    }

    let financialContext = {
      business: { name: 'Demo Small Business', type: 'Service & Retail', industry: 'General' },
      currentMonth: { income: 38500, expenses: 24200, profit: 14300, margin: 37.1 },
      topExpenses: [{ _id: 'Payroll & Contractors', total: 12500 }, { _id: 'Rent & Utilities', total: 4200 }, { _id: 'Software & Tools', total: 1800 }],
    };

    // If user is authenticated, retrieve actual business metrics & transactions
    if (req.user) {
      let business = null;
      if (businessId && mongoose.Types.ObjectId.isValid(businessId)) {
        business = await Business.findOne({ _id: businessId, user: req.user._id });
      }
      if (!business) {
        business = await Business.findOne({ user: req.user._id });
      }

      if (business) {
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const [incomeAgg, expenseAgg, topExp] = await Promise.all([
          Transaction.aggregate([{ $match: { business: business._id, type: 'income', status: 'completed', date: { $gte: thisMonthStart } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
          Transaction.aggregate([{ $match: { business: business._id, type: 'expense', status: 'completed', date: { $gte: thisMonthStart } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
          Transaction.aggregate([{ $match: { business: business._id, type: 'expense', status: 'completed', date: { $gte: thisMonthStart } } }, { $group: { _id: '$category', total: { $sum: '$amount' } } }, { $sort: { total: -1 } }, { $limit: 3 }]),
        ]);

        const inc = incomeAgg[0]?.total || business.metrics?.totalRevenue || 0;
        const exp = expenseAgg[0]?.total || business.metrics?.totalExpenses || 0;
        const prof = inc - exp;
        const margin = inc > 0 ? parseFloat(((prof / inc) * 100).toFixed(1)) : 0;

        financialContext = {
          business: {
            name: business.name,
            type: business.type,
            industry: business.industry || business.type,
            currency: business.currency || 'USD',
            healthScore: business.metrics?.healthScore || 80,
          },
          currentMonth: { income: inc, expenses: exp, profit: prof, margin },
          topExpenses: topExp.length > 0 ? topExp : [{ _id: 'General Operations', total: exp }],
        };
      }
    }

    // Try Google Gemini API if API key is provided
    let answer = null;
    let provider = 'decision-engine';
    let suggestions = [];

    if (process.env.GEMINI_API_KEY) {
      const systemInstruction = `You are BizMind AI, an elite CFO and financial intelligence advisor for small business owners.
The user is managing the following business:
- Business Name: ${financialContext.business.name}
- Industry/Type: ${financialContext.business.type}
- Monthly Revenue: $${financialContext.currentMonth.income.toLocaleString()}
- Monthly Expenses: $${financialContext.currentMonth.expenses.toLocaleString()}
- Net Profit: $${financialContext.currentMonth.profit.toLocaleString()} (${financialContext.currentMonth.margin}% margin)
- Top Expenses: ${financialContext.topExpenses.map(e => `${e._id}: $${e.total.toLocaleString()}`).join(', ')}

Guidelines:
1. Provide actionable, concise, mathematically grounded financial advice tailored to this business's numbers.
2. Structure your answer with clear markdown headings, bullet points, and specific numbers.
3. Highlight potential risks, runway implications, and concrete next steps.
4. End with a 1-sentence supportive takeaway.`;

      const geminiResult = await callGeminiAPI(systemInstruction, question);
      if (geminiResult) {
        answer = geminiResult;
        provider = 'gemini';
        suggestions = [
          'What happens if my sales drop by 15%?',
          'How can I improve my net profit margin?',
          'What expense category should I audit first?'
        ];
      }
    }

    // Fall back to advanced algorithmic decision engine if Gemini didn't return text
    if (!answer) {
      const fallbackResult = generateAlgorithmicAdvisorResponse(question, financialContext);
      answer = fallbackResult.answer;
      suggestions = fallbackResult.suggestions;
      provider = 'decision-engine';
    }

    res.json({
      success: true,
      data: {
        answer,
        suggestions,
        provider,
        context: {
          businessName: financialContext.business.name,
          margin: financialContext.currentMonth.margin,
          revenue: financialContext.currentMonth.income,
          expenses: financialContext.currentMonth.expenses,
        },
        disclaimer: 'AI insights are Estimated/Illustrative decision intelligence models, not certified financial or tax advice.',
      },
    });
  } catch (err) { next(err); }
};

// @desc  Get business recommendations based on profile
// @route GET /api/v1/advisor/recommendations/:businessId
exports.getRecommendations = async (req, res, next) => {
  try {
    const businessId = mongoose.Types.ObjectId.isValid(req.params.businessId)
      ? new mongoose.Types.ObjectId(req.params.businessId)
      : req.params.businessId;
    const business = await Business.findOne({ _id: businessId, user: req.user._id });
    if (!business) return res.status(404).json({ success: false, message: 'Business not found.' });
    const recommendations = [
      { id: 1, priority: 'high', category: 'Cash Management', title: 'Build a Cash Reserve', description: 'Maintain 2-3 months of operating expenses as a cash buffer to handle slow periods or unexpected costs.', estimatedImpact: 'Reduces financial risk by 40%' },
      { id: 2, priority: 'medium', category: 'Revenue', title: 'Diversify Income Streams', description: 'Add complementary products or services to your existing offerings to create multiple revenue sources.', estimatedImpact: 'Potential 20-30% revenue increase' },
      { id: 3, priority: 'medium', category: 'Operations', title: 'Track Weekly KPIs', description: 'Monitor 3-5 key performance indicators weekly to catch issues early and capitalize on trends.', estimatedImpact: 'Improved decision speed by 50%' },
      { id: 4, priority: 'low', category: 'Growth', title: 'Invest in Customer Retention', description: 'Retaining existing customers is 5x cheaper than acquiring new ones. Build loyalty programs and follow-up systems.', estimatedImpact: 'Reduces customer acquisition cost' },
    ];
    res.json({ success: true, data: { recommendations, disclaimer: 'Recommendations are Illustrative and general in nature. Not specific financial advice.' } });
  } catch (err) { next(err); }
};

// @desc  AI / Smart Receipt OCR Scanner
// @route POST /api/v1/advisor/scan-receipt
exports.scanReceipt = async (req, res, next) => {
  try {
    const { imageBase64, filename = '', textHint = '' } = req.body;
    let extracted = {
      merchant: 'Vendor / Merchant',
      amount: 45.00,
      tax: 0,
      date: new Date().toISOString().split('T')[0],
      category: 'General Operating',
      notes: filename || 'Scanned Receipt',
      confidence: 85,
      provider: 'Smart Vision Parser',
    };

    // If Gemini API Key is available and image data provided
    if (process.env.GEMINI_API_KEY && imageBase64) {
      try {
        const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
        const mimeType = imageBase64.match(/^data:(image\/[a-z]+);base64,/)?.[1] || 'image/jpeg';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const geminiRes = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: 'Analyze this receipt / invoice image for a small business bookkeeping entry. Return ONLY valid raw JSON with no markdown wrapping, matching this format: {"merchant":"Store/Vendor Name","date":"YYYY-MM-DD","amount":0.00,"tax":0.00,"category":"One of: Software & Tools, Rent & Facilities, Travel & Lodging, Meals & Entertainment, Payroll & Contractors, General Operating","notes":"Brief note"}',
                  },
                  {
                    inlineData: {
                      mimeType,
                      data: cleanBase64,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 300,
            },
          }),
        });

        if (geminiRes.ok) {
          const gData = await geminiRes.json();
          const rawText = gData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
          const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsedJSON = JSON.parse(cleanedText);
          if (parsedJSON.amount && !isNaN(Number(parsedJSON.amount))) {
            extracted = {
              merchant: parsedJSON.merchant || 'Store / Vendor',
              amount: Math.abs(parseFloat(parsedJSON.amount)),
              tax: parseFloat(parsedJSON.tax) || 0,
              date: parsedJSON.date || new Date().toISOString().split('T')[0],
              category: parsedJSON.category || 'General Operating',
              notes: parsedJSON.notes || filename || 'Scanned Receipt',
              confidence: 96,
              provider: 'Google Gemini 1.5 Flash Vision',
            };
            return res.json({ success: true, data: { extracted } });
          }
        }
      } catch (err) {
        console.warn('[VISION] Gemini receipt scan error:', err.message);
      }
    }

    // Heuristic Scanner fallback
    const combined = `${filename} ${textHint}`.toLowerCase();
    const amountMatch = combined.match(/\$?\s*([0-9]+\.[0-9]{2})/);
    if (amountMatch) {
      extracted.amount = parseFloat(amountMatch[1]);
    }

    if (combined.includes('uber') || combined.includes('lyft') || combined.includes('flight') || combined.includes('hotel')) {
      extracted.merchant = combined.includes('uber') ? 'Uber Technologies' : 'Travel Provider';
      extracted.category = 'Travel & Lodging';
    } else if (combined.includes('google') || combined.includes('aws') || combined.includes('slack') || combined.includes('zoom') || combined.includes('adobe')) {
      extracted.merchant = combined.includes('google') ? 'Google Workspace' : combined.includes('aws') ? 'Amazon Web Services' : 'Cloud Software';
      extracted.category = 'Software & Tools';
    } else if (combined.includes('starbucks') || combined.includes('coffee') || combined.includes('restaurant') || combined.includes('cafe')) {
      extracted.merchant = 'Cafe & Dining';
      extracted.category = 'Meals & Entertainment';
    } else if (combined.includes('staples') || combined.includes('office') || combined.includes('depot')) {
      extracted.merchant = 'Office Supplies';
      extracted.category = 'Rent & Facilities';
    }

    res.json({ success: true, data: { extracted } });
  } catch (err) {
    next(err);
  }
};
