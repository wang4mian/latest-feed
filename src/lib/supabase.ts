import { createClient } from '@supabase/supabase-js'
import type { WorkbenchFilters, ArticleStatus } from '@/types'

const supabaseUrl = import.meta.env.SUPABASE_URL
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('Missing required environment variable: SUPABASE_URL')
}

if (!supabaseServiceKey) {
  throw new Error('Missing required environment variable: SUPABASE_SERVICE_ROLE_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey)

// 重新导出类型以供其他模块使用
export type { WorkbenchFilters }

// 获取工作台文章
export async function getWorkbenchArticles(filters: WorkbenchFilters, page = 1, limit = 20) {
  let query = supabase.from('articles').select('*')

  // 状态筛选
  if (filters.status && filters.status.length > 0) {
    query = query.in('status', filters.status)
  }

  // 编辑操作筛选
  if (filters.editor_action && filters.editor_action.length > 0) {
    query = query.in('editor_action', filters.editor_action)
  }

  // 价值评分筛选
  if (filters.value_score_min !== undefined) {
    query = query.gte('value_score', filters.value_score_min)
  }

  // 目标受众筛选
  if (filters.target_audience && filters.target_audience.length > 0) {
    query = query.overlaps('target_audience', filters.target_audience)
  }

  // 主题分类筛选
  if (filters.category && filters.category !== 'all') {
    // 先获取该category的RSS源
    const { data: categoryRssSources } = await supabase
      .from('rss_sources')
      .select('url')
      .eq('category', filters.category)
      .eq('is_active', true)

    if (categoryRssSources && categoryRssSources.length > 0) {
      const validSourceUrls = categoryRssSources.map(source => source.url)
      // 通过source_url字段直接匹配
      query = query.in('source_url', validSourceUrls)
    }
  }

  // 排序
  query = query.order(filters.sort_by, { ascending: filters.sort_order === 'asc' })

  // 分页
  const start = (page - 1) * limit
  query = query.range(start, start + limit - 1)

  return query
}

// 更新文章状态
export async function updateArticleStatus(id: string, status: ArticleStatus, editor_action?: string) {
  const updateData: any = { status, updated_at: new Date().toISOString() }
  if (editor_action) {
    updateData.editor_action = editor_action
  }

  return supabase.from('articles').update(updateData).eq('id', id)
}

// 获取RSS源
export async function getRSSSources() {
  return supabase.from('rss_sources').select('*').eq('is_active', true).order('success_rate', { ascending: false })
}

// 获取统计数据
export async function getStats() {
  const [articlesCount, sourcesCount, compiledCount] = await Promise.all([
    supabase.from('articles').select('*', { count: 'exact', head: true }),
    supabase.from('rss_sources').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('editor_action', 'compiled')
  ])

  return {
    total_articles: articlesCount.count || 0,
    active_sources: sourcesCount.count || 0,
    compiled_articles: compiledCount.count || 0
  }
}