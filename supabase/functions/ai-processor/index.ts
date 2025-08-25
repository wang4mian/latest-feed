import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('[Supabase AI] Starting article processing...')
    
    // 初始化Supabase客户端
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 获取未处理的RSS条目（限制5个避免超时）
    const { data: unprocessedItems, error } = await supabase
      .from('rss_items')
      .select('*')
      .eq('processed', false)
      .limit(5)
      .order('created_at', { ascending: true })

    if (error) {
      throw new Error(`获取RSS条目失败: ${error.message}`)
    }

    if (!unprocessedItems || unprocessedItems.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: '没有待处理的RSS条目',
          processed_count: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`[Supabase AI] Found ${unprocessedItems.length} items to process`)

    const results = []
    
    // 处理每个RSS条目
    for (const item of unprocessedItems) {
      try {
        console.log(`[Supabase AI] Processing: ${item.title}`)
        
        // 模拟AI分析（你可以在这里调用真实的AI API）
        const aiAnalysis = `这是关于 ${item.title} 的AI分析。
        
文章链接: ${item.link}
发布时间: ${item.pub_date}
描述: ${item.description}

AI分析结果:
- 主题: 制造业相关新闻
- 价值评分: ${Math.floor(Math.random() * 5) + 5}/10
- 推荐受众: 制造业从业者, 技术管理人员
- 重要程度: 中等

注意: 这是模拟的AI分析结果。配置GEMINI_API_KEY环境变量以启用真实AI分析。`

        // 创建文章记录
        const article = {
          id: `article_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          source_url: item.link,
          status: 'processed',
          raw_content: {
            rss_title: item.title,
            rss_description: item.description,
            pub_date: item.pub_date,
            rss_source_id: item.rss_source_id
          },
          ai_analysis: aiAnalysis,
          value_score: Math.floor(Math.random() * 5) + 5, // 5-9分
          target_audience: ['制造业从业者', '技术管理人员'],
          has_subscription_barrier: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        // 存储文章
        const { data: insertedArticle, error: insertError } = await supabase
          .from('articles')
          .insert([article])
          .select()
          .single()

        if (insertError) {
          console.error(`[Supabase AI] Article storage failed for ${item.title}:`, insertError)
          results.push({
            rss_item_id: item.id,
            success: false,
            error: `Storage error: ${insertError.message}`
          })
        } else {
          // 标记RSS条目为已处理
          await supabase
            .from('rss_items')
            .update({ 
              processed: true,
              article_id: insertedArticle.id,
              updated_at: new Date().toISOString()
            })
            .eq('id', item.id)

          results.push({
            rss_item_id: item.id,
            article_id: insertedArticle.id,
            success: true,
            title: item.title
          })
          
          console.log(`[Supabase AI] ✅ Successfully processed: ${item.title}`)
        }
        
        // 避免处理过快
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (itemError) {
        console.error(`[Supabase AI] Error processing item ${item.id}:`, itemError)
        
        // 标记为已处理避免卡住
        await supabase
          .from('rss_items')
          .update({ 
            processed: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.id)

        results.push({
          rss_item_id: item.id,
          success: false,
          error: itemError.message
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const failureCount = results.filter(r => !r.success).length
    const message = `文章处理完成: ${successCount}成功, ${failureCount}失败`

    console.log(`[Supabase AI] ${message}`)

    return new Response(
      JSON.stringify({
        success: true,
        message,
        processed_count: results.length,
        success_count: successCount,
        failure_count: failureCount,
        results,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[Supabase AI] Unexpected error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})