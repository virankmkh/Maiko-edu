// PayPal SDK is optional - only load if available
let paypal = null;
let client = null;

try {
  paypal = require('@paypal/paypal-server-sdk');
  client = new paypal.core.PayPalHttpClient(
    new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID || 'your_client_id',
      process.env.PAYPAL_CLIENT_SECRET || 'your_client_secret'
    )
  );
} catch (error) {
  console.log('⚠️  PayPal SDK not available - PayPal payments will be mocked');
}

const { models } = require('../config/database');

class PayPalService {
  constructor() {
    this.client = client;
  }

  /**
   * Create a PayPal order for course payment
   */
  async createOrder(courseId, userId, amount, currency = 'USD') {
    try {
      // If PayPal SDK is not available, return a mock response
      if (!paypal || !this.client) {
        return {
          success: true,
          orderId: `mock_order_${Date.now()}`,
          approvalUrl: `${process.env.CLIENT_URL}/payment/success?courseId=${courseId}&userId=${userId}`,
          mock: true
        };
      }

      const course = await models.Course.findByPk(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const orderRequest = {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency,
            value: amount.toString()
          },
          description: `Course: ${course.title}`,
          custom_id: `course_${courseId}_user_${userId}`,
          invoice_id: `INV-${Date.now()}-${courseId}-${userId}`
        }],
        application_context: {
          brand_name: 'Maiko EDU',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: `${process.env.CLIENT_URL}/payment/success`,
          cancel_url: `${process.env.CLIENT_URL}/payment/cancel`
        }
      };

      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer('return=representation');
      request.requestBody(orderRequest);

      const response = await this.client.execute(request);
      
      return {
        success: true,
        orderId: response.result.id,
        approvalUrl: response.result.links.find(link => link.rel === 'approve').href,
        data: response.result
      };

    } catch (error) {
      console.error('PayPal order creation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Capture a PayPal order after approval
   */
  async captureOrder(orderId) {
    try {
      // If PayPal SDK is not available, return a mock response
      if (!paypal || !this.client) {
        return {
          success: true,
          transactionId: `mock_transaction_${Date.now()}`,
          status: 'COMPLETED',
          mock: true
        };
      }

      const request = new paypal.orders.OrdersCaptureRequest(orderId);
      request.requestBody({});

      const response = await this.client.execute(request);
      
      if (response.result.status === 'COMPLETED') {
        return {
          success: true,
          transactionId: response.result.id,
          status: response.result.status,
          amount: response.result.purchase_units[0].payments.captures[0].amount.value,
          currency: response.result.purchase_units[0].payments.captures[0].amount.currency_code,
          data: response.result
        };
      } else {
        return {
          success: false,
          error: 'Payment not completed',
          status: response.result.status
        };
      }

    } catch (error) {
      console.error('PayPal order capture error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get order details
   */
  async getOrderDetails(orderId) {
    try {
      const request = new paypal.orders.OrdersGetRequest(orderId);
      const response = await this.client.execute(request);
      
      return {
        success: true,
        order: response.result
      };

    } catch (error) {
      console.error('PayPal order details error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhook(headers, body, webhookId) {
    try {
      // In production, you should verify the webhook signature
      // For now, we'll do basic validation
      const webhookIdFromHeader = headers['paypal-transmission-id'];
      return webhookIdFromHeader === webhookId;
    } catch (error) {
      console.error('Webhook verification error:', error);
      return false;
    }
  }

  /**
   * Process webhook event
   */
  async processWebhook(event) {
    try {
      const eventType = event.event_type;
      const resource = event.resource;

      switch (eventType) {
        case 'PAYMENT.CAPTURE.COMPLETED':
          return await this.handlePaymentCompleted(resource);
        
        case 'PAYMENT.CAPTURE.DENIED':
          return await this.handlePaymentDenied(resource);
        
        case 'PAYMENT.CAPTURE.REFUNDED':
          return await this.handlePaymentRefunded(resource);
        
        default:
          console.log(`Unhandled webhook event: ${eventType}`);
          return { success: true, message: 'Event not handled' };
      }

    } catch (error) {
      console.error('Webhook processing error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Handle payment completed webhook
   */
  async handlePaymentCompleted(resource) {
    try {
      const customId = resource.custom_id;
      const [courseId, userId] = customId.split('_').slice(1, 3);
      
      // Update enrollment status
      const enrollment = await models.CourseEnrollment.findOne({
        where: { userId, courseId }
      });

      if (enrollment) {
        await enrollment.update({
          paymentStatus: 'paid',
          paymentId: resource.id,
          paidAt: new Date()
        });

        // Create payment record
        await models.CoursePayment.create({
          userId: parseInt(userId),
          courseId: parseInt(courseId),
          enrollmentId: enrollment.id,
          amount: parseFloat(resource.amount.value),
          currency: resource.amount.currency_code,
          paymentMethod: 'paypal',
          paymentGatewayId: resource.id,
          status: 'completed',
          gatewayResponse: resource
        });
      }

      return { success: true, message: 'Payment processed successfully' };

    } catch (error) {
      console.error('Payment completion handling error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle payment denied webhook
   */
  async handlePaymentDenied(resource) {
    try {
      const customId = resource.custom_id;
      const [courseId, userId] = customId.split('_').slice(1, 3);
      
      // Update payment status
      const payment = await models.CoursePayment.findOne({
        where: { paymentGatewayId: resource.id }
      });

      if (payment) {
        await payment.update({ status: 'failed' });
      }

      return { success: true, message: 'Payment denial processed' };

    } catch (error) {
      console.error('Payment denial handling error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle payment refunded webhook
   */
  async handlePaymentRefunded(resource) {
    try {
      const payment = await models.CoursePayment.findOne({
        where: { paymentGatewayId: resource.id }
      });

      if (payment) {
        await payment.update({
          status: 'refunded',
          refundedAt: new Date(),
          refundAmount: parseFloat(resource.amount.value)
        });

        // Update enrollment status
        const enrollment = await models.CourseEnrollment.findByPk(payment.enrollmentId);
        if (enrollment) {
          await enrollment.update({ paymentStatus: 'free' });
        }
      }

      return { success: true, message: 'Refund processed' };

    } catch (error) {
      console.error('Refund handling error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new PayPalService();
