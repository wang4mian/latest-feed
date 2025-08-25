import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  try {
    // 验证这是来自Vercel Cron的请求
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }

    console.log('[Cron] Starting scheduled RSS fetch...');

    // 调用RSS抓取API
    const response = await fetch(`${process.env.BASE_URL || 'http://localhost:4321'}/api/fetch-rss`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    if (!response.ok) {
      throw new Error(`RSS processing failed: ${response.status}`);
    }

    const result = await response.json();
    
    console.log('[Cron] RSS fetch completed:', result);

    return new Response(JSON.stringify({
      success: true,
      message: 'RSS fetch completed successfully',
      timestamp: new Date().toISOString(),
      result
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('[Cron] RSS fetch error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};