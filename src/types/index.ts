// 制造业情报系统 - 类型定义

export type ArticleStatus = 'new' | 'processing' | 'processed' | 'adopted' | 'ignored' | 'compiled' | 'published'

export type TargetAudienceTag = 
  | '制造企业高管' 
  | '技术研发团队'
  | '投资机构'
  | '政策制定者'
  | '行业分析师'
  | '设备采购'
  | '供应链管理'

export interface Article {
  id: string
  source_url: string
  status: ArticleStatus
  raw_content?: any
  ai_translation?: string
  ai_analysis?: string
  final_content?: string
  editor_action?: string
  value_score?: number
  target_audience?: TargetAudienceTag[]
  created_at: string
  updated_at?: string
}

export interface RSSSource {
  id: string
  name: string
  url: string
  category: string
  region: string
  is_active: boolean
  success_rate?: number
  last_fetch?: string
  error_message?: string
}

export interface WorkbenchFilters {
  status?: ArticleStatus[]
  editor_action?: string[]
  value_score_min?: number
  target_audience?: TargetAudienceTag[]
  category?: string
  sort_by: 'created_at' | 'value_score'
  sort_order: 'asc' | 'desc'
}