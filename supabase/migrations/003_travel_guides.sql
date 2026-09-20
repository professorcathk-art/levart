-- Optional knowledge layer for destination guides / 攻略 snippets.
-- Public community trips are already used as retrieval context without this table.
-- Apply this if you want to store curated, attributed travel notes.

CREATE TABLE IF NOT EXISTS public.travel_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'zh-Hant',
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  source_name TEXT,
  source_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.travel_guides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read travel guides" ON public.travel_guides;
CREATE POLICY "Anyone can read travel guides"
  ON public.travel_guides FOR SELECT
  USING (true);

CREATE INDEX IF NOT EXISTS travel_guides_destination_idx
  ON public.travel_guides (lower(destination));
