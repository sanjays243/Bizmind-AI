const express = require('express');
const router = express.Router();

// @desc Break-even calculation
router.post('/break-even', (req, res) => {
  const { fixedCosts, unitPrice, variableCostPerUnit } = req.body;
  const fc = Number(fixedCosts) || 0;
  const price = Number(unitPrice) || 0;
  const vc = Number(variableCostPerUnit) || 0;
  const contributionMargin = price - vc;
  if (contributionMargin <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Unit price must be greater than variable cost per unit.',
    });
  }
  const breakEvenUnits = Math.ceil(fc / contributionMargin);
  const breakEvenRevenue = breakEvenUnits * price;
  res.json({
    success: true,
    data: {
      breakEvenUnits,
      breakEvenRevenue,
      contributionMargin,
      contributionMarginRatio: parseFloat(((contributionMargin / price) * 100).toFixed(2)),
      disclaimer: 'Calculations are mathematical estimates for planning purposes only.',
    },
  });
});

module.exports = router;
