import type { APIRoute } from 'astro'
import { getActiveRSSSources } from '@/lib/rss-sources'
import { AIProcessor } from '@/lib/ai-processor'
import { supabase } from '@/lib/supabase'

export const GET: APIRoute = async ({ url }) => {
  const searchParams = new URL(url).searchParams
  const action = searchParams.get('action')
  
  if (action === 'health') {
    const activeSources = getActiveRSSSources()
    
    return new Response(JSON.stringify({
      success: true,
      data: {
        total_sources: activeSources.length,
        active_sources: activeSources.length,
        categories: ['Technology', 'Business', 'Policy'],
        status: 'healthy'
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  return new Response(JSON.stringify({
    success: false,
    error: '未知的action参数'
  }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' }
  })
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const { url } = body
    
    if (!url) {
      return new Response(JSON.stringify({
        success: false,
        error: 'URL不能为空'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // 单篇文章的完整处理：crawl4AI + AI分析 + 存储
    const processingResult = await AIProcessor.processArticle(url, false)
    
    if (processingResult.success && processingResult.article) {
      // 存储到数据库
      const { data, error } = await supabase
        .from('articles')
        .insert([processingResult.article])
        .select()
        .single()

      if (error) {
        return new Response(JSON.stringify({
          success: false,
          error: '数据库存储失败: ' + error.message,
          processing_result: processingResult
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({
        success: true,
        message: '文章处理完成',
        article: data,
        processing_time: processingResult.processing_time
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: processingResult.error,
        processing_time: processingResult.processing_time
      }), {
        status: 500,
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

async function testRSSSource(source: any) {
  try {
    // 模拟RSS测试
    const response = await fetch(source.url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader)'
      },
      signal: AbortSignal.timeout(10000) // 10秒超时
    })
    
    if (!response.ok) {
      return {
        success: false,
        source_id: source.id,
        error: `HTTP ${response.status}: ${response.statusText}`,
        test_time: new Date().toISOString()
      }
    }
    
    const content = await response.text()
    
    // 简单验证RSS格式
    const isValidRSS = content.includes('<rss') || content.includes('<feed') || content.includes('xml')
    
    if (!isValidRSS) {
      return {
        success: false,
        source_id: source.id,
        error: '响应内容不是有效的RSS格式',
        test_time: new Date().toISOString()
      }
    }
    
    // 提取基本信息
    const itemCount = (content.match(/<item/g) || content.match(/<entry/g) || []).length
    
    return {
      success: true,
      source_id: source.id,
      source_name: source.name,
      response_size: content.length,
      item_count: itemCount,
      content_type: response.headers.get('content-type'),
      test_time: new Date().toISOString(),
      strategy: source.crawl_strategy
    }
    
  } catch (error) {
    return {
      success: false,
      source_id: source.id,
      error: error instanceof Error ? error.message : '测试失败',
      test_time: new Date().toISOString()
    }
  }
}

