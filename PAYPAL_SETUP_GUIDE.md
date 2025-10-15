# PayPal Integration Setup Guide

## 🎯 **What You Need to Do**

### **1. PayPal Business Account Setup**

1. **Go to PayPal Developer**: https://developer.paypal.com/
2. **Create App**: 
   - Click "Create App"
   - Choose "Default Application"
   - Select "Merchant" as the app type
   - Choose "Accept payments" as the capability

3. **Get Your Credentials**:
   - **Client ID**: Copy this for your `.env` file
   - **Client Secret**: Copy this for your `.env` file
   - **Webhook ID**: You'll get this after setting up webhooks

### **2. Update Your Environment Variables**

Add these to your `.env` file:

```env
# PayPal Configuration
PAYPAL_CLIENT_ID=your_actual_client_id_here
PAYPAL_CLIENT_SECRET=your_actual_client_secret_here
PAYPAL_MODE=sandbox
PAYPAL_WEBHOOK_ID=your_webhook_id_here
```

### **3. Set Up Webhooks (Important!)**

1. **Go to Webhooks**: In your PayPal app dashboard
2. **Create Webhook**: 
   - URL: `https://yourdomain.com/api/paypal/webhook`
   - Events to subscribe to:
     - `PAYMENT.CAPTURE.COMPLETED`
     - `PAYMENT.CAPTURE.DENIED`
     - `PAYMENT.CAPTURE.REFUNDED`
3. **Copy Webhook ID**: Add this to your `.env` file

### **4. Test Your Integration**

1. **Start your server**: `npm start` in the server directory
2. **Test payment flow**: Try enrolling in a paid course
3. **Use PayPal Sandbox**: 
   - Use sandbox PayPal accounts for testing
   - Go to https://developer.paypal.com/developer/accounts/
   - Create test buyer and seller accounts

### **5. Go Live (Production)**

1. **Switch to Live Mode**: Change `PAYPAL_MODE=live` in your `.env`
2. **Update Client ID/Secret**: Use your live credentials
3. **Update Webhook URL**: Point to your production domain
4. **Test with Real Money**: Use small amounts first!

## 💳 **How It Works**

### **Payment Flow:**
1. **Student clicks "Pay with PayPal"**
2. **System creates PayPal order** with course details
3. **Student redirected to PayPal** (can pay with PayPal account OR credit card)
4. **PayPal processes payment** (both PayPal and Visa cards work)
5. **Webhook confirms payment** and updates your database
6. **Student gets full course access**

### **What Students Can Pay With:**
- ✅ **PayPal Account** (if they have one)
- ✅ **Visa Cards** (directly through PayPal)
- ✅ **Mastercard** (directly through PayPal)
- ✅ **American Express** (directly through PayPal)
- ✅ **Debit Cards** (directly through PayPal)

### **All Payments Go To:**
- 🎯 **Your PayPal Business Account**
- 💰 **You receive the money directly**
- 📊 **You can track all transactions in PayPal dashboard**

## 🔧 **Current Implementation**

### **Backend Features:**
- ✅ PayPal order creation
- ✅ Payment capture
- ✅ Webhook handling
- ✅ Database integration
- ✅ Error handling

### **Frontend Features:**
- ✅ PayPal payment button
- ✅ Redirect to PayPal
- ✅ Payment status tracking
- ✅ User feedback

## 🚀 **Next Steps**

1. **Get your PayPal credentials** (follow steps 1-3 above)
2. **Update your `.env` file** with real credentials
3. **Test the integration** with sandbox accounts
4. **Deploy to production** when ready
5. **Monitor payments** in PayPal dashboard

## 📞 **Support**

- **PayPal Developer Docs**: https://developer.paypal.com/docs/
- **PayPal Support**: https://www.paypal.com/support
- **Webhook Testing**: Use PayPal's webhook simulator

## 💡 **Pro Tips**

1. **Start with Sandbox**: Always test with sandbox first
2. **Use Webhooks**: Don't rely on return URLs for payment confirmation
3. **Handle Errors**: Implement proper error handling for failed payments
4. **Monitor Logs**: Check your server logs for any issues
5. **Test Different Cards**: Try various card types and countries

---

**Ready to start? Follow the steps above and you'll be accepting payments in no time!** 🎉
