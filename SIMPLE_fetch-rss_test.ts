import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('🔥 函数开始执行');

    // 检查环境变量
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const crawlApiKey = Deno.env.get('CRAWL4AI_API_KEY');
    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    
    console.log('📋 环境变量检查:');
    console.log(`- SUPABASE_URL: ${supabaseUrl ? '✅ 已设置' : '❌ 未设置'}`);
    console.log(`- SUPABASE_SERVICE_ROLE_KEY: ${serviceKey ? '✅ 已设置' : '❌ 未设置'}`);
    console.log(`- CRAWL4AI_API_KEY: ${crawlApiKey ? '✅ 已设置' : '❌ 未设置'}`);
    console.log(`- GEMINI_API_KEY: ${geminiKey ? '✅ 已设置' : '❌ 未设置'}`);

    if (!supabaseUrl || !serviceKey) {
      throw new Error('缺少必要的Supabase环境变量');
    }

    // 初始化Supabase客户端
    const supabaseClient = createClient(supabaseUrl, serviceKey);
    console.log('✅ Supabase客户端初始化成功');

    // 获取请求参数
    const { rssUrl, sourceName, verticalName } = await req.json();
    console.log(`📥 收到请求: ${rssUrl}`);

    if (!rssUrl) {
      throw new Error('RSS URL不能为空');
    }

    // 简单测试：只抓取RSS，不处理全文
    console.log('📡 开始测试RSS抓取...');
    
    const response = await fetch(rssUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      },
      signal: AbortSignal.timeout(10000) // 10秒超时
    });

    if (!response.ok) {
      throw new Error(`RSS拉取失败: HTTP ${response.status}`);
    }

    const xmlText = await response.text();
    console.log(`📡 RSS内容获取成功，长度: ${xmlText.length}`);

    // 简单解析RSS标题数量
    const itemMatches = xmlText.match(/<item[^>]*>/gi);
    const itemCount = itemMatches ? itemMatches.length : 0;
    console.log(`📄 找到 ${itemCount} 个RSS条目`);

    // 测试数据库连接
    console.log('🗄️ 测试数据库连接...');
    const { data: testQuery, error: testError } = await supabaseClient
      .from('articles')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('❌ 数据库连接测试失败:', testError);
      throw new Error(`数据库连接失败: ${testError.message}`);
    }

    console.log('✅ 数据库连接测试成功');

    return new Response(JSON.stringify({
      success: true,
      message: '基础测试通过',
      results: {
        rss_url: rssUrl,
        rss_content_length: xmlText.length,
        rss_items_found: itemCount,
        database_connection: '正常',
        environment_variables: {
          supabase_url: !!supabaseUrl,
          service_key: !!serviceKey,
          crawl4ai_key: !!crawlApiKey,
          gemini_key: !!geminiKey
        }
      },
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ 测试失败:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});