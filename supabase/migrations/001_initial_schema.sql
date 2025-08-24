-- 制造业情报系统数据库模式

-- RSS源表
CREATE TABLE IF NOT EXISTS rss_sources (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (category IN ('Technology', 'Business', 'Policy')),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    crawl_strategy TEXT DEFAULT 'default' CHECK (crawl_strategy IN ('google_news', 'anti_bot', 'js_heavy', 'default')),
    last_crawled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 文章表
CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    source_url TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'processing', 'processed', 'adopted', 'ignored', 'compiled', 'published')),
    raw_content JSONB,
    ai_analysis TEXT,
    ai_translation TEXT,
    final_content TEXT,
    value_score INTEGER CHECK (value_score BETWEEN 1 AND 10),
    target_audience TEXT[],
    has_subscription_barrier BOOLEAN DEFAULT false,
    claude_enhancement TEXT,
    editor_action TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RSS条目表
CREATE TABLE IF NOT EXISTS rss_items (
    id TEXT PRIMARY KEY,
    rss_source_id TEXT REFERENCES rss_sources(id),
    title TEXT NOT NULL,
    link TEXT NOT NULL,
    description TEXT,
    pub_date TIMESTAMP WITH TIME ZONE,
    guid TEXT,
    processed BOOLEAN DEFAULT false,
    article_id TEXT REFERENCES articles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_value_score ON articles(value_score DESC);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rss_items_rss_source_id ON rss_items(rss_source_id);
CREATE INDEX IF NOT EXISTS idx_rss_items_processed ON rss_items(processed);
CREATE INDEX IF NOT EXISTS idx_rss_sources_category ON rss_sources(category);
CREATE INDEX IF NOT EXISTS idx_rss_sources_is_active ON rss_sources(is_active);

-- 启用行级安全策略
ALTER TABLE rss_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rss_items ENABLE ROW LEVEL SECURITY;

-- 创建策略（允许所有操作，可根据需要调整）
CREATE POLICY "允许所有RSS源操作" ON rss_sources FOR ALL USING (true);
CREATE POLICY "允许所有文章操作" ON articles FOR ALL USING (true);
CREATE POLICY "允许所有RSS条目操作" ON rss_items FOR ALL USING (true);