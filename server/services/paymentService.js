const { models } = require('../config/database');
const CoursePayment = models.CoursePayment;
const CourseEnrollment = models.CourseEnrollment;
const Course = models.Course;
const paypalService = require('./paypalService');

class PaymentService {
  constructor() {
    this.paymentGateways = {
      stripe: this.stripePayment,
      paypal: this.paypalPayment,
      orange_money: this.orangeMoneyPayment,
      vodacom_mpesa: this.vodacomMpesaPayment,
      bank_transfer: this.bankTransferPayment
    };
  }

  /**
   * Process course payment
   */
  async processCoursePayment(userId, courseId, paymentMethod, paymentData) {
    try {
      // Get course details
      const course = await Course.findByPk(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      // Get enrollment
      const enrollment = await CourseEnrollment.findOne({
        where: { userId, courseId }
      });

      if (!enrollment) {
        throw new Error('Enrollment not found');
      }

      if (enrollment.paymentStatus === 'paid') {
        throw new Error('Course already paid for');
      }

      // Process payment through gateway
      const paymentResult = await this.paymentGateways[paymentMethod](
        course.price,
        paymentData
      );

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Payment failed');
      }

      // Create payment record
      const payment = await CoursePayment.create({
        userId,
        courseId,
        enrollmentId: enrollment.id,
        amount: course.price,
        currency: 'USD',
        paymentMethod,
        paymentGatewayId: paymentResult.transactionId,
        status: 'completed',
        gatewayResponse: paymentResult.response
      });

      // Update enrollment status
      await enrollment.update({
        paymentStatus: 'paid',
        paymentId: paymentResult.transactionId,
        paidAt: new Date()
      });

      return {
        success: true,
        payment,
        enrollment
      };

    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check if user has access to a specific lesson
   * TEMPORARILY DISABLED FOR DEVELOPMENT - ALL LESSONS ACCESSIBLE
   */
  async checkLessonAccess(userId, courseId, lessonId) {
    try {
      // DEVELOPMENT MODE: Allow access to all lessons
      console.log(`🔓 DEVELOPMENT MODE: Allowing access to lesson ${lessonId} for user ${userId}`);
      return { hasAccess: true, reason: 'Development mode - payment bypassed' };

      /* COMMENTED OUT FOR DEVELOPMENT - UNCOMMENT WHEN READY FOR PAYMENTS
      const enrollment = await CourseEnrollment.findOne({
        where: { userId, courseId }
      });

      if (!enrollment) {
        return { hasAccess: false, reason: 'Not enrolled' };
      }

      // If payment is completed, user has access to all lessons
      if (enrollment.paymentStatus === 'paid') {
        return { hasAccess: true };
      }

      // For free users, check if this is a free lesson
      const lesson = await models.Lesson.findByPk(lessonId);
      if (!lesson) {
        return { hasAccess: false, reason: 'Lesson not found' };
      }

      // Check if it's the first lesson (free)
      const firstLesson = await models.Lesson.findOne({
        where: { courseId },
        order: [['order', 'ASC']]
      });

      if (lesson.id === firstLesson.id) {
        return { hasAccess: true };
      }

      // Check if lesson is marked as free
      if (lesson.isFree) {
        return { hasAccess: true };
      }

      return { 
        hasAccess: false, 
        reason: 'Payment required',
        coursePrice: enrollment.course?.price || 0
      };
      */

    } catch (error) {
      console.error('Lesson access check error:', error);
      return { hasAccess: false, reason: 'Error checking access' };
    }
  }

  /**
   * Get user's payment status for a course
   * TEMPORARILY DISABLED FOR DEVELOPMENT - ALWAYS SHOW AS PAID
   */
  async getCoursePaymentStatus(userId, courseId) {
    try {
      // DEVELOPMENT MODE: Always return as paid for development
      console.log(`🔓 DEVELOPMENT MODE: Returning paid status for course ${courseId} for user ${userId}`);
      return {
        status: 'paid',
        coursePrice: 0,
        paidAt: new Date(),
        freeLessonsCompleted: 0,
        developmentMode: true
      };

      /* COMMENTED OUT FOR DEVELOPMENT - UNCOMMENT WHEN READY FOR PAYMENTS
      const enrollment = await CourseEnrollment.findOne({
        where: { userId, courseId },
        include: [{
          model: Course,
          as: 'course'
        }]
      });

      if (!enrollment) {
        return { status: 'not_enrolled' };
      }

      return {
        status: enrollment.paymentStatus,
        coursePrice: enrollment.course?.price || 0,
        paidAt: enrollment.paidAt,
        freeLessonsCompleted: enrollment.freeLessonsCompleted
      };
      */

    } catch (error) {
      console.error('Payment status check error:', error);
      return { status: 'error' };
    }
  }

  // Payment Gateway Implementations (Mock for now)
  async stripePayment(amount, paymentData) {
    // Mock Stripe payment
    return {
      success: true,
      transactionId: `stripe_${Date.now()}`,
      response: { status: 'succeeded' }
    };
  }

  async paypalPayment(amount, paymentData) {
    try {
      // Create PayPal order
      const orderResult = await paypalService.createOrder(
        paymentData.courseId,
        paymentData.userId,
        amount
      );

      if (!orderResult.success) {
        return {
          success: false,
          error: orderResult.error
        };
      }

      // If this is a direct capture (not redirect flow)
      if (paymentData.captureOrderId) {
        const captureResult = await paypalService.captureOrder(paymentData.captureOrderId);
        return captureResult;
      }

      // Return order details for frontend redirect
      return {
        success: true,
        orderId: orderResult.orderId,
        approvalUrl: orderResult.approvalUrl,
        requiresRedirect: true
      };

    } catch (error) {
      console.error('PayPal payment error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async orangeMoneyPayment(amount, paymentData) {
    // Mock Orange Money payment
    return {
      success: true,
      transactionId: `orange_${Date.now()}`,
      response: { status: 'success' }
    };
  }

  async vodacomMpesaPayment(amount, paymentData) {
    // Mock Vodacom M-Pesa payment
    return {
      success: true,
      transactionId: `mpesa_${Date.now()}`,
      response: { status: 'success' }
    };
  }

  async bankTransferPayment(amount, paymentData) {
    // Mock bank transfer payment
    return {
      success: true,
      transactionId: `bank_${Date.now()}`,
      response: { status: 'pending' }
    };
  }
}

module.exports = new PaymentService();
