-- ============================================================
-- DriveEase — Seed Data
-- Run this AFTER schema.sql in the Supabase SQL Editor
-- 8 cars across all 4 types (economy, suv, luxury, van)
-- ============================================================

INSERT INTO cars (name, brand, model, year, type, seats, transmission, fuel_type, price_per_day, images, available, description)
VALUES

-- ── ECONOMY ──────────────────────────────────────────────────
(
  'City Cruiser',
  'Toyota',
  'Yaris',
  2023,
  'economy',
  5,
  'auto',
  'petrol',
  7500,
  ARRAY['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
  true,
  'Perfect for city commutes in Colombo. Fuel-efficient, easy to park, and comfortable for up to 5 passengers.'
),
(
  'Metro Glide',
  'Honda',
  'Fit',
  2022,
  'economy',
  5,
  'auto',
  'petrol',
  8000,
  ARRAY['https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?w=800&q=80'],
  true,
  'Reliable Honda Fit with spacious interior and excellent fuel economy. Ideal for budget-conscious travelers.'
),

-- ── SUV ──────────────────────────────────────────────────────
(
  'Summit Explorer',
  'Toyota',
  'RAV4',
  2024,
  'suv',
  5,
  'auto',
  'petrol',
  18000,
  ARRAY['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80'],
  true,
  'Rugged and capable Toyota RAV4. Perfect for both city driving and weekend getaways around Sri Lanka. Full safety suite included.'
),
(
  'Trail Blazer X',
  'Mitsubishi',
  'Outlander',
  2023,
  'suv',
  7,
  'auto',
  'diesel',
  22000,
  ARRAY['https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80'],
  true,
  '7-seater Mitsubishi Outlander with diesel engine. Great fuel range and ample cargo space for family trips.'
),

-- ── LUXURY ───────────────────────────────────────────────────
(
  'Executive Prestige',
  'BMW',
  '5 Series',
  2024,
  'luxury',
  5,
  'auto',
  'petrol',
  45000,
  ARRAY['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
        'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80'],
  true,
  'Drive in style with the BMW 5 Series. Premium leather interior, advanced driver assistance, and a powerful turbocharged engine. Perfect for corporate travel.'
),
(
  'Grand Touring',
  'Mercedes-Benz',
  'E-Class',
  2023,
  'luxury',
  5,
  'auto',
  'petrol',
  55000,
  ARRAY['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80'],
  true,
  'Unrivaled comfort in the Mercedes-Benz E-Class. Burmester sound system, massage seats, and MBUX infotainment for a truly premium experience.'
),

-- ── VAN ──────────────────────────────────────────────────────
(
  'Family Voyager',
  'Toyota',
  'HiAce',
  2022,
  'van',
  10,
  'manual',
  'diesel',
  28000,
  ARRAY['https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80'],
  true,
  'Spacious Toyota HiAce for large groups. Ideal for airport transfers, family trips, and corporate shuttles across Colombo and beyond.'
),
(
  'Comfort Shuttle',
  'Nissan',
  'Urvan',
  2023,
  'van',
  8,
  'manual',
  'diesel',
  25000,
  ARRAY['https://images.unsplash.com/photo-1631707153748-39e8b55c5665?w=800&q=80'],
  true,
  'Nissan Urvan with comfortable seating for 8. Air-conditioned and well-maintained, perfect for group travel around Sri Lanka.'
);
