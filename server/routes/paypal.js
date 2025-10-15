const express = require('express');
const { body, validationResult } = require('express-validator');
const paypalService = require('../services/paypalService');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/paypal/create-order
// @desc    Create PayPal order for course payment
// @access  Private (Student)
router.post('/create-order', [
  auth,
  body('courseId', 'Course ID is required').isInt(),
  body('amount', 'Amount is required').isFloat({ min: 0.01 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can create orders' });
    }

    const { courseId, amount } = req.body;

    const result = await paypalService.createOrder(courseId, req.user.id, amount);

    if (result.success) {
      res.json({
        success: true,
        orderId: result.orderId,
        approvalUrl: result.approvalUrl
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }

  } catch (error) {
    console.error('PayPal order creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/paypal/capture-order
// @desc    Capture PayPal order after approval
// @access  Private (Student)
router.post('/capture-order', [
  auth,
  body('orderId', 'Order ID is required').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can capture orders' });
    }

    const { orderId } = req.body;

    const result = await paypalService.captureOrder(orderId);

    if (result.success) {
      res.json({
        success: true,
        transactionId: result.transactionId,
        status: result.status,
        amount: result.amount,
        currency: result.currency
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }

  } catch (error) {
    console.error('PayPal order capture error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/paypal/order/:orderId
// @desc    Get PayPal order details
// @access  Private (Student)
router.get('/order/:orderId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { orderId } = req.params;
    const result = await paypalService.getOrderDetails(orderId);

    if (result.success) {
      res.json({
        success: true,
        order: result.order
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }

  } catch (error) {
    console.error('PayPal order details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/paypal/webhook
// @desc    Handle PayPal webhooks
// @access  Public (PayPal only)
router.post('/webhook', async (req, res) => {
  try {
    const headers = req.headers;
    const body = req.body;

    // Verify webhook signature (in production)
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    if (webhookId && !paypalService.verifyWebhook(headers, body, webhookId)) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    // Process webhook event
    const result = await paypalService.processWebhook(body);

    if (result.success) {
      res.status(200).json({ message: 'Webhook processed successfully' });
    } else {
      console.error('Webhook processing failed:', result.error);
      res.status(500).json({ message: 'Webhook processing failed' });
    }

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Webhook error' });
  }
});

module.exports = router;
