require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Business = require('../models/Business');
const Category = require('../models/Category');
const AuditLog = require('../models/AuditLog');
const connectDB = require('../config/db');
const slugify = require('slugify');

const seedAdmin = async () => {
  try {
    console.log('[SEED] Connecting to database...');
    await connectDB();

    const adminName = process.env.ADMIN_NAME || 'Platform Administrator';
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@bizmind.ai').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@BizMind2026!';

    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(adminEmail)) {
      throw new Error(`Invalid ADMIN_EMAIL format: "${adminEmail}"`);
    }

    // Require strong initial password: at least 8 chars, 1 uppercase, 1 number, 1 special character
    if (adminPassword.length < 8 || !/[A-Z]/.test(adminPassword) || !/[0-9]/.test(adminPassword)) {
      throw new Error('ADMIN_PASSWORD must be at least 8 characters long and contain at least one uppercase letter and one number.');
    }

    const [firstName, ...lastNameParts] = adminName.split(' ');
    const lastName = lastNameParts.join(' ') || 'Admin';

    let existingAdmin = await User.findOne({ email: adminEmail });

    let adminUser;
    if (existingAdmin) {
      if (existingAdmin.role === 'admin') {
        console.log(`[SEED] Administrator already exists for email: ${adminEmail}`);
        console.log('[SEED] Idempotent run: Existing password was NOT overwritten.');
        adminUser = existingAdmin;
      } else {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log(`[SEED] Existing account for ${adminEmail} promoted to "admin" role.`);
        adminUser = existingAdmin;
      }
    } else {
      adminUser = await User.create({
        firstName,
        lastName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isVerified: true,
        isActive: true,
        businessProfile: {
          businessName: 'BizMind AI Operations',
          businessType: 'Executive Administration',
          industry: 'Artificial Intelligence & FinTech',
        },
      });

      console.log(`[SEED] Successfully created initial Administrator account:`);
      console.log(`       Name:  ${adminUser.fullName}`);
      console.log(`       Email: ${adminUser.email}`);
      console.log(`       Role:  ${adminUser.role}`);

      await AuditLog.create({
        admin: adminUser._id,
        adminEmail: adminUser.email,
        adminName: adminUser.fullName,
        action: 'ADMIN_LOGIN',
        resourceType: 'Auth',
        resourceId: adminUser._id.toString(),
        resourceName: adminUser.email,
        details: { note: 'Initial administrator account seeded securely via seedAdmin.js' },
      });
    }

    // Seed Standard Categories if none exist
    const categoriesCount = await Category.countDocuments();
    if (categoriesCount === 0) {
      console.log('[SEED] Seeding standard business categories...');
      const defaultCategories = [
        'Retail & Local Shops',
        'Food & Beverage',
        'Technology & Online',
        'Home & Construction',
        'Agriculture',
        'Education',
        'Beauty & Fashion',
        'Health & Fitness',
        'Transportation',
        'Tourism & Hospitality',
        'Manufacturing',
        'Events & Entertainment',
        'Professional Services',
        'Pet & Animal Services',
      ];

      for (const cat of defaultCategories) {
        await Category.create({
          name: cat,
          slug: slugify(cat, { lower: true, strict: true }),
          description: `Business opportunities and intelligent decision models in ${cat}.`,
          createdBy: adminUser._id,
        });
      }
      console.log(`[SEED] Seeded ${defaultCategories.length} standard categories.`);
    }

    // Seed Initial Catalog Business Ideas if catalog is empty
    const catalogCount = await Business.countDocuments({ status: 'published' });
    if (catalogCount === 0) {
      console.log('[SEED] Seeding starter verified business ideas for the dynamic catalog...');
      const starterIdeas = [
        {
          name: 'Specialty Artisan Coffee Roastery & Retail',
          slug: 'specialty-artisan-coffee-roastery-retail',
          category: 'Retail & Local Shops',
          shortDescription: 'Turnkey specialty artisan coffee roastery & retail opportunity with structured operating models, verified supply chains, and healthy unit margins.',
          fullDescription: 'A modern, profitable business model designed for ambitious entrepreneurs. Built around streamlined lean operations, predictable monthly cash cycles, and durable customer retention. Combines retail footfall with lucrative high-margin B2B office wholesale accounts.',
          image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
          targetCustomers: 'Local demographics, conscious consumers, modern households, and specialized B2B buyers seeking premium quality.',
          locationGuidance: 'High-visibility commercial hubs, walkable street fronts, or optimized light-industrial spaces with convenient parking.',
          investmentMin: 45000,
          investmentMax: 95000,
          startupCostBreakdown: {
            businessRegistration: 2100,
            locationDeposit: 12600,
            equipment: 19600,
            interior: 11200,
            inventory: 8400,
            technology: 3500,
            marketing: 4200,
            staffSetup: 3500,
            workingCapital: 4900,
            otherCosts: 1400,
          },
          monthlyExpenses: {
            rent: 4410,
            salaries: 9734,
            inventoryMaterials: 11232,
            electricity: 950,
            marketing: 2995,
            transportation: 454,
            software: 222,
            maintenance: 445,
            otherExpenses: 300,
            total: 30742,
          },
          revenueEstimate: {
            averageCustomersDay: 72,
            averageOrderValue: 20,
            estimatedDailyRevenue: 1440,
            estimatedMonthlyRevenue: 37440,
          },
          profitEstimate: {
            potentialOperatingProfit: 6698,
            potentialProfitMargin: 18,
          },
          breakEvenEstimate: {
            initialInvestment: 70000,
            monthlyFixedCosts: 15761,
            averageGrossMargin: '70%',
            estimatedBreakEvenPoint: '10 Months',
            requiredDailySales: '43 orders/day',
          },
          difficulty: 'Moderate',
          riskLevel: 'Medium',
          profitPotential: 'High',
          marketOpportunityScore: 88,
          advantages: [
            'High recurring customer repeat purchase rate',
            'Strong gross profit margins on core inventory/services',
            'Multiple revenue streams (in-person, online, subscriptions)',
            'Scalable operational systems with high resale valuation',
          ],
          disadvantages: [
            'Requires consistent early-stage operational oversight',
            'Sensitivity to local commercial real estate lease rates',
            'Ongoing recruitment and training of reliable staff',
          ],
          majorRisks: [
            'Shifts in local foot traffic or footfall patterns',
            'Ingredient/material cost inflation if suppliers are not locked',
            'New competitive entrants opening within a 3-mile radius',
          ],
          requiredSkills: ['Operations Management', 'Customer Relationship Building', 'Inventory Cost Control', 'Team Leadership'],
          requiredResources: ['Commercial Espresso Machines & Roaster', 'Water Filtration System', 'POS Terminal & Inventory Software', 'Initial Coffee Bean Stock'],
          marketingStrategy: ['Hyper-local Instagram & TikTok Reels', 'Loyalty Card Rewards program', 'Corporate Coffee subscriptions for local tech offices', 'Weekend roasting masterclass events'],
          competitorAnalysis: ['Differentiate on freshly roasted single-origin transparency and welcoming atmosphere vs impersonal multinational chains.'],
          growthOpportunities: ['Subscription bean box home deliveries', 'Cold brew bottled wholesale distribution', 'Secondary satellite kiosk locations'],
          startupPlan: [
            { step: 1, title: 'Concept & Financial Model', description: 'Validate local demographic density and complete unit economics blueprint.', timeline: 'Weeks 1-3' },
            { step: 2, title: 'Lease & Permitting', description: 'Secure commercial retail space and execute environmental health permits.', timeline: 'Weeks 4-8' },
            { step: 3, title: 'Equipment & Buildout', description: 'Install commercial roaster, espresso machine, and complete warm aesthetic interior.', timeline: 'Weeks 9-12' },
            { step: 4, title: 'Soft Launch & Marketing', description: 'Host invite-only community tasting and launch digital acquisition campaign.', timeline: 'Weeks 13-14' },
          ],
          aiRecommendation: {
            score: 88,
            summary: 'High customer lifetime value with strong gross margin defense. Ideal for lifestyle founders with disciplined operational focus.',
            actionPlan: 'Prioritize location lease negotiation below 12% of projected revenue; secure long-term green coffee bean futures contract.',
            verdict: 'Strong Recommendation',
            timelineMonths: 4,
          },
          status: 'published',
          isFeatured: true,
          createdBy: adminUser._id,
        },
        {
          name: 'AI Automation & Cloud Workflow Consultancy',
          slug: 'ai-automation-cloud-workflow-consultancy',
          category: 'Technology & Online',
          shortDescription: 'High-margin B2B consultancy automating administrative workflows, CRM integrations, and generative AI pipelines for regional SMBs.',
          fullDescription: 'Small and mid-sized enterprises urgently need operational efficiency but lack in-house technical talent. This consultancy provides fixed-fee workflow audits and monthly recurring retainers for AI agent deployment, CRM syncing, and automated reporting.',
          image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
          targetCustomers: 'Mid-sized legal firms, accounting practices, logistics providers, and healthcare clinics with 10-100 staff.',
          locationGuidance: 'Remote-first / digital agency with optional hot-desk access in major metropolitan business hubs.',
          investmentMin: 12000,
          investmentMax: 35000,
          startupCostBreakdown: {
            businessRegistration: 1500,
            softwareLicenses: 4800,
            marketingBranding: 5000,
            legalTemplates: 2500,
            workingCapital: 10000,
          },
          monthlyExpenses: {
            salaries: 6500,
            softwareTooling: 1200,
            marketingAdvertising: 2200,
            professionalServices: 600,
            total: 10500,
          },
          revenueEstimate: {
            averageCustomersDay: 1,
            averageOrderValue: 3500,
            estimatedDailyRevenue: 850,
            estimatedMonthlyRevenue: 25500,
          },
          profitEstimate: {
            potentialOperatingProfit: 15000,
            potentialProfitMargin: 58,
          },
          breakEvenEstimate: {
            initialInvestment: 25000,
            monthlyFixedCosts: 8300,
            averageGrossMargin: '85%',
            estimatedBreakEvenPoint: '3 Months',
            requiredDailySales: '3 client retainers',
          },
          difficulty: 'Moderate',
          riskLevel: 'Low',
          profitPotential: 'Very High',
          marketOpportunityScore: 94,
          advantages: [
            'Exceptional 55-70% operating profit margins',
            'Predictable monthly recurring revenue (MRR) retainers',
            'Minimal physical capital expenditure or inventory risk',
            'Rapid break-even timeline under 90 days',
          ],
          disadvantages: [
            'Requires technical acumen and continuous learning of AI toolchains',
            'B2B sales cycles require active relationship-building and consultative pitching',
          ],
          majorRisks: [
            'Rapid evolution of third-party AI APIs requiring prompt maintenance',
            'Client reliance on single key consultants in early stages',
          ],
          requiredSkills: ['Workflow Architecture (Zapier/Make/n8n)', 'API Integrations', 'B2B Solution Selling', 'Client Account Management'],
          requiredResources: ['Enterprise SaaS tooling stack', 'Demo portfolio environments', 'Standardized master service agreements (MSAs)'],
          marketingStrategy: ['LinkedIn Thought Leadership & Case Studies', 'Targeted cold email outreach to Managing Partners', 'Speaking at local Chamber of Commerce tech seminars'],
          competitorAnalysis: ['Compete against expensive traditional IT consultancies with rapid 14-day turnaround and clear value-based pricing.'],
          growthOpportunities: ['Productize recurring workflow templates into vertical SaaS', 'Hire junior prompt engineers for implementation scale'],
          startupPlan: [
            { step: 1, title: 'Service Packaging', description: 'Define 3 standardized audit & automation packages with fixed price points.', timeline: 'Weeks 1-2' },
            { step: 2, title: 'Case Study & Assets', description: 'Build 2 functional end-to-end demo automations for real businesses.', timeline: 'Weeks 3-4' },
            { step: 3, title: 'Outreach & Pilot Clients', description: 'Secure 3 initial pilot clients at introductory rates for verified testimonials.', timeline: 'Weeks 5-8' },
            { step: 4, title: 'Full Commercial Launch', description: 'Ramp outbound marketing and onboard first recurring retainer cohort.', timeline: 'Weeks 9-12' },
          ],
          aiRecommendation: {
            score: 94,
            summary: 'Exceptional ROI profile with low capital intensity and surging market demand from small businesses needing digitization.',
            actionPlan: 'Specialize immediately in one high-value vertical (such as legal or medical clinics) to command premium pricing.',
            verdict: 'Highest Recommendation',
            timelineMonths: 2,
          },
          status: 'published',
          isFeatured: true,
          createdBy: adminUser._id,
        },
        {
          name: 'Urban Hydroponic Microgreen & Herb Facility',
          slug: 'urban-hydroponic-microgreen-herb-facility',
          category: 'Agriculture',
          shortDescription: 'High-density vertical farming producing fresh microgreens, edible flowers, and gourmet culinary herbs for fine dining restaurants and premium grocery stores.',
          fullDescription: 'Controlled environment indoor agriculture utilizing vertical hydroponic shelving systems. Produces continuous weekly harvests with 90% less water usage than traditional farming, supplying chefs and organic specialty retailers with zero-kilometer fresh greens.',
          image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80',
          targetCustomers: 'Executive chefs at upscale restaurants, organic food co-ops, weekend farmers markets, and subscription salad enthusiasts.',
          locationGuidance: 'Suburban commercial warehouse or climate-controlled garage space with reliable electricity and water supply.',
          investmentMin: 28000,
          investmentMax: 60000,
          startupCostBreakdown: {
            verticalRacksAndLEDs: 14000,
            irrigationAndSensors: 6000,
            seedsAndSubstrates: 3000,
            refrigerationAndPackaging: 5000,
            marketingAndDeliveryVehicle: 7000,
          },
          monthlyExpenses: {
            electricityAndWater: 1800,
            seedsAndNutrients: 2400,
            packagingAndDelivery: 1200,
            salariesLabor: 3800,
            rentSpace: 2200,
            total: 11400,
          },
          revenueEstimate: {
            averageCustomersDay: 15,
            averageOrderValue: 45,
            estimatedDailyRevenue: 675,
            estimatedMonthlyRevenue: 18900,
          },
          profitEstimate: {
            potentialOperatingProfit: 7500,
            potentialProfitMargin: 39,
          },
          breakEvenEstimate: {
            initialInvestment: 45000,
            monthlyFixedCosts: 7800,
            averageGrossMargin: '68%',
            estimatedBreakEvenPoint: '7 Months',
            requiredDailySales: '28 orders/day',
          },
          difficulty: 'Moderate',
          riskLevel: 'Medium',
          profitPotential: 'High',
          marketOpportunityScore: 82,
          advantages: ['Year-round harvests unaffected by seasonal weather', 'Fast 10-14 day crop turnaround cycles', 'High price per gram for specialty culinary herbs'],
          disadvantages: ['Daily sanitation and humidity monitoring required', 'Electricity cost dependency for indoor LED arrays'],
          majorRisks: ['Power outage without generator backup', 'Bacterial contamination if hygiene SOPs lapse'],
          requiredSkills: ['Hydroponic Nutrient Balancing', 'Cleanroom Sanitation', 'Chef Relationship Management', 'Packaging & Cold Chain'],
          requiredResources: ['Vertical racking', 'Full-spectrum LED grow lights', 'Reverse osmosis water filtration', 'Climate-controlled nursery room'],
          marketingStrategy: ['Direct chef sample deliveries with handwritten notes', 'Live tasting displays at culinary trade shows', 'Weekly subscription vegetable baskets'],
          competitorAnalysis: ['Deliver living potted herbs and harvested-same-day greens that outlast wilting supermarket imports by 10+ days.'],
          growthOpportunities: ['Expand into medicinal herbs and culinary mushroom cultivation', 'Franchise indoor modular farming pods'],
          startupPlan: [
            { step: 1, title: 'Facility Setup', description: 'Equip climate-controlled space with vertical racking and automation sensors.', timeline: 'Weeks 1-4' },
            { step: 2, title: 'Trial Crop Cycles', description: 'Run test germination and harvest cycles across 8 signature microgreen varietals.', timeline: 'Weeks 5-6' },
            { step: 3, title: 'Chef Sampling Campaign', description: 'Provide free sample boxes to top 30 regional restaurants.', timeline: 'Weeks 7-8' },
            { step: 4, title: 'Commercial Supply Routes', description: 'Establish scheduled Tuesday and Friday delivery routes.', timeline: 'Weeks 9-10' },
          ],
          aiRecommendation: {
            score: 82,
            summary: 'Stable unit economics with strong weekly recurring chef orders. Fast cash turnaround due to 12-day growth cycles.',
            actionPlan: 'Pre-sell 50% of production capacity to anchor restaurant accounts before ordering full commercial LED setup.',
            verdict: 'Recommended Opportunity',
            timelineMonths: 3,
          },
          status: 'published',
          isFeatured: false,
          createdBy: adminUser._id,
        },
      ];

      for (const item of starterIdeas) {
        await Business.create(item);
      }
      console.log(`[SEED] Seeded ${starterIdeas.length} verified starter business ideas.`);
    }

    console.log('[SEED] Admin setup & seeding complete successfully!');
    process.exit(0);
  } catch (err) {
    console.error('[SEED] Seeding error:', err.message);
    process.exit(1);
  }
};

seedAdmin();
