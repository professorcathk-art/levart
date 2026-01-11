-- Create users table (simplified for MVP)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create itineraries table
CREATE TABLE IF NOT EXISTS itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  destination TEXT NOT NULL,
  trip_focus TEXT[] NOT NULL,
  selected_attractions JSONB NOT NULL,
  route_data JSONB NOT NULL,
  final_itinerary JSONB NOT NULL,
  check_in DATE,
  check_out DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create affiliate_clicks table
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  itinerary_id UUID REFERENCES itineraries(id) ON DELETE SET NULL,
  click_type TEXT NOT NULL CHECK (click_type IN ('hotel', 'flight', 'activity')),
  destination TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_itineraries_user_id ON itineraries(user_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_created_at ON itineraries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_user_id ON affiliate_clicks(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_itinerary_id ON affiliate_clicks(itinerary_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_timestamp ON affiliate_clicks(timestamp DESC);

-- Enable Row Level Security (RLS) - for MVP, allow all operations
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations for MVP (can be tightened later)
CREATE POLICY "Allow all operations on users" ON users
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on itineraries" ON itineraries
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on affiliate_clicks" ON affiliate_clicks
  FOR ALL USING (true) WITH CHECK (true);
