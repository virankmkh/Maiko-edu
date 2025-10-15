# PayPal Sandbox Testing Guide

## 🧪 **Test with Fake Money - No Real Account Needed!**

### **1. Create Sandbox Test Accounts**

1. **Go to PayPal Developer**: https://developer.paypal.com/
2. **Login** with your PayPal account (or create one)
3. **Go to "Sandbox"** → "Accounts"
4. **Create Test Accounts**:
   - **Business Account** (for you - the seller)
   - **Personal Account** (for testing - the buyer)

### **2. Get Sandbox Credentials**

1. **Go to "My Apps & Credentials"**
2. **Create New App**:
   - App Name: "Maiko EDU Test"
   - Environment: **Sandbox** (not Live!)
   - Features: "Accept payments"
3. **Copy Credentials**:
   - **Client ID**: `sb-...` (starts with sb-)
   - **Client Secret**: `sb-...` (starts with sb-)

### **3. Update Your .env File**

```env
# PayPal Sandbox Configuration
PAYPAL_CLIENT_ID=sb-your_sandbox_client_id_here
PAYPAL_CLIENT_SECRET=sb-your_sandbox_client_secret_here
PAYPAL_MODE=sandbox
```

### **4. Test Payment Flow**

1. **Start your server**: `npm start`
2. **Enroll in a paid course**
3. **Click "Pay with PayPal"**
4. **Use Sandbox Test Account**:
   - Email: The sandbox personal account email
   - Password: The sandbox personal account password
   - **No real money involved!**

### **5. Sandbox Test Accounts**

PayPal provides pre-made test accounts:

**Buyer Account (for testing payments):**
- Email: `sb-buyer@personal.example.com`
- Password: `password123`
- **Has $1000 fake money**

**Seller Account (your business):**
- Email: `sb-seller@business.example.com`
- Password: `password123`
- **Receives fake payments**

### **6. Test Different Scenarios**

- ✅ **Successful Payment**: Use valid test account
- ❌ **Failed Payment**: Use account with no money
- 🔄 **Partial Payment**: Test different amounts
- 💳 **Credit Card**: Test with fake card numbers

### **7. Monitor Test Payments**

- **PayPal Sandbox Dashboard**: See all test transactions
- **Your App Logs**: Check server logs for webhook events
- **Database**: Verify payment records are created

## 🎯 **Benefits of Sandbox Testing**

- **No Real Money**: All transactions are fake
- **Safe Testing**: Test any scenario without risk
- **Real PayPal Experience**: Same UI as production
- **Webhook Testing**: Test payment confirmations
- **Error Testing**: Test failed payments safely

## 🚀 **Ready to Test?**

1. Create sandbox accounts (5 minutes)
2. Update your .env with sandbox credentials
3. Start testing payments immediately!

**No real PayPal account or money needed!** 🎉
