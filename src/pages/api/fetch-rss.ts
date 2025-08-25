import type { APIRoute } from 'astro'
import { supabase } from '@/lib/supabase'
import { getActiveRSSSources } from '@/lib/rss-sources'
import { XMLParser } from 'fast-xml-parser'

interface RSSItem {
  title: string
  link: string
  description?: string
  pubDate?: string
  guid?: string
}

interface RSSChannel {
  title: string
  description: string
  items: RSSItem[]
}

// 共用的RSS抓取逻辑
async function fetchRSSData(request: Request) {
  try {
    const { sourceIds = [], limit = 10 } = await request.json().catch(() => ({}))
    
    // 获取要抓取的RSS源
    let rssSources
    if (sourceIds.length > 0) {
      // 抓取指定的RSS源
      const activeSources = getActiveRSSSources()
      rssSources = activeSources.filter(source => sourceIds.includes(source.id))
    } else {
      // 抓取所有活跃的RSS源
      rssSources = getActiveRSSSources()
    }

    if (rssSources.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: '没有找到活跃的RSS源'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const results = []
    const parser = new XMLParser({
      ignoreAttributes: false,
      parseAttributeValue: true,
      trimValues: true
    })

    // 逐个抓取RSS源
    for (const source of rssSources) {
      try {
        console.log(`[RSS-Fetcher] Starting to fetch: ${source.name} - ${source.url}`)
        
        // 获取RSS内容
        const response = await fetch(source.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Manufacturing Intelligence Bot/1.0)'
          },
          timeout: 30000
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const xmlContent = await response.text()
        const rssData = parser.parse(xmlContent)
        
        // 解析RSS结构
        let channel
        if (rssData.rss?.channel) {
          channel = rssData.rss.channel
        } else if (rssData.feed) {
          // Atom feed format
          channel = rssData.feed
        } else {
          throw new Error('不支持的RSS格式')
        }

        // 标准化RSS条目
        let items = []
        if (Array.isArray(channel.item)) {
          items = channel.item
        } else if (channel.item) {
          items = [channel.item]
        } else if (Array.isArray(channel.entry)) {
          // Atom format
          items = channel.entry.map((entry: any) => ({
            title: entry.title,
            link: entry.link?.href || entry.link,
            description: entry.summary || entry.content,
            pubDate: entry.published || entry.updated,
            guid: entry.id
          }))
        }

        // 限制条目数量
        items = items.slice(0, limit)
        
        console.log(`[RSS-Fetcher] Found ${items.length} items from ${source.name}`)

        // 将条目直接存储为文章
        const articles = []
        for (const item of items) {
          const article = {
            id: `rss_${source.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            source_url: item.link || '',
            status: 'pending',
            raw_content: {
              title: item.title || '无标题',
              rss_description: item.description || '',
              source_name: source.name,
              rss_source_id: source.id,
              pub_date: item.pubDate,
              guid: item.guid || item.link
            },
            value_score: 50, // 默认评分
            target_audience: ['制造业从业者'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          articles.push(article)
        }

        // 批量插入文章
        if (articles.length > 0) {
          const { data: insertedItems, error: insertError } = await supabase
            .from('articles')
            .insert(articles)
            .select()

          if (insertError) {
            console.error(`[RSS-Fetcher] Database insert error for ${source.name}:`, insertError)
            results.push({
              source_id: source.id,
              source_name: source.name,
              success: false,
              error: `数据库插入失败: ${insertError.message}`,
              items_fetched: articles.length,
              items_stored: 0
            })
          } else {
            // 更新RSS源的最后抓取时间
            await supabase
              .from('rss_sources')
              .update({ 
                last_crawled_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq('id', source.id)

            results.push({
              source_id: source.id,
              source_name: source.name,
              success: true,
              items_fetched: articles.length,
              items_stored: insertedItems?.length || 0,
              message: `成功抓取并存储${insertedItems?.length || 0}个文章`
            })
            
            console.log(`[RSS-Fetcher] ✅ Successfully stored ${insertedItems?.length || 0} items from ${source.name}`)
          }
        } else {
          results.push({
            source_id: source.id,
            source_name: source.name,
            success: true,
            items_fetched: 0,
            items_stored: 0,
            message: '没有找到新的RSS条目'
          })
        }
        
        // 避免请求过于频繁
        await new Promise(resolve => setTimeout(resolve, 2000))
        
      } catch (sourceError) {
        console.error(`[RSS-Fetcher] Error fetching ${source.name}:`, sourceError)
        results.push({
          source_id: source.id,
          source_name: source.name,
          success: false,
          error: sourceError instanceof Error ? sourceError.message : '抓取RSS失败',
          items_fetched: 0,
          items_stored: 0
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const failureCount = results.filter(r => !r.success).length
    const totalItemsStored = results.reduce((sum, r) => sum + (r.items_stored || 0), 0)

    return new Response(JSON.stringify({
      success: true,
      message: `RSS抓取完成: ${successCount}个源成功, ${failureCount}个源失败, 共存储${totalItemsStored}个条目`,
      sources_processed: results.length,
      success_count: successCount,
      failure_count: failureCount,
      total_items_stored: totalItemsStored,
      results
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('[RSS-Fetcher] Unexpected error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'RSS抓取失败'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export const GET: APIRoute = async () => {
  try {
    // 获取RSS源的抓取状态统计
    const { data: sources, error: sourceError } = await supabase
      .from('rss_sources')
      .select('*')
      .eq('is_active', true)
    
    if (sourceError) {
      throw new Error(sourceError.message)
    }

    const { data: items, error: itemError } = await supabase
      .from('rss_items')
      .select('rss_source_id, created_at')
      .order('created_at', { ascending: false })
    
    if (itemError) {
      throw new Error(itemError.message)
    }

    // 统计每个RSS源的条目数量和最新条目时间
    const sourceStats = sources?.map(source => {
      const sourceItems = items?.filter(item => item.rss_source_id === source.id) || []
      const latestItem = sourceItems[0] // 因为已按时间降序排列
      
      return {
        source_id: source.id,
        source_name: source.name,
        source_url: source.url,
        last_crawled_at: source.last_crawled_at,
        total_items: sourceItems.length,
        latest_item_at: latestItem?.created_at || null,
        is_active: source.is_active
      }
    }) || []

    const totalSources = sourceStats.length
    const recentlyActive = sourceStats.filter(s => {
      if (!s.last_crawled_at) return false
      const lastCrawl = new Date(s.last_crawled_at)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      return lastCrawl > oneHourAgo
    }).length

    return new Response(JSON.stringify({
      success: true,
      stats: {
        total_active_sources: totalSources,
        recently_crawled: recentlyActive,
        total_rss_items: items?.length || 0,
        source_details: sourceStats
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : '获取RSS统计失败'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}