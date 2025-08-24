一、访问方式
打开工作台：
Github 仓库地址：https://github.com/wang4mian/latest-feed
里面的公众号排版器是使用了这个开源项目：https://github.com/doocs/md
数据库在 Supabase 两个表格里（出 bug 的时候查询，一般不用）
  1. ✅ rss_sources 表 - 3D 打印的几个 RSS 源已导入
  2. ✅ articles 表 - 保存所有拉取的 RSS 文章和交互结果

二、开始工作
Latest-feed 一共有三个页面：文章池、RSS源、编辑台（workbench）
需要在文章池里筛选文章，在编辑台里查看详情 + 编辑。

现在先只做了 3D 打印一个主题的。其他的 RSS 源都没打开（is_active=FALSE)。
在 markdown 编辑器里排好版的可以一键复制到公众号后台。我们保存了一个固定的样式。


三、概念澄清

主要手段还是 RSS，那么 RSS 是自动触发的吗？
是，利用 supabase-cron，每2小时自动执行 (0:00, 2:00, 4:00...)，每源最多3篇新文章，基于source_url避免重复

数据流转路径？谁在处理？ 
从原始RSS到最终发布，5个步骤3个角色。
流转步骤
抓取 - 系统每2小时自动从RSS源抓取新文章
分析 - AI自动翻译+分析内容价值
筛选 - 人工在主页点"采用"或"忽略"
编译 - 编辑在工作台用markdown编辑器专业化改写
发布 - 最终发布到渠道
处理者
系统：自动抓取+AI分析
编辑：筛选采用/忽略
专业编辑：改写编译

文章状态
new → processed → adopted → compiled → published

需要知道的重要字段：
核心状态字段 (2个)：
status - 文章处理状态：new / processing / processed / adopted / ignored / compiled
editor_action - 编辑操作：adopted / ignored / compiled

 重要内容字段 (4个)：
raw_content - 原始抓取内容
ai_translation - AI翻译
ai_analysis - AI分析结果
final_content - 最终编译内容

每篇文章的评分是个什么概念？
评分字段：value_score (1-10分)
评分含义：
8-10分：重大技术突破、政策变化、行业整合
6-7分：重要行业动态、新产品发布
4-5分：一般性新闻、常规更新
1-3分：价值较低的内容  
实际用途
工作台排序：高分文章优先显示作为筛选参考

整个设计的目的：
  自动收集+打分+翻译；减少编辑人工筛选工作量。
  人工需要专注于编译+价值提升

技术架构
前端框架：Astro
数据库：Supabase PostgreSQL
后端服务：Supabase Edge Functions (Deno)
- fetch-rss - RSS抓取服务
- ai-processor - AI分析服务
 		- 基于Deno运行时的无服务器函数
简单说：Supabase作为BaaS后端 + Astro服务器端API + Edge Functions处理复杂逻辑。

