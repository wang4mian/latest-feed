-- 启用pg_cron扩展（需要在Supabase项目设置中启用）
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 创建用于调用Edge Functions的数据库函数
CREATE OR REPLACE FUNCTION public.trigger_rss_fetch()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  project_url text;
  anon_key text;
  response_status int;
  response_body text;
BEGIN
  -- 从环境变量获取项目信息
  project_url := current_setting('app.settings.supabase_url', true);
  anon_key := current_setting('app.settings.supabase_anon_key', true);
  
  -- 如果环境变量不存在，使用默认值（需要手动设置）
  IF project_url IS NULL THEN
    project_url := 'YOUR_SUPABASE_PROJECT_URL';
  END IF;
  
  IF anon_key IS NULL THEN
    anon_key := 'YOUR_SUPABASE_ANON_KEY';
  END IF;

  -- 调用RSS抓取Edge Function
  SELECT status, content 
  INTO response_status, response_body
  FROM http((
    'POST',
    project_url || '/functions/v1/fetch-rss',
    ARRAY[
      http_header('Authorization', 'Bearer ' || anon_key),
      http_header('Content-Type', 'application/json')
    ],
    'application/json',
    '{}'
  )::http_request);

  -- 记录结果
  INSERT INTO public.cron_logs (
    function_name,
    status_code,
    response_body,
    executed_at
  ) VALUES (
    'fetch-rss',
    response_status,
    response_body,
    NOW()
  );

  -- 如果RSS抓取成功，调用AI处理
  IF response_status = 200 THEN
    SELECT status, content 
    INTO response_status, response_body
    FROM http((
      'POST',
      project_url || '/functions/v1/ai-processor',
      ARRAY[
        http_header('Authorization', 'Bearer ' || anon_key),
        http_header('Content-Type', 'application/json')
      ],
      'application/json',
      '{}'
    )::http_request);

    -- 记录AI处理结果
    INSERT INTO public.cron_logs (
      function_name,
      status_code,
      response_body,
      executed_at
    ) VALUES (
      'ai-processor',
      response_status,
      response_body,
      NOW()
    );
  END IF;

EXCEPTION
  WHEN OTHERS THEN
    -- 记录错误
    INSERT INTO public.cron_logs (
      function_name,
      status_code,
      response_body,
      executed_at
    ) VALUES (
      'trigger_rss_fetch_error',
      500,
      SQLERRM,
      NOW()
    );
END;
$$;

-- 创建cron日志表用于监控
CREATE TABLE IF NOT EXISTS public.cron_logs (
    id BIGSERIAL PRIMARY KEY,
    function_name TEXT NOT NULL,
    status_code INTEGER,
    response_body TEXT,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_cron_logs_executed_at ON public.cron_logs(executed_at DESC);
CREATE INDEX IF NOT EXISTS idx_cron_logs_function_name ON public.cron_logs(function_name);

-- 启用行级安全策略
ALTER TABLE public.cron_logs ENABLE ROW LEVEL SECURITY;

-- 创建策略（允许所有操作）
CREATE POLICY "允许所有cron日志操作" ON public.cron_logs FOR ALL USING (true);

-- 手动测试函数
-- SELECT public.trigger_rss_fetch();

-- 设置cron任务（需要在Supabase Dashboard中启用pg_cron扩展后执行）
-- 每天北京时间上午10点执行（UTC时间02:00）
-- SELECT cron.schedule(
--   'daily-rss-fetch',           -- 任务名称
--   '0 2 * * *',                 -- cron表达式：每天02:00 UTC
--   'SELECT public.trigger_rss_fetch();'
-- );

-- 查看cron任务状态的函数
CREATE OR REPLACE FUNCTION public.get_cron_status()
RETURNS TABLE (
  last_execution timestamp with time zone,
  total_executions bigint,
  recent_successes bigint,
  recent_failures bigint
)
LANGUAGE sql
AS $$
  SELECT 
    MAX(executed_at) as last_execution,
    COUNT(*) as total_executions,
    COUNT(*) FILTER (WHERE status_code = 200) as recent_successes,
    COUNT(*) FILTER (WHERE status_code != 200) as recent_failures
  FROM public.cron_logs 
  WHERE executed_at > NOW() - INTERVAL '7 days';
$$;