import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request }) => {
  try {
    const baseUrl = new URL(request.url).origin
    const results = []
    
    // 测试1: 检查系统状态
    console.log('[RSS-Test] Step 1: Checking system status...')
    try {
      const statusResponse = await fetch(`${baseUrl}/api/rss-pipeline`)
      const statusData = await statusResponse.json()
      results.push({
        test: 'system_status',
        success: statusData.success,
        data: statusData
      })
    } catch (error) {
      results.push({
        test: 'system_status',
        success: false,
        error: error instanceof Error ? error.message : 'Status check failed'
      })
    }

    // 测试2: 初始化RSS源
    console.log('[RSS-Test] Step 2: Initializing RSS sources...')
    try {
      const initResponse = await fetch(`${baseUrl}/api/init-rss-sources`, { method: 'POST' })
      const initData = await initResponse.json()
      results.push({
        test: 'init_sources',
        success: initData.success,
        sources_count: initData.sources_count,
        message: initData.message
      })
    } catch (error) {
      results.push({
        test: 'init_sources',
        success: false,
        error: error instanceof Error ? error.message : 'Init failed'
      })
    }

    // 测试3: 抓取少量RSS（只测试2个源，避免超时）
    console.log('[RSS-Test] Step 3: Fetching RSS (limited test)...')
    try {
      const fetchResponse = await fetch(`${baseUrl}/api/fetch-rss`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sourceIds: ['google-news-manufacturing', 'google-news-industry40'], // 只测试2个可靠源
          limit: 3 // 每个源只抓取3个条目
        })
      })
      const fetchData = await fetchResponse.json()
      results.push({
        test: 'fetch_rss',
        success: fetchData.success,
        items_stored: fetchData.total_items_stored,
        sources_processed: fetchData.sources_processed,
        message: fetchData.message
      })
    } catch (error) {
      results.push({
        test: 'fetch_rss',
        success: false,
        error: error instanceof Error ? error.message : 'Fetch failed'
      })
    }

    // 测试4: 检查处理状态
    console.log('[RSS-Test] Step 4: Checking processing status...')
    try {
      const processStatusResponse = await fetch(`${baseUrl}/api/process-rss`)
      const processStatusData = await processStatusResponse.json()
      results.push({
        test: 'process_status',
        success: processStatusData.success,
        stats: processStatusData.stats
      })
    } catch (error) {
      results.push({
        test: 'process_status',
        success: false,
        error: error instanceof Error ? error.message : 'Process status check failed'
      })
    }

    const successCount = results.filter(r => r.success).length
    const totalTests = results.length

    return new Response(JSON.stringify({
      success: successCount === totalTests,
      message: `RSS系统测试完成: ${successCount}/${totalTests} 测试通过`,
      overall_status: successCount === totalTests ? '✅ 系统运行正常' : '⚠️ 部分功能异常',
      test_results: results,
      summary: {
        tests_passed: successCount,
        tests_total: totalTests,
        system_ready: successCount >= 3 // 至少前3个测试通过说明系统基本可用
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('[RSS-Test] Test suite failed:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'RSS系统测试失败'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}