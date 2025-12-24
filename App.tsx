import React, { useState, useEffect } from 'react';
import { Sparkles, BarChart2, FileSpreadsheet } from 'lucide-react';
import { TitleCard } from './components/TitleCard';
import { CustomTitleAnalyzer } from './components/CustomTitleAnalyzer';
import { uploadAndProcessFile, getRecommendedTitles } from './services/api';
import { KeywordData, TitleAnalysisResult } from './types';

const App: React.FC = () => {
  // Initial state logic removed as we want to simulate data loaded immediately
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [recommendations, setRecommendations] = useState<TitleAnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Main Tab state
  const [activeTab, setActiveTab] = useState<'recommend' | 'custom'>('recommend');
  
  // Sub Tab state for recommendations
  const [activeRecIndex, setActiveRecIndex] = useState(0);

  // Simulate initial data loading
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      try {
        // Mock loading process - passing a dummy file object since our API mock ignores it anyway
        // In a real app integrated with backend, this would likely be a fetch call to an endpoint
        const dummyFile = new File([""], "dummy.xlsx");
        const data = await uploadAndProcessFile(dummyFile);
        setKeywords(data);
        
        const recs = await getRecommendedTitles(data);
        setRecommendations(recs);
      } catch (error) {
        console.error("Error loading initial data", error);
      } finally {
        setIsLoading(false);
      }
    };

    initData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
                <Sparkles className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Smart Title Builder</h1>
          </div>
          
          {/* Status Area (Upload button removed) */}
          <div className="flex items-center gap-4">
             {keywords.length > 0 && (
                 <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                    <FileSpreadsheet size={16} />
                    <span className="font-medium">数据已加载 ({keywords.length} 个词)</span>
                 </div>
             )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
           // Loading State
           <div className="flex flex-col items-center justify-center py-32">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-slate-600 font-medium animate-pulse">正在加载数据并生成标题...</p>
           </div>
        ) : (
          // Main Content
          <>
            {/* Main Tabs */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-fit mb-8">
              <button
                onClick={() => setActiveTab('recommend')}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2
                  ${activeTab === 'recommend' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Sparkles size={16} /> 智能推荐标题
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2
                  ${activeTab === 'custom' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <BarChart2 size={16} /> 自定义标题分析
              </button>
            </div>

            {/* Content Area */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              {activeTab === 'recommend' && recommendations.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">推荐方案</h2>
                    <span className="text-sm text-slate-500">基于搜索人气与转化率综合计算</span>
                  </div>

                  {/* Recommendation Sub-Tabs */}
                  <div className="flex flex-col gap-6">
                      <div className="flex items-center gap-4 border-b border-slate-200">
                          {recommendations.map((rec, idx) => (
                             <button
                                key={rec.id}
                                onClick={() => setActiveRecIndex(idx)}
                                className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2
                                    ${activeRecIndex === idx 
                                        ? 'border-indigo-600 text-indigo-600' 
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                             >
                                <span className={`flex items-center justify-center w-5 h-5 rounded-full text-xs
                                    ${activeRecIndex === idx ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'}`}>
                                    {idx + 1}
                                </span>
                                标题方案 {idx + 1}
                             </button>
                          ))}
                      </div>

                      {/* Display Selected Recommendation */}
                      <div className="animate-in fade-in slide-in-from-right-4 duration-200" key={activeRecIndex}>
                          <TitleCard 
                             result={recommendations[activeRecIndex]} 
                             index={activeRecIndex} 
                          />
                      </div>
                  </div>
                </div>
              )}

              {activeTab === 'custom' && (
                <div>
                  <CustomTitleAnalyzer allKeywords={keywords} />
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;