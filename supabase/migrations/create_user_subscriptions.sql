-- Create user_subscriptions table for managing user subscription status
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'inactive', -- 'active', 'inactive', 'canceled', 'past_due', 'unpaid'
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_access_levels table for feature access control
CREATE TABLE IF NOT EXISTS public.user_access_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  access_level TEXT NOT NULL, -- 'free', 'basic', 'premium', 'enterprise'
  features JSONB NOT NULL DEFAULT '{}',
  limits JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create plans table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  interval TEXT NOT NULL, -- 'month', 'year', 'one_time'
  stripe_price_id TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '{}',
  limits JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  is_popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create plan_features table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.plan_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id TEXT NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  feature TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer_id ON public.user_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_subscription_id ON public.user_subscriptions(stripe_subscription_id);

CREATE INDEX IF NOT EXISTS idx_user_access_levels_user_id ON public.user_access_levels(user_id);
CREATE INDEX IF NOT EXISTS idx_user_access_levels_plan_id ON public.user_access_levels(plan_id);

CREATE INDEX IF NOT EXISTS idx_plans_stripe_price_id ON public.plans(stripe_price_id);
CREATE INDEX IF NOT EXISTS idx_plans_is_active ON public.plans(is_active);

CREATE INDEX IF NOT EXISTS idx_plan_features_plan_id ON public.plan_features(plan_id);

-- Enable Row Level Security
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_access_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_features ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON public.user_subscriptions
  FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "System can manage subscriptions"
  ON public.user_subscriptions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for user_access_levels
CREATE POLICY "Users can view their own access levels"
  ON public.user_access_levels
  FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "System can manage access levels"
  ON public.user_access_levels
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for plans (public read access)
CREATE POLICY "Anyone can view active plans"
  ON public.plans
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "System can manage plans"
  ON public.plans
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for plan_features (public read access)
CREATE POLICY "Anyone can view plan features"
  ON public.plan_features
  FOR SELECT
  USING (true);

CREATE POLICY "System can manage plan features"
  ON public.plan_features
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_access_levels_updated_at
  BEFORE UPDATE ON public.user_access_levels
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON public.plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to sync user access levels when subscription changes
CREATE OR REPLACE FUNCTION public.sync_user_access_level()
RETURNS TRIGGER AS $$
DECLARE
  plan_record RECORD;
BEGIN
  -- Get plan details
  SELECT * INTO plan_record FROM public.plans WHERE id = NEW.plan_id;
  
  -- Insert or update user access level based on subscription
  INSERT INTO public.user_access_levels (user_id, plan_id, access_level, features, limits)
  VALUES (
    NEW.user_id,
    NEW.plan_id,
    CASE 
      WHEN plan_record.price_cents = 0 THEN 'free'
      WHEN plan_record.price_cents < 2000 THEN 'basic'
      WHEN plan_record.price_cents < 5000 THEN 'premium'
      ELSE 'enterprise'
    END,
    plan_record.features,
    plan_record.limits
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    plan_id = NEW.plan_id,
    access_level = CASE 
      WHEN plan_record.price_cents = 0 THEN 'free'
      WHEN plan_record.price_cents < 2000 THEN 'basic'
      WHEN plan_record.price_cents < 5000 THEN 'premium'
      ELSE 'enterprise'
    END,
    features = plan_record.features,
    limits = plan_record.limits,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to sync access levels
CREATE TRIGGER sync_user_access_level_trigger
  AFTER INSERT OR UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_access_level();

-- Insert default plans (you'll need to update these with your actual Stripe price IDs)
INSERT INTO public.plans (id, name, description, price_cents, currency, interval, stripe_price_id, features, limits, is_popular) VALUES
('free', 'Free Tier', 'Basic access with limited features', 0, 'usd', 'month', 'price_free', '{"chat_limit": 10, "search_limit": 5, "export": false}', '{"max_chats": 10, "max_searches_per_day": 5}', false),
('basic', 'Basic Tier', 'Essential features for individuals', 2000, 'usd', 'month', 'price_basic_monthly', '{"chat_limit": 100, "search_limit": 50, "export": true, "priority_support": false}', '{"max_chats": 100, "max_searches_per_day": 50}', false),
('premium', 'Premium Tier', 'Advanced features for professionals', 5000, 'usd', 'month', 'price_premium_monthly', '{"chat_limit": 1000, "search_limit": 200, "export": true, "priority_support": true, "api_access": true}', '{"max_chats": 1000, "max_searches_per_day": 200}', true),
('enterprise', 'Enterprise Tier', 'Full access with custom features', 10000, 'usd', 'month', 'price_enterprise_monthly', '{"chat_limit": -1, "search_limit": -1, "export": true, "priority_support": true, "api_access": true, "custom_integrations": true}', '{"max_chats": -1, "max_searches_per_day": -1}', false)
ON CONFLICT (id) DO NOTHING;

-- Insert plan features
INSERT INTO public.plan_features (plan_id, feature, description) VALUES
('free', 'Basic Chat', 'Limited chat interactions'),
('free', 'Basic Search', 'Basic search functionality'),
('basic', 'Enhanced Chat', 'More chat interactions'),
('basic', 'Advanced Search', 'Advanced search with filters'),
('basic', 'Export Data', 'Export your data'),
('premium', 'Unlimited Chat', 'Unlimited chat interactions'),
('premium', 'Premium Search', 'Advanced search with AI insights'),
('premium', 'API Access', 'Access to our API'),
('premium', 'Priority Support', 'Priority customer support'),
('enterprise', 'Everything in Premium', 'All premium features'),
('enterprise', 'Custom Integrations', 'Custom integrations and features'),
('enterprise', 'Dedicated Support', 'Dedicated account manager')
ON CONFLICT DO NOTHING;
