import { KeywordData } from "../types";
import { parsePopularityRange } from "../utils";

const rawData = [
  { rank: 1, keyword: "厨房剪刀", pop: "8万 ~ 15万", click: "100.00%", conv: "30% ~ 35%" },
  { rank: 2, keyword: "剪刀厨房专用", pop: "4万 ~ 8万", click: "96.00%", conv: "35% ~ 40%" },
  { rank: 3, keyword: "厨房用剪刀", pop: "2万 ~ 4万", click: "105.00%", conv: "30% ~ 35%" },
  { rank: 4, keyword: "剪刀厨房", pop: "2万 ~ 4万", click: "96.00%", conv: "30% ~ 35%" },
  { rank: 5, keyword: "剪鸡鸭鹅骨头", pop: "2万 ~ 4万", click: "113.00%", conv: "25% ~ 30%" },
  { rank: 6, keyword: "厨房专用剪刀", pop: "2万 ~ 4万", click: "105.00%", conv: "35% ~ 40%" },
  { rank: 7, keyword: "剪刀高硬度锋利", pop: "2万 ~ 4万", click: "84.00%", conv: "30% ~ 35%" },
  { rank: 8, keyword: "不锈钢剪刀", pop: "1万 ~ 2万", click: "91.00%", conv: "25% ~ 30%" },
  { rank: 9, keyword: "厨房剪骨剪刀", pop: "1万 ~ 2万", click: "109.00%", conv: "25% ~ 30%" },
  { rank: 10, keyword: "瑞士力康", pop: "1万 ~ 2万", click: "60.00%", conv: "7.5% ~ 10%" },
  // Adding some more for variety in matching
  { rank: 11, keyword: "家用菜板", pop: "5万 ~ 10万", click: "80.00%", conv: "20% ~ 25%" },
  { rank: 12, keyword: "防霉抗菌砧板", pop: "3万 ~ 6万", click: "90.00%", conv: "25% ~ 30%" },
  { rank: 13, keyword: "切水果案板", pop: "1万 ~ 2万", click: "95.00%", conv: "30% ~ 35%" },
  { rank: 14, keyword: "辅食板", pop: "5000 ~ 1万", click: "85.00%", conv: "20% ~ 25%" },
  { rank: 15, keyword: "摩登主妇", pop: "2万 ~ 5万", click: "110.00%", conv: "15% ~ 20%" },
];

export const MOCK_KEYWORDS: KeywordData[] = rawData.map(item => {
  const { min, max } = parsePopularityRange(item.pop);
  return {
    id: item.rank,
    rank: item.rank,
    keyword: item.keyword,
    popularityRaw: item.pop,
    popularityMin: min,
    popularityMax: max,
    clickRate: item.click,
    conversionRate: item.conv
  };
});

/**
 * Generates a large list of mock keywords to simulate a dense result set (e.g., 50 matches).
 * Used for the Recommendation cards.
 */
export const generateLargeMockKeywords = (count: number): KeywordData[] => {
  const seeds = ["厨房", "剪刀", "菜板", "不锈钢", "家用", "强力", "多功能", "杀鱼", "骨头", "切菜", "抗菌", "防霉", "进口", "德国", "日本", "张小泉", "十八子", "锋利", "专用"];
  const results: KeywordData[] = [];
  
  for (let i = 0; i < count; i++) {
    const seed1 = seeds[Math.floor(Math.random() * seeds.length)];
    let keyword = seed1;
    
    // Make some keywords 2 words long
    if (Math.random() > 0.3) {
       const seed2 = seeds[Math.floor(Math.random() * seeds.length)];
       if (seed2 !== seed1) {
          keyword += seed2;
       }
    }

    const min = Math.floor(Math.random() * 50000) + 1000;
    const max = min + Math.floor(Math.random() * 20000);
    
    results.push({
      id: 2000 + i,
      rank: i + 1,
      keyword: keyword, 
      popularityRaw: `${(min/10000).toFixed(1)}万 ~ ${(max/10000).toFixed(1)}万`,
      popularityMin: min,
      popularityMax: max,
      clickRate: (Math.random() * 100).toFixed(2) + "%",
      conversionRate: (Math.random() * 40).toFixed(2) + "%"
    });
  }
  
  return results.sort((a, b) => b.popularityMin - a.popularityMin);
};

/**
 * Generates mock matches specifically for a given title.
 * It extracts substrings from the title to ensure "Title Match" highlighting works perfectly.
 */
export const generateMockMatchesForTitle = (title: string, count: number): KeywordData[] => {
  const results: KeywordData[] = [];
  
  // 1. Generate all possible substrings of length 2 to 4 (typical keyword length)
  const substrings: string[] = [];
  const cleanTitle = title.replace(/\s+/g, ''); // Remove spaces if any
  
  for (let i = 0; i < cleanTitle.length; i++) {
    for (let len = 2; len <= 5; len++) {
      if (i + len <= cleanTitle.length) {
        substrings.push(cleanTitle.substring(i, i + len));
      }
    }
  }

  // 2. Filter out pure symbols if necessary (simplified here)
  const uniqueSubstrings = Array.from(new Set(substrings));
  
  // 3. Generate rows
  for (let i = 0; i < count; i++) {
    // Pick a random substring
    let keyword = "厨房用品"; // Fallback
    if (uniqueSubstrings.length > 0) {
      keyword = uniqueSubstrings[Math.floor(Math.random() * uniqueSubstrings.length)];
    }

    const min = Math.floor(Math.random() * 50000) + 1000;
    const max = min + Math.floor(Math.random() * 20000);

    results.push({
      id: 3000 + i,
      rank: i + 1,
      keyword: keyword,
      popularityRaw: `${(min/10000).toFixed(1)}万 ~ ${(max/10000).toFixed(1)}万`,
      popularityMin: min,
      popularityMax: max,
      clickRate: (Math.random() * 100).toFixed(2) + "%",
      conversionRate: (Math.random() * 40).toFixed(2) + "%"
    });
  }

  return results.sort((a, b) => b.popularityMin - a.popularityMin).map((item, idx) => ({...item, rank: idx + 1}));
};