# 制造业情报系统

基于Astro + Supabase + AI的制造业新闻情报处理系统，实现RSS源自动抓取、AI智能分析、文章筛选与编辑发布的全流程自动化。

## 🔄 工作流程
1. **RSS定时抓取** (Supabase cron) → `rss_items`表
2. **智能处理** (每10分钟调用`/api/process-rss`) → crawl4AI内容抓取 → AI分析评分 → `articles`表
3. **文章池筛选** (`/articles`) → 人工采用/忽略决策
4. **编辑台编译** (`/workbench`) → Doocs MD编辑器 → 发布

## ✨ 核心特性
- 🤖 AI智能内容分析与价值评分
- 🔍 多源RSS自动抓取与去重
- 📊 可视化数据统计面板
- ✍️ 集成Doocs编辑器支持
- 🚀 Vercel Serverless部署
- 📱 响应式现代UI设计

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

## 🔌 API接口
- `GET /api/health` - 系统健康检查与环境变量状态
- `POST /api/process-rss` - 批量处理RSS条目
- `GET /api/articles` - 获取文章列表
- `POST /api/articles/update` - 更新文章状态
- `GET /api/stats` - 系统统计数据
- `POST /api/test-crawl` - 单篇文章抓取测试

## 🚀 部署状态
- ✅ Vercel自动部署
- ✅ Node.js 18.x运行时
- ✅ Serverless Functions
- ✅ 自定义域名支持

## 💻 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

---
*最后更新: 2025-08-25*