import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const CoursePaymentModal = ({ isOpen, onClose, course, onPaymentSuccess }) => {
  const { t } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({});

  const paymentMethods = [
    { id: 'stripe', name: 'Credit/Debit Card', icon: '💳', description: 'Visa, Mastercard, American Express' },
    { id: 'paypal', name: 'PayPal', icon: '🅿️', description: 'Pay with your PayPal account' },
    { id: 'orange_money', name: 'Orange Money', icon: '🟠', description: 'Mobile money payment' },
    { id: 'vodacom_mpesa', name: 'Vodacom M-Pesa', icon: '📱', description: 'Mobile money payment' },
    { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦', description: 'Direct bank transfer' }
  ];

  const handlePayment = async () => {
    if (!course) return;

    setIsProcessing(true);
    try {
      // DEVELOPMENT MODE: Completely mock the payment process
      console.log('🔓 DEVELOPMENT MODE: Mocking payment process - no server required');
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful payment result
      const mockResult = {
        success: true,
        message: 'Payment processed successfully (Development Mode)',
        payment: {
          id: `mock_payment_${Date.now()}`,
          amount: course.price,
          method: selectedMethod,
          status: 'completed',
          mock: true
        },
        enrollment: {
          id: `mock_enrollment_${Date.now()}`,
          courseId: course.id,
          userId: 1,
          enrolledAt: new Date().toISOString(),
          paymentStatus: 'paid'
        }
      };
      
      alert('🎉 Successfully enrolled in course! (Payment mocked in development mode)');
      onPaymentSuccess(mockResult);
      onClose();
      
    } catch (error) {
      console.error('Mock payment error:', error);
      alert('Mock payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentDataChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="p-6 flex-shrink-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {String(t('courses.payment.title') || 'Complete Your Purchase')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6">
        {/* Course Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900">{course.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{course.shortDescription}</p>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">
              ${course.price}
            </span>
            <span className="text-sm text-gray-500">
              {String(t('courses.payment.fullAccess') || 'Full Course Access')}
            </span>
          </div>
          
          {/* Development Mode Notice */}
          <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs text-yellow-800">
            🔓 <strong>Development Mode:</strong> This is a mock payment for testing only. No real payment will be processed.
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            {String(t('courses.payment.selectMethod') || 'Select Payment Method')}
          </h3>
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{method.icon}</span>
                    <span className="font-medium text-gray-900">{method.name}</span>
                  </div>
                  <p className="text-sm text-gray-500">{method.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Payment Form Fields */}
        {selectedMethod === 'stripe' && (
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber || ''}
                onChange={(e) => handlePaymentDataChange('cardNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={paymentData.expiryDate || ''}
                  onChange={(e) => handlePaymentDataChange('expiryDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  value={paymentData.cvv || ''}
                  onChange={(e) => handlePaymentDataChange('cvv', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {selectedMethod === 'orange_money' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+243 XXX XXX XXX"
              value={paymentData.phoneNumber || ''}
              onChange={(e) => handlePaymentDataChange('phoneNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {selectedMethod === 'vodacom_mpesa' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+243 XXX XXX XXX"
              value={paymentData.phoneNumber || ''}
              onChange={(e) => handlePaymentDataChange('phoneNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        </div>

        {/* Footer */}
        <div className="p-6 flex-shrink-0 border-t">
          {/* Action Buttons */}
          <div className="flex space-x-3 mb-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              {String(t('common.cancel') || 'Cancel')}
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
            {isProcessing 
              ? '🔓 Mocking Payment...' 
              : `🔓 Dev Mode - Mock Payment`
            }
            </button>
          </div>

          {/* Development Notice */}
          <div className="text-xs text-gray-500 text-center">
            🔓 Development Mode: Mock payment system for testing purposes only
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePaymentModal;
