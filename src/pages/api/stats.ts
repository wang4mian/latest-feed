import type { APIRoute } from 'astro'
import { supabase } from '@/lib/supabase'

export const GET: APIRoute = async () => {
  try {
    // 获取文章统计
    const { data: articleStats, error: articleError } = await supabase
      .from('articles')
      .select('status, value_score, created_at')

    if (articleError) {
      throw new Error(`文章统计查询失败: ${articleError.message}`)
    }

    // 获取RSS源统计
    const { data: rssStats, error: rssError } = await supabase
      .from('rss_sources')
      .select('category, is_active, crawl_strategy')

    if (rssError) {
      throw new Error(`RSS源统计查询失败: ${rssError.message}`)
    }

    // 计算统计数据
    const stats = calculateSystemStats(articleStats || [], rssStats || [])

    return new Response(JSON.stringify({
      success: true,
      data: stats
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : '统计查询失败'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

function calculateSystemStats(articles: any[], rssSources: any[]) {
  // 文章状态统计
  const articlesByStatus = articles.reduce((acc, article) => {
    acc[article.status] = (acc[article.status] || 0) + 1
    return acc
  }, {})

  // RSS源统计
  const rssSourceStats = {
    total: rssSources.length,
    active: rssSources.filter(s => s.is_active).length,
    by_category: rssSources.reduce((acc, source) => {
      acc[source.category] = (acc[source.category] || 0) + 1
      return acc
    }, {}),
    by_strategy: rssSources.reduce((acc, source) => {
      acc[source.crawl_strategy] = (acc[source.crawl_strategy] || 0) + 1
      return acc
    }, {})
  }

  // 质量统计
  const qualityStats = {
    avg_score: articles.length > 0 
      ? articles.reduce((sum, a) => sum + (a.value_score || 0), 0) / articles.length 
      : 0,
    high_quality_count: articles.filter(a => (a.value_score || 0) >= 8).length,
    processing_success_rate: articles.length > 0 
      ? articles.filter(a => a.status === 'processed' || a.status === 'adopted').length / articles.length 
      : 0
  }

  // 时间统计
  const now = new Date()
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const recentArticles = articles.filter(a => new Date(a.created_at) > last24h)

  return {
    articles: {
      total: articles.length,
      by_status: articlesByStatus,
      recent_24h: recentArticles.length,
      quality: qualityStats
    },
    rss_sources: rssSourceStats,
    system: {
      health_score: calculateHealthScore(rssSourceStats, qualityStats),
      uptime: '99.9%', // 模拟数据
      last_update: now.toISOString()
    },
    performance: {
      avg_processing_time: '25.6s', // 模拟数据
      success_rate: qualityStats.processing_success_rate,
      error_rate: 1 - qualityStats.processing_success_rate
    }
  }
}

function calculateHealthScore(rssStats: any, qualityStats: any): number {
  const rssHealth = rssStats.active / rssStats.total
  const qualityHealth = qualityStats.processing_success_rate
  const scoreHealth = qualityStats.avg_score / 10
  
  return Math.round((rssHealth * 0.4 + qualityHealth * 0.4 + scoreHealth * 0.2) * 100)
}