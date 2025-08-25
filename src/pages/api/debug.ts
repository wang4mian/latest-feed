import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    status: "debug",
    environment: {
      node_version: process.version,
      platform: process.platform,
      memory: process.memoryUsage(),
      env_vars: {
        has_supabase_url: !!process.env.SUPABASE_URL,
        has_supabase_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        has_crawl4ai_key: !!process.env.CRAWL4AI_API_KEY,
        node_env: process.env.NODE_ENV
      }
    }
  }

  try {
    return new Response(JSON.stringify(diagnostics, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Debug endpoint failed",
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}