# 制造业情报系统

## 工作流程
1. RSS定时抓取 (Supabase cron) → `rss_items`表
2. 自动处理 (每10分钟调用`/api/process-rss`) → crawl4AI → AI分析 → `articles`表
3. 文章池筛选 (`/articles`) → 采用/忽略
4. 编辑台编译 (`/workbench`) → Doocs MD编辑器 → 发布

## 环境配置
```bash
# Crawl4AI Cloud
CRAWL4AI_CLOUD_URL=https://www.crawl4ai-cloud.com/query
CRAWL4AI_API_KEY=your_key

# Supabase
SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_key
```

## Supabase定时任务设置
```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS http;

SELECT cron.schedule(
    'process-rss-items-auto',
    '*/10 * * * *',
    $$
    SELECT net.http_post(
        url := 'https://feed.intelliexport.com/api/process-rss',
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body := '{"limit": 5}'::jsonb
    );
    $$
);
```

## 页面
- `/` - 首页
- `/articles` - 文章池（筛选采用/忽略）
- `/rss-sources` - RSS源管理
- `/workbench` - 编辑台（Doocs MD编辑器）

## API
- `POST /api/process-rss` - 批量处理RSS条目
- `POST /api/test-crawl` - 单篇文章测试
- `POST /api/articles/update` - 更新文章状态

## 启动
```bash
npm run dev
```