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
    console.log('🔌 初始化Supabase客户端...');
    const supabaseClient = createClient(supabaseUrl, serviceKey);
    console.log('✅ Supabase客户端初始化成功');

    // 安全地获取请求参数
    let requestData;
    try {
      requestData = await req.json();
      console.log('📥 收到请求数据:', JSON.stringify(requestData));
    } catch (jsonError) {
      console.error('❌ JSON解析失败:', jsonError.message);
      throw new Error('请求数据格式错误');
    }

    const { rssUrl, sourceName, verticalName } = requestData;
    console.log(`📥 解析参数: rssUrl=${rssUrl}, sourceName=${sourceName}, verticalName=${verticalName}`);

    if (!rssUrl) {
      throw new Error('RSS URL不能为空');
    }

    // 简单测试：只抓取RSS
    console.log('📡 开始测试RSS抓取...');
    
    let rssResponse;
    try {
      rssResponse = await fetch(rssUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader)',
          'Accept': 'application/rss+xml, application/xml, text/xml, */*'
        },
        signal: AbortSignal.timeout(10000) // 10秒超时
      });
    } catch (fetchError) {
      console.error('❌ RSS请求失败:', fetchError.message);
      throw new Error(`RSS请求失败: ${fetchError.message}`);
    }

    if (!rssResponse.ok) {
      console.error(`❌ RSS响应错误: ${rssResponse.status}`);
      throw new Error(`RSS拉取失败: HTTP ${rssResponse.status}`);
    }

    let xmlText;
    try {
      xmlText = await rssResponse.text();
      console.log(`📡 RSS内容获取成功，长度: ${xmlText.length}`);
    } catch (textError) {
      console.error('❌ RSS内容读取失败:', textError.message);
      throw new Error('RSS内容读取失败');
    }

    // 简单解析RSS标题数量
    const itemMatches = xmlText.match(/<item[^>]*>/gi);
    const itemCount = itemMatches ? itemMatches.length : 0;
    console.log(`📄 找到 ${itemCount} 个RSS条目`);

    // 测试数据库连接
    console.log('🗄️ 测试数据库连接...');
    let dbTestResult;
    try {
      dbTestResult = await supabaseClient
        .from('articles')
        .select('id')
        .limit(1);
      
      console.log('📊 数据库查询结果:', dbTestResult);
    } catch (dbError) {
      console.error('❌ 数据库查询异常:', dbError.message);
      throw new Error(`数据库查询异常: ${dbError.message}`);
    }

    // 安全地检查数据库结果
    if (dbTestResult && dbTestResult.error) {
      console.error('❌ 数据库连接测试失败:', dbTestResult.error);
      throw new Error(`数据库连接失败: ${dbTestResult.error.message || '未知数据库错误'}`);
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
        database_articles_count: dbTestResult?.data?.length || 0,
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
    
    // 确保error对象有message属性
    const errorMessage = error && error.message ? error.message : String(error);
    
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
      error_type: typeof error,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});