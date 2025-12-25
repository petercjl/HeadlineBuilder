
import React, { useState, useEffect, useMemo } from 'react';
import { KeywordData, TitleAnalysisResult } from '../types';
import { analyzeCustomTitle } from '../services/api';
import { calculateTitleLength, formatPopularity } from '../utils';
import { TokenDisplay } from './TokenDisplay';
import { KeywordTable, KeywordTableHeader } from './KeywordTable';
import { Trash2, Search, ArrowRight, Activity, History, ChevronRight } from 'lucide-react';

interface Props {
  allKeywords: KeywordData[];
}

export const CustomTitleAnalyzer: React.FC<Props> = ({ allKeywords }) => {
  const [inputText, setInputText] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<TitleAnalysisResult | null>(null);
  const [history, setHistory] = useState<TitleAnalysisResult[]>([]);
  const [activeTokens, setActiveTokens] = useState<string[]>([]);

  // Update char count on input
  useEffect(() => {
    setCharCount(calculateTitleLength(inputText));
  }, [inputText]);

  // Reset active tokens when result changes
  useEffect(() => {
    setActiveTokens([]);
  }, [currentResult]);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeCustomTitle(inputText, allKeywords);
      setCurrentResult(result);
      // Add to history if not exists (simple dedup by title)
      setHistory(prev => {
        const filtered = prev.filter(p => p.title !== inputText);
        return [result, ...filtered];
      });
    } catch (e) {
      console.error("Analysis failed", e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(h => h.id !== id));
    if (currentResult?.id === id) {
      setCurrentResult(null);
    }
  };

  const handleSelectHistory = (item: TitleAnalysisResult) => {
    setCurrentResult(item);
    setInputText(item.title);
  };

  const handleTokenClick = (token: string) => {
    setActiveTokens(prev => {
        if (prev.includes(token)) {
            return prev.filter(t => t !== token);
        } else {
            return [...prev, token];
        }
    });
  };

  // Calculate filtered count to match what the table displays
  const filteredKeywordsCount = useMemo(() => {
    if (!currentResult) return 0;
    if (activeTokens.length === 0) {
        return currentResult.matchedKeywords.length;
    }
    return currentResult.matchedKeywords.filter(kw => 
        activeTokens.some(token => kw.keyword.includes(token))
    ).length;
  }, [currentResult, activeTokens]);

  return (
    <div className="flex flex-col gap-6">
      {/* TOP SECTION: Input & History (Side by Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0 h-[280px]">
        {/* Input Card */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Search size={20} className="text-indigo-600"/> 自定义标题分析
          </h3>
          
          <div className="relative flex-1 mb-3">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-full p-4 text-slate-700 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-base leading-relaxed"
              placeholder="请输入您想要分析的淘宝标题 (60字符以内)..."
            />
            <div className={`absolute bottom-3 right-3 text-xs font-medium px-2 py-1 rounded bg-white/80 backdrop-blur border border-slate-100 ${charCount > 60 ? 'text-red-500' : 'text-slate-500'}`}>
              {charCount}/60
            </div>
          </div>

          <div className="flex justify-end">
            <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !inputText.trim()}
                className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold rounded-lg transition-all flex items-center gap-2 shadow-sm"
            >
                {isAnalyzing ? '分析中...' : <>开始分析 <ArrowRight size={18} /></>}
            </button>
          </div>
        </div>

        {/* History Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 shrink-0 flex justify-between items-center">
            <h4 className="font-semibold text-slate-700 flex items-center gap-2">
               <History size={18} /> 最近分析历史
            </h4>
            <span className="text-xs text-slate-400">{history.length} 条记录</span>
          </div>
          
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {history.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm">
                  <History size={32} className="mb-2 opacity-20" />
                  <p>暂无历史记录</p>
               </div>
            ) : (
              history.map(item => (
                <div 
                  key={item.id}
                  onClick={() => handleSelectHistory(item)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm group flex flex-col gap-1
                    ${currentResult?.id === item.id 
                      ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200' 
                      : 'bg-white border-slate-100 hover:border-indigo-100 hover:bg-slate-50'}`}
                >
                  <div className="flex justify-between items-start gap-2">
                     <p className="text-xs text-slate-800 line-clamp-2 font-medium leading-relaxed">{item.title}</p>
                     <button 
                        onClick={(e) => handleDeleteHistory(item.id, e)}
                        className="text-slate-300 hover:text-red-500 p-0.5 rounded transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        <Activity size={10} className="text-green-600" />
                        <span>{formatPopularity(item.totalPopularityMin)}</span>
                      </div>
                      {currentResult?.id === item.id && (
                          <span className="text-[10px] text-indigo-600 font-medium ml-auto flex items-center">
                            当前查看 <ChevronRight size={10} />
                          </span>
                      )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Results (Full Width, Natural Height) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
        {currentResult ? (
          <>
            {/* Sticky Header Wrapper (Stats + Token + Table Header) */}
            <div className="sticky top-16 z-30 shadow-md transition-shadow">
                
                {/* Result Info Header */}
                <div className="p-6 border-b border-slate-100 bg-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 text-green-700 p-2 rounded-lg">
                                <Activity size={20} />
                            </div>
                            <div>
                                <div className="text-sm text-slate-500">覆盖搜索人气 (Min ~ Max)</div>
                                <div className="text-xl font-bold text-slate-900">
                                    {formatPopularity(currentResult.totalPopularityMin)} <span className="text-slate-300 text-sm font-normal mx-1">~</span> {formatPopularity(currentResult.totalPopularityMax)}
                                </div>
                            </div>
                        </div>
                        <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold self-start md:self-center">
                            命中词数: {filteredKeywordsCount}
                        </div>
                    </div>

                    <div>
                        <TokenDisplay 
                            tokens={currentResult.tokens} 
                            activeTokens={activeTokens}
                            onTokenClick={handleTokenClick}
                        />
                    </div>
                </div>

                {/* Table Header Section */}
                <div className="bg-slate-50 border-b border-slate-200 px-6 pt-4 pb-0">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">命中关键词明细</h4>
                    <div className="overflow-hidden bg-white border-t border-l border-r border-slate-200 rounded-t-lg">
                        <KeywordTableHeader />
                    </div>
                </div>
            </div>

            {/* Result Table Body Container */}
            <div className="bg-slate-50 rounded-b-xl">
                 <div className="px-6 pb-6 pt-0">
                    <div className="bg-white border-l border-r border-b border-slate-200 rounded-b-lg">
                        <KeywordTable 
                            keywords={currentResult.matchedKeywords} 
                            titleContext={currentResult.title} 
                            highlightTokens={activeTokens}
                            hideHeader={true}
                        />
                    </div>
                 </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center bg-slate-50/50 text-slate-400 p-20 min-h-[400px]">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Search size={32} className="text-slate-300" />
            </div>
            <p className="text-lg font-medium text-slate-600">准备就绪</p>
            <p className="text-sm max-w-md text-center mt-2 leading-relaxed">
                请在上方输入框中输入淘宝/天猫商品标题，我们将为您分析标题的拆词结构，并匹配数据库中的核心搜索词，计算覆盖人气。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
