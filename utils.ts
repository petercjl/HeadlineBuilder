import { KeywordData } from "./types";

/**
 * Calculates string length where Chinese characters count as 2, others as 1.
 */
export const calculateTitleLength = (str: string): number => {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    // Check for double-byte character (Chinese, etc.)
    if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
      len += 2;
    } else {
      len += 1;
    }
  }
  return len;
};

/**
 * Parses a string like "8万" or "1500" into a number.
 */
export const parseNumberString = (str: string): number => {
  if (!str) return 0;
  let multiplier = 1;
  let cleanStr = str.replace(/,/g, '');
  
  if (cleanStr.includes('万')) {
    multiplier = 10000;
    cleanStr = cleanStr.replace('万', '');
  } else if (cleanStr.includes('亿')) {
    multiplier = 100000000;
    cleanStr = cleanStr.replace('亿', '');
  }

  const val = parseFloat(cleanStr);
  return isNaN(val) ? 0 : Math.floor(val * multiplier);
};

/**
 * Formats a large number back to "X万" style.
 */
export const formatPopularity = (num: number): string => {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(1).replace('.0', '') + '亿';
  }
  if (num >= 10000) {
    return (num / 10000).toFixed(1).replace('.0', '') + '万';
  }
  return num.toString();
};

/**
 * Parses the Excel range string "X ~ Y" into min/max numbers.
 */
export const parsePopularityRange = (rangeStr: string): { min: number, max: number } => {
  const parts = rangeStr.split('~').map(s => s.trim());
  if (parts.length === 2) {
    return {
      min: parseNumberString(parts[0]),
      max: parseNumberString(parts[1])
    };
  }
  // Fallback if no range
  const val = parseNumberString(rangeStr);
  return { min: val, max: val };
};