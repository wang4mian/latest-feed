# 制造业情报系统

基于Astro + Supabase + AI的制造业新闻情报处理系统，实现RSS源自动抓取、AI智能分析、文章筛选与编辑发布的全流程自动化。

## 🔄 工作流程
1. **RSS定时抓取** (Vercel Cron) → 每天8点、14点、20点自动抓取RSS → `rss_items`表
2. **智能处理** → Crawl4AI内容抓取 → Gemini AI分析评分 → `articles`表
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
# Gemini AI (必需)
GEMINI_API_KEY=your_gemini_key

# Crawl4AI Cloud
CRAWL4AI_CLOUD_URL=https://www.crawl4ai-cloud.com/query
CRAWL4AI_API_KEY=your_crawl4ai_key

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key

# Vercel Cron Security
CRON_SECRET=your_cron_secret
```

## ⏰ 自动化定时任务

### RSS抓取定时任务 (Vercel Cron)
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/fetch-rss",
      "schedule": "0 8,14,20 * * *"
    }
  ]
}
```

**执行时间：** 每天8点、14点、20点自动执行RSS抓取

**手动触发RSS抓取：**
```bash
curl -X POST https://feed.intelliexport.com/api/fetch-rss \
  -H "Content-Type: application/json" \
  -d '{}'
```

### RSS源管理
系统支持多种RSS源：
- Google News 搜索 (制造业、工业4.0、AI制造等关键词)
- 3D Printing Industry
- 行业专业媒体 RSS feeds
- 可通过 `/api/rss-sources` 管理启用/禁用状态

## 页面
- `/` - 首页
- `/articles` - 文章池（筛选采用/忽略）
- `/rss-sources` - RSS源管理
- `/workbench` - 编辑台（Doocs MD编辑器）

## 🔌 API接口

### RSS相关
- `POST /api/fetch-rss` - RSS抓取 (支持cron调用)
- `GET /api/fetch-rss` - RSS源统计信息  
- `POST /api/process-rss` - 批量处理RSS条目为文章

### 文章管理
- `GET /api/articles` - 获取文章列表
- `POST /api/articles/update` - 更新文章状态
- `GET /api/articles/[id]` - 获取单篇文章

### 系统工具
- `GET /api/health` - 系统健康检查
- `GET /api/stats` - 系统统计数据  
- `POST /api/test-crawl` - 单篇文章抓取测试
- `GET /api/ping` - 基础连通性测试

## 🚀 部署状态
- ✅ Vercel自动部署
- ✅ Node.js 18.x运行时  
- ✅ Serverless Functions
- ✅ 自定义域名: `feed.intelliexport.com`
- ✅ Vercel Cron定时任务
- ✅ Supabase数据库集成

## 📊 系统监控

### 查看RSS抓取状态
```bash
# 查看RSS源统计
curl https://feed.intelliexport.com/api/fetch-rss

# 查看系统健康状态
curl https://feed.intelliexport.com/api/health

# 查看整体数据统计  
curl https://feed.intelliexport.com/api/stats
```

### Vercel部署监控
- Vercel Dashboard → Functions 查看cron执行日志
- Vercel Dashboard → Deployments 查看部署状态

## 💻 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## ✅ 项目完成状态

### 已实现功能
- [x] RSS源多渠道抓取（3D打印、制造业、工业4.0等）
- [x] Vercel Cron自动定时任务（每日3次）
- [x] Crawl4AI智能内容提取
- [x] Gemini AI内容分析与评分
- [x] Supabase数据库存储与管理
- [x] 响应式Web界面
- [x] API接口完善
- [x] 生产环境部署

### 待优化功能
- [ ] 文章去重算法优化
- [ ] AI分析准确性提升  
- [ ] 编辑工作流完善
- [ ] 用户权限管理

## 🔧 故障排查与解决记录

### RSS定时抓取问题修复历程

#### 问题1：Supabase Cron限制
**症状**：尝试使用Supabase pg_cron时HTTP扩展不可用
**解决**：改用Vercel Cron（更稳定可靠）

#### 问题2：Vercel函数路由404
**症状**：`/api/cron/fetch-rss` 返回404 NOT_FOUND
**原因**：Astro嵌套API路由在Vercel上识别问题
**解决**：使用扁平路由结构，改为 `/api/fetch-rss`

#### 问题3：数据库表结构问题  
**症状**：`"there is no unique or exclusion constraint matching the ON CONFLICT specification"`
**原因**：代码中使用upsert但数据库无对应约束
**解决**：简化为直接insert操作，移除upsert逻辑

#### 问题4：GET vs POST请求问题
**症状**：Vercel Cron调用成功但不执行RSS抓取
**原因**：Vercel Cron发送GET请求，但RSS抓取逻辑在POST方法中
**解决**：修改GET方法，使其也能执行RSS抓取

#### 问题5：数据表设计优化
**症状**：原设计使用rss_items中间表
**优化**：直接将RSS内容存储为articles，简化数据流程

### 最终解决方案
```
Vercel Cron → GET /api/fetch-rss → 直接执行RSS抓取 → 存储到articles表
```

**关键配置：**
- `vercel.json`中配置cron任务
- GET和POST方法都支持RSS抓取
- 直接存储为articles（status: pending）
- 每日3次自动执行（8点、14点、20点）

---
*最后更新: 2025-08-25 - RSS定时抓取系统完全修复并投入生产*