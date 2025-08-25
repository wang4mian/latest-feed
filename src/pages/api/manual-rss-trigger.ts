import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('[Manual RSS] Starting manual RSS fetch and processing...')
    
    // 获取你的Supabase项目信息
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase配置缺失')
    }

    const results = []

    // 1. 调用Supabase Edge Function - RSS抓取
    console.log('[Manual RSS] Calling Supabase fetch-rss function...')
    try {
      const fetchResponse = await fetch(`${supabaseUrl}/functions/v1/fetch-rss`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      })
      
      const fetchResult = await fetchResponse.json()
      results.push({
        step: 'fetch-rss',
        success: fetchResult.success,
        data: fetchResult
      })
      
      console.log(`[Manual RSS] Fetch result: ${fetchResult.success ? '✅' : '❌'}`)
      
      // 2. 如果抓取成功，调用AI处理
      if (fetchResult.success && fetchResult.total_items_stored > 0) {
        console.log('[Manual RSS] Calling Supabase ai-processor function...')
        await new Promise(resolve => setTimeout(resolve, 2000)) // 等待2秒
        
        const processResponse = await fetch(`${supabaseUrl}/functions/v1/ai-processor`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        })
        
        const processResult = await processResponse.json()
        results.push({
          step: 'ai-processor',
          success: processResult.success,
          data: processResult
        })
        
        console.log(`[Manual RSS] Process result: ${processResult.success ? '✅' : '❌'}`)
      } else {
        results.push({
          step: 'ai-processor',
          success: true,
          data: { message: '没有新条目需要处理' }
        })
      }
      
    } catch (error) {
      console.error('[Manual RSS] Supabase function call failed:', error)
      results.push({
        step: 'supabase-functions',
        success: false,
        error: error.message
      })
    }

    // 生成总结
    const fetchSuccess = results.find(r => r.step === 'fetch-rss')?.success
    const processSuccess = results.find(r => r.step === 'ai-processor')?.success
    const itemsFetched = results.find(r => r.step === 'fetch-rss')?.data?.total_items_stored || 0
    const articlesProcessed = results.find(r => r.step === 'ai-processor')?.data?.success_count || 0

    return new Response(JSON.stringify({
      success: fetchSuccess && processSuccess,
      message: `手动RSS处理完成: 抓取${itemsFetched}个条目, 处理${articlesProcessed}篇文章`,
      summary: {
        items_fetched: itemsFetched,
        articles_processed: articlesProcessed,
        fetch_success: fetchSuccess,
        process_success: processSuccess
      },
      details: results,
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('[Manual RSS] Unexpected error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : '手动RSS处理失败'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}