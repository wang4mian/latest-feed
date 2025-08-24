import type { APIRoute } from 'astro'
import { supabase } from '@/lib/supabase'

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const { sources } = body

    if (!sources || !Array.isArray(sources)) {
      return new Response(JSON.stringify({
        success: false,
        error: '无效的RSS源数据'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // 批量插入RSS源，使用upsert避免重复
    const { data, error } = await supabase
      .from('rss_sources')
      .upsert(sources, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })
      .select()

    if (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({
      success: true,
      data: {
        imported_count: data?.length || 0,
        message: `成功导入 ${data?.length || 0} 个RSS源`
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : '导入失败'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}