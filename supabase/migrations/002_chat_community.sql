-- Chat-first planner, sharing, and community
-- Apply this migration to the Levart Supabase project.

CREATE SCHEMA IF NOT EXISTS private;

-- Profiles (1:1 with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  destination TEXT NOT NULL DEFAULT '',
  trip_focus TEXT[] NOT NULL DEFAULT '{}',
  check_in DATE,
  check_out DATE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed')),
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'unlisted', 'public')),
  slug TEXT UNIQUE,
  itinerary JSONB NOT NULL DEFAULT '{}'::jsonb,
  selected_attractions JSONB NOT NULL DEFAULT '[]'::jsonb,
  route_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  cover_photo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  confirmed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL UNIQUE REFERENCES public.trips(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  parts JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS public.share_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stars INTEGER NOT NULL CHECK (stars >= 1 AND stars <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  UNIQUE (trip_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.affiliate_clicks
  ADD COLUMN IF NOT EXISTS trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_trips_owner_id ON public.trips(owner_id);
CREATE INDEX IF NOT EXISTS idx_trips_status_visibility ON public.trips(status, visibility);
CREATE INDEX IF NOT EXISTS idx_trips_destination ON public.trips(destination);
CREATE INDEX IF NOT EXISTS idx_trips_created_at ON public.trips(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_share_links_token ON public.share_links(token);
CREATE INDEX IF NOT EXISTS idx_ratings_trip_id ON public.ratings(trip_id);
CREATE INDEX IF NOT EXISTS idx_comments_trip_id ON public.comments(trip_id, created_at);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_trip_id ON public.affiliate_clicks(trip_id);

CREATE OR REPLACE VIEW public.trip_stats
WITH (security_invoker = true) AS
SELECT
  t.id AS trip_id,
  coalesce(round(avg(r.stars)::numeric, 2), 0) AS avg_rating,
  count(r.id) AS rating_count,
  (
    SELECT count(*)::bigint
    FROM public.comments c
    WHERE c.trip_id = t.id
  ) AS comment_count
FROM public.trips t
LEFT JOIN public.ratings r ON r.trip_id = t.id
GROUP BY t.id;

CREATE OR REPLACE FUNCTION private.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base text;
BEGIN
  base := lower(regexp_replace(split_part(coalesce(NEW.email, 'traveler'), '@', 1), '[^a-z0-9]', '', 'g'));
  IF base IS NULL OR length(base) < 2 THEN
    base := 'traveler';
  END IF;

  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    base || '_' || substr(replace(NEW.id::text, '-', ''), 1, 8),
    coalesce(NEW.raw_user_meta_data->>'full_name', split_part(coalesce(NEW.email, 'Traveler'), '@', 1))
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION private.handle_new_user();

CREATE OR REPLACE FUNCTION private.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trips_updated_at ON public.trips;
CREATE TRIGGER trips_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();

DROP TRIGGER IF EXISTS ratings_updated_at ON public.ratings;
CREATE TRIGGER ratings_updated_at
  BEFORE UPDATE ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.share_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles are readable" ON public.profiles;
CREATE POLICY "profiles are readable"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "users update own profile" ON public.profiles;
CREATE POLICY "users update own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "owners manage trips" ON public.trips;
CREATE POLICY "owners manage trips"
  ON public.trips FOR ALL
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "public read published trips" ON public.trips;
CREATE POLICY "public read published trips"
  ON public.trips FOR SELECT
  USING (visibility = 'public' AND status = 'confirmed');

DROP POLICY IF EXISTS "owners manage conversations" ON public.conversations;
CREATE POLICY "owners manage conversations"
  ON public.conversations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.trips t
      WHERE t.id = trip_id AND t.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trips t
      WHERE t.id = trip_id AND t.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "owners manage messages" ON public.messages;
CREATE POLICY "owners manage messages"
  ON public.messages FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM public.conversations c
      JOIN public.trips t ON t.id = c.trip_id
      WHERE c.id = conversation_id AND t.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.conversations c
      JOIN public.trips t ON t.id = c.trip_id
      WHERE c.id = conversation_id AND t.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "owners manage share links" ON public.share_links;
CREATE POLICY "owners manage share links"
  ON public.share_links FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.trips t
      WHERE t.id = trip_id AND t.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trips t
      WHERE t.id = trip_id AND t.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "read ratings for public or own trips" ON public.ratings;
CREATE POLICY "read ratings for public or own trips"
  ON public.ratings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.trips t
      WHERE t.id = trip_id
        AND (
          (t.visibility = 'public' AND t.status = 'confirmed')
          OR t.owner_id = auth.uid()
        )
    )
  );

DROP POLICY IF EXISTS "authenticated insert rating" ON public.ratings;
CREATE POLICY "authenticated insert rating"
  ON public.ratings FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.trips t
      WHERE t.id = trip_id AND t.visibility = 'public' AND t.status = 'confirmed'
    )
  );

DROP POLICY IF EXISTS "update own rating" ON public.ratings;
CREATE POLICY "update own rating"
  ON public.ratings FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "delete own rating" ON public.ratings;
CREATE POLICY "delete own rating"
  ON public.ratings FOR DELETE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "read comments for public or own trips" ON public.comments;
CREATE POLICY "read comments for public or own trips"
  ON public.comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.trips t
      WHERE t.id = trip_id
        AND (
          (t.visibility = 'public' AND t.status = 'confirmed')
          OR t.owner_id = auth.uid()
        )
    )
  );

DROP POLICY IF EXISTS "authenticated insert comment" ON public.comments;
CREATE POLICY "authenticated insert comment"
  ON public.comments FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND char_length(body) BETWEEN 1 AND 2000
    AND EXISTS (
      SELECT 1 FROM public.trips t
      WHERE t.id = trip_id AND t.visibility = 'public' AND t.status = 'confirmed'
    )
  );

DROP POLICY IF EXISTS "delete own comment" ON public.comments;
CREATE POLICY "delete own comment"
  ON public.comments FOR DELETE
  USING (user_id = auth.uid());
