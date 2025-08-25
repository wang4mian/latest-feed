import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// RSS源定义 - 与src/lib/rss-sources.ts保持一致
const RSS_SOURCES = [
  // Google News专题源 (10个永恒可靠源)
  {
    id: 'google-news-manufacturing',
    name: 'Google News - 制造业',
    url: 'https://news.google.com/rss/search?q=manufacturing+factory+automation&hl=en-US&gl=US&ceid=US:en',
    category: 'Technology',
    description: '制造业综合新闻',
    is_active: true,
    crawl_strategy: 'google_news'
  },
  {
    id: 'google-news-industry40',
    name: 'Google News - 工业4.0',
    url: 'https://news.google.com/rss/search?q=industry+4.0+smart+manufacturing&hl=en-US&gl=US&ceid=US:en',
    category: 'Technology',
    description: '智能制造和数字化转型',
    is_active: true,
    crawl_strategy: 'google_news'
  },
  {
    id: 'google-news-ai-manufacturing',
    name: 'Google News - AI制造',
    url: 'https://news.google.com/rss/search?q=artificial+intelligence+manufacturing&hl=en-US&gl=US&ceid=US:en',
    category: 'Technology',
    description: 'AI在制造业的应用',
    is_active: true,
    crawl_strategy: 'google_news'
  },
  {
    id: 'the-manufacturer',
    name: 'The Manufacturer',
    url: 'https://www.themanufacturer.com/feed/',
    category: 'Business',
    description: '英国权威制造业出版物',
    is_active: true,
    crawl_strategy: 'default'
  },
  {
    id: 'manufacturing-net',
    name: 'Manufacturing.net',
    url: 'https://www.manufacturing.net/rss.xml',
    category: 'Technology',
    description: '北美制造业新闻平台',
    is_active: true,
    crawl_strategy: 'default'
  }
  // 只包含部分可靠源，避免超时
]

interface RSSItem {
  title: string
  link: string
  description?: string
  pubDate?: string
  guid?: string
}

// 简单的XML解析函数
function parseRSSXML(xmlText: string) {
  const items: RSSItem[] = []
  
  // 提取所有<item>...</item>块
  const itemMatches = xmlText.match(/<item[^>]*>([\s\S]*?)<\/item>/gi)
  if (!itemMatches) return items
  
  for (const itemXml of itemMatches) {
    const item: RSSItem = {
      title: extractXMLTag(itemXml, 'title') || '无标题',
      link: extractXMLTag(itemXml, 'link') || '',
      description: extractXMLTag(itemXml, 'description') || '',
      pubDate: extractXMLTag(itemXml, 'pubDate') || extractXMLTag(itemXml, 'published') || '',
      guid: extractXMLTag(itemXml, 'guid') || extractXMLTag(itemXml, 'id') || ''
    }
    
    if (item.link) {
      items.push(item)
    }
  }
  
  return items.slice(0, 10) // 限制每个源最多10个条目
}

function extractXMLTag(xml: string, tagName: string): string {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i')
  const match = xml.match(regex)
  return match ? match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, '$1').trim() : ''
}

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
  }

  // 处理OPTIONS请求
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('[Supabase RSS] Starting RSS fetch process...')
    
    // 初始化Supabase客户端
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 先初始化RSS源到数据库
    console.log('[Supabase RSS] Initializing RSS sources...')
    const { error: upsertError } = await supabase
      .from('rss_sources')
      .upsert(RSS_SOURCES.map(source => ({
        ...source,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })), {
        onConflict: 'id',
        ignoreDuplicates: false
      })

    if (upsertError) {
      console.error('[Supabase RSS] RSS源初始化失败:', upsertError)
    } else {
      console.log(`[Supabase RSS] ✅ RSS源初始化完成: ${RSS_SOURCES.length}个源`)
    }

    const results = []
    let totalItemsStored = 0

    // 抓取每个RSS源
    for (const source of RSS_SOURCES) {
      try {
        console.log(`[Supabase RSS] Fetching: ${source.name}`)
        
        const response = await fetch(source.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Manufacturing Intelligence Bot/1.0)'
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const xmlContent = await response.text()
        const items = parseRSSXML(xmlContent)
        
        console.log(`[Supabase RSS] Found ${items.length} items from ${source.name}`)

        // 准备RSS条目数据
        const rssItems = items.map(item => ({
          id: `${source.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          rss_source_id: source.id,
          title: item.title || '无标题',
          link: item.link || '',
          description: item.description || '',
          pub_date: item.pubDate ? new Date(item.pubDate).toISOString() : null,
          guid: item.guid || item.link || '',
          processed: false,
          created_at: new Date().toISOString()
        }))

        // 存储到数据库
        if (rssItems.length > 0) {
          const { data: insertedItems, error: insertError } = await supabase
            .from('rss_items')
            .upsert(rssItems, {
              onConflict: 'guid',
              ignoreDuplicates: true
            })
            .select()

          if (insertError) {
            console.error(`[Supabase RSS] Database insert error for ${source.name}:`, insertError)
            results.push({
              source_name: source.name,
              success: false,
              error: insertError.message,
              items_stored: 0
            })
          } else {
            const storedCount = insertedItems?.length || 0
            totalItemsStored += storedCount
            
            // 更新RSS源的最后抓取时间
            await supabase
              .from('rss_sources')
              .update({ 
                last_crawled_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq('id', source.id)

            results.push({
              source_name: source.name,
              success: true,
              items_stored: storedCount
            })
            
            console.log(`[Supabase RSS] ✅ Stored ${storedCount} items from ${source.name}`)
          }
        }
        
        // 避免请求过于频繁
        await new Promise(resolve => setTimeout(resolve, 2000))
        
      } catch (error) {
        console.error(`[Supabase RSS] Error fetching ${source.name}:`, error)
        results.push({
          source_name: source.name,
          success: false,
          error: error.message,
          items_stored: 0
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const message = `RSS抓取完成: ${successCount}/${RSS_SOURCES.length} 源成功, 共存储 ${totalItemsStored} 个条目`
    
    console.log(`[Supabase RSS] ${message}`)

    return new Response(
      JSON.stringify({
        success: true,
        message,
        total_sources: RSS_SOURCES.length,
        success_sources: successCount,
        total_items_stored: totalItemsStored,
        results,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('[Supabase RSS] Unexpected error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})