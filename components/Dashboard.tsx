import React from 'react';
import { Sparkles, ShoppingBag, MessageCircle, TrendingUp, BarChart2, Image as ImageIcon, Search, PenTool, Camera } from 'lucide-react';

interface Props {
  onSelectAgent: () => void;
}

const AgentCard = ({ icon: Icon, title, desc, tag, onClick, isNew = false }: any) => (
  <div 
    onClick={onClick}
    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group relative overflow-hidden"
  >
    {isNew && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
            NEW
        </div>
    )}
    <div className="mb-4 w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
      <Icon className="text-slate-600 group-hover:text-indigo-600" size={24} />
    </div>
    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-700 transition-colors">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed mb-4 min-h-[40px]">{desc}</p>
    <div className="flex justify-between items-center text-xs text-slate-400">
        <span>{tag}</span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600 font-medium flex items-center">
            立即使用 &rarr;
        </span>
    </div>
  </div>
);

export const Dashboard: React.FC<Props> = ({ onSelectAgent }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-4">
             <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-200">
                <Sparkles className="text-white" size={20} />
             </div>
             <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                SealSeek
             </span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          AI赋能经营决策 数据驱动全域增长
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          集成多种电商场景智能体，为您提供从选品、标题优化到详情页生成的全链路AI解决方案。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* The Target Agent */}
        <div className="lg:col-span-1 transform hover:-translate-y-1 transition-transform duration-300">
             <div className="h-full relative p-[1px] rounded-xl bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400">
                <div 
                    onClick={onSelectAgent}
                    className="h-full bg-white rounded-[11px] p-6 cursor-pointer hover:bg-slate-50 transition-colors relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm z-10">
                        智能体
                    </div>
                    <div className="mb-4 w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center">
                        <PenTool className="text-indigo-600" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">标题制作智能体</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                        深度分析搜索词数据，自动拆解词根，生成覆盖高人气的多维度SEO标题。
                    </p>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-indigo-600 font-semibold text-sm">
                        <Sparkles size={16} className="mr-2" /> 点击开始制作
                    </div>
                </div>
             </div>
        </div>

        {/* Placeholder Agents */}
        <AgentCard icon={MessageCircle} title="商品评价分析" desc="分析商品评价，为详情页制作提供建议" tag="@全网" />
        <AgentCard icon={Search} title="问大家分析" desc="分析问大家和回复，挖掘用户核心痛点" tag="@全网" />
        <AgentCard icon={TrendingUp} title="飙升商品找蓝海" desc="分析飙升商品榜单，寻找蓝海商品市场" tag="@全网" />
        <AgentCard icon={BarChart2} title="全维度竞品差异" desc="分析竞品的主图、详情、sku，主图视频" tag="@全网" />
        <AgentCard icon={ShoppingBag} title="关键词选款选市场" desc="分析关键词榜单，寻找类目下的蓝海商品" tag="@全网" />
        <AgentCard icon={ImageIcon} title="生成详情页脚本" desc="结合评价和问大家分析，自动生成详情页文案" tag="@全网" />
        <AgentCard icon={Camera} title="生成买家秀" desc="根据商品的参考图及描述生成商品买家秀图片" tag="@全网" />
      </div>
    </div>
  );
};