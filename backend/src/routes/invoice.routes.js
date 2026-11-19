const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');
const { protect, optionalAuth } = require('../middleware/auth');

router.post('/:id/checkout', optionalAuth, invoiceController.checkoutInvoice);

router.use(protect);

router.get('/', invoiceController.getInvoices);
router.get('/stats/:businessId', invoiceController.getInvoiceStats);
router.post('/', invoiceController.createInvoice);
router.get('/:id', invoiceController.getInvoice);
router.put('/:id', invoiceController.updateInvoice);
router.delete('/:id', invoiceController.deleteInvoice);
router.post('/:id/pay', invoiceController.markAsPaid);

module.exports = router;

