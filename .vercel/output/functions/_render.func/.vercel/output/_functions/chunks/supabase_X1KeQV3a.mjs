import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://msvgeriacsaaakmxvqye.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdmdlcmlhY3NhYWFrbXh2cXllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzYwNDIwOSwiZXhwIjoyMDUzMTgwMjA5fQ.O1zKC51UUwQWxSsavmIiVQVFZuexYP1HoC3YNY4ViM0";
const supabase = createClient(supabaseUrl, supabaseServiceKey);
async function getWorkbenchArticles(filters, page = 1, limit = 20) {
  let query = supabase.from("articles").select("*");
  if (filters.status && filters.status.length > 0) {
    query = query.in("status", filters.status);
  }
  if (filters.editor_action && filters.editor_action.length > 0) {
    query = query.in("editor_action", filters.editor_action);
  }
  if (filters.value_score_min !== void 0) {
    query = query.gte("value_score", filters.value_score_min);
  }
  if (filters.target_audience && filters.target_audience.length > 0) {
    query = query.overlaps("target_audience", filters.target_audience);
  }
  if (filters.category && filters.category !== "all") {
    const { data: categoryRssSources } = await supabase.from("rss_sources").select("url").eq("category", filters.category).eq("is_active", true);
    if (categoryRssSources && categoryRssSources.length > 0) {
      const validSourceUrls = categoryRssSources.map((source) => source.url);
      query = query.in("source_url", validSourceUrls);
    }
  }
  query = query.order(filters.sort_by, { ascending: filters.sort_order === "asc" });
  const start = (page - 1) * limit;
  query = query.range(start, start + limit - 1);
  return query;
}

export { getWorkbenchArticles as g, supabase as s };
