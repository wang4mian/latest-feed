import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  try {
    console.log('[RSS-Cron] Starting scheduled RSS fetch...');

    // 调用现有的RSS抓取API
    const baseUrl = new URL(request.url).origin;
    const response = await fetch(`${baseUrl}/api/fetch-rss`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sourceIds: [], limit: 10 })
    });

    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status}`);
    }

    const result = await response.json();
    console.log('[RSS-Cron] RSS fetch completed:', result.message);

    return new Response(JSON.stringify({
      success: true,
      message: 'Cron RSS fetch completed successfully',
      timestamp: new Date().toISOString(),
      rss_result: result
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('[RSS-Cron] Error:', error);
    
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