-- Supabase Database Function for Daily Stats Calculation
-- This function is called by pg_cron daily at 6 AM CT
-- It calculates user performance stats for meetings that occurred 2 days ago

CREATE OR REPLACE FUNCTION public.calculate_daily_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_date DATE;
  day_name TEXT;
  user_record RECORD;
  earned NUMERIC;
  possible NUMERIC;
  event_uuid UUID;
BEGIN
  -- Calculate stats for 2 days ago (grace period for data entry)
  target_date := CURRENT_DATE - INTERVAL '2 days';
  day_name := TO_CHAR(target_date, 'Day');
  -- Trim whitespace from day name
  day_name := TRIM(day_name);

  -- Only process meeting days (Monday, Wednesday, Thursday)
  IF day_name NOT IN ('Monday', 'Wednesday', 'Thursday') THEN
    RAISE NOTICE 'No meeting on %, skipping.', day_name;
    RETURN;
  END IF;

  -- Try to find a matching forge event for this date
  SELECT event_id INTO event_uuid
  FROM public.forge_events
  WHERE DATE(start_time) = target_date
  LIMIT 1;

  -- Calculate max possible points for this day type (Meeting category)
  SELECT COALESCE(SUM(point_value), 0) INTO possible
  FROM public.points
  WHERE point_coin_type = 'Crucible Credit'
    AND (
      point_day LIKE '%' || day_name || '%'
      OR point_day IS NULL
    );

  -- For each active user, calculate their earned points
  FOR user_record IN
    SELECT user_id FROM public.users
  LOOP
    -- Check if a stat row already exists for this user/date/category
    IF EXISTS (
      SELECT 1 FROM public.user_daily_stats
      WHERE stat_user_id = user_record.user_id
        AND stat_date = target_date
        AND stat_category = 'Meeting'
    ) THEN
      CONTINUE;
    END IF;

    -- Sum earned points from coin_relationships for this user on this date
    SELECT COALESCE(SUM(p.point_value), 0) INTO earned
    FROM public.coin_relationships cr
    CROSS JOIN LATERAL UNNEST(cr.coin_relationship_point_ref) AS ref_id
    JOIN public.points p ON p.point_id = ref_id
    WHERE cr.coin_user_id = user_record.user_id
      AND cr.coin_relationship_date_rewarded = target_date
      AND cr.coin_type_id = 'Crucible Credit';

    -- Only write a stat row if the user had any activity
    IF earned > 0 THEN
      INSERT INTO public.user_daily_stats (
        stat_user_id,
        stat_event_id,
        stat_date,
        stat_day_type,
        stat_points_earned,
        stat_points_possible,
        stat_category
      ) VALUES (
        user_record.user_id,
        event_uuid,
        target_date,
        day_name,
        earned,
        possible,
        'Meeting'
      );
    END IF;
  END LOOP;

  RAISE NOTICE 'Daily stats calculated for %', target_date;
END;
$$;

-- Schedule the function to run daily at 6 AM Central Time (12:00 UTC during CST)
-- Note: pg_cron uses UTC. Central Time is UTC-6 (CST) or UTC-5 (CDT)
-- Using 12:00 UTC which is 6:00 AM CST
-- Adjust to 11:00 UTC during daylight saving time if needed

-- To enable, run in Supabase SQL editor:
-- SELECT cron.schedule(
--   'calculate-daily-stats',
--   '0 12 * * *',
--   'SELECT public.calculate_daily_stats()'
-- );

-- To verify the job is scheduled:
-- SELECT * FROM cron.job;

-- To unschedule:
-- SELECT cron.unschedule('calculate-daily-stats');
