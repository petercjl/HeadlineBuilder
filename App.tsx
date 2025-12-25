import React, { useState, useEffect } from 'react';
import { Sparkles, BarChart2, FileSpreadsheet, ArrowLeft, LayoutGrid, MessageSquare, PenTool, Image as ImageIcon, Search, TrendingUp, ShoppingBag, Camera } from 'lucide-react';
import { TitleCard } from './components/TitleCard';
import { CustomTitleAnalyzer } from './components/CustomTitleAnalyzer';
import { AgentChat } from './components/AgentChat';
import { KeywordData, TitleAnalysisResult } from './types';

const REC_TABS = [
  '新品期', '成长期', '成熟期', 
  '流量优先', '转化优先', '均衡型', 
  '更多维度'
];

type AppView = 'chat' | 'report';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('chat');
  
  // Data transferred from Chat to Report
  const [reportData, setReportData] = useState<{
      keywords: KeywordData[],
      recommendations: TitleAnalysisResult[]
  } | null>(null);

  // Results View State
  const [activeTab, setActiveTab] = useState<'recommend' | 'custom'>('recommend');
  const [activeRecTab, setActiveRecTab] = useState('新品期');
  const [selectedOtherId, setSelectedOtherId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedOtherId(null);
  }, [activeRecTab]);

  const handleShowReport = (keywords: KeywordData[], recommendations: TitleAnalysisResult[]) => {
      setReportData({ keywords, recommendations });
      setView('report');
  };

  const handleBackToChat = () => {
      setView('chat');
  };

  const renderSidebar = () => (
      <div className="hidden md:flex flex-col w-64 bg-slate-900 h-screen fixed left-0 top-0 text-slate-300 z-20">
          <div className="h-16 flex items-center px-6 border-b border-slate-800">
             <div className="flex items-center gap-2 text-white font-bold text-lg">
                <Sparkles size={20} className="text-indigo-500" />
                SealSeek
             </div>
          </div>
          
          <div className="p-4">
             <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">智能体列表</div>
             <div className="space-y-1">
                <button 
                    onClick={() => setView('chat')}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors ${view === 'chat' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}
                >
                    <PenTool size={18} />
                    <span className="font-medium text-sm">标题制作智能体</span>
                </button>
                <button className="w-full text-left px-3 py-2.5 hover:bg-slate-800 rounded-lg flex items-center gap-3 transition-colors opacity-60">
                    <MessageSquare size={18} />
                    <span className="font-medium text-sm">商品评价分析</span>
                </button>
                <button className="w-full text-left px-3 py-2.5 hover:bg-slate-800 rounded-lg flex items-center gap-3 transition-colors opacity-60">
                    <TrendingUp size={18} />
                    <span className="font-medium text-sm">飙升商品找蓝海</span>
                </button>
                <button className="w-full text-left px-3 py-2.5 hover:bg-slate-800 rounded-lg flex items-center gap-3 transition-colors opacity-60">
                    <Camera size={18} />
                    <span className="font-medium text-sm">生成买家秀</span>
                </button>
             </div>
          </div>

          <div className="mt-auto p-4 border-t border-slate-800">
             <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                    SS
                </div>
                <div className="text-sm font-medium">SealSeek User</div>
             </div>
          </div>
      </div>
  );

  const renderRecommendationContent = () => {
    if (!reportData) return null;
    const { recommendations } = reportData;

    if (activeRecTab === '更多维度') {
        const otherItems = recommendations.filter(r => r.group === 'other');
        const selectedItem = otherItems.find(i => i.id === selectedOtherId);

        if (selectedItem) {
            return (
                <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                    <button 
                        onClick={() => setSelectedOtherId(null)}
                        className="mb-4 flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                        <ArrowLeft size={16} /> 返回列表
                    </button>
                    <TitleCard 
                        result={selectedItem}
                        label={selectedItem.tag}
                    />
                </div>
            );
        }

        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-2 mb-4 text-slate-500">
                    <LayoutGrid size={18} />
                    <span className="text-sm font-medium">更多维度的标题生成方案</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                    {otherItems.map((rec) => (
                        <div 
                            key={rec.id}
                            onClick={() => setSelectedOtherId(rec.id)}
                            className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all group"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md border border-slate-200 group-hover:bg-indigo-50 group-hover:text-indigo-700 group-hover:border-indigo-100 transition-colors">
                                            {rec.tag}
                                        </span>
                                    </div>
                                    <h4 className="text-base text-slate-800 font-medium leading-relaxed group-hover:text-indigo-900 transition-colors line-clamp-1">
                                        {rec.title}
                                    </h4>
                                </div>
                                <div className="shrink-0 flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-xs text-slate-400 mb-0.5">预估覆盖人气</div>
                                        <div className="text-sm font-bold text-slate-700 group-hover:text-indigo-600">
                                            {(rec.totalPopularityMin / 10000).toFixed(1)}w+
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                        <ArrowLeft size={16} className="rotate-180" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const selectedItem = recommendations.find(r => r.tag === activeRecTab && r.group !== 'other');

    if (!selectedItem) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
                <div className="text-slate-400 font-medium">暂无 "{activeRecTab}" 相关的推荐标题</div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <TitleCard 
                key={selectedItem.id}
                result={selectedItem}
                label={selectedItem.tag}
            />
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {renderSidebar()}
      
      <div className="md:ml-64 min-h-screen flex flex-col transition-all duration-300">
        
        {/* VIEW: CHAT INTERFACE - Keep mounted to preserve state */}
        <div className={view === 'chat' ? 'block' : 'hidden'}>
            <AgentChat onShowReport={handleShowReport} />
        </div>

        {/* VIEW: REPORT (RESULTS) */}
        {view === 'report' && reportData && (
            <div className="animate-in fade-in slide-in-from-right duration-300">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <button 
                            onClick={handleBackToChat}
                            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium"
                        >
                            <ArrowLeft size={20} />
                            返回对话
                        </button>
                        <div className="flex items-center gap-2">
                             <span className="text-sm font-bold text-slate-800">标题分析报告</span>
                             <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">已完成</span>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
                     {/* Top Tabs */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-fit">
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
                        
                         {/* Data Badge */}
                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                            <FileSpreadsheet size={16} />
                            <span className="font-medium">基础数据: {reportData.keywords.length} 个搜索词</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                        {activeTab === 'recommend' && (
                            <>
                                <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide border-b border-slate-200">
                                    {REC_TABS.map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveRecTab(tab)}
                                            className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-all
                                                ${activeRecTab === tab
                                                    ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50' 
                                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                                }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                                <div>{renderRecommendationContent()}</div>
                            </>
                        )}

                        {activeTab === 'custom' && (
                            <CustomTitleAnalyzer allKeywords={reportData.keywords} />
                        )}
                    </div>
                </main>
            </div>
        )}
      </div>
    </div>
  );
};

export default App;