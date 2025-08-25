import type { APIRoute } from 'astro'
import { supabase } from '@/lib/supabase'
import { AIProcessor } from '@/lib/ai-processor'

export const POST: APIRoute = async ({ request }) => {
  try {
    const { limit = 5 } = await request.json().catch(() => ({}))
    
    // 获取未处理的RSS条目
    const { data: unprocessedItems, error } = await supabase
      .from('rss_items')
      .select('*')
      .eq('processed', false)
      .limit(limit)
      .order('created_at', { ascending: true })

    if (error) {
      return new Response(JSON.stringify({
        success: false,
        error: '获取RSS条目失败: ' + error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!unprocessedItems || unprocessedItems.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        message: '没有待处理的RSS条目',
        processed_count: 0
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const results = []
    
    // 逐个处理RSS条目
    for (const item of unprocessedItems) {
      try {
        console.log(`[RSS-Processor] Starting processing: ${item.title} - ${item.link}`)
        
        // 使用crawl4AI + AI分析处理文章
        const processingResult = await AIProcessor.processArticle(item.link, false)
        
        if (processingResult.success && processingResult.article) {
          // 关联RSS条目信息
          processingResult.article.source_url = item.link
          processingResult.article.raw_content = {
            ...processingResult.article.raw_content,
            rss_title: item.title,
            rss_description: item.description,
            pub_date: item.pub_date
          }
          
          // 存储到articles表
          const { data: article, error: insertError } = await supabase
            .from('articles')
            .insert([processingResult.article])
            .select()
            .single()

          if (insertError) {
            console.error(`[RSS-Processor] Article storage failed for ${item.title}:`, insertError)
            results.push({
              rss_item_id: item.id,
              success: false,
              error: `Storage error: ${insertError.message}`
            })
          } else {
            // 标记RSS条目为已处理，并关联文章
            const updateResult = await supabase
              .from('rss_items')
              .update({ 
                processed: true,
                article_id: article.id,
                updated_at: new Date().toISOString()
              })
              .eq('id', item.id)

            if (updateResult.error) {
              console.warn(`[RSS-Processor] Failed to update RSS item status for ${item.title}:`, updateResult.error)
            }

            results.push({
              rss_item_id: item.id,
              article_id: article.id,
              success: true,
              title: item.title,
              processing_time: processingResult.processing_time
            })
            
            console.log(`[RSS-Processor] ✅ Successfully processed: ${item.title} (${processingResult.processing_time}ms)`)
          }
        } else {
          // 处理失败，仍然标记为已处理避免重复
          const markProcessedResult = await supabase
            .from('rss_items')
            .update({ 
              processed: true,
              updated_at: new Date().toISOString()
            })
            .eq('id', item.id)

          if (markProcessedResult.error) {
            console.warn(`[RSS-Processor] Failed to mark RSS item as processed for ${item.title}:`, markProcessedResult.error)
          }

          results.push({
            rss_item_id: item.id,
            success: false,
            error: processingResult.error || 'Article processing failed'
          })
          
          console.log(`[RSS-Processor] ❌ Processing failed: ${item.title} - ${processingResult.error}`)
        }
        
        // 避免请求过于频繁
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (itemError) {
        console.error(`[RSS-Processor] Unexpected error processing RSS item ${item.id} (${item.title}):`, itemError)
        
        // 标记为已处理避免卡住
        try {
          await supabase
            .from('rss_items')
            .update({ 
              processed: true,
              updated_at: new Date().toISOString()
            })
            .eq('id', item.id)
        } catch (updateError) {
          console.error(`[RSS-Processor] Failed to mark item as processed after error:`, updateError)
        }

        results.push({
          rss_item_id: item.id,
          success: false,
          error: itemError instanceof Error ? itemError.message : 'Unexpected processing error'
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const failureCount = results.filter(r => !r.success).length

    return new Response(JSON.stringify({
      success: true,
      message: `批量处理完成: ${successCount}成功, ${failureCount}失败`,
      processed_count: results.length,
      success_count: successCount,
      failure_count: failureCount,
      results
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('批量处理RSS失败:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : '批量处理失败'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export const GET: APIRoute = async () => {
  try {
    // 获取处理状态统计
    const { data: stats, error } = await supabase
      .from('rss_items')
      .select('processed')
    
    if (error) {
      throw new Error(error.message)
    }

    const total = stats?.length || 0
    const processed = stats?.filter(item => item.processed).length || 0
    const unprocessed = total - processed

    return new Response(JSON.stringify({
      success: true,
      stats: {
        total_rss_items: total,
        processed_items: processed,
        unprocessed_items: unprocessed,
        processing_rate: total > 0 ? Math.round((processed / total) * 100) : 0
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : '获取统计失败'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}