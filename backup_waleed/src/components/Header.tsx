import React from 'react';
import { 
  Compass, 
  FileText, 
  Cpu, 
  MessageSquareQuote, 
  ExternalLink, 
  PlusCircle,
  History,
  Building2,
  Download,
  Languages
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenReport: () => void;
  onOpenTriLingualAudit?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenReport, onOpenTriLingualAudit }) => {
  const tabs = [
    { id: 'generator', label: 'إصدار تصريح جديد', icon: PlusCircle },
    { id: 'history', label: 'أرشيف التصاريح', icon: History },
    { id: 'companies', label: 'الشركات والأختام', icon: Building2 },
    { id: 'overview', label: 'تشريح وتحليل المشروع', icon: FileText },
    { id: 'experts', label: 'مجلس الخبراء', icon: Compass },
    { id: 'chat', label: 'استشارة حية', icon: MessageSquareQuote },
    { id: 'simulator', label: 'محاكي الفحص', icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 gap-3">
          {/* Logo & Project Identity */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 font-black text-lg">
                  <span>ت.س</span>
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-900"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base md:text-lg font-black text-white tracking-tight">
                    تصاريح النقل السياحي
                  </h1>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    تطبيق ميداني PWA
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>المطور:</span>
                  <span className="text-slate-200 font-semibold">وليد السنبسي</span>
                  <span className="text-slate-600">•</span>
                  <a 
                    href="https://waleedalsenbesy.pythonanywhere.com/" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 transition-colors font-mono text-[11px] dir-ltr"
                  >
                    pythonanywhere
                    <ExternalLink className="w-3 h-3 inline" />
                  </a>
                </div>
              </div>
            </div>

            {/* Mobile PWA Install button placed prominently */}
            <div className="md:hidden">
              <PWAInstallButton />
            </div>
          </div>

          {/* Quick Actions & PWA Install for Desktop / Tablet */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <div className="hidden md:block">
              <PWAInstallButton />
            </div>

            <a
              href="/backup_waleed.tar.gz"
              download="backup_waleed.tar.gz"
              title="تنزيل نسخة احتياطية من المشروع باسم وليد"
              className="px-2.5 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/80 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>نسخة وليد (Backup)</span>
            </a>

            {onOpenTriLingualAudit && (
              <button
                onClick={onOpenTriLingualAudit}
                title="فحص كشف الروم ليست عبر خبراء اللغات الثلاث (حل معضلة 7 مقابل 9)"
                className="px-2.5 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/80 text-indigo-200 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Languages className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">تدقيق اللغات (7 سياح)</span>
                <span className="sm:hidden">تدقيق 7</span>
              </button>
            )}

            <button
              onClick={onOpenReport}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>تقرير الخبراء</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 space-x-reverse overflow-x-auto py-2 no-scrollbar border-t border-slate-800/60">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
