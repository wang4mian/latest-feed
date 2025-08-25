import type { APIRoute } from 'astro'
import { supabase } from '@/lib/supabase'
import { RSS_SOURCES } from '@/lib/rss-sources'

export const POST: APIRoute = async () => {
  try {
    console.log('[RSS-Init] Starting to initialize RSS sources...')
    
    // 将预定义的RSS源插入到数据库
    const { data: insertedSources, error } = await supabase
      .from('rss_sources')
      .upsert(RSS_SOURCES, {
        onConflict: 'id',
        ignoreDuplicates: false // 更新现有记录
      })
      .select()

    if (error) {
      console.error('[RSS-Init] Database error:', error)
      return new Response(JSON.stringify({
        success: false,
        error: `数据库操作失败: ${error.message}`
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    console.log(`[RSS-Init] ✅ Successfully initialized ${insertedSources?.length || 0} RSS sources`)

    return new Response(JSON.stringify({
      success: true,
      message: `成功初始化${insertedSources?.length || 0}个RSS源`,
      sources_count: insertedSources?.length || 0,
      sources: insertedSources?.map(source => ({
        id: source.id,
        name: source.name,
        category: source.category,
        is_active: source.is_active
      }))
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('[RSS-Init] Unexpected error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : '初始化RSS源失败'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export const GET: APIRoute = async () => {
  try {
    // 检查数据库中的RSS源状态
    const { data: dbSources, error } = await supabase
      .from('rss_sources')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    const predefinedCount = RSS_SOURCES.length
    const databaseCount = dbSources?.length || 0
    const activeCount = dbSources?.filter(source => source.is_active).length || 0

    const categoryStats = RSS_SOURCES.reduce((stats, source) => {
      stats[source.category] = (stats[source.category] || 0) + 1
      return stats
    }, {} as Record<string, number>)

    return new Response(JSON.stringify({
      success: true,
      stats: {
        predefined_sources: predefinedCount,
        database_sources: databaseCount,
        active_sources: activeCount,
        category_breakdown: categoryStats,
        sync_status: predefinedCount === databaseCount ? 'synchronized' : 'needs_sync'
      },
      sources: dbSources?.map(source => ({
        id: source.id,
        name: source.name,
        category: source.category,
        is_active: source.is_active,
        last_crawled_at: source.last_crawled_at,
        created_at: source.created_at
      }))
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : '获取RSS源状态失败'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}