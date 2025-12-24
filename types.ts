export interface KeywordData {
  id: number;
  keyword: string; // 搜索词
  popularityRaw: string; // 搜索人气 (e.g., "8万 ~ 15万")
  popularityMin: number;
  popularityMax: number;
  clickRate: string; // 点击率
  conversionRate: string; // 支付转化率
  rank: number;
}

export interface TitleAnalysisResult {
  id: string;
  title: string;
  tokens: string[]; // 拆词结果
  matchedKeywords: KeywordData[]; // 命中的搜索词
  totalPopularityMin: number; // 覆盖人气最小值合计
  totalPopularityMax: number; // 覆盖人气最大值合计
  timestamp: number;
}

export interface TitleMetrics {
  length: number; // Visual length (60 chars limit)
  isValidLength: boolean;
}