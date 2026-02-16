-- ============================================================================
-- Community App — Initial Schema Migration
-- Supabase / PostgreSQL
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. USERS
-- ============================================================================
CREATE TABLE public.users (
  user_id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email                   TEXT UNIQUE NOT NULL,
  user_first_name              TEXT NOT NULL,
  user_last_name               TEXT NOT NULL,
  user_name                    TEXT,
  user_login_email             TEXT,
  user_notification_email      TEXT,
  user_role                    TEXT NOT NULL DEFAULT 'User'
                                 CHECK (user_role IN ('User', 'Swordsman', 'Edge Keeper', 'Forge Keeper', 'Admin')),
  user_invited_by              UUID REFERENCES public.users(user_id),
  user_start_date              DATE DEFAULT CURRENT_DATE,
  user_clan                    TEXT,
  user_state                   TEXT,
  user_photo_source            TEXT DEFAULT 'Avatar'
                                 CHECK (user_photo_source IN ('Avatar', 'Gravatar', 'Photo')),
  user_photo_upload            TEXT,
  user_faith_profession        DATE,

  -- Avatar fields
  skin_color                   TEXT DEFAULT 'Light',
  top                          TEXT DEFAULT 'ShortHairShortFlat',
  hair_color                   TEXT DEFAULT 'Brown',
  accessories                  TEXT DEFAULT 'Blank',
  facial_hair                  TEXT DEFAULT 'Blank',
  facial_hair_color            TEXT DEFAULT 'Brown',
  clothes                      TEXT DEFAULT 'ShirtCrewNeck',
  clothe_color                 TEXT DEFAULT 'Black',
  graphic                      TEXT DEFAULT 'Bat',
  eyes                         TEXT DEFAULT 'Default',
  eyebrow                      TEXT DEFAULT 'Default',
  mouth                        TEXT DEFAULT 'Default',
  background_or_transparent    TEXT DEFAULT 'Circle',

  created_at                   TIMESTAMPTZ DEFAULT NOW(),

  -- Link to Supabase Auth
  CONSTRAINT fk_users_auth FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- ============================================================================
-- 2. COINS (reference table — 3 static rows)
-- ============================================================================
CREATE TABLE public.coins (
  coin_id          TEXT PRIMARY KEY,
  coin_order       INTEGER NOT NULL,
  coin_description TEXT
);

INSERT INTO public.coins (coin_id, coin_order, coin_description) VALUES
  ('Crucible Credit', 3, 'Foundation points earned through spiritual disciplines and group participation'),
  ('Talent Token',    2, 'Premium currency earned through dedicated one-on-one discipleship time'),
  ('Kingdom Coin',    1, 'Advanced currency earned through teaching and discipleship multiplication');

-- ============================================================================
-- 3. POINTS (reference table — activity definitions)
-- ============================================================================
CREATE TABLE public.points (
  point_id        TEXT PRIMARY KEY,
  point_activity  TEXT NOT NULL,
  point_value     INTEGER NOT NULL,
  point_category  TEXT NOT NULL,
  point_coin_type TEXT NOT NULL REFERENCES public.coins(coin_id),
  point_role      TEXT DEFAULT 'All',
  point_day       TEXT
);

INSERT INTO public.points (point_id, point_activity, point_value, point_category, point_coin_type, point_role, point_day) VALUES
  ('HVK-0001', 'Scripture🎖️',                          5,  'scripture',          'Crucible Credit', 'All',          'Thursday, Monday'),
  ('HVK-0002', 'Scripture🎖️🎖️',                        10, 'scripture',          'Crucible Credit', 'All',          'Thursday, Monday'),
  ('HVK-0003', 'Scripture🎖️🎖️🎖️',                      15, 'scripture',          'Crucible Credit', 'All',          'Thursday, Monday'),
  ('HVK-0004', 'Finished the book 📕',                  20, 'book_finished',      'Crucible Credit', 'All',          'Thursday'),
  ('HVK-0005', 'At least 10 bookmarks/notes 📝',        20, 'book_bookmarks',     'Crucible Credit', 'All',          'Thursday'),
  ('HVK-0006', 'Monday Attendance ✅',                   15, 'attendence',         'Crucible Credit', 'All',          'Monday'),
  ('HVK-0009', 'Wednesday Attendance ✅',                 10, 'attendence',         'Crucible Credit', 'All',          'Wednesday'),
  ('HVK-0013', 'Thursday Attendance ✅',                  20, 'attendence',         'Crucible Credit', 'All',          'Thursday'),
  ('HVK-0016', '10 minutes spent with another member',   1,  'talent_30min',       'Talent Token',    'All',          'All days'),
  ('HVK-0017', 'Create teaching material/content',       1,  'kc_forge_create',    'Kingdom Coin',    'Forge Keeper', 'All days'),
  ('HVK-0018', 'Train Edge Keeper on topic',             1,  'kc_forge_train',     'Kingdom Coin',    'Forge Keeper', 'All days'),
  ('HVK-0019', 'Swordsman passes end-of-month test',     1,  'kc_forge_sword_pass','Kingdom Coin',    'Forge Keeper', 'All days'),
  ('HVK-0020', 'Complete training from Forge Keeper',     1,  'kc_edge_learn',      'Kingdom Coin',    'Edge Keeper',  'All days'),
  ('HVK-0021', 'Swordsman under them passes test',       1,  'kc_edge_sword_pass', 'Kingdom Coin',    'Edge Keeper',  'All days'),
  ('HVK-0022', 'Complete training and pass test',         1,  'kc_sword_pass',      'Kingdom Coin',    'Swordsman',    'All days'),
  ('HVK-24',   'Prayed On Call',                          5,  'pray_on_call',       'Crucible Credit', 'All',          NULL),
  ('HVK-25',   'Stayed till End ⏰',                      5,  'stayed_till_end',    'Crucible Credit', 'All',          'Monday, Wednesday, Thursday'),
  ('HVK-26',   'On Time to call ⏰',                      5,  'On_time',            'Crucible Credit', 'All',          'Monday, Wednesday, Thursday'),
  ('HVK-27',   'Video turned on',                         5,  'attendence',         'Crucible Credit', 'All',          'Monday, Wednesday, Thursday');

-- ============================================================================
-- 4. COIN_RELATIONSHIPS
-- ============================================================================
CREATE TABLE public.coin_relationships (
  coin_relationship_id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coin_user_id                       UUID NOT NULL REFERENCES public.users(user_id),
  coin_type_id                       TEXT NOT NULL REFERENCES public.coins(coin_id),
  coin_date                          TIMESTAMPTZ DEFAULT NOW(),
  coin_relationship_point_ref        TEXT[],
  coin_relationship_date_rewarded    DATE,
  coin_relationship_day              TEXT,
  coin_relationship_edge_keeper_id   UUID REFERENCES public.users(user_id),
  coin_relationship_forge_keeper_id  UUID REFERENCES public.users(user_id),
  coin_relationship_talent_amount    INTEGER DEFAULT 0,
  coin_relationship_gift_from_id     UUID REFERENCES public.users(user_id),
  created_at                         TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. RELATIONSHIPS
-- ============================================================================
CREATE TABLE public.relationships (
  relationship_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id            UUID NOT NULL REFERENCES public.users(user_id),
  disciple_id          UUID NOT NULL REFERENCES public.users(user_id),
  date_of_relationship DATE DEFAULT CURRENT_DATE,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. SCRIPTURE_MEMORY
-- ============================================================================
CREATE TABLE public.scripture_memory (
  scripture_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scripture_book        TEXT NOT NULL,
  scripture_chapter     INTEGER NOT NULL,
  scripture_verse_start INTEGER NOT NULL,
  scripture_verse_end   INTEGER,
  scripture_user        UUID NOT NULL REFERENCES public.users(user_id),
  scripture_verse       TEXT,
  scripture_tag         TEXT[],
  scripture_role        TEXT,
  scripture_hide_verse  BOOLEAN DEFAULT FALSE,
  scripture_due_date    DATE,
  scripture_image       TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. DISCIPLINE_DEN
-- ============================================================================
CREATE TABLE public.discipline_den (
  discipline_den_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discipline_den_caption      TEXT,
  discipline_den_img          TEXT,
  discipline_den_date_created TIMESTAMPTZ DEFAULT NOW(),
  discipline_den_user         UUID NOT NULL REFERENCES public.users(user_id),
  discipline_den_link         TEXT,
  discipline_den_title        TEXT
);

-- ============================================================================
-- 8. DISCIPLINE_DEN_COMMENTS
-- ============================================================================
CREATE TABLE public.discipline_den_comments (
  discipline_den_comment_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discipline_den_comment_date       TIMESTAMPTZ DEFAULT NOW(),
  discipline_den_comment_parent_ref UUID NOT NULL REFERENCES public.discipline_den(discipline_den_id) ON DELETE CASCADE,
  discipline_den_comment_text       TEXT NOT NULL,
  discipline_den_comment_user_id    UUID NOT NULL REFERENCES public.users(user_id)
);

-- ============================================================================
-- 9. DISCIPLINE_DEN_LIKES
-- ============================================================================
CREATE TABLE public.discipline_den_likes (
  discipline_den_likes_id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discipline_den_likes_date              TIMESTAMPTZ DEFAULT NOW(),
  discipline_den_likes_comment_parent_ref UUID REFERENCES public.discipline_den_comments(discipline_den_comment_id) ON DELETE CASCADE,
  discipline_den_comment_user_id         UUID NOT NULL REFERENCES public.users(user_id),
  discipline_den_post_ref                UUID REFERENCES public.discipline_den(discipline_den_id) ON DELETE CASCADE
);

-- ============================================================================
-- 10. FORGES
-- ============================================================================
CREATE TABLE public.forges (
  forge_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  forge_date      DATE NOT NULL,
  forge_week_type TEXT
);

-- ============================================================================
-- 11. FORGE_EVENTS (The Forge HVK Events)
-- ============================================================================
CREATE TABLE public.forge_events (
  event_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT,
  start_time  TIMESTAMPTZ,
  end_time    TIMESTAMPTZ,
  location    TEXT,
  creator     TEXT,
  attendees   TEXT[],
  status      TEXT,
  web_link    TEXT,
  meet_link   TEXT,
  description TEXT
);

-- ============================================================================
-- 12. USER_DAILY_STATS
-- ============================================================================
CREATE TABLE public.user_daily_stats (
  stat_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_user_id         UUID NOT NULL REFERENCES public.users(user_id),
  stat_event_id        UUID REFERENCES public.forge_events(event_id),
  stat_date            DATE NOT NULL,
  stat_day_type        TEXT CHECK (stat_day_type IN ('Monday', 'Wednesday', 'Thursday')),
  stat_points_earned   NUMERIC DEFAULT 0,
  stat_points_possible NUMERIC DEFAULT 0,
  stat_percentage      NUMERIC GENERATED ALWAYS AS (
                         CASE WHEN stat_points_possible > 0
                              THEN (stat_points_earned / stat_points_possible) * 100
                              ELSE 0
                         END
                       ) STORED,
  stat_category        TEXT DEFAULT 'Meeting'
                         CHECK (stat_category IN ('Meeting', 'Workout')),
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 13. USER_REQUESTS
-- ============================================================================
CREATE TABLE public.user_requests (
  user_request_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_request_first_name TEXT NOT NULL,
  user_request_last_name  TEXT NOT NULL,
  user_request_email      TEXT NOT NULL,
  user_request_state      TEXT,
  user_request_invited_by TEXT,
  user_request_status     TEXT DEFAULT 'New Request'
                            CHECK (user_request_status IN ('New Request', 'Approved', 'Denied')),
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_coin_relationships_user   ON public.coin_relationships(coin_user_id);
CREATE INDEX idx_coin_relationships_date   ON public.coin_relationships(coin_relationship_date_rewarded);
CREATE INDEX idx_user_daily_stats_user     ON public.user_daily_stats(stat_user_id);
CREATE INDEX idx_user_daily_stats_date     ON public.user_daily_stats(stat_date);
CREATE INDEX idx_discipline_den_user       ON public.discipline_den(discipline_den_user);
CREATE INDEX idx_scripture_memory_user     ON public.scripture_memory(scripture_user);
CREATE INDEX idx_relationships_mentor      ON public.relationships(mentor_id);
CREATE INDEX idx_relationships_disciple    ON public.relationships(disciple_id);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Role lookup helper (SECURITY DEFINER so RLS policies can read any user's role)
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
  SELECT user_role FROM public.users WHERE user_id = user_uuid;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================================
-- ROW LEVEL SECURITY — Enable on every table
-- ============================================================================
ALTER TABLE public.users                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coins                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_relationships      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationships           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scripture_memory        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discipline_den          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discipline_den_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discipline_den_likes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forges                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forge_events            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_stats        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_requests           ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES — users
-- ============================================================================

-- Any authenticated user can read all user rows
CREATE POLICY users_select ON public.users
  FOR SELECT TO authenticated
  USING (true);

-- Users can update their own row only
CREATE POLICY users_update_own ON public.users
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Only Admins can insert new user rows
CREATE POLICY users_insert_admin ON public.users
  FOR INSERT TO authenticated
  WITH CHECK (
    public.get_user_role(auth.uid()) = 'Admin'
  );

-- Only Admins can delete user rows
CREATE POLICY users_delete_admin ON public.users
  FOR DELETE TO authenticated
  USING (
    public.get_user_role(auth.uid()) = 'Admin'
  );

-- ============================================================================
-- RLS POLICIES — coins (read-only reference table)
-- ============================================================================
CREATE POLICY coins_select ON public.coins
  FOR SELECT TO authenticated
  USING (true);

-- ============================================================================
-- RLS POLICIES — points (read-only reference table)
-- ============================================================================
CREATE POLICY points_select ON public.points
  FOR SELECT TO authenticated
  USING (true);

-- ============================================================================
-- RLS POLICIES — coin_relationships
-- ============================================================================

-- Users can see their own rows.
-- Edge Keepers can also see rows of their disciples.
-- Forge Keepers and Admins can see all rows.
CREATE POLICY coin_relationships_select ON public.coin_relationships
  FOR SELECT TO authenticated
  USING (
    coin_user_id = auth.uid()
    OR public.get_user_role(auth.uid()) IN ('Forge Keeper', 'Admin')
    OR (
      public.get_user_role(auth.uid()) = 'Edge Keeper'
      AND coin_user_id IN (
        SELECT disciple_id FROM public.relationships WHERE mentor_id = auth.uid()
      )
    )
  );

-- Edge Keepers can insert rows for their own disciples only
-- Forge Keepers and Admins can insert for anyone
CREATE POLICY coin_relationships_insert ON public.coin_relationships
  FOR INSERT TO authenticated
  WITH CHECK (
    public.get_user_role(auth.uid()) IN ('Forge Keeper', 'Admin')
    OR (
      public.get_user_role(auth.uid()) = 'Edge Keeper'
      AND coin_user_id IN (
        SELECT disciple_id FROM public.relationships WHERE mentor_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- RLS POLICIES — relationships
-- ============================================================================

-- Authenticated users can view all relationships
CREATE POLICY relationships_select ON public.relationships
  FOR SELECT TO authenticated
  USING (true);

-- Only Forge Keeper / Admin can insert
CREATE POLICY relationships_insert ON public.relationships
  FOR INSERT TO authenticated
  WITH CHECK (
    public.get_user_role(auth.uid()) IN ('Forge Keeper', 'Admin')
  );

-- Only Forge Keeper / Admin can update
CREATE POLICY relationships_update ON public.relationships
  FOR UPDATE TO authenticated
  USING (
    public.get_user_role(auth.uid()) IN ('Forge Keeper', 'Admin')
  )
  WITH CHECK (
    public.get_user_role(auth.uid()) IN ('Forge Keeper', 'Admin')
  );

-- Only Forge Keeper / Admin can delete
CREATE POLICY relationships_delete ON public.relationships
  FOR DELETE TO authenticated
  USING (
    public.get_user_role(auth.uid()) IN ('Forge Keeper', 'Admin')
  );

-- ============================================================================
-- RLS POLICIES — scripture_memory (full CRUD on own rows)
-- ============================================================================
CREATE POLICY scripture_memory_select ON public.scripture_memory
  FOR SELECT TO authenticated
  USING (scripture_user = auth.uid());

CREATE POLICY scripture_memory_insert ON public.scripture_memory
  FOR INSERT TO authenticated
  WITH CHECK (scripture_user = auth.uid());

CREATE POLICY scripture_memory_update ON public.scripture_memory
  FOR UPDATE TO authenticated
  USING (scripture_user = auth.uid())
  WITH CHECK (scripture_user = auth.uid());

CREATE POLICY scripture_memory_delete ON public.scripture_memory
  FOR DELETE TO authenticated
  USING (scripture_user = auth.uid());

-- ============================================================================
-- RLS POLICIES — discipline_den
-- ============================================================================

-- All authenticated users can view posts
CREATE POLICY discipline_den_select ON public.discipline_den
  FOR SELECT TO authenticated
  USING (true);

-- Users can insert their own posts
CREATE POLICY discipline_den_insert ON public.discipline_den
  FOR INSERT TO authenticated
  WITH CHECK (discipline_den_user = auth.uid());

-- Users can update their own posts
CREATE POLICY discipline_den_update ON public.discipline_den
  FOR UPDATE TO authenticated
  USING (discipline_den_user = auth.uid())
  WITH CHECK (discipline_den_user = auth.uid());

-- Users can delete their own posts
CREATE POLICY discipline_den_delete ON public.discipline_den
  FOR DELETE TO authenticated
  USING (discipline_den_user = auth.uid());

-- ============================================================================
-- RLS POLICIES — discipline_den_comments
-- ============================================================================

-- All authenticated users can view comments
CREATE POLICY discipline_den_comments_select ON public.discipline_den_comments
  FOR SELECT TO authenticated
  USING (true);

-- Users can insert their own comments
CREATE POLICY discipline_den_comments_insert ON public.discipline_den_comments
  FOR INSERT TO authenticated
  WITH CHECK (discipline_den_comment_user_id = auth.uid());

-- Users can update their own comments
CREATE POLICY discipline_den_comments_update ON public.discipline_den_comments
  FOR UPDATE TO authenticated
  USING (discipline_den_comment_user_id = auth.uid())
  WITH CHECK (discipline_den_comment_user_id = auth.uid());

-- Users can delete their own comments
CREATE POLICY discipline_den_comments_delete ON public.discipline_den_comments
  FOR DELETE TO authenticated
  USING (discipline_den_comment_user_id = auth.uid());

-- ============================================================================
-- RLS POLICIES — discipline_den_likes
-- ============================================================================

-- All authenticated users can view likes
CREATE POLICY discipline_den_likes_select ON public.discipline_den_likes
  FOR SELECT TO authenticated
  USING (true);

-- Users can insert their own likes
CREATE POLICY discipline_den_likes_insert ON public.discipline_den_likes
  FOR INSERT TO authenticated
  WITH CHECK (discipline_den_comment_user_id = auth.uid());

-- Users can delete their own likes
CREATE POLICY discipline_den_likes_delete ON public.discipline_den_likes
  FOR DELETE TO authenticated
  USING (discipline_den_comment_user_id = auth.uid());

-- ============================================================================
-- RLS POLICIES — user_daily_stats
-- ============================================================================

-- Users can view their own stats
CREATE POLICY user_daily_stats_select ON public.user_daily_stats
  FOR SELECT TO authenticated
  USING (stat_user_id = auth.uid());

-- INSERT and UPDATE reserved for the service role (pg_cron jobs)
-- The service role bypasses RLS, so no explicit authenticated policy is needed.
-- We add an explicit policy for the service_role for clarity.
CREATE POLICY user_daily_stats_insert_service ON public.user_daily_stats
  FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY user_daily_stats_update_service ON public.user_daily_stats
  FOR UPDATE TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- RLS POLICIES — user_requests
-- ============================================================================

-- Anyone (including unauthenticated / anon) can submit a request
CREATE POLICY user_requests_insert_public ON public.user_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Only Forge Keeper / Admin can view requests
CREATE POLICY user_requests_select_admin ON public.user_requests
  FOR SELECT TO authenticated
  USING (
    public.get_user_role(auth.uid()) IN ('Forge Keeper', 'Admin')
  );

-- Only Forge Keeper / Admin can update requests (approve / deny)
CREATE POLICY user_requests_update_admin ON public.user_requests
  FOR UPDATE TO authenticated
  USING (
    public.get_user_role(auth.uid()) IN ('Forge Keeper', 'Admin')
  )
  WITH CHECK (
    public.get_user_role(auth.uid()) IN ('Forge Keeper', 'Admin')
  );

-- ============================================================================
-- RLS POLICIES — forges (read-only for authenticated)
-- ============================================================================
CREATE POLICY forges_select ON public.forges
  FOR SELECT TO authenticated
  USING (true);

-- ============================================================================
-- RLS POLICIES — forge_events (read-only for authenticated)
-- ============================================================================
CREATE POLICY forge_events_select ON public.forge_events
  FOR SELECT TO authenticated
  USING (true);

-- ============================================================================
-- pg_cron FUNCTION — calculate_daily_stats
-- ============================================================================
CREATE OR REPLACE FUNCTION public.calculate_daily_stats()
RETURNS void AS $$
DECLARE
  target_date DATE;
  target_day_type TEXT;
BEGIN
  -- Calculate stats for meetings that occurred 2 days ago
  target_date := CURRENT_DATE - INTERVAL '2 days';
  target_day_type := TRIM(TO_CHAR(target_date, 'Day'));

  -- Only process if the target date was a meeting day
  IF target_day_type NOT IN ('Monday', 'Wednesday', 'Thursday') THEN
    RETURN;
  END IF;

  -- Calculate the maximum possible points for this day type
  -- by summing all point values that apply to this day
  -- Then for each active user, sum up their earned coin_relationship rows
  -- for that date and insert/update a stat row.

  INSERT INTO public.user_daily_stats (stat_user_id, stat_date, stat_day_type, stat_points_earned, stat_points_possible, stat_category)
  SELECT
    u.user_id                                          AS stat_user_id,
    target_date                                        AS stat_date,
    target_day_type                                    AS stat_day_type,
    COALESCE(earned.total_earned, 0)                   AS stat_points_earned,
    COALESCE(possible.total_possible, 0)               AS stat_points_possible,
    'Meeting'                                          AS stat_category
  FROM public.users u
  -- Subquery: points the user actually earned on that date
  LEFT JOIN LATERAL (
    SELECT SUM(p.point_value) AS total_earned
    FROM public.coin_relationships cr
    JOIN public.points p
      ON p.point_id = ANY(cr.coin_relationship_point_ref)
    WHERE cr.coin_user_id = u.user_id
      AND cr.coin_relationship_date_rewarded = target_date
  ) earned ON true
  -- Subquery: max possible points for the day type and the user's role
  CROSS JOIN LATERAL (
    SELECT SUM(p.point_value) AS total_possible
    FROM public.points p
    WHERE p.point_coin_type = 'Crucible Credit'
      AND (
        p.point_day ILIKE '%' || target_day_type || '%'
        OR p.point_day IS NULL
      )
      AND (
        p.point_role = 'All'
        OR p.point_role = u.user_role
      )
  ) possible
  -- Only users who have coin_relationship activity on that date (attended)
  WHERE EXISTS (
    SELECT 1
    FROM public.coin_relationships cr
    WHERE cr.coin_user_id = u.user_id
      AND cr.coin_relationship_date_rewarded = target_date
  )
  -- Avoid duplicate stat rows if the function runs more than once
  ON CONFLICT DO NOTHING;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
