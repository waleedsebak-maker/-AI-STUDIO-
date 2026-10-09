import React, { useState } from 'react';
import { 
  Compass, 
  MessageSquare, 
  ChevronRight, 
  AlertCircle, 
  Clock, 
  Sparkles, 
  CheckCircle,
  Shield,
  Server,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { EXPERT_PANEL } from '../data/projectData';
import { Expert } from '../types';

interface ExpertPanelProps {
  onSelectExpertToChat: (expertId: string) => void;
}

export const ExpertPanel: React.FC<ExpertPanelProps> = ({ onSelectExpertToChat }) => {
  const [selectedExpertId, setSelectedExpertId] = useState<string>('tourism_ops');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const selectedExpert = EXPERT_PANEL.find(e => e.id === selectedExpertId) || EXPERT_PANEL[0];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 60) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const filteredRecommendations = selectedExpert.recommendations.filter(r => {
    if (filterPriority === 'all') return true;
    return r.priority === filterPriority;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Intro Header */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>عرض المشروع على الخبراء المتخصصين</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            مجلس الخبراء الاستشاري لتقييم مشروع وليد السنبسي
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            بناءً على طلبك، قمنا بعرض تفاصيل المشروع وكوده ومخرجاته على 4 خبراء كبار في مجالات: العمليات السياحية واللوجستيات، هندسة النظم السحابية، الأمن السيبراني، ونماذج أعمال الـ SaaS.
          </p>
        </div>

        <button
          onClick={() => onSelectExpertToChat('general')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/10 flex items-center gap-2 shrink-0 transition-all active:scale-95"
        >
          <MessageSquare className="w-4 h-4" />
          <span>فتح جلسة نقاش مع المجلس كاملاً</span>
        </button>
      </div>

      {/* Expert Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {EXPERT_PANEL.map((expert) => {
          const isSelected = selectedExpertId === expert.id;
          return (
            <div
              key={expert.id}
              onClick={() => setSelectedExpertId(expert.id)}
              className={`cursor-pointer rounded-2xl p-5 border transition-all relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-800/90 border-amber-500/50 shadow-xl shadow-amber-500/5 ring-1 ring-amber-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl p-1 bg-slate-950/60 rounded-xl border border-slate-800 inline-block">
                  {expert.avatar}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-black border ${getScoreColor(expert.score)}`}>
                  {expert.score} / 100
                </span>
              </div>

              <h3 className="font-extrabold text-white text-base">{expert.name}</h3>
              <p className="text-xs text-amber-400/90 font-medium mt-0.5 line-clamp-1">{expert.title}</p>
              
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-semibold">{expert.verdict}</span>
                <span className="text-[11px] text-slate-400 group-hover:text-amber-400 flex items-center">
                  عرض التقرير <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Expert Detailed Dossier */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 md:p-8 space-y-6">
        {/* Expert Dossier Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <span className="text-5xl p-2 bg-slate-950 rounded-2xl border border-slate-800">
              {selectedExpert.avatar}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-black text-white">{selectedExpert.name}</h3>
                <span className={`px-3 py-0.5 rounded-full text-xs font-black border ${getScoreColor(selectedExpert.score)}`}>
                  التقييم: {selectedExpert.score}% ({selectedExpert.verdict})
                </span>
              </div>
              <p className="text-sm text-amber-400 font-semibold mt-0.5">{selectedExpert.title}</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">{selectedExpert.role}</p>
            </div>
          </div>

          <button
            onClick={() => onSelectExpertToChat(selectedExpert.id)}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-md flex items-center gap-2 transition-all active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>اسأل {selectedExpert.name.split(' ')[1] || selectedExpert.name} سؤالاً مخصصاً</span>
          </button>
        </div>

        {/* Detailed Assessment Letter */}
        <div className="bg-slate-950/70 rounded-xl p-5 border border-slate-800">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>التقييم التشخيصي المفصل للخبير</span>
          </h4>
          <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line font-medium">
            "{selectedExpert.detailedReview}"
          </p>
        </div>

        {/* Key Insights Grid */}
        <div>
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>أهم الملاحظات والاستنتاجات الجوهرية (Key Insights)</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedExpert.keyInsights.map((insight, index) => (
              <div key={index} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Recommendations with Priority Filter */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>التوصيات العملية وخطة التطوير (Action Plan)</span>
            </h4>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setFilterPriority('all')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  filterPriority === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => setFilterPriority('عاجل')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  filterPriority === 'عاجل' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                عاجل (أولوية قصوى)
              </button>
              <button
                onClick={() => setFilterPriority('متوسط')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  filterPriority === 'متوسط' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                متوسط
              </button>
              <button
                onClick={() => setFilterPriority('تحسين مستقبلي')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  filterPriority === 'تحسين مستقبلي' ? 'bg-sky-500/20 text-sky-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                تحسين مستقبلي
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredRecommendations.map((rec, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      rec.priority === 'عاجل'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : rec.priority === 'متوسط'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                    }`}>
                      {rec.priority}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">الأثر المرجو:</span>
                    <span className="text-xs text-emerald-400 font-semibold">{rec.impact}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-200">{rec.text}</p>
                </div>

                <button
                  onClick={() => onSelectExpertToChat(selectedExpert.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white shrink-0 transition-colors"
                >
                  طلب كود التنفيذ
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
