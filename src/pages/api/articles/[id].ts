import type { APIRoute } from 'astro'
import { supabase } from '@/lib/supabase'

export const GET: APIRoute = async ({ params }) => {
  try {
    const id = params.id

    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        error: '文章ID不能为空'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { data: article, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({
      success: true,
      data: article
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