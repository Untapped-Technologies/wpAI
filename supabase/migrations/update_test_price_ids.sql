-- Update plans with test Stripe price IDs for development
-- You can replace these with your actual Stripe price IDs later

-- For development/testing, you can use these test price IDs:
-- Note: These are example IDs - you'll need to create actual prices in your Stripe dashboard

UPDATE public.plans 
SET stripe_price_id = 'price_test_free' 
WHERE id = 'free';

UPDATE public.plans 
SET stripe_price_id = 'price_test_basic_monthly' 
WHERE id = 'basic';

UPDATE public.plans 
SET stripe_price_id = 'price_test_premium_monthly' 
WHERE id = 'premium';

UPDATE public.plans 
SET stripe_price_id = 'price_test_enterprise_monthly' 
WHERE id = 'enterprise';

-- Verify the updates
SELECT id, name, price_cents, stripe_price_id FROM public.plans ORDER BY price_cents;
