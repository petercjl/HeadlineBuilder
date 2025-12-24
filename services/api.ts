import { KeywordData, TitleAnalysisResult } from "../types";
import { MOCK_KEYWORDS, generateLargeMockKeywords, generateMockMatchesForTitle } from "./mockData";
import { calculateTitleLength } from "../utils";

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to simulate tokenization (simple split by known words for demo)
const mockTokenize = (text: string): string[] => {
  // In a real backend, an NLP library (like jieba) would do this
  // Here we just look for matches in our keywords or random split
  const tokens: string[] = [];
  let remaining = text;
  
  // Very naive greedy tokenizer for demo purposes
  const vocab = [...MOCK_KEYWORDS.map(k => k.keyword), "摩登", "主妇", "菜板", "防霉", "抗菌", "家用", "厨房", "专用", "切菜", "切", "水果", "小", "案板", "辅食", "塑料", "砧板"];
  
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

// Helper to find matched keywords in a title
const findMatches = (title: string, allKeywords: KeywordData[]): KeywordData[] => {
    // In real backend, this might check broad matches, exact matches etc.
    // Here we check if the keyword string exists within the title
    return allKeywords.filter(k => title.includes(k.keyword));
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
 * Returns 3 generated titles based on the dataset.
 */
export const getRecommendedTitles = async (keywords: KeywordData[]): Promise<TitleAnalysisResult[]> => {
    await delay(1000); // Simulate AI generation time

    // Mock generated titles
    const titles = [
        "摩登主妇菜板防霉抗菌家用厨房专用切菜切水果小案板辅食塑料砧板",
        "德国进口不锈钢厨房剪刀强力鸡骨剪家用专用强力杀鱼剪刀多功能",
        "张小泉剪刀家用厨房专用强力鸡骨剪不锈钢多功能杀鱼大剪子锋利"
    ];

    return titles.map((title, index) => {
        // NOTE: For simulation purposes, we ignore the actual 'keywords' input overlap
        // and force a large list of 50 keywords as requested by the user.
        const matched = generateLargeMockKeywords(50);
        
        const totalMin = matched.reduce((sum, k) => sum + k.popularityMin, 0);
        const totalMax = matched.reduce((sum, k) => sum + k.popularityMax, 0);

        return {
            id: `rec-${index}`,
            title,
            tokens: mockTokenize(title),
            matchedKeywords: matched,
            totalPopularityMin: totalMin,
            totalPopularityMax: totalMax,
            timestamp: Date.now()
        };
    });
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
        timestamp: Date.now()
    };
};