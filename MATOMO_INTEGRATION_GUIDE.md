# 📊 Matomo Analytics Integration Guide

## 🎯 **Overview**

Matomo Analytics has been fully integrated into Maiko EDU to provide comprehensive tracking of:
- **Student Learning Analytics**
- **Revenue Tracking & Financial Analytics**
- **Course Performance Metrics**
- **Marketing Campaign Analysis**
- **User Behavior Insights**

## 🚀 **Quick Start**

### **1. Access Analytics Dashboard**
- Navigate to your instructor dashboard
- Click the **"Analytics Dashboard"** button
- View real-time metrics and performance data

### **2. Open Full Matomo Dashboard**
- Click **"Open Matomo"** button in the analytics widget
- Access advanced analytics, reports, and custom dashboards
- Create automated reports and alerts

## 💰 **Revenue Tracking Features**

### **Course Sales Tracking**
```javascript
// Automatically tracked when students enroll
await matomoService.trackRevenue(
  userId, 
  courseId, 
  courseTitle, 
  amount, 
  currency, 
  paymentMethod, 
  transactionId
);
```

### **Subscription Revenue**
```javascript
// Track recurring subscription income
await matomoService.trackSubscriptionRevenue(
  userId, 
  'Premium Monthly', 
  29.99, 
  'USD', 
  'monthly'
);
```

### **Affiliate Commissions**
```javascript
// Track affiliate-generated revenue
await matomoService.trackAffiliateCommission(
  userId, 
  affiliateId, 
  courseId, 
  commissionAmount, 
  'USD'
);
```

### **Marketing Campaign ROI**
```javascript
// Track marketing campaign performance
await matomoService.trackMarketingCampaign(
  userId, 
  'Facebook Ad Campaign', 
  'Social Media', 
  cost, 
  revenue, 
  roi
);
```

## 📈 **Analytics Dashboard Features**

### **Key Metrics Displayed:**
- **Total Revenue**: Course sales, subscriptions, affiliate commissions
- **Student Engagement**: Enrollments, lesson completions, forum activity
- **Learning Analytics**: H5P interactions, video watch time, quiz performance
- **Performance Metrics**: Session duration, bounce rate, conversion rates

### **Revenue Breakdown:**
- Course sales revenue
- Affiliate commission tracking
- Marketing ROI analysis
- Student lifetime value calculation

### **Top Performing Courses:**
- Enrollment numbers
- Revenue per course
- Completion rates
- Student satisfaction metrics

## 🔧 **Integration Points**

### **Automatic Tracking:**
- **Course Enrollments**: Tracked when students enroll
- **Lesson Completions**: Tracked when lessons are completed
- **H5P Interactions**: Tracked during interactive content engagement
- **Video Watch Time**: Tracked during video playback
- **Quiz Submissions**: Tracked when quizzes are submitted
- **Forum Activity**: Tracked during discussions
- **Jitsi Sessions**: Tracked during live lessons

### **Revenue Tracking:**
- **Course Purchases**: Automatic tracking on enrollment
- **Payment Methods**: Tracked for analysis
- **Affiliate Attribution**: Tracked for commission calculation
- **Marketing Attribution**: Tracked for campaign analysis

## 📊 **Available Analytics Views**

### **1. Instructor Dashboard**
- Course performance overview
- Revenue analytics
- Student engagement metrics
- Learning analytics

### **2. Student Analytics**
- Personal learning progress
- Study patterns and preferences
- Goal tracking and achievements
- Learning recommendations

### **3. Full Matomo Dashboard**
- Real-time visitor tracking
- Custom reports and dashboards
- Heatmaps and user behavior analysis
- Advanced segmentation and filtering

## 🎨 **Dashboard Components**

### **MatomoIntegrationButton**
- Quick access to analytics
- Real-time metrics display
- Direct Matomo dashboard access
- Revenue and engagement overview

### **InstructorAnalyticsDashboard**
- Comprehensive analytics view
- Revenue tracking and analysis
- Course performance metrics
- Student engagement insights

### **StudentAnalytics**
- Personal learning analytics
- Progress tracking
- Study pattern analysis
- Goal setting and achievement

## 🔗 **API Endpoints**

### **Analytics Endpoints:**
- `GET /api/matomo/config` - Get Matomo configuration
- `GET /api/matomo/dashboard` - Get dashboard data
- `GET /api/matomo/analytics/:method` - Get specific analytics data

### **Tracking Endpoints:**
- `POST /api/matomo/track/pageview` - Track page views
- `POST /api/matomo/track/enrollment` - Track course enrollments
- `POST /api/matomo/track/lesson-completion` - Track lesson completions
- `POST /api/matomo/track/h5p-interaction` - Track H5P interactions
- `POST /api/matomo/track/video-watch` - Track video watch time
- `POST /api/matomo/track/quiz-submission` - Track quiz submissions
- `POST /api/matomo/track/jitsi-session` - Track Jitsi sessions
- `POST /api/matomo/track/forum-activity` - Track forum activity

### **Revenue Tracking Endpoints:**
- `POST /api/matomo/track/revenue` - Track course purchases
- `POST /api/matomo/track/subscription-revenue` - Track subscriptions
- `POST /api/matomo/track/affiliate-commission` - Track affiliate commissions
- `POST /api/matomo/track/marketing-campaign` - Track marketing campaigns
- `POST /api/matomo/track/student-lifetime-value` - Track student CLV

## 🛠️ **Setup Instructions**

### **1. Enable Matomo Tracking**
Add to your `.env` file:
```env
MATOMO_URL=http://localhost:8080
MATOMO_SITE_ID=1
MATOMO_AUTH_TOKEN=your_auth_token_here
MATOMO_TRACKING_ENABLED=true
```

### **2. Install Matomo Server**
1. Download Matomo from https://matomo.org/
2. Install on your server (e.g., http://localhost:8080)
3. Create a site and get the Site ID
4. Generate an auth token in Matomo admin

### **3. Frontend Integration**
```jsx
import MatomoTracker from './components/analytics/MatomoTracker';
import MatomoIntegrationButton from './components/analytics/MatomoIntegrationButton';

// Wrap your app with MatomoTracker
<MatomoTracker>
  <App />
</MatomoTracker>

// Add analytics button to instructor dashboard
<MatomoIntegrationButton onAnalyticsClick={handleAnalyticsClick} />
```

## 📱 **Mobile & Responsive**

All analytics components are fully responsive and work on:
- Desktop computers
- Tablets
- Mobile phones
- Different screen sizes

## 🔒 **Privacy & Security**

### **Privacy-First Approach:**
- Self-hosted analytics (no third-party tracking)
- GDPR compliant by default
- User data stays on your server
- No cross-site tracking

### **Data Security:**
- Encrypted data transmission
- Secure authentication required
- Role-based access control
- Data export and deletion capabilities

## 📈 **Advanced Features**

### **Custom Reports:**
- Create custom dashboards in Matomo
- Set up automated reports
- Configure alerts and notifications
- Export data in various formats

### **Segmentation:**
- Segment users by behavior
- Analyze different user groups
- Track conversion funnels
- Monitor user journeys

### **Real-time Analytics:**
- Live visitor tracking
- Real-time revenue monitoring
- Instant engagement metrics
- Live course performance data

## 🎯 **Best Practices**

### **Revenue Tracking:**
1. Track all course purchases
2. Monitor subscription renewals
3. Analyze affiliate performance
4. Track marketing campaign ROI
5. Calculate student lifetime value

### **Learning Analytics:**
1. Monitor lesson completion rates
2. Track H5P engagement
3. Analyze video watch patterns
4. Monitor forum activity
5. Track quiz performance

### **Performance Optimization:**
1. Use analytics to identify bottlenecks
2. Optimize based on user behavior
3. A/B test different approaches
4. Monitor conversion rates
5. Track user satisfaction

## 🚀 **Next Steps**

1. **Set up Matomo server** for full analytics functionality
2. **Configure tracking** for your specific needs
3. **Create custom dashboards** for your team
4. **Set up automated reports** for regular insights
5. **Train your team** on using analytics effectively

## 📞 **Support**

For technical support or questions about Matomo integration:
- Check the Matomo documentation: https://matomo.org/docs/
- Review the API documentation in the codebase
- Contact your development team for assistance

---

**🎉 Your Maiko EDU platform now has comprehensive analytics and revenue tracking capabilities!**
