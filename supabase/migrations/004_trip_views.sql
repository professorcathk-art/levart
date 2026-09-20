-- Trip view history for public itineraries.
-- Signed-in travelers create a row when they open someone else's public plan.

CREATE TABLE IF NOT EXISTS public.trip_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  viewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (trip_id, viewer_id)
);

CREATE INDEX IF NOT EXISTS idx_trip_views_trip ON public.trip_views (trip_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_trip_views_viewer ON public.trip_views (viewer_id, viewed_at DESC);

ALTER TABLE public.trip_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "viewers insert own trip views" ON public.trip_views;
CREATE POLICY "viewers insert own trip views"
  ON public.trip_views FOR INSERT
  TO authenticated
  WITH CHECK (viewer_id = auth.uid());

DROP POLICY IF EXISTS "viewers update own trip views" ON public.trip_views;
CREATE POLICY "viewers update own trip views"
  ON public.trip_views FOR UPDATE
  TO authenticated
  USING (viewer_id = auth.uid())
  WITH CHECK (viewer_id = auth.uid());

DROP POLICY IF EXISTS "viewers read own history" ON public.trip_views;
CREATE POLICY "viewers read own history"
  ON public.trip_views FOR SELECT
  TO authenticated
  USING (
    viewer_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = trip_views.trip_id
        AND trips.owner_id = auth.uid()
    )
  );

GRANT SELECT, INSERT, UPDATE ON public.trip_views TO authenticated;
GRANT ALL ON public.trip_views TO service_role;
