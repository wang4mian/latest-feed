import type { APIRoute } from 'astro'
import { getWorkbenchArticles, type WorkbenchFilters } from '@/lib/supabase'

export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = new URL(url).searchParams
    
    // 解析筛选参数
    const status = searchParams.getAll('status')
    const category = searchParams.get('category')
    const sort_by = searchParams.get('sort_by') || 'created_at'
    const sort_order = searchParams.get('sort_order') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const filters: WorkbenchFilters = {
      status: status.length > 0 ? status as any[] : ['adopted'],
      ...(category && { category }),
      sort_by: sort_by as 'created_at' | 'value_score',
      sort_order: sort_order as 'asc' | 'desc'
    }

    const { data: articles, error } = await getWorkbenchArticles(filters, page, limit)

    if (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const totalCount = articles?.length || 0
    
    return new Response(JSON.stringify({
      success: true,
      data: {
        articles: articles || [],
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit)
        },
        filters
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'batch_update_status':
        return await batchUpdateStatus(data)
      
      case 'get_statistics':
        return await getWorkbenchStatistics()
      
      default:
        return new Response(JSON.stringify({
          success: false,
          error: '未知的操作类型'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
    }

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

async function batchUpdateStatus(_data: any) {
  // TODO: 实现批量状态更新
  return new Response(JSON.stringify({
    success: true,
    data: { updated_count: 0 }
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
}

async function getWorkbenchStatistics() {
  // TODO: 实现工作台统计信息
  return new Response(JSON.stringify({
    success: true,
    data: {
      total_articles: 0,
      by_status: {},
      by_category: {},
      recent_activity: []
    }
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
}