-- 添加缺失的字段到articles表
ALTER TABLE articles ADD COLUMN IF NOT EXISTS has_subscription_barrier BOOLEAN DEFAULT false;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS claude_enhancement TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS editor_action TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS ai_translation TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS final_content TEXT;

-- 确保所有必要的索引存在
CREATE INDEX IF NOT EXISTS idx_articles_has_subscription_barrier ON articles(has_subscription_barrier);

-- 更新表注释
COMMENT ON COLUMN articles.has_subscription_barrier IS '文章是否有订阅门槛';
COMMENT ON COLUMN articles.claude_enhancement IS 'Claude AI增强内容';
COMMENT ON COLUMN articles.editor_action IS '编辑操作记录';
COMMENT ON COLUMN articles.ai_translation IS 'AI翻译内容';
COMMENT ON COLUMN articles.final_content IS '最终处理后的内容';