# RSS抓取系统使用说明

## 系统架构

1. **RSS源管理** (`/api/init-rss-sources`)
   - 初始化预定义的RSS源到数据库
   - 管理RSS源的状态和配置

2. **RSS抓取** (`/api/fetch-rss`) 
   - 从RSS源抓取最新内容
   - 解析RSS/Atom格式
   - 存储到`rss_items`表

3. **文章处理** (`/api/process-rss`)
   - 处理未处理的RSS条目
   - 使用AI分析内容
   - 转换为文章并存储

4. **完整管道** (`/api/rss-pipeline`)
   - 一键执行完整流程
   - 自动化所有步骤

## API使用方法

### 1. 系统初始化
```bash
curl -X POST https://feed.intelliexport.com/api/init-rss-sources
```
将预定义的43个RSS源导入数据库。

### 2. 抓取RSS内容
```bash
# 抓取所有活跃RSS源
curl -X POST https://feed.intelliexport.com/api/fetch-rss \
  -H "Content-Type: application/json" \
  -d '{"limit": 10}'

# 抓取指定RSS源
curl -X POST https://feed.intelliexport.com/api/fetch-rss \
  -H "Content-Type: application/json" \
  -d '{
    "sourceIds": ["google-news-manufacturing", "google-news-industry40"],
    "limit": 5
  }'
```

### 3. 处理文章
```bash
curl -X POST https://feed.intelliexport.com/api/process-rss \
  -H "Content-Type: application/json" \
  -d '{"limit": 5}'
```

### 4. 一键运行完整流程
```bash
curl -X POST https://feed.intelliexport.com/api/rss-pipeline \
  -H "Content-Type: application/json" \
  -d '{
    "initSources": true,
    "fetchRss": true, 
    "processArticles": true,
    "limit": 5
  }'
```

### 5. 系统状态检查
```bash
# 获取系统概览
curl https://feed.intelliexport.com/api/rss-pipeline

# 检查RSS源状态
curl https://feed.intelliexport.com/api/init-rss-sources

# 检查抓取统计
curl https://feed.intelliexport.com/api/fetch-rss

# 检查处理状态
curl https://feed.intelliexport.com/api/process-rss
```

### 6. 系统测试
```bash
curl https://feed.intelliexport.com/api/test-rss-system
```

## RSS源类型

系统包含43个制造业相关RSS源：

### Google News源 (10个)
- 制造业综合新闻
- 工业4.0和智能制造
- AI在制造业应用
- 3D打印/增材制造
- 供应链动态
- 中国制造业
- 半导体制造
- 绿色制造
- 工业机器人
- 制造业政策

### 专业媒体源 (33个)
- The Manufacturer (英国权威)
- Manufacturing.net (北美平台)
- MIT研究新闻
- NIST政府资源
- 专业技术媒体等

## 自动化建议

1. **定时抓取**: 使用cron或GitHub Actions定时调用`/api/rss-pipeline`
2. **批量处理**: 控制limit参数避免超时，建议每次处理5-10个条目
3. **错误监控**: 检查API响应的success字段和error信息
4. **数据库维护**: 定期清理过期的RSS条目

## 故障排除

- **RSS解析失败**: 检查源的XML格式和可访问性
- **数据库错误**: 检查Supabase连接和权限
- **超时问题**: 减少limit参数值
- **依赖模块错误**: 确保fast-xml-parser已安装