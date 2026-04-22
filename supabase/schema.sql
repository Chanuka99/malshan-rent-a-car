-- ============================================================
-- DriveEase — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- ── TABLES ───────────────────────────────────────────────────

-- profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- cars
CREATE TABLE IF NOT EXISTS cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('economy', 'suv', 'luxury', 'van')),
  seats INT NOT NULL,
  transmission TEXT NOT NULL CHECK (transmission IN ('auto', 'manual')),
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('petrol', 'diesel', 'electric')),
  price_per_day NUMERIC NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  available BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- bookings
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE NOT NULL,
  pickup_date DATE NOT NULL,
  dropoff_date DATE NOT NULL,
  total_days INT NOT NULL,
  total_price NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── ROW LEVEL SECURITY ────────────────────────────────────────

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- ── HELPER FUNCTION (get caller role) ────────────────────────
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── profiles POLICIES ────────────────────────────────────────

-- Users can read their own profile
CREATE POLICY "profiles_select_own"
ON profiles FOR SELECT
USING (auth.uid() = id OR get_my_role() = 'admin');

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Anyone (just authenticated service) can insert (on signup via server action)
CREATE POLICY "profiles_insert_own"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- ── cars POLICIES ─────────────────────────────────────────────

-- Public read
CREATE POLICY "cars_select_public"
ON cars FOR SELECT
USING (true);

-- Admin insert
CREATE POLICY "cars_insert_admin"
ON cars FOR INSERT
WITH CHECK (get_my_role() = 'admin');

-- Admin update
CREATE POLICY "cars_update_admin"
ON cars FOR UPDATE
USING (get_my_role() = 'admin');

-- Admin delete
CREATE POLICY "cars_delete_admin"
ON cars FOR DELETE
USING (get_my_role() = 'admin');

-- ── bookings POLICIES ─────────────────────────────────────────

-- Users read their own bookings; admins read all
CREATE POLICY "bookings_select"
ON bookings FOR SELECT
USING (user_id = auth.uid() OR get_my_role() = 'admin');

-- Users insert their own booking
CREATE POLICY "bookings_insert_own"
ON bookings FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Admins update all; users update their own (for cancellation)
CREATE POLICY "bookings_update"
ON bookings FOR UPDATE
USING (user_id = auth.uid() OR get_my_role() = 'admin');

-- ── STORAGE ───────────────────────────────────────────────────
-- Run these separately in Supabase Dashboard → Storage:
-- 1. Create a bucket named "cars" and set it to PUBLIC
-- 2. Add storage policy:
--    Allow authenticated admin users to upload:
--    CREATE POLICY "storage_cars_upload"
--    ON storage.objects FOR INSERT
--    WITH CHECK (bucket_id = 'cars' AND get_my_role() = 'admin');
--
--    Allow public read:
--    CREATE POLICY "storage_cars_read"
--    ON storage.objects FOR SELECT
--    USING (bucket_id = 'cars');
