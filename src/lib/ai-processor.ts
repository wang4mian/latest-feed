import type { Article } from '@/types'

export interface ProcessingResult {
  success: boolean
  article?: Article
  error?: string
  processing_time?: number
}

export interface AIAnalysis {
  value_score: number
  importance_score: number
  impact_scope: string
  timeliness: string
  information_quality: number
  target_audience: string[]
  key_points: string[]
  competitive_analysis?: string
  translation: string
  summary: string
  has_subscription_barrier: boolean
  barrier_indicators: string[]
}

export class AIProcessor {
  static async processArticle(
    url: string, 
    useClaudeEnhancement = false
  ): Promise<ProcessingResult> {
    const startTime = Date.now()
    
    try {
      // 1. 抓取内容
      const crawlResult = await this.crawlContent(url)
      if (!crawlResult.success || !crawlResult.content) {
        return {
          success: false,
          error: '内容抓取失败: ' + crawlResult.error
        }
      }

      // 2. AI分析
      const aiAnalysis = await this.analyzeWithGemini(crawlResult.content)
      if (!aiAnalysis.success || !aiAnalysis.analysis) {
        return {
          success: false,
          error: 'AI分析失败: ' + (aiAnalysis.error || 'No analysis result')
        }
      }

      // 3. Claude增强（可选）
      let claudeEnhancement = null
      if (useClaudeEnhancement) {
        claudeEnhancement = await this.enhanceWithClaude(
          crawlResult.content, 
          aiAnalysis.analysis
        )
      }

      // 4. 构建文章对象
      const article: Article = {
        id: this.generateId(),
        source_url: url,
        status: 'processed',
        raw_content: {
          headline: crawlResult.content.headline,
          source_url: url,
          full_text: crawlResult.content.full_text,
          metadata: crawlResult.content.metadata
        },
        ai_analysis: JSON.stringify(aiAnalysis.analysis),
        ai_translation: aiAnalysis.analysis.translation,
        value_score: aiAnalysis.analysis.value_score,
        target_audience: aiAnalysis.analysis.target_audience as any,
        has_subscription_barrier: aiAnalysis.analysis.has_subscription_barrier,
        claude_enhancement: claudeEnhancement ? JSON.stringify(claudeEnhancement) : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      return {
        success: true,
        article,
        processing_time: Date.now() - startTime
      }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
        processing_time: Date.now() - startTime
      }
    }
  }

  private static async crawlContent(url: string) {
    try {
      const crawlApiUrl = process.env.CRAWL4AI_CLOUD_URL || 'https://www.crawl4ai-cloud.com/query'
      const apiKey = process.env.CRAWL4AI_API_KEY
      
      if (!apiKey) {
        throw new Error('CRAWL4AI_API_KEY environment variable is required but not configured')
      }
      
      // 根据URL选择抓取策略
      const strategy = this.selectCrawlStrategy(url)
      
      const requestBody = {
        url,
        apikey: apiKey,
        output_format: 'fit_markdown',
        magic: true,
        remove_overlay_elements: true,
        word_count_threshold: 50,
        cache_mode: 'bypass',
        ...strategy
      }
      
      const response = await fetch(crawlApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error(`Crawl4AI Cloud请求失败: ${response.status}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Crawl4AI Cloud抓取失败')
      }

      return {
        success: true,
        content: {
          headline: result.metadata?.title || result.title || '无标题',
          full_text: result.markdown || result.fit_markdown || result.extracted_content || '',
          metadata: result.metadata || {},
          raw_html: result.html,
          screenshot: result.screenshot
        }
      }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '抓取失败'
      }
    }
  }

  private static selectCrawlStrategy(url: string) {
    const domain = new URL(url).hostname.toLowerCase()
    
    // Google News策略
    if (domain.includes('news.google.com')) {
      return {
        wait_for: 1000,
        process_iframes: false
      }
    }
    
    // 反爬虫策略
    if (domain.includes('bloomberg.com') || 
        domain.includes('wsj.com') || 
        domain.includes('reuters.com')) {
      return {
        js_code: `
          // 模拟用户行为
          window.scrollTo(0, document.body.scrollHeight / 2);
          
          // 尝试点击"同意"按钮
          const agreeButtons = document.querySelectorAll('button, a');
          for (let btn of agreeButtons) {
            if (btn.textContent && btn.textContent.toLowerCase().includes('agree')) {
              btn.click();
              break;
            }
          }
        `,
        wait_for: 3000,
        magic: true,
        remove_overlay_elements: true
      }
    }
    
    // JavaScript重度策略
    if (domain.includes('medium.com') || 
        domain.includes('substack.com') || 
        domain.includes('linkedin.com')) {
      return {
        js_code: `
          // 移除付费墙元素
          const paywalls = document.querySelectorAll('[class*="paywall"], [class*="subscription"], [class*="premium"]');
          paywalls.forEach(el => el.remove());
          
          // 滚动加载更多内容
          window.scrollTo(0, document.body.scrollHeight);
          await new Promise(resolve => setTimeout(resolve, 2000));
          window.scrollTo(0, document.body.scrollHeight);
        `,
        wait_for: 5000,
        magic: true,
        remove_overlay_elements: true,
        excluded_tags: ['script', 'style', 'nav', 'footer']
      }
    }
    
    // 默认策略
    return {
      js_code: `
        window.scrollTo(0, document.body.scrollHeight / 2);
        await new Promise(resolve => setTimeout(resolve, 1000));
      `,
      wait_for: 2000,
      magic: true,
      remove_overlay_elements: true
    }
  }

  private static async analyzeWithGemini(content: any): Promise<{success: boolean, analysis?: AIAnalysis, error?: string}> {
    try {
      const geminiApiKey = process.env.GEMINI_API_KEY
      
      // 如果配置了真实的Gemini API Key，使用真实API
      if (geminiApiKey) {
        return await this.callRealGeminiAPI(content, geminiApiKey)
      }
      
      // 否则使用模拟数据进行开发和测试
      console.warn('[AI-Processor] Using mock Gemini analysis - configure GEMINI_API_KEY for real AI analysis')
      
      const mockAnalysis: AIAnalysis = {
        value_score: Math.floor(Math.random() * 4) + 7, // 7-10分
        importance_score: Math.floor(Math.random() * 3) + 7,
        impact_scope: '制造业',
        timeliness: '高时效性',
        information_quality: Math.floor(Math.random() * 2) + 8,
        target_audience: ['研发技术', '企业战略'],
        key_points: ['技术创新', '市场影响'],
        competitive_analysis: '行业竞争分析',
        translation: content.headline + ' - 专业制造业分析',
        summary: '制造业重要动态',
        has_subscription_barrier: content.full_text?.length < 500,
        barrier_indicators: content.full_text?.length < 500 ? ['内容过短'] : []
      }

      return {
        success: true,
        analysis: mockAnalysis
      }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'AI分析失败'
      }
    }
  }

  private static async callRealGeminiAPI(_content: any, _apiKey: string): Promise<{success: boolean, analysis?: AIAnalysis, error?: string}> {
    try {
      // TODO: 实现真实的Gemini API调用
      // 准备提示词和API调用逻辑
      // const prompt = `请分析以下制造业文章...`;
      // const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${_apiKey}`
      //   },
      //   body: JSON.stringify({
      //     contents: [{
      //       parts: [{ text: prompt }]
      //     }]
      //   })
      // })
      
      throw new Error('Real Gemini API integration not yet implemented')

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Gemini API调用失败'
      }
    }
  }

  private static async enhanceWithClaude(_content: any, _baseAnalysis: AIAnalysis) {
    try {
      // 模拟Claude增强分析
      return {
        quality_assessment: '高质量制造业内容',
        title_suggestions: ['优化标题1', '优化标题2'],
        social_media_content: {
          weibo: '微博内容',
          linkedin: 'LinkedIn内容'
        },
        competitive_insights: '深度竞争分析'
      }
    } catch (error) {
      return null
    }
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }
}