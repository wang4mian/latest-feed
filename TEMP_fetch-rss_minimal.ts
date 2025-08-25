// 在构建article对象的部分，临时移除缺失字段：

const article = {
  id: `article_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  source_url: rssArticle.link,
  status: 'processed',
  raw_content: {
    title: rssArticle.title,
    rss_description: rssArticle.rssDescription,
    full_content: fullContent,
    vertical_name: verticalName,
    source_name: sourceName,
    crawl_method: 'crawl4ai_cloud'
  },
  ai_analysis: aiAnalysis.summary,
  value_score: parseInt(aiAnalysis.score),
  target_audience: ['制造业从业者', '技术管理人员'],
  // 暂时注释掉这个字段
  // has_subscription_barrier: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};