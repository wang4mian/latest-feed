-- 纯数据库实现的RSS抓取函数
-- 避免复杂的HTTP扩展问题

CREATE OR REPLACE FUNCTION simple_rss_fetch()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  rss_sources_cursor CURSOR FOR 
    SELECT id, name, url FROM rss_sources WHERE is_active = true LIMIT 5;
  source_record RECORD;
  rss_content text;
  result_summary text := '';
  total_processed int := 0;
BEGIN
  -- 遍历活跃的RSS源
  FOR source_record IN rss_sources_cursor LOOP
    BEGIN
      -- 使用http_get抓取RSS内容
      SELECT content INTO rss_content 
      FROM http_get(source_record.url);
      
      -- 简单验证RSS内容
      IF rss_content IS NOT NULL AND length(rss_content) > 100 THEN
        -- 更新最后抓取时间
        UPDATE rss_sources 
        SET last_fetch = NOW(), 
            updated_at = NOW(),
            total_attempts = total_attempts + 1,
            successful_attempts = successful_attempts + 1
        WHERE id = source_record.id;
        
        total_processed := total_processed + 1;
        result_summary := result_summary || source_record.name || ': OK, ';
      ELSE
        -- 记录失败
        UPDATE rss_sources 
        SET last_error = 'Empty or invalid RSS content',
            total_attempts = total_attempts + 1,
            updated_at = NOW()
        WHERE id = source_record.id;
        
        result_summary := result_summary || source_record.name || ': Failed, ';
      END IF;
      
    EXCEPTION WHEN OTHERS THEN
      -- 记录异常
      UPDATE rss_sources 
      SET last_error = SQLERRM,
          total_attempts = total_attempts + 1,
          updated_at = NOW()
      WHERE id = source_record.id;
      
      result_summary := result_summary || source_record.name || ': Error, ';
    END;
  END LOOP;
  
  RETURN 'Processed ' || total_processed || ' sources: ' || result_summary;
END;
$$;

-- 创建简单的定时任务
SELECT cron.schedule(
  'simple-rss-fetch',
  '0 8,14,20 * * *',  -- 每天8点、14点、20点执行
  'SELECT simple_rss_fetch();'
);

-- 立即测试函数
-- SELECT simple_rss_fetch();