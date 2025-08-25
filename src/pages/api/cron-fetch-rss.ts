import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  try {
    // 验证这是来自Vercel Cron的请求
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }

    console.log('[Cron] Starting scheduled RSS fetch...');

    return new Response(JSON.stringify({
      success: true,
      message: 'Cron endpoint working! RSS fetch functionality will be implemented here.',
      timestamp: new Date().toISOString()
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