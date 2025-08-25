# Supabase RSS抓取系统设置指南

## 1. 部署Edge Functions

```bash
# 确保安装了Supabase CLI
npm install -g supabase

# 登录Supabase
supabase login

# 链接到你的项目
supabase link --project-ref YOUR_PROJECT_REF

# 部署Edge Functions
supabase functions deploy fetch-rss
supabase functions deploy ai-processor

# 运行数据库迁移
supabase db push
```

## 2. 在Supabase Dashboard中设置

### 启用扩展
1. 进入Supabase Dashboard
2. 去 Database → Extensions
3. 启用以下扩展：
   - `pg_cron` (定时任务)
   - `http` (HTTP请求，可能已默认启用)

### 设置环境变量
在 Edge Functions → Settings 中设置：
- `SUPABASE_URL`: 你的项目URL
- `SUPABASE_SERVICE_ROLE_KEY`: Service Role密钥
- `GEMINI_API_KEY`: (可选) Gemini AI API密钥

### 设置定时任务
在 SQL Editor 中执行：

```sql
-- 设置项目配置（替换为你的实际值）
ALTER DATABASE postgres SET app.settings.supabase_url = 'https://your-project.supabase.co';
ALTER DATABASE postgres SET app.settings.supabase_anon_key = 'your-anon-key';

-- 创建每日RSS抓取任务（北京时间上午10点）
SELECT cron.schedule(
  'daily-rss-fetch',
  '0 2 * * *',  -- UTC时间02:00 = 北京时间10:00
  'SELECT public.trigger_rss_fetch();'
);
```

## 3. 测试系统

### 手动测试Edge Functions
```bash
# 测试RSS抓取
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/fetch-rss \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# 测试AI处理
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/ai-processor \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### 手动触发cron函数
```sql
SELECT public.trigger_rss_fetch();
```

### 查看cron执行状态
```sql
-- 查看最近的执行日志
SELECT * FROM public.cron_logs ORDER BY executed_at DESC LIMIT 10;

-- 查看系统状态
SELECT * FROM public.get_cron_status();

-- 查看所有cron任务
SELECT * FROM cron.job;
```

## 4. 监控和维护

### 查看cron任务状态
```sql
-- 查看所有定时任务
SELECT jobname, schedule, active, jobid FROM cron.job;

-- 查看任务执行历史
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 20;
```

### 删除/更新cron任务
```sql
-- 删除任务
SELECT cron.unschedule('daily-rss-fetch');

-- 重新创建任务（如果需要修改时间）
SELECT cron.schedule('daily-rss-fetch', '0 6 * * *', 'SELECT public.trigger_rss_fetch();');
```

### 清理旧日志
```sql
-- 删除7天前的日志
DELETE FROM public.cron_logs WHERE executed_at < NOW() - INTERVAL '7 days';
```

## 5. 故障排除

### Edge Function错误
- 检查函数日志：Supabase Dashboard → Edge Functions → Logs
- 验证环境变量设置
- 确保数据库连接正常

### Cron任务不执行
- 确认`pg_cron`扩展已启用
- 检查cron任务语法：`SELECT * FROM cron.job;`
- 查看执行日志：`SELECT * FROM cron.job_run_details;`

### 数据库权限问题
- 确保RLS策略正确设置
- 检查Service Role权限
- 验证函数的SECURITY DEFINER设置

## 6. 系统架构

```
Supabase Cron (每日10点)
    ↓
trigger_rss_fetch() 数据库函数
    ↓
调用 fetch-rss Edge Function
    ↓ (如果成功)
调用 ai-processor Edge Function
    ↓
结果记录到 cron_logs 表
```

这样设置后，你的RSS抓取系统将完全在Supabase内部运行，无需外部服务！