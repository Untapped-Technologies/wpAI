# Industry-Standard Payment Process Implementation

## Overview

This document outlines the implementation of a proper industry-standard payment process for user registration and subscription management. The new system follows the **"Pay-to-Register"** model, ensuring users select and pay for their desired tier before account creation.

## Architecture

### Database Schema

The new system includes comprehensive database tables for subscription management:

1. **`user_subscriptions`** - Tracks user subscription status and billing information
2. **`user_access_levels`** - Manages feature access based on subscription tiers
3. **`plans`** - Defines available subscription plans and pricing
4. **`plan_features`** - Maps features to specific plans
5. **`payment_transactions`** - Records all payment transactions

### Key Features

- ✅ **Pay-to-Register Flow**: Users select tier and pay before account creation
- ✅ **Automatic Account Creation**: Accounts are created after successful payment
- ✅ **Subscription Management**: Full lifecycle management of subscriptions
- ✅ **Access Control**: Feature restrictions based on subscription tiers
- ✅ **Webhook Integration**: Real-time subscription status updates
- ✅ **Free Tier Support**: Seamless handling of free registrations

## Registration Flow

### 1. Plan Selection (`/register`)

Users start by selecting their desired subscription tier:

```typescript
// Registration flow steps:
1. Display available plans
2. User selects plan
3. User enters account details (email, password, user type)
4. Payment processing (Stripe Checkout)
5. Account creation via webhook
6. Redirect to success page
```

### 2. Payment Processing

For paid plans:

- Creates Stripe customer
- Initiates Stripe Checkout session
- Handles payment completion via webhook

For free plans:

- Creates account immediately
- Sets up free subscription
- Redirects to success page

### 3. Account Creation

After successful payment, the webhook handler:

- Creates Supabase Auth user
- Creates user profile
- Sets up subscription record
- Records payment transaction
- Syncs access levels

## API Endpoints

### Registration & Checkout

- `POST /api/checkout/register` - Handles registration with payment
- `POST /api/checkout/upgrade` - Handles subscription upgrades
- `POST /api/user/subscription/cancel` - Cancels subscriptions

### Access Control

- `GET /api/user/access` - Returns user's access level and features
- `GET /api/pricing` - Returns available plans

### Webhooks

- `POST /api/stripe-webhook` - Handles Stripe webhook events

## Components

### Registration Components

- `RegistrationFlow` - Main registration component with multi-step flow
- `AccessGuard` - Protects routes based on subscription levels
- `SubscriptionManagement` - Manages user subscriptions

### Access Control

```typescript
// Usage example
import { AccessGuard } from '@/components/auth/access-guard'

<AccessGuard requiredLevel="premium" requiredFeature="api_access">
  <PremiumFeature />
</AccessGuard>
```

## Subscription Tiers

### Free Tier

- Basic chat functionality
- Limited searches
- No data export

### Basic Tier ($20/month)

- Enhanced chat (100 interactions)
- Advanced search (50/day)
- Data export
- Email support

### Premium Tier ($50/month)

- Unlimited chat
- Premium search (200/day)
- API access
- Priority support
- Advanced analytics

### Enterprise Tier ($100/month)

- Everything in Premium
- Custom integrations
- Dedicated support
- Unlimited usage

## Security Features

### Payment Security

- Stripe handles all payment processing
- No sensitive payment data stored locally
- PCI compliance through Stripe

### Access Control

- Row Level Security (RLS) on all tables
- Server-side access validation
- Feature-level permissions

### Webhook Security

- Stripe signature verification
- Idempotent webhook handling
- Error logging and monitoring

## Migration Guide

### For Existing Users

1. **Run Database Migration**:

   ```sql
   -- Run the migration file
   \i supabase/migrations/create_user_subscriptions.sql
   ```

2. **Update Existing Users**:

   ```typescript
   // Create default free subscriptions for existing users
   await supabase.from('user_subscriptions').insert({
     user_id: existingUserId,
     plan_id: 'free',
     status: 'active'
     // ... other fields
   })
   ```

3. **Update Components**:
   - Replace old signup forms with `RegistrationFlow`
   - Add `AccessGuard` to protected routes
   - Update navigation to use new registration flow

### Environment Variables

Ensure these environment variables are set:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Testing

### Test Scenarios

1. **Free Registration**:
   - User selects free plan
   - Account created immediately
   - Access level set to 'free'

2. **Paid Registration**:
   - User selects paid plan
   - Redirected to Stripe Checkout
   - Payment processed
   - Account created via webhook
   - Access level set appropriately

3. **Subscription Management**:
   - User can upgrade/downgrade plans
   - Cancellation handled properly
   - Access levels updated correctly

### Webhook Testing

Use Stripe CLI for local webhook testing:

```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

## Monitoring & Analytics

### Key Metrics to Track

- Registration conversion rates by plan
- Payment success rates
- Subscription churn rates
- Feature usage by tier

### Logging

All critical operations are logged:

- Payment processing
- Account creation
- Subscription changes
- Access control decisions

## Best Practices

### Payment Processing

- Always verify webhook signatures
- Handle idempotent operations
- Implement proper error handling
- Use Stripe's test mode for development

### Access Control

- Check permissions server-side
- Cache access levels appropriately
- Implement graceful degradation
- Log access violations

### User Experience

- Clear pricing information
- Smooth checkout flow
- Immediate access after payment
- Helpful error messages

## Troubleshooting

### Common Issues

1. **Webhook Not Firing**:
   - Check Stripe webhook configuration
   - Verify webhook endpoint URL
   - Check webhook secret

2. **Access Control Not Working**:
   - Verify RLS policies
   - Check user subscription status
   - Validate access level sync

3. **Payment Failures**:
   - Check Stripe logs
   - Verify API keys
   - Check webhook processing

### Debug Tools

- Stripe Dashboard for payment monitoring
- Supabase logs for database operations
- Application logs for business logic
- Browser dev tools for frontend issues

## Future Enhancements

### Planned Features

- Prorated billing for upgrades/downgrades
- Annual billing discounts
- Usage-based billing for API calls
- Multi-currency support
- Invoice management
- Dunning management for failed payments

### Scalability Considerations

- Database indexing for performance
- Caching strategies for access levels
- CDN for static assets
- Load balancing for high traffic
- Monitoring and alerting systems
