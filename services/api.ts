
import { KeywordData, TitleAnalysisResult, RecommendationGroup } from "../types";
import { MOCK_KEYWORDS, generateLargeMockKeywords, generateMockMatchesForTitle } from "./mockData";

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to simulate tokenization (simple split by known words for demo)
const mockTokenize = (text: string): string[] => {
  // In a real backend, an NLP library (like jieba) would do this
  // Here we just look for matches in our keywords or random split
  const tokens: string[] = [];
  let remaining = text;
  
  // Very naive greedy tokenizer for demo purposes
  const vocab = [...MOCK_KEYWORDS.map(k => k.keyword), "摩登", "主妇", "菜板", "防霉", "抗菌", "家用", "厨房", "专用", "切菜", "切", "水果", "小", "案板", "辅食", "塑料", "砧板", "德国", "进口", "不锈钢", "强力", "鸡骨剪", "杀鱼", "多功能", "张小泉", "大剪子", "锋利", "宿舍", "学生", "便携", "加厚", "实木", "竹制", "高端", "礼盒"];
  
  // Sort vocab by length desc
  vocab.sort((a, b) => b.length - a.length);

  while (remaining.length > 0) {
      let found = false;
      for (const word of vocab) {
          if (remaining.startsWith(word)) {
              tokens.push(word);
              remaining = remaining.substring(word.length);
              found = true;
              break;
          }
      }
      if (!found) {
          tokens.push(remaining[0]);
          remaining = remaining.substring(1);
      }
  }
  
  return tokens;
};

// Helper to create a single title result
const createMockResult = (id: string, title: string, group: RecommendationGroup, tag: string): TitleAnalysisResult => {
    const matched = generateLargeMockKeywords(50);
    const totalMin = matched.reduce((sum, k) => sum + k.popularityMin, 0);
    const totalMax = matched.reduce((sum, k) => sum + k.popularityMax, 0);

    return {
        id,
        title,
        tokens: mockTokenize(title),
        matchedKeywords: matched,
        totalPopularityMin: totalMin,
        totalPopularityMax: totalMax,
        timestamp: Date.now(),
        group,
        tag
    };
};

/**
 * UPLOAD API
 * Simulates uploading the Excel file and processing it to extract keywords.
 */
export const uploadAndProcessFile = async (file: File): Promise<KeywordData[]> => {
    await delay(1500); // Simulate upload time
    console.log("File uploaded:", file.name);
    // In reality, backend returns the parsed rows from Excel
    return MOCK_KEYWORDS; 
};

/**
 * RECOMMENDATIONS API
 * Returns categorized generated titles.
 */
export const getRecommendedTitles = async (keywords: KeywordData[]): Promise<TitleAnalysisResult[]> => {
    await delay(1000); // Simulate AI generation time

    const results: TitleAnalysisResult[] = [];

    // 1. Product Lifecycle (3 titles)
    results.push(createMockResult('lc-1', "摩登主妇菜板防霉抗菌家用厨房专用切菜切水果小案板辅食塑料砧板", 'lifecycle', '新品期'));
    results.push(createMockResult('lc-2', "抗菌防霉菜板家用厨房专用切菜案板实木加厚大号不锈钢双面砧板", 'lifecycle', '成长期'));
    results.push(createMockResult('lc-3', "德国进口304不锈钢菜板家用抗菌防霉切菜板案板厨房专用砧板高级", 'lifecycle', '成熟期'));

    // 2. Optimization Goal (3 titles)
    results.push(createMockResult('goal-1', "菜板家用防霉抗菌切菜板案板厨房专用实木竹制大号砧板刀板整竹", 'goal', '流量优先'));
    results.push(createMockResult('goal-2', "德国乌檀木菜板实木家用抗菌防霉切菜板案板整木厨房专用砧板", 'goal', '转化优先'));
    results.push(createMockResult('goal-3', "双面不锈钢菜板家用抗菌防霉切菜板案板厨房专用切水果砧板304", 'goal', '均衡型'));

    // 3. Others (Variable number)
    const otherTitles = [
        { t: "宿舍学生小菜板迷你切水果案板家用塑料防霉抗菌厨房切菜砧板", tag: "场景词" },
        { t: "9.9包邮家用切菜板塑料防霉抗菌厨房案板切水果小砧板宿舍用", tag: "价格定位" },
        { t: "整竹菜板楠竹实木家用加厚切菜板案板厨房专用抗菌防霉大号砧板", tag: "材质词" },
        { t: "多功能切菜板家用防霉抗菌双面不锈钢案板厨房专用解冻板砧板", tag: "功能词" },
        { t: "宝宝辅食菜板婴儿专用迷你切水果小案板家用抗菌防霉塑料砧板", tag: "人群词" },
    ];

    otherTitles.forEach((item, idx) => {
        results.push(createMockResult(`other-${idx}`, item.t, 'other', item.tag));
    });

    return results;
};

/**
 * ANALYZE API
 * Analyzes a custom title input by the user.
 */
export const analyzeCustomTitle = async (title: string, allKeywords: KeywordData[]): Promise<TitleAnalysisResult> => {
    await delay(600); // Simulate processing

    // Instead of using the small initial list, we generate 50 mock keywords 
    // that are actual substrings of the custom title to look like real matches.
    const matched = generateMockMatchesForTitle(title, 50);
    
    const totalMin = matched.reduce((sum, k) => sum + k.popularityMin, 0);
    const totalMax = matched.reduce((sum, k) => sum + k.popularityMax, 0);

    return {
        id: `custom-${Date.now()}`,
        title,
        tokens: mockTokenize(title),
        matchedKeywords: matched,
        totalPopularityMin: totalMin,
        totalPopularityMax: totalMax,
        timestamp: Date.now(),
        group: 'other', // Default
        tag: '自定义'
    };
};
