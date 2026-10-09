import React, { useState } from 'react';
import { Header } from './components/Header';
import { PermitGeneratorWizard } from './components/PermitGeneratorWizard';
import { PermitViewer7Pages } from './components/PermitViewer7Pages';
import { PermitsHistory } from './components/PermitsHistory';
import { CompanyManager } from './components/CompanyManager';
import { ProjectOverview } from './components/ProjectOverview';
import { ExpertPanel } from './components/ExpertPanel';
import { LiveExpertConsultant } from './components/LiveExpertConsultant';
import { SystemSimulator } from './components/SystemSimulator';
import { ArchitectureComparison } from './components/ArchitectureComparison';
import { MonetizationCalculator } from './components/MonetizationCalculator';
import { AuditReportModal } from './components/AuditReportModal';
import { PhoneInstallModal } from './components/PhoneInstallModal';
import { TriLingualAuditModal } from './components/TriLingualAuditModal';
import { IssuedPermit } from './services/permitStorage';
import { PROJECT_DETAILS, SAMPLE_PASSENGERS } from './data/projectData';
import { 
  ArrowUpRight, 
  ExternalLink, 
  Smartphone, 
  Download, 
  ShieldCheck, 
  CheckCircle2,
  Sparkles,
  QrCode
} from 'lucide-react';
import { usePWAInstall } from './hooks/usePWAInstall';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('generator');
  const [activePermitView, setActivePermitView] = useState<IssuedPermit | null>(null);
  const [consultantExpertId, setConsultantExpertId] = useState<string>('general');
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState<boolean>(false);
  const [isTriLingualModalOpen, setIsTriLingualModalOpen] = useState<boolean>(false);
  const { isInstallable, isInstalled, install } = usePWAInstall();

  const handleStartConsultation = (expertId: string = 'general') => {
    setConsultantExpertId(expertId);
    setActiveTab('chat');
  };

  const handlePermitGenerated = (permit: IssuedPermit) => {
    setActivePermitView(permit);
  };

  const handleOpenPermitFromHistory = (permit: IssuedPermit) => {
    setActivePermitView(permit);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Cairo',sans-serif] selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setActivePermitView(null);
        }}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenTriLingualAudit={() => setIsTriLingualModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-8 space-y-6">
        {/* Prominent Phone Install Helper Banner */}
        <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white">هل ترغب في تنزيل التطبيق على هاتفك المحمول؟</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
                  سهل وسريع
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                امسح الباركود بكاميرا هاتفك أو أرسل الرابط لواتسابك واضغط "إضافة للشاشة الرئيسية" ليثبت كأيقونة على الهاتف.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPhoneModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all active:scale-95 shrink-0"
          >
            <QrCode className="w-4 h-4" />
            <span>عرض الباركود وطريقة التثبيت</span>
          </button>
        </div>

        {/* If Active Permit is open in 7-Page Viewer */}
        {activePermitView ? (
          <PermitViewer7Pages
            permit={activePermitView}
            onBack={() => setActivePermitView(null)}
          />
        ) : (
          <>
            {/* Tab 1: Operational Permit Generator Wizard */}
            {activeTab === 'generator' && (
              <PermitGeneratorWizard
                onPermitGenerated={handlePermitGenerated}
                onOpenCompanyManager={() => setActiveTab('companies')}
              />
            )}

            {/* Tab 2: Permits History & Offline Archive */}
            {activeTab === 'history' && (
              <PermitsHistory
                onOpenPermit={handleOpenPermitFromHistory}
              />
            )}

            {/* Tab 3: Companies & Stamps Manager */}
            {activeTab === 'companies' && (
              <CompanyManager />
            )}

            {/* Tab 4: Project Analysis & Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <ProjectOverview onConsultExpert={handleStartConsultation} />
                <ArchitectureComparison />
                <MonetizationCalculator />
              </div>
            )}

            {/* Tab 5: Expert Panel Dossiers */}
            {activeTab === 'experts' && (
              <ExpertPanel onSelectExpertToChat={handleStartConsultation} />
            )}

            {/* Tab 6: Interactive Live AI Consultation */}
            {activeTab === 'chat' && (
              <LiveExpertConsultant initialExpertId={consultantExpertId} />
            )}

            {/* Tab 7: System Simulator & Sandbox */}
            {activeTab === 'simulator' && (
              <SystemSimulator />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/90 border-t border-slate-800 py-6 mt-12 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>
            تطبيق تصاريح النقل السياحي المصري (نسخة PWA الميدانية) • تطوير وإعداد المطور{' '}
            <strong className="text-slate-300">{PROJECT_DETAILS.author}</strong>
          </p>
          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400">
            <span>مطابق للاشتراطات الرسمية لوزارة السياحة والآثار وشرطة السياحة</span>
            <span>•</span>
            <button
              onClick={() => setIsReportOpen(true)}
              className="text-amber-400 hover:underline"
            >
              عرض تقرير التدقيق التنفيذي
            </button>
          </div>
        </div>
      </footer>

      {/* Printable/Exportable Formal Audit Modal */}
      <AuditReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

      {/* Phone Connect & Install Guide Modal */}
      <PhoneInstallModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
      />

      {/* Tri-Lingual Linguistic Audit Modal (Chinese, English, Arabic) */}
      <TriLingualAuditModal
        isOpen={isTriLingualModalOpen}
        onClose={() => setIsTriLingualModalOpen(false)}
        paxCount={7}
        passengers={SAMPLE_PASSENGERS}
      />
    </div>
  );
}
