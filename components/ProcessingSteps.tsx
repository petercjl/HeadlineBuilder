import React from 'react';
import { TitleBuilderInput } from '../types';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface Props {
  inputData: TitleBuilderInput;
  currentStep: number;
}

const STEPS = [
    { title: "数据预处理", desc: "读取Excel文件" },
    { title: "关键词筛选", desc: "识别核心流量词" },
    { title: "维度识别", desc: "分析搜索意图" },
    { title: "标题生成", desc: "AI智能组合标题" },
    { title: "标题验证", desc: "违禁词检测" },
    { title: "输出格式化", desc: "生成可视化报告" },
];

export const ProcessingSteps: React.FC<Props> = ({ inputData, currentStep }) => {
  return (
    <div className="w-full px-4 py-6">
      <div className="relative pl-6 border-l-2 border-slate-100 space-y-6">
        {STEPS.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isPending = index > currentStep;

            return (
                <div key={index} className={`relative transition-all duration-300 ${isPending ? 'opacity-40' : 'opacity-100'}`}>
                    {/* Status Icon Marker */}
                    <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 flex items-center justify-center bg-white transition-colors duration-300
                        ${isCompleted ? 'border-green-500 text-green-500' : ''}
                        ${isCurrent ? 'border-indigo-600 text-indigo-600 shadow-sm shadow-indigo-100 scale-110' : ''}
                        ${isPending ? 'border-slate-300 text-slate-300' : ''}
                    `}>
                        {isCompleted && <CheckCircle2 size={12} fill="currentColor" className="text-white" />}
                        {isCurrent && <Loader2 size={12} className="animate-spin" />}
                        {isPending && <Circle size={8} />}
                    </div>

                    <div className={`flex flex-col ${isCurrent ? 'transform translate-x-1' : ''} transition-transform`}>
                        <h4 className={`text-sm font-bold mb-0.5 transition-colors ${isCurrent ? 'text-indigo-600' : 'text-slate-800'}`}>
                            {step.title}
                        </h4>
                        <p className="text-xs text-slate-500">
                            {step.desc}
                        </p>
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};