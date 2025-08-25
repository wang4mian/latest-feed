import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '', 
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { rssUrl, sourceName, verticalName } = await req.json();

    if (!rssUrl) {
      throw new Error('RSS URL不能为空');
    }

    console.log('🔥 开始RSS分析:', rssUrl);

    // ===== 步骤1: RSS拉取 - 只获取基础字段 =====
    const rssArticles = await fetchRSSBasicInfo(rssUrl);
    console.log(`📄 RSS拉取完成，找到 ${rssArticles.length} 篇文章`);

    const processedArticles = [];

    // 处理每篇文章 (带请求间隔)
    for (let i = 0; i < Math.min(rssArticles.length, 5); i++) {
      const rssArticle = rssArticles[i];
      try {
        console.log(`🔄 处理文章 ${i + 1}/${Math.min(rssArticles.length, 5)}: ${rssArticle.title.substring(0, 50)}...`);

        // 检查文章是否已存在
        const { data: existingArticle } = await supabaseClient
          .from('articles')
          .select('id')
          .eq('source_url', rssArticle.link)
          .maybeSingle();

        if (existingArticle) {
          console.log(`⚠️ 文章已存在，跳过`);
          continue;
        }

        // ===== 步骤2: Crawl4AI 读取全文 (带降级处理) =====
        let fullContent = await fetchFullTextWithCrawl4AI(rssArticle.link);

        if (!fullContent || fullContent.length < 100) {
          console.log(`⚠️ Crawl4AI失败，使用RSS描述作为内容`);
          // 降级处理：使用RSS描述作为内容
          if (rssArticle.rssDescription && rssArticle.rssDescription.length > 20) {
            fullContent = `标题: ${rssArticle.title}\n\n${rssArticle.rssDescription}\n\n[注：因网站保护机制，未能获取完整正文，以上为RSS摘要内容]`;
          } else {
            fullContent = `标题: ${rssArticle.title}\n\n暂无全文内容，此文章可能被源网站保护或Crawl4AI访问受限。`;
          }
        }

        console.log(`✅ 内容获取完成，长度: ${fullContent.length}字符`);

        // ===== 步骤3: Gemini LLM 分析全文 - 摘要和打分 =====
        const aiAnalysis = await analyzeWithGemini(rssArticle.title, fullContent, verticalName);

        // 组装最终数据 - 使用正确的数据库字段
        const article = {
          id: `article_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          source_url: rssArticle.link,
          status: 'processed',
          raw_content: {
            title: rssArticle.title,
            rss_description: rssArticle.rssDescription,
            full_content: fullContent,
            vertical_name: verticalName,
            source_name: sourceName,
            crawl_method: 'crawl4ai'
          },
          ai_analysis: aiAnalysis.summary,
          value_score: parseInt(aiAnalysis.score),
          target_audience: ['制造业从业者', '技术管理人员'],
          has_subscription_barrier: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        processedArticles.push(article);
        console.log(`✅ 文章处理完成，评分: ${aiAnalysis.score}`);

        // 🕐 添加请求间隔，避免被反DDOS机制误判
        if (i < Math.min(rssArticles.length, 5) - 1) {
          console.log(`⏳ 等待3秒后处理下一篇文章...`);
          await new Promise((resolve) => setTimeout(resolve, 3000)); // 3秒间隔，Crawl4AI需要更长间隔
        }

      } catch (articleError) {
        console.error(`❌ 文章处理失败: ${articleError.message}`);
        // 即使出错也要等待，避免频繁重试
        if (i < Math.min(rssArticles.length, 5) - 1) {
          console.log(`⏳ 错误后等待2秒...`);
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    }

    // 插入数据库
    if (processedArticles.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        count: 0,
        message: '没有新文章需要添加'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    const { data, error } = await supabaseClient
      .from('articles')
      .insert(processedArticles)
      .select();

    if (error) {
      if (error.code === '23505') {
        console.log(`⚠️ 检测到重复文章`);
        return new Response(JSON.stringify({
          success: true,
          count: 0,
          message: '检测到重复文章，已跳过'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        });
      } else {
        throw new Error(`数据库插入失败: ${error.message}`);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      count: data?.length || 0,
      message: `成功处理 ${data?.length || 0} 篇文章`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('❌ RSS分析失败:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});

// ===== 步骤1: RSS拉取 - 只获取基础字段 =====
async function fetchRSSBasicInfo(rssUrl) {
  console.log('📡 开始RSS拉取...');
  const response = await fetch(rssUrl, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader)',
      'Accept': 'application/rss+xml, application/xml, text/xml, */*'
    },
    signal: AbortSignal.timeout(15000)
  });

  if (!response.ok) {
    throw new Error(`RSS拉取失败: HTTP ${response.status}`);
  }

  const xmlText = await response.text();
  console.log(`📡 RSS内容获取成功，长度: ${xmlText.length}`);

  // 解析RSS，只提取基础信息
  const articles = [];
  const itemPattern = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  const itemMatches = [...xmlText.matchAll(itemPattern)];

  for (const itemMatch of itemMatches) {
    const itemContent = itemMatch[1];
    const titleMatch = itemContent.match(/<title[^>]*>(.*?)<\/title>/is);
    const linkMatch = itemContent.match(/<link[^>]*>(.*?)<\/link>/is);
    const descMatch = itemContent.match(/<description[^>]*>(.*?)<\/description>/is);
    const summaryMatch = itemContent.match(/<summary[^>]*>(.*?)<\/summary>/is);
    const contentMatch = itemContent.match(/<content:encoded[^>]*>(.*?)<\/content:encoded>/is);

    if (titleMatch && linkMatch) {
      const title = cleanText(titleMatch[1]);
      const link = linkMatch[1].trim();
      let rssDescription = '';

      // 尝试获取RSS中的描述内容
      if (contentMatch && contentMatch[1]) {
        rssDescription = cleanText(contentMatch[1]);
      } else if (descMatch && descMatch[1]) {
        rssDescription = cleanText(descMatch[1]);
      } else if (summaryMatch && summaryMatch[1]) {
        rssDescription = cleanText(summaryMatch[1]);
      }

      if (title && link && link.startsWith('http')) {
        articles.push({
          title,
          link,
          rssDescription: rssDescription || ''
        });
      }
    }
  }

  return articles;
}

// ===== 步骤2: Crawl4AI 读取全文 (带重试机制) =====
async function fetchFullTextWithCrawl4AI(url) {
  console.log(`🕷️ 开始Crawl4AI全文抓取...`);
  const crawl4aiApiKey = Deno.env.get('CRAWL4AI_API_KEY');
  
  if (!crawl4aiApiKey) {
    console.log(`❌ 未配置CRAWL4AI_API_KEY`);
    return null;
  }

  // 重试机制：最多重试3次
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`🕷️ 第${attempt}次尝试Crawl4AI...`);
      
      const crawlResponse = await fetch('https://api.crawl4ai.com/crawl', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${crawl4aiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          urls: [url],
          formats: ['markdown'],
          includeTags: ['article', 'main', 'div', 'p', 'h1', 'h2', 'h3'],
          excludeTags: ['nav', 'header', 'footer', 'aside', 'script', 'style'],
          waitFor: 3000,
          timeout: 30000,
          extractStrategy: 'NoExtractionStrategy',
          chunking_strategy: 'RegexChunking'
        }),
        signal: AbortSignal.timeout(60000) // 60秒超时
      });

      console.log(`🕷️ Crawl4AI响应状态: ${crawlResponse.status}`);

      if (crawlResponse.status === 429) {
        console.log(`⚠️ 遇到速率限制，等待${attempt * 3}秒后重试...`);
        await new Promise((resolve) => setTimeout(resolve, attempt * 3000));
        continue;
      }

      if (crawlResponse.ok) {
        const crawlData = await crawlResponse.json();
        console.log(`🕷️ Crawl4AI响应结构: ${JSON.stringify(crawlData).substring(0, 300)}...`);

        // 解析Crawl4AI的响应格式
        let content = null;
        
        if (crawlData.results && crawlData.results.length > 0) {
          const result = crawlData.results[0];
          
          // 优先使用markdown格式的内容
          if (result.markdown) {
            content = result.markdown;
          } else if (result.cleaned_html) {
            content = result.cleaned_html;
          } else if (result.text) {
            content = result.text;
          } else if (result.content) {
            content = result.content;
          }
        } else if (crawlData.data && crawlData.data.markdown) {
          content = crawlData.data.markdown;
        } else if (crawlData.data && crawlData.data.text) {
          content = crawlData.data.text;
        } else if (crawlData.markdown) {
          content = crawlData.markdown;
        } else if (crawlData.text) {
          content = crawlData.text;
        }

        if (content && content.length > 100) {
          // 清理markdown内容，保留主要文本
          const cleanedContent = content
            .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 保留链接文本
            .replace(/#{1,6}\s*/g, '') // 移除标题符号
            .replace(/\*\*([^*]+)\*\*/g, '$1') // 移除粗体标记
            .replace(/\*([^*]+)\*/g, '$1') // 移除斜体标记
            .replace(/```[\s\S]*?```/g, '') // 移除代码块
            .replace(/`([^`]+)`/g, '$1') // 移除内联代码标记
            .replace(/\n{3,}/g, '\n\n') // 规范化换行
            .trim();

          console.log(`🕷️ ✅ Crawl4AI成功，原始长度: ${content.length}, 清理后长度: ${cleanedContent.length}字符`);
          return cleanedContent;
        } else {
          console.log(`⚠️ Crawl4AI返回内容过短或无效: ${JSON.stringify(crawlData).substring(0, 200)}...`);
        }
      } else {
        const errorText = await crawlResponse.text();
        console.log(`⚠️ Crawl4AI错误 ${crawlResponse.status}: ${errorText.substring(0, 200)}`);
      }

    } catch (error) {
      console.log(`⚠️ 第${attempt}次尝试失败: ${error.message}`);
    }

    // 如果不是最后一次尝试，等待后重试
    if (attempt < 3) {
      const waitTime = attempt * 2000; // 递增等待时间：2秒、4秒
      console.log(`⏳ 等待${waitTime / 1000}秒后重试...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  console.log(`❌ Crawl4AI三次尝试都失败，返回null`);
  return null;
}

// ===== 步骤3: Gemini LLM 分析全文 - 摘要和打分 =====
async function analyzeWithGemini(title, fullContent, verticalName) {
  console.log('🤖 开始Gemini AI分析...');
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  
  if (!geminiApiKey) {
    throw new Error('未配置GEMINI_API_KEY');
  }

  const prompt = `你是一个专业的${verticalName}行业分析师。请基于以下标准为新闻打分：

评分维度：
1. 重要性(40%)：技术突破/市场动态/政策法规的重要程度
2. 影响范围(30%)：全球性>区域性>企业级>概念性
3. 时效性(20%)：突发>独家>定期>历史
4. 信息质量(10%)：权威来源>详实数据>明确来源>推测性质

评分标准：
• 10分：行业重大突破，全球影响，突发新闻，权威来源
• 9分：重要技术进展，广泛影响，独家报道，可靠来源
• 8分：显著市场动态，区域影响，及时报道，明确来源
• 7分：一般行业新闻，企业级影响，定期更新，基本可信
• 6分：常规信息，局部影响，延迟报道，来源一般
• 5分：边缘相关，概念性，历史回顾，来源模糊
• 1-4分：不相关/过时/虚假信息

标题: ${title}
内容: ${fullContent.substring(0, 3000)}...
领域: ${verticalName}

请返回JSON格式:
{
  "score": 1到10的数字评分,
  "summary": "基于文章内容的中文摘要，2-3句话，不超过100字"
}`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': geminiApiKey
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }]
    }),
    signal: AbortSignal.timeout(30000)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API失败 (${response.status}): ${errorText}`);
  }

  const geminiData = await response.json();
  const aiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!aiText) {
    throw new Error('Gemini返回空内容');
  }

  console.log(`🤖 AI分析完成`);

  // 解析JSON响应
  try {
    const jsonMatch = aiText.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return {
        score: Math.max(1, Math.min(10, parseInt(result.score) || 7)),
        summary: result.summary || ''
      };
    }
  } catch (parseError) {
    console.log(`⚠️ JSON解析失败，尝试提取数字`);
    const scoreMatch = aiText.match(/(\d+)/);
    return {
      score: scoreMatch ? Math.max(1, Math.min(10, parseInt(scoreMatch[1]))) : 7,
      summary: `AI分析摘要：${title.substring(0, 50)}...`
    };
  }

  return {
    score: 7,
    summary: `AI分析摘要：${title.substring(0, 50)}...`
  };
}

// 文本清理
function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}