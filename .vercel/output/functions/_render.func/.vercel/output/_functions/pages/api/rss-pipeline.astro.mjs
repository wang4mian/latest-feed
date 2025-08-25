export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const {
      initSources = true,
      fetchRss = true,
      processArticles = true,
      limit = 5
    } = await request.json().catch(() => ({}));
    const results = {
      init_sources: null,
      fetch_rss: null,
      process_articles: null,
      pipeline_success: false
    };
    if (initSources) {
      console.log("[RSS-Pipeline] Step 1: Initializing RSS sources...");
      try {
        const initResponse = await fetch(new URL("/api/init-rss-sources", request.url), {
          method: "POST"
        });
        results.init_sources = await initResponse.json();
        if (!results.init_sources.success) {
          throw new Error(`RSS源初始化失败: ${results.init_sources.error}`);
        }
        console.log("[RSS-Pipeline] ✅ Step 1 completed: RSS sources initialized");
      } catch (error) {
        console.error("[RSS-Pipeline] ❌ Step 1 failed:", error);
        results.init_sources = { success: false, error: error instanceof Error ? error.message : "初始化失败" };
        return new Response(JSON.stringify({
          success: false,
          error: "RSS源初始化步骤失败",
          results
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    if (fetchRss) {
      console.log("[RSS-Pipeline] Step 2: Fetching RSS content...");
      try {
        const fetchResponse = await fetch(new URL("/api/fetch-rss", request.url), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ limit })
        });
        results.fetch_rss = await fetchResponse.json();
        if (!results.fetch_rss.success) {
          throw new Error(`RSS抓取失败: ${results.fetch_rss.error}`);
        }
        console.log(`[RSS-Pipeline] ✅ Step 2 completed: ${results.fetch_rss.total_items_stored} items fetched`);
      } catch (error) {
        console.error("[RSS-Pipeline] ❌ Step 2 failed:", error);
        results.fetch_rss = { success: false, error: error instanceof Error ? error.message : "抓取失败" };
        return new Response(JSON.stringify({
          success: false,
          error: "RSS抓取步骤失败",
          results
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    if (processArticles && results.fetch_rss?.total_items_stored > 0) {
      console.log("[RSS-Pipeline] Step 3: Processing articles...");
      try {
        await new Promise((resolve) => setTimeout(resolve, 2e3));
        const processResponse = await fetch(new URL("/api/process-rss", request.url), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ limit: Math.min(limit, 3) })
          // 限制处理数量避免超时
        });
        results.process_articles = await processResponse.json();
        if (!results.process_articles.success) {
          throw new Error(`文章处理失败: ${results.process_articles.error}`);
        }
        console.log(`[RSS-Pipeline] ✅ Step 3 completed: ${results.process_articles.success_count} articles processed`);
      } catch (error) {
        console.error("[RSS-Pipeline] ❌ Step 3 failed:", error);
        results.process_articles = { success: false, error: error instanceof Error ? error.message : "处理失败" };
        console.warn("[RSS-Pipeline] Article processing failed, but RSS fetching was successful");
      }
    } else if (processArticles && results.fetch_rss?.total_items_stored === 0) {
      results.process_articles = { success: true, message: "没有新的RSS条目需要处理" };
    }
    results.pipeline_success = true;
    let summary = "RSS管道执行完成:\n";
    if (results.init_sources) {
      summary += `- RSS源初始化: ${results.init_sources.success ? "✅" : "❌"} (${results.init_sources.sources_count || 0}个源)
`;
    }
    if (results.fetch_rss) {
      summary += `- RSS抓取: ${results.fetch_rss.success ? "✅" : "❌"} (${results.fetch_rss.total_items_stored || 0}个条目)
`;
    }
    if (results.process_articles) {
      summary += `- 文章处理: ${results.process_articles.success ? "✅" : "❌"} (${results.process_articles.success_count || 0}篇文章)
`;
    }
    return new Response(JSON.stringify({
      success: true,
      message: summary.trim(),
      pipeline_results: results,
      summary: {
        sources_initialized: results.init_sources?.sources_count || 0,
        items_fetched: results.fetch_rss?.total_items_stored || 0,
        articles_processed: results.process_articles?.success_count || 0,
        total_execution_time: Date.now()
        // 可以添加实际的执行时间跟踪
      }
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[RSS-Pipeline] Unexpected pipeline error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "RSS管道执行失败"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const GET = async ({ request }) => {
  try {
    const baseUrl = new URL(request.url).origin;
    const [sourcesResponse, rssResponse, processResponse] = await Promise.all([
      fetch(`${baseUrl}/api/init-rss-sources`),
      fetch(`${baseUrl}/api/fetch-rss`),
      fetch(`${baseUrl}/api/process-rss`)
    ]);
    const [sourcesData, rssData, processData] = await Promise.all([
      sourcesResponse.json(),
      rssResponse.json(),
      processResponse.json()
    ]);
    return new Response(JSON.stringify({
      success: true,
      system_overview: {
        rss_sources: sourcesData.success ? sourcesData.stats : { error: sourcesData.error },
        rss_fetching: rssData.success ? rssData.stats : { error: rssData.error },
        article_processing: processData.success ? processData.stats : { error: processData.error }
      },
      recommendations: [
        sourcesData.stats?.sync_status === "needs_sync" ? "建议运行RSS源初始化" : null,
        rssData.stats?.recently_crawled === 0 ? "建议执行RSS抓取" : null,
        processData.stats?.unprocessed_items > 0 ? `有${processData.stats.unprocessed_items}个待处理条目` : null
      ].filter(Boolean)
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "获取系统状态失败"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
