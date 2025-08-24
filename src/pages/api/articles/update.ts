import type { APIRoute } from 'astro'
import { supabase } from '@/lib/supabase'

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const { id, status, editor_action, final_content } = body

    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        error: '文章ID不能为空'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (status !== undefined) updateData.status = status
    if (editor_action !== undefined) updateData.editor_action = editor_action
    if (final_content !== undefined) updateData.final_content = final_content
    
    if (editor_action === 'compiled') {
      updateData.processed_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('articles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

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
      data
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