const RSS_SOURCES = [
  // Google News专题源 (10个永恒可靠源)
  {
    id: "google-news-manufacturing",
    name: "Google News - 制造业",
    url: "https://news.google.com/rss/search?q=manufacturing+factory+automation&hl=en-US&gl=US&ceid=US:en",
    category: "Technology",
    description: "制造业综合新闻",
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    crawl_strategy: "google_news"
  },
  {
    id: "google-news-industry40",
    name: "Google News - 工业4.0",
    url: "https://news.google.com/rss/search?q=industry+4.0+smart+manufacturing&hl=en-US&gl=US&ceid=US:en",
    category: "Technology",
    description: "智能制造和数字化转型",
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    crawl_strategy: "google_news"
  },
  {
    id: "google-news-ai-manufacturing",
    name: "Google News - AI制造",
    url: "https://news.google.com/rss/search?q=artificial+intelligence+manufacturing&hl=en-US&gl=US&ceid=US:en",
    category: "Technology",
    description: "AI在制造业的应用",
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    crawl_strategy: "google_news"
  },
  {
    id: "google-news-3d-printing",
    name: "Google News - 3D打印",
    url: "https://news.google.com/rss/search?q=3D+printing+additive+manufacturing&hl=en-US&gl=US&ceid=US:en",
    category: "Technology",
    description: "增材制造技术",
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    crawl_strategy: "google_news"
  },
  {
    id: "google-news-supply-chain",
    name: "Google News - 供应链",
    url: "https://news.google.com/rss/search?q=manufacturing+supply+chain&hl=en-US&gl=US&ceid=US:en",
    category: "Business",
    description: "制造业供应链动态",
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    crawl_strategy: "google_news"
  },
  {
    id: "google-news-china-manufacturing",
    name: "Google News - 中国制造",
    url: "https://news.google.com/rss/search?q=China+manufacturing+export&hl=en-US&gl=US&ceid=US:en",
    category: "Business",
    description: "中国制造业和出口贸易",
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    crawl_strategy: "google_news"
  },
  {
    id: "google-news-semiconductor",
    name: "Google News - 半导体",
    url: "https://news.google.com/rss/search?q=semiconductor+chip+manufacturing&hl=en-US&gl=US&ceid=US:en",
    category: "Technology",
    description: "芯片制造产业",
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    crawl_strategy: "google_news"
  },
  {
    id: "google-news-green-manufacturing",
    name: "Google News - 绿色制造",
    url: "https://news.google.com/rss/search?q=green+manufacturing+sustainability&hl=en-US&gl=US&ceid=US:en",
    category: "Policy",
    description: "可持续制造和环保",
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    crawl_strategy: "google_news"
  },
  {
    id: "google-news-robotics",
    name: "Google News - 自动化机器人",
    url: "https://news.google.com/rss/search?q=industrial+robots+automation&hl=en-US&gl=US&ceid=US:en",
    category: "Technology",
    description: "工业机器人技术",
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    crawl_strategy: "google_news"
  },
  {
    id: "google-news-trade-policy",
    name: "Google News - 制造业政策",
    url: "https://news.google.com/rss/search?q=manufacturing+trade+policy&hl=en-US&gl=US&ceid=US:en",
    category: "Policy",
    description: "贸易政策对制造业的影响",
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    crawl_strategy: "google_news"
  },
  // 专业制造业媒体 (18个权威源)
  {
    id: "the-manufacturer",
    name: "The Manufacturer",
    url: "https://www.themanufacturer.com/feed/",
    category: "Business",
    description: "英国权威制造业出版物",
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    crawl_strategy: "default"
  },
  {
    id: "manufacturing-net",
    name: "Manufacturing.net",
    url: "https://www.manufacturing.net/rss.xml",
    category: "Technology",
    description: "北美制造业新闻平台",
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    crawl_strategy: "default"
  },
  {
    id: "manufacturing-tomorrow",
    name: "ManufacturingTomorrow",
    url: "https://www.manufacturingtomorrow.com/rss.xml",
    category: "Technology",
    description: "工业4.0和智能制造专题",
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    crawl_strategy: "default"
  },
  {
    id: "industry-today",
    name: "Industry Today",
    url: "https://industrytoday.com/feed/",
    category: "Business",
    description: "制造业运营和管理动态",
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    crawl_strategy: "default"
  },
  {
    id: "automation-com",
    name: "Automation.com",
    url: "https://www.automation.com/rss.xml",
    category: "Technology",
    description: "工业自动化权威媒体",
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    crawl_strategy: "default"
  },
  {
    id: "intelligent-automation",
    name: "Intelligent Automation Network",
    url: "https://www.intelligentautomation.network/rss.xml",
    category: "Technology",
    description: "智能自动化网络",
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    crawl_strategy: "default"
  },
  {
    id: "iot-business-news",
    name: "IoT Business News",
    url: "https://iotbusinessnews.com/feed/",
    category: "Technology",
    description: "物联网商业应用",
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    crawl_strategy: "default"
  },
  {
    id: "robotics-tomorrow",
    name: "RoboticsTomorrow",
    url: "https://www.roboticstomorrow.com/rss.xml",
    category: "Technology",
    description: "机器人技术发展动态",
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    crawl_strategy: "default"
  },
  {
    id: "mit-additive",
    name: "MIT - 增材制造",
    url: "https://news.mit.edu/rss/topic/additive-manufacturing",
    category: "Technology",
    description: "MIT增材制造研究",
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    crawl_strategy: "default"
  },
  {
    id: "3d-printing-industry",
    name: "3D Printing Industry",
    url: "https://3dprintingindustry.com/feed/",
    category: "Technology",
    description: "3D打印行业综合资讯",
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    crawl_strategy: "default"
  },
  {
    id: "all3dp",
    name: "All3DP",
    url: "https://all3dp.com/feed/",
    category: "Technology",
    description: "3D打印技术和应用",
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    crawl_strategy: "default"
  },
  {
    id: "mit-ai",
    name: "MIT - 人工智能",
    url: "https://news.mit.edu/rss/topic/artificial-intelligence",
    category: "Technology",
    description: "MIT人工智能研究",
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    crawl_strategy: "default"
  },
  {
    id: "nist-manufacturing",
    name: "NIST Manufacturing News",
    url: "https://www.nist.gov/news-events/news/manufacturing/rss.xml",
    category: "Policy",
    description: "美国国家标准技术研究院制造业新闻",
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    crawl_strategy: "default"
  },
  {
    id: "nist-manufacturing-innovation",
    name: "NIST Manufacturing Innovation",
    url: "https://www.manufacturing.gov/blog/rss.xml",
    category: "Policy",
    description: "制造业创新政策和倡议",
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    crawl_strategy: "default"
  },
  {
    id: "nist-cybersecurity",
    name: "NIST Cybersecurity",
    url: "https://www.nist.gov/blogs/cybersecurity-insights/rss.xml",
    category: "Policy",
    description: "制造业网络安全",
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    crawl_strategy: "default"
  }
];
function getActiveRSSSources() {
  return RSS_SOURCES.filter((source) => source.is_active);
}

export { RSS_SOURCES as R, getActiveRSSSources as g };
