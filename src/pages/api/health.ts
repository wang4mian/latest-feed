import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  try {
    // 在运行时检查环境变量，避免构建时静态解析
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        node_version: process.version,
        runtime: 'nodejs',
        has_supabase_url: !!process.env.SUPABASE_URL,
        has_supabase_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        has_crawl4ai_key: !!process.env.CRAWL4AI_API_KEY,
        has_gemini_key: !!process.env.GEMINI_API_KEY,
      }
    }

    return new Response(JSON.stringify(health, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('[Health Check] Error:', error)
    
    return new Response(JSON.stringify({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, null, 2), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}