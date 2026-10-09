import React, { useState } from 'react';
import { IssuedPermit } from '../services/permitStorage';
import { 
  Printer, 
  Download, 
  Share2, 
  ArrowLeft, 
  CheckCircle, 
  PhoneCall,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  FileDown,
  Loader2,
  FileCheck2,
  Layers,
  MapPin,
  Building2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { permitStorage } from '../services/permitStorage';
import { generateUnified7PagePDF } from '../services/pdfGenerator';
import { SAMPLE_PASSENGERS } from '../data/projectData';

interface PermitViewer7PagesProps {
  permit: IssuedPermit;
  onBack: () => void;
}

export const PermitViewer7Pages: React.FC<PermitViewer7PagesProps> = ({ permit, onBack }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [maskPassports, setMaskPassports] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [downloadedPdfResult, setDownloadedPdfResult] = useState<{ blobUrl: string; filename: string } | null>(null);
  const [generationProgress, setGenerationProgress] = useState<{ current: number; total: number } | null>(null);
  const [viewAllPages, setViewAllPages] = useState<boolean>(false);

  // Check if this is the Hurghada transfer pathway or the shared pathway
  const isHurghadaRoute = permit.permitType === 'hurghada';

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadUnifiedPdf = async () => {
    setIsGeneratingPdf(true);
    setGenerationProgress({ current: 1, total: 7 });
    try {
      const filename = `${permit.fileNo}_${isHurghadaRoute ? 'hurghada_7pages' : 'shared_7pages'}.pdf`;
      const result = await generateUnified7PagePDF(
        'officialSevenPagesContainer', 
        filename,
        (current, total) => {
          setGenerationProgress({ current, total });
        }
      );
      setDownloadedPdfResult(result);
    } catch (err: any) {
      console.error(err);
      alert(`تنبيه: تم فتح نافذة الطباعة كبديل لتوليد الـ PDF المباشر (${err.message})`);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
      setGenerationProgress(null);
    }
  };

  const handleOpenPdfInNewTab = () => {
    if (downloadedPdfResult?.blobUrl) {
      window.open(downloadedPdfResult.blobUrl, '_blank');
    } else {
      handleDownloadUnifiedPdf();
    }
  };

  const handleSendWhatsAppDriver = () => {
    if (permit.driverPhone) {
      window.open(permitStorage.createWhatsAppLink(permit.driverPhone, permit), '_blank');
    } else {
      alert('الرجاء إدخال هاتف السائق أولاً');
    }
  };

  const handleSendWhatsAppGuide = () => {
    if (permit.guidePhone) {
      window.open(permitStorage.createWhatsAppLink(permit.guidePhone, permit), '_blank');
    }
  };

  const maskPassport = (pass: string) => {
    if (!maskPassports || !pass || pass.length < 4) return pass;
    return pass.slice(0, 2) + '••••' + pass.slice(-2);
  };

  const isUnlimited = permit.licenseNumber === '2257' || permit.companyId === 'unlimited';
  const submitterName = permit.submitterName || (isUnlimited ? 'رائد ناجح فرج عبد السيد' : 'محمد عبدالناصر محمد');
  const submitterId = permit.submitterNationalId || (isUnlimited ? '29704062702113' : '29009011328331');
  const branch = permit.governorateBranch || (isHurghadaRoute && !isUnlimited ? 'بالاقصر' : 'بالبحر الأحمر');

  // Clean route label for official papers without internal notes like (مسار مشترك)
  const getCleanRouteLabel = (label: string, type: string) => {
    if (type === 'cairo') return 'توصيلة القاهرة';
    if (type === 'luxor_transfer') return 'توصيلة الأقصر';
    if (type === 'luxor_overnight') return 'مبيت الأقصر';
    if (type === 'hurghada') return 'توصيلة الغردقة من الأقصر';
    return (label || '').replace(/\(مسار مشترك\)/g, '').replace(/\(مع إخطار.*\)/g, '').trim();
  };
  const cleanRouteLabel = getCleanRouteLabel(permit.permitLabel, permit.permitType);

  // Define the dynamic 7 tabs depending on route pathway
  const pageTabs = isHurghadaRoute ? [
    { p: 1, title: 'ورقة 1: إخطار تأمين الأفواج' },
    { p: 2, title: 'ورقة 2: إخطار غرفة الشركات' },
    { p: 3, title: 'ورقة 3: إخطار وزارة السياحة' },
    { p: 4, title: 'ورقة 4: كشف الروم ليست' },
    { p: 5, title: 'ورقة 5: استمارة إدارة البرامج' },
    { p: 6, title: 'ورقة 6: إخطار شرطة الأقصر' },
    { p: 7, title: 'ورقة 7: الورقة الإضافية للغردقة' },
  ] : [
    { p: 1, title: 'ورقة 1: إخطار تأمين الأفواج' },
    { p: 2, title: 'ورقة 2: إخطار غرفة الشركات' },
    { p: 3, title: 'ورقة 3: إخطار وزارة السياحة' },
    { p: 4, title: 'ورقة 4: نيم ليست (نسخة تأمين الأفواج)' },
    { p: 5, title: 'ورقة 5: نيم ليست (نسخة غرفة الشركات)' },
    { p: 6, title: 'ورقة 6: نيم ليست (نسخة وزارة السياحة)' },
    { p: 7, title: 'ورقة 7: استمارة إدارة البرامج' },
  ];

  // Helper renderer for passenger rooming list table with customized authority footer
  const renderRoomingListPage = ({
    pageNumber,
    copyTitle,
    copySubtitle,
    authorityBadge,
    footerSignatures
  }: {
    pageNumber: number;
    copyTitle: string;
    copySubtitle: string;
    authorityBadge: string;
    footerSignatures: React.ReactNode;
  }) => {
    // Direct binding to the tourist passengers array received from generator
    // Filter out any accidental insertion of the guide's name so tourists are always displayed accurately
    const rawPassengers = (permit.passengers && Array.isArray(permit.passengers) && permit.passengers.length > 0)
      ? permit.passengers
      : SAMPLE_PASSENGERS;

    // Filter out any entry where the name is mistakenly the guide's name
    const validTouristPassengers = rawPassengers.filter(p => {
      const guideTrim = (permit.guideName || '').trim();
      if (!guideTrim) return true;
      const ch = (p.chinese || '').trim();
      const en = (p.english || '').trim().toLowerCase();
      const gLower = guideTrim.toLowerCase();
      // If the passenger row name is identical to the guide name, exclude it from the tourist manifest
      return ch !== guideTrim && en !== gLower;
    });

    const displayPassengers = validTouristPassengers.length > 0 ? validTouristPassengers : SAMPLE_PASSENGERS;

    return (
      <div 
        className={`official-government-paper bg-white text-black p-8 sm:p-10 mx-auto max-w-[794px] min-h-[1123px] border border-black shadow-2xl relative font-sans leading-tight ${viewAllPages || currentPage === pageNumber ? 'block' : 'hidden print:block'}`} 
        style={{ width: '794px', minHeight: '1123px' }}
      >
        {/* Header */}
        <div className="text-center font-bold pb-2 border-b-2 border-black mb-3">
          <h2 className="text-xl font-bold tracking-wide">
            كشف الروم ليست والنيم ليست المعتمد للأفواج السياحية
          </h2>
          <div className="text-xs text-slate-700 mt-0.5">TOURIST ROOMING LIST & MANIFEST</div>
          <div className="inline-block mt-1 px-4 py-0.5 border border-black text-xs font-black bg-slate-100">
            {copyTitle}
          </div>
        </div>

        <div className="flex justify-between items-center text-xs font-bold mb-3 border border-black p-2 bg-slate-50">
          <div>الشركة: <span className="font-bold">{permit.companyName}</span> (ترخيص {permit.licenseNumber})</div>
          <div>رقم الملف: <span className="font-mono font-bold">{permit.fileNo}</span></div>
          <div>تاريخ التحرك: <span className="font-mono font-bold">{permit.tripDate}</span></div>
          <div>إجمالي السياح: <span className="font-mono font-black text-sm text-blue-950">{displayPassengers.length} سياح</span> (معتمد بالتصريح: <span className="font-mono font-black text-sm">{permit.paxCount}</span>)</div>
        </div>

        {/* Target Authority Notice */}
        <div className="text-[11px] font-bold text-center border border-black p-1 mb-3 bg-slate-100">
          {copySubtitle}
        </div>

        {/* Passenger Table */}
        <table className="w-full border-collapse border border-black text-center text-[10px] mb-4">
          <thead className="bg-slate-100 font-bold border-b border-black">
            <tr>
              <th className="border border-black p-1.5 w-8">م</th>
              <th className="border border-black p-1.5">الاسم بالصيني</th>
              <th className="border border-black p-1.5">الاسم بالإنجليزي</th>
              <th className="border border-black p-1.5 w-12">النوع</th>
              <th className="border border-black p-1.5">رقم الجواز</th>
              <th className="border border-black p-1.5">تاريخ الميلاد</th>
              <th className="border border-black p-1.5">تاريخ الانتهاء</th>
              <th className="border border-black p-1.5 w-12">الغرفة</th>
            </tr>
          </thead>
          <tbody>
            {displayPassengers.map((p, idx) => (
              <tr key={p.id || idx + 1} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="border border-black p-1 font-mono">{idx + 1}</td>
                <td className="border border-black p-1 font-bold text-xs">{p.chinese || '—'}</td>
                <td className="border border-black p-1 font-mono text-[9px] uppercase">{p.english || '—'}</td>
                <td className="border border-black p-1">{p.sex || 'ذكر'}</td>
                <td className="border border-black p-1 font-mono font-bold">{maskPassport(p.passport)}</td>
                <td className="border border-black p-1 font-mono">{p.dob || '—'}</td>
                <td className="border border-black p-1 font-mono">{p.expiry || '—'}</td>
                <td className="border border-black p-1 font-mono font-bold">{p.room || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Authority Specific Signatures */}
        <div className="pt-2">
          {footerSignatures}
        </div>

        <div className="absolute bottom-3 left-0 right-0 text-center text-[10px] text-slate-500 font-mono">
          صفحة {pageNumber} من 7 — {authorityBadge}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Mobile Action Bar (hidden on print) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">
                ملف التصريح الرسمي (7 ورقات موحدة): {permit.fileNo}
              </h2>
              {isHurghadaRoute ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  مسار الغردقة من الأقصر (مع إخطار شرطة الأقصر والورقة الإضافية)
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  مسار مشترك للشركتين (3 إخطارات + 3 نسخ نيم ليست + إدارة البرامج)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {permit.companyName} (ترخيص {permit.licenseNumber}) • {permit.permitLabel} • تاريخ الرحلة: {permit.tripDate}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {permit.driverPhone && (
            <button
              onClick={handleSendWhatsAppDriver}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>واتساب السائق</span>
            </button>
          )}

          {permit.guidePhone && (
            <button
              onClick={handleSendWhatsAppGuide}
              className="px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>واتساب المرشد</span>
            </button>
          )}

          {/* Genuine 7-Page PDF File Download Button */}
          <button
            onClick={handleDownloadUnifiedPdf}
            disabled={isGeneratingPdf}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {isGeneratingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            <span>{isGeneratingPdf ? 'جاري بناء وتنزيل الـ PDF...' : 'تنزيل PDF النهائي (7 ورقات)'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة مباشرة</span>
          </button>
        </div>
      </div>

      {/* Page Navigation Tabs and View Mode Controls (no-print) */}
      <div className="space-y-2 no-print">
        {/* PDF Compilation Progress or Ready Banner */}
        {isGeneratingPdf && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center justify-between gap-3 text-amber-300 text-xs animate-pulse">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span className="font-bold">
                جاري تجميع حزمة التصريح في ملف PDF موحد: معالجة الورقة {generationProgress?.current || 1} من {generationProgress?.total || 7}...
              </span>
            </div>
            <span className="font-mono text-[11px] bg-amber-500/20 px-2 py-0.5 rounded">
              A4 Portrait High-DPI
            </span>
          </div>
        )}

        {downloadedPdfResult && !isGeneratingPdf && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-emerald-300 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold">تم تجميع الـ 7 ورقات بنجاح في ملف PDF واحد جاهز للطباعة: </span>
                <span className="font-mono text-emerald-200 underline">{downloadedPdfResult.filename}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenPdfInNewTab}
                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-all"
              >
                فتح الـ PDF
              </button>
              <button
                onClick={handleDownloadUnifiedPdf}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-[11px] border border-emerald-500/30 transition-all"
              >
                إعادة التنزيل
              </button>
            </div>
          </div>
        )}

        {/* View Mode Switcher & Page Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold">
          {/* Toggle between Tab mode vs Full Continuous Document */}
          <div className="flex items-center gap-1.5 border-b sm:border-b-0 sm:border-l border-slate-800 pb-2 sm:pb-0 sm:pl-3">
            <button
              onClick={() => setViewAllPages(false)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                !viewAllPages 
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              صفحة بصفحة (1-7)
            </button>
            <button
              onClick={() => setViewAllPages(true)}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                viewAllPages 
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>عرض الكل متتالي</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-black/30 text-white">7 ورقات</span>
            </button>
          </div>

          {!viewAllPages ? (
            <div className="flex items-center justify-between gap-1 grow overflow-x-auto no-scrollbar">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {pageTabs.map(item => (
                  <button
                    key={item.p}
                    onClick={() => setCurrentPage(item.p)}
                    className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors text-[11px] ${
                      currentPage === item.p
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(7, p + 1))}
                disabled={currentPage === 7}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-slate-400 text-xs px-2 flex items-center gap-2 justify-between w-full sm:w-auto">
              <span>يتم الآن استعراض المستند الكامل المكون من 7 صفحات رسمية متتالية للطباعة.</span>
              <button
                onClick={handlePrint}
                className="text-amber-400 hover:underline flex items-center gap-1 text-[11px] font-bold"
              >
                <Printer className="w-3.5 h-3.5" />
                طباعة الآن
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CONTAINER FOR ALL 7 OFFICIAL GOVERNMENT PAGES */}
      <div id="officialSevenPagesContainer" className="space-y-8 overflow-x-auto pb-8 w-full">
        
        {/* ========================================================================= */}
        {/* PAGE 1: نموذج رقم (6) - إخطار عن رحله سياحيه إختياريه (مدير إدارة تأمين الأفواج السياحية) */}
        {/* ========================================================================= */}
        <div className={`official-government-paper bg-white text-black p-8 sm:p-10 mx-auto max-w-[794px] min-h-[1123px] border border-black shadow-2xl relative font-sans leading-tight ${viewAllPages || currentPage === 1 ? 'block' : 'hidden print:block'}`} style={{ width: '794px', minHeight: '1123px' }}>
          
          {/* File Number at Top Right White Area */}
          <div className="flex justify-between items-center text-xs font-bold mb-3 pb-1 border-b border-black">
            <div className="text-right">
              رقم الملف : <span className="font-mono font-black text-sm text-blue-950 px-1">{permit.fileNo}</span>
            </div>
            <div className="text-left font-mono text-[11px] text-slate-600">
              تحريراً في: {permit.issueDate}
            </div>
          </div>

          <div className="text-center font-bold pb-2">
            <h2 className="text-xl font-bold tracking-wide border-b-2 border-black inline-block pb-0.5 px-4 mb-2">
              إخطار عن رحله سياحيه إختياريه
            </h2>
          </div>

          <div className="flex justify-between items-start text-xs font-bold mb-2">
            <div>
              <div>السيد / مدير إدارة تأمين الأفواج السياحية {branch === 'بالاقصر' ? 'بالاقصر' : ''}</div>
              <div className="mt-1">نتقدم لسيادتكم بإخطارنا عن تنظيم رحله سياحيه</div>
            </div>
            <div className="text-left font-bold text-xs">
              <div>نموذج رقم (6)</div>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs font-bold mb-1">
            <div>■ بيانات شركة السياحه:</div>
            <div className="border border-black px-4 py-1">
              تاريخ الرحله: <span className="font-mono">{permit.tripDate}</span>
            </div>
          </div>

          {/* Table: بيانات شركة السياحة */}
          <table className="w-full border-collapse border border-black text-center text-xs mb-3 font-semibold">
            <tbody>
              <tr>
                <td className="border border-black p-1.5 w-1/4 bg-slate-50">إسم شركة السياحة :</td>
                <td className="border border-black p-1.5 w-1/4 font-bold">{permit.companyName}</td>
                <td className="border border-black p-1.5 w-1/4 bg-slate-50">رقم الترخيص :</td>
                <td className="border border-black p-1.5 w-1/4 font-mono font-bold">{permit.licenseNumber}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 bg-slate-50 font-bold">عدد السائحين :</td>
                <td className="border border-black p-1.5 font-black font-mono text-base">{permit.paxCount}</td>
                <td className="border border-black p-1.5 bg-slate-50">الجنسية :</td>
                <td className="border border-black p-1.5">صيني</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 bg-slate-50 font-bold">اسم المندوب / المرشد المرافق :</td>
                <td className="border border-black p-1.5 font-black text-sm">{permit.guideName || '—'}</td>
                <td className="border border-black p-1.5 bg-slate-50 font-bold">رقم تليفون المندوب / المرشد :</td>
                <td className="border border-black p-1.5 font-mono font-black text-sm">{permit.guidePhone || '—'}</td>
              </tr>
            </tbody>
          </table>

          {/* Section: بيانات شركة النقل */}
          <div className="text-xs font-bold mb-1">■ بيانات شركة النقل:</div>
          <table className="w-full border-collapse border border-black text-xs mb-3 font-semibold">
            <tbody>
              <tr>
                <td className="border border-black p-1.5 w-1/4 bg-slate-50 text-center font-bold">إسم شركة النقل :</td>
                <td colSpan={3} className="border border-black p-1.5 font-black text-sm">{permit.transportCompany || '—'}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 bg-slate-50 text-center">نوع السياره:</td>
                <td className="border border-black p-1.5">
                  <div className="flex gap-3 justify-center">
                    <span>{permit.vehicleType === 'أتوبيس' ? '☑' : '☐'} أتوبيس</span>
                    <span>{permit.vehicleType === 'كوستر' ? '☑' : '☐'} كوستر</span>
                    <span>{permit.vehicleType === 'ميكروباص' ? '☑' : '☐'} ميكروباص</span>
                    <span>{permit.vehicleType === 'ليموزين' ? '☑' : '☐'} ليموزين</span>
                  </div>
                </td>
                <td className="border border-black p-1.5 bg-slate-50 text-center font-bold">رقم السياره :</td>
                <td className="border border-black p-1.5 font-mono font-black text-sm text-center">{permit.vehicleNumber || '—'}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 bg-slate-50 text-center font-bold">السائق:</td>
                <td className="border border-black p-1.5 font-black text-sm text-center">{permit.driverName || '—'}</td>
                <td className="border border-black p-1.5 bg-slate-50 text-center font-bold">رقم الهاتف :</td>
                <td className="border border-black p-1.5 font-mono font-black text-sm text-center">{permit.driverPhone || '—'}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 bg-slate-50 text-center">السائق الأحتياطى :</td>
                <td className="border border-black p-1.5 text-center">{permit.backupDriverName || '—'}</td>
                <td className="border border-black p-1.5 bg-slate-50 text-center">رقم الهاتف :</td>
                <td className="border border-black p-1.5 font-mono text-center">{permit.backupDriverPhone || '—'}</td>
              </tr>
            </tbody>
          </table>

          {/* Section: بيانات الرحلة */}
          <div className="text-xs font-bold mb-1">■ بيانات الرحلة</div>
          <table className="w-full border-collapse border border-black text-xs mb-2 font-semibold">
            <tbody>
              <tr>
                <td className="border border-black p-1.5 w-1/4 bg-slate-50 text-center font-black text-xs sm:text-sm">نوع الرحله :</td>
                <td className="border border-black p-1.5 w-1/4 text-center font-black text-xl text-black bg-slate-100 py-2">{cleanRouteLabel}</td>
                <td className="border border-black p-1.5 w-1/4 bg-slate-50 text-center font-bold">البرنامج / أماكن الإقامه :</td>
                <td className="border border-black p-1.5 w-1/4 font-black text-sm text-center leading-snug">{permit.programText}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 bg-slate-50 text-center">الإتجاه :</td>
                <td colSpan={3} className="border border-black p-1.5">
                  <div className="flex gap-4 justify-around">
                    <span>{permit.permitType === 'cairo' ? '☑' : '☐'} القاهره</span>
                    <span>☐ الإسكندريه</span>
                    <span>☐ شرم الشيخ</span>
                    <span>{permit.permitType.includes('luxor') ? '☑' : '☐'} الأقصر</span>
                    <span>☐ أسوان</span>
                    {permit.permitType === 'hurghada' && <span>☑ الغردقة</span>}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 bg-slate-50 text-center">منفذ الخروج :</td>
                <td colSpan={3} className="border border-black p-1.5">
                  <div className="flex gap-4 justify-around">
                    <span>{permit.permitType === 'cairo' ? '☑' : '☐'} كمين الجونه</span>
                    <span>{permit.permitType.includes('luxor') ? '☑' : '☐'} كمين سفاجا - قنا</span>
                    <span>☐ كمين مرسى علم - إدفو</span>
                    {branch === 'بالاقصر' && <span>☑ كمين العشى</span>}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 bg-slate-50 text-center">توقيت الخروج من المنفذ :</td>
                <td colSpan={3} className="border border-black p-1.5">
                  <div className="grid grid-cols-2 text-[11px] gap-2">
                    <div className="border-l border-black pl-2">
                      <div>الذهاب: <span className="font-mono">.. : ..</span></div>
                      <div>العوده: <span className="font-mono">.. : ..</span></div>
                      <div className="text-[10px] text-slate-700 font-bold">طريق القاهره مفتوح طوال 24 ساعه</div>
                    </div>
                    <div className="pr-2">
                      <div>الذهاب: <span className="font-mono">.. : ..</span></div>
                      <div>العوده: <span className="font-mono">{permit.permitType.includes('luxor') ? '18:00' : '.. : ..'}</span></div>
                      <div className="text-[10px] text-slate-700 font-bold">طريق (سفاجا-الأقصر ومرسى علم – إدفو) مفتوح من الساعه 6 حتى 18 يوميا"</div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Mandatory Law notice */}
          <div className="text-[10px] font-bold text-center border-t border-b border-black py-1 mb-4 leading-normal">
            مع ملاحظة ضرورة الإلتزام بمرور السياره فى الذهاب والعوده من منفذ الخروج فى الميعاد المحدد مسبقا" من قبل الشركه والمدون بإخطارها والمثبت بتصريح المرور
          </div>

          {/* Signatures & Submitter Area */}
          <div className="text-xs font-bold mb-3">
            توقيع مدير الشركه : .............................
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="border border-black p-3 text-xs space-y-2">
              <div className="font-bold underline text-center pb-1">مقدم الإخطار</div>
              <div>الإســم : <span className="font-bold">{submitterName}</span></div>
              <div>التوقيع : ...................................................</div>
              <div>رقم البطاقه : <span className="font-mono font-bold">{submitterId}</span></div>
            </div>

            <div className="border border-black p-3 flex flex-col justify-between text-xs">
              <div className="h-16 flex items-center justify-center font-bold text-slate-700">
                خـــــتم الشــــــــركه
              </div>
              <div className="border-t border-black pt-1">
                تحريرا فى : <span className="font-mono">{permit.issueDate}</span>
              </div>
            </div>
          </div>

          {/* Security Approval Box (Police) */}
          <div className="border border-black p-3 text-center text-xs space-y-1 w-3/4 mx-auto">
            <div className="font-bold">الإعتماد الأمنى لإدارة تأمين الأفواج السياحية</div>
            <div className="font-bold">بالإدارة العامة لشرطة السياحة واآلثار</div>
            <div className="text-[11px] font-bold">بتمام المراجعة الأمنية والقانونية</div>
            <div className="pt-2">التوقيع : .............................................................</div>
            <div className="pt-1">الختم:</div>
          </div>

          <div className="absolute bottom-3 left-0 right-0 text-center text-[10px] text-slate-500 font-mono">
            صفحة 1 من 7 — نموذج رقم (6) إدارة تأمين الأفواج السياحية
          </div>
        </div>


        {/* ========================================================================= */}
        {/* PAGE 2: نموذج رقم (6) - إخطار غرفة شركات ووكالات السفر والسياحة بالبحر الأحمر / بالأقصر */}
        {/* ========================================================================= */}
        <div className={`official-government-paper bg-white text-black p-8 sm:p-10 mx-auto max-w-[794px] min-h-[1123px] border border-black shadow-2xl relative font-sans leading-tight ${viewAllPages || currentPage === 2 ? 'block' : 'hidden print:block'}`} style={{ width: '794px', minHeight: '1123px' }}>
          
          {/* File Number at Top Right White Area */}
          <div className="flex justify-between items-center text-xs font-bold mb-3 pb-1 border-b border-black">
            <div className="text-right">
              رقم الملف : <span className="font-mono font-black text-sm text-blue-950 px-1">{permit.fileNo}</span>
            </div>
            <div className="text-left font-mono text-[11px] text-slate-600">
              تحريراً في: {permit.issueDate}
            </div>
          </div>

          <div className="text-center font-bold pb-2">
            <h2 className="text-xl font-bold tracking-wide border-b-2 border-black inline-block pb-0.5 px-4 mb-2">
              إخطار عن رحله سياحيه إختياريه
            </h2>
          </div>

          <div className="flex justify-between items-start text-xs font-bold mb-2">
            <div>
              <div>السيد الأستاذ / أمين عام فرع غرفة شركات ووكالات السفر والسياحة {branch}</div>
              <div className="mt-1">نتقدم لسيادتكم بإخطارنا عن تنظيم رحله سياحيه</div>
            </div>
            <div className="text-left font-bold text-xs">
              <div>نموذج رقم (6)</div>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs font-bold mb-1">
            <div>■ بيانات شركة السياحه:</div>
            <div className="border border-black px-4 py-1">
              تاريخ الرحله: <span className="font-mono">{permit.tripDate}</span>
            </div>
          </div>

          <table className="w-full border-collapse border border-black text-center text-xs mb-3 font-semibold">
            <tbody>
              <tr>
                <td className="border border-black p-1.5 w-1/4 bg-slate-50">إسم شركة السياحة :</td>
                <td className="border border-black p-1.5 w-1/4 font-bold">{permit.companyName}</td>
                <td className="border border-black p-1.5 w-1/4 bg-slate-50">رقم الترخيص :</td>
                <td className="border border-black p-1.5 w-1/4 font-mono font-bold">{permit.licenseNumber}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 bg-slate-50 font-bold">عدد السائحين :</td>
                <td className="border border-black p-1.5 font-black font-mono text-base">{permit.paxCount}</td>
                <td className="border border-black p-1.5 bg-slate-50">الجنسية :</td>
                <td className="border border-black p-1.5">صيني</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 bg-slate-50 font-bold">اسم المندوب / المرشد المرافق :</td>
                <td className="border border-black p-1.5 font-black text-sm">{permit.guideName || '—'}</td>
                <td className="border border-black p-1.5 bg-slate-50 font-bold">رقم تليفون المندوب / المرشد :</td>
                <td className="border border-black p-1.5 font-mono font-black text-sm">{permit.guidePhone || '—'}</td>
              </tr>
            </tbody>
          </table>

          <div className="text-xs font-bold mb-1">■ بيانات شركة النقل:</div>
          <table className="w-full border-collapse border border-black text-xs mb-3 font-semibold">
            <tbody>
              <tr>
                <td className="border border-black p-1.5 w-1/4 bg-slate-50 text-center font-bold">إسم شركة النقل :</td>
                <td colSpan={3} className="border border-black p-1.5 font-black text-sm">{permit.transportCompany || '—'}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 bg-slate-50 text-center">نوع السياره:</td>
                <td className="border border-black p-1.5">
                  <div className="flex gap-3 justify-center">
                    <span>{permit.vehicleType === 'أتوبيس' ? '☑' : '☐'} أتوبيس</span>
                    <span>{permit.vehicleType === 'كوستر' ? '☑' : '☐'} كوستر</span>
                    <span>{permit.vehicleType === 'ميكروباص' ? '☑' : '☐'} ميكروباص</span>
                    <span>{permit.vehicleType === 'ليموزين' ? '☑' : '☐'} ليموزين</span>
                  </div>
                </td>
                <td className="border border-black p-1.5 bg-slate-50 text-center font-bold">رقم السياره :</td>
                <td className="border border-black p-1.5 font-mono font-black text-sm text-center">{permit.vehicleNumber || '—'}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 bg-slate-50 text-center font-bold">السائق:</td>
                <td className="border border-black p-1.5 font-black text-sm text-center">{permit.driverName || '—'}</td>
                <td className="border border-black p-1.5 bg-slate-50 text-center font-bold">رقم الهاتف :</td>
                <td className="border border-black p-1.5 font-mono font-black text-sm text-center">{permit.driverPhone || '—'}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 bg-slate-50 text-center">السائق الأحتياطى :</td>
                <td className="border border-black p-1.5 text-center">{permit.backupDriverName || '—'}</td>
                <td className="border border-black p-1.5 bg-slate-50 text-center">رقم الهاتف :</td>
                <td className="border border-black p-1.5 font-mono text-center">{permit.backupDriverPhone || '—'}</td>
              </tr>
            </tbody>
          </table>

          <div className="text-xs font-bold mb-1">■ بيانات الرحلة</div>
          <table className="w-full border-collapse border border-black text-xs mb-2 font-semibold">
            <tbody>
              <tr>
                <td className="border border-black p-1.5 w-1/4 bg-slate-50 text-center font-black text-xs sm:text-sm">نوع الرحله :</td>
                <td className="border border-black p-1.5 w-1/4 text-center font-black text-xl text-black bg-slate-100 py-2">{cleanRouteLabel}</td>
                <td className="border border-black p-1.5 w-1/4 bg-slate-50 text-center font-bold">البرنامج / أماكن الإقامه :</td>
                <td className="border border-black p-1.5 w-1/4 font-black text-sm text-center leading-snug">{permit.programText}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 bg-slate-50 text-center">الإتجاه :</td>
                <td colSpan={3} className="border border-black p-1.5">
                  <div className="flex gap-4 justify-around">
                    <span>{permit.permitType === 'cairo' ? '☑' : '☐'} القاهره</span>
                    <span>☐ الإسكندريه</span>
                    <span>☐ شرم الشيخ</span>
                    <span>{permit.permitType.includes('luxor') ? '☑' : '☐'} الأقصر</span>
                    <span>☐ أسوان</span>
                    {permit.permitType === 'hurghada' && <span>☑ الغردقة</span>}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 bg-slate-50 text-center">منفذ الخروج :</td>
                <td colSpan={3} className="border border-black p-1.5">
                  <div className="flex gap-4 justify-around">
                    <span>{permit.permitType === 'cairo' ? '☑' : '☐'} كمين الجونه</span>
                    <span>{permit.permitType.includes('luxor') ? '☑' : '☐'} كمين سفاجا - قنا</span>
                    <span>☐ كمين مرسى علم - إدفو</span>
                    {branch === 'بالاقصر' && <span>☑ كمين العشى</span>}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 bg-slate-50 text-center">توقيت الخروج من المنفذ :</td>
                <td colSpan={3} className="border border-black p-1.5">
                  <div className="grid grid-cols-2 text-[11px] gap-2">
                    <div className="border-l border-black pl-2">
                      <div>الذهاب: <span className="font-mono">.. : ..</span></div>
                      <div>العوده: <span className="font-mono">.. : ..</span></div>
                      <div className="text-[10px] text-slate-700 font-bold">طريق القاهره مفتوح طوال 24 ساعه</div>
                    </div>
                    <div className="pr-2">
                      <div>الذهاب: <span className="font-mono">.. : ..</span></div>
                      <div>العوده: <span className="font-mono">{permit.permitType.includes('luxor') ? '18:00' : '.. : ..'}</span></div>
                      <div className="text-[10px] text-slate-700 font-bold">طريق (سفاجا-الأقصر ومرسى علم – إدفو) مفتوح من الساعه 6 حتى 18 يوميا"</div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="text-[10px] font-bold text-center border-t border-b border-black py-1 mb-3 leading-normal">
            مع ملاحظة ضرورة الإلتزام بمرور السياره فى الذهاب والعوده من منفذ الخروج فى الميعاد المحدد مسبقا" من قبل الشركه والمدون بإخطارها والمثبت بتصريح المرور
          </div>

          <div className="flex justify-between items-center text-xs font-bold mb-3">
            <div>توقيع مدير الشركه : .............................</div>
            <div className="border-b border-black font-bold px-4 pb-0.5 text-blue-900">
              حسابات الغرفه : ...................................
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="border border-black p-3 text-xs space-y-2">
              <div className="font-bold underline text-center pb-1">مقدم الإخطار</div>
              <div>الإســم : <span className="font-bold">{submitterName}</span></div>
              <div>التوقيع : ...................................................</div>
              <div>رقم البطاقه : <span className="font-mono font-bold">{submitterId}</span></div>
            </div>

            <div className="border border-black p-3 flex flex-col justify-between text-xs">
              <div className="h-16 flex items-center justify-center font-bold text-slate-700">
                خـــــتم الشــــــــركه
              </div>
              <div className="border-t border-black pt-1">
                تحريرا فى : <span className="font-mono">{permit.issueDate}</span>
              </div>
            </div>
          </div>

          {/* Bottom Approvals: Police on Right, Chamber on Left */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* 1. Right (اليمين): اعتماد شرطة السياحة */}
            <div className="border border-black p-2.5 text-center space-y-1">
              <div className="font-bold">الإعتماد الأمنى لإدارة تأمين الأفواج السياحية بالإدارة العامة لشرطة السياحة واآلثار</div>
              <div className="text-[11px] font-bold">بتمام المراجعة الأمنية والقانونية</div>
              <div className="pt-3">التوقيع : .............................................................</div>
              <div className="pt-2 font-bold">الختم:</div>
            </div>

            {/* 2. Left (الشمال): إعتماد فرع غرفة شركات السياحة */}
            <div className="border border-black p-2.5 text-center space-y-1">
              <div className="font-bold text-blue-900">إعتماد فرع غرفة شركات ووكالات السفر والسياحة {branch}</div>
              <div className="text-[11px] font-bold text-blue-900">بتمام المراجعة الإدارية والفنية</div>
              <div className="text-[10px] text-right pt-1">مراجع : .............................................................</div>
              <div className="text-[10px] text-right">مدخل بيانات : ...................................................</div>
              <div className="text-[10px] text-right">رئيس القسم : ...................................................</div>
              <div className="text-[10px] text-center pt-1 font-bold">الختم :</div>
            </div>
          </div>

          <div className="absolute bottom-3 left-0 right-0 text-center text-[10px] text-slate-500 font-mono">
            صفحة 2 من 7 — نموذج رقم (6) فرع غرفة شركات ووكالات السفر والسياحة
          </div>
        </div>


        {/* ========================================================================= */}
        {/* PAGE 3: نموذج رقم (6) - إخطار مدير عام مكتب وزارة السياحة بالبحر الأحمر / بالأقصر */}
        {/* ========================================================================= */}
        <div className={`official-government-paper bg-white text-black p-8 sm:p-10 mx-auto max-w-[794px] min-h-[1123px] border border-black shadow-2xl relative font-sans leading-tight ${viewAllPages || currentPage === 3 ? 'block' : 'hidden print:block'}`} style={{ width: '794px', minHeight: '1123px' }}>
          
          {/* File Number at Top Right White Area */}
          <div className="flex justify-between items-center text-xs font-bold mb-3 pb-1 border-b border-black">
            <div className="text-right">
              رقم الملف : <span className="font-mono font-black text-sm text-blue-950 px-1">{permit.fileNo}</span>
            </div>
            <div className="text-left font-mono text-[11px] text-slate-600">
              تحريراً في: {permit.issueDate}
            </div>
          </div>

          <div className="text-center font-bold pb-2">
            <h2 className="text-xl font-bold tracking-wide border-b-2 border-black inline-block pb-0.5 px-4 mb-2">
              إخطار عن رحله سياحيه إختياريه
            </h2>
          </div>

          <div className="flex justify-between items-start text-xs font-bold mb-2">
            <div>
              <div>السيد الأستاذ / مدير عام مكتب وزارة السياحة {branch}</div>
              <div className="mt-1">نتقدم لسيادتكم بإخطارنا عن تنظيم رحله سياحيه</div>
            </div>
            <div className="text-left font-bold text-xs">
              <div>نموذج رقم (6)</div>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs font-bold mb-1">
            <div>■ بيانات شركة السياحه:</div>
            <div className="border border-black px-4 py-1">
              تاريخ الرحله: <span className="font-mono">{permit.tripDate}</span>
            </div>
          </div>

          <table className="w-full border-collapse border border-black text-center text-xs mb-3 font-semibold">
            <tbody>
              <tr>
                <td className="border border-black p-1.5 w-1/4 bg-slate-50">إسم شركة السياحة :</td>
                <td className="border border-black p-1.5 w-1/4 font-bold">{permit.companyName}</td>
                <td className="border border-black p-1.5 w-1/4 bg-slate-50">رقم الترخيص :</td>
                <td className="border border-black p-1.5 w-1/4 font-mono font-bold">{permit.licenseNumber}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 bg-slate-50 font-bold">عدد السائحين :</td>
                <td className="border border-black p-1.5 font-black font-mono text-base">{permit.paxCount}</td>
                <td className="border border-black p-1.5 bg-slate-50">الجنسية :</td>
                <td className="border border-black p-1.5">صيني</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 bg-slate-50 font-bold">اسم المندوب / المرشد المرافق :</td>
                <td className="border border-black p-1.5 font-black text-sm">{permit.guideName || '—'}</td>
                <td className="border border-black p-1.5 bg-slate-50 font-bold">رقم تليفون المندوب / المرشد :</td>
                <td className="border border-black p-1.5 font-mono font-black text-sm">{permit.guidePhone || '—'}</td>
              </tr>
            </tbody>
          </table>

          <div className="text-xs font-bold mb-1">■ بيانات شركة النقل:</div>
          <table className="w-full border-collapse border border-black text-xs mb-3 font-semibold">
            <tbody>
              <tr>
                <td className="border border-black p-1.5 w-1/4 bg-slate-50 text-center font-bold">إسم شركة النقل :</td>
                <td colSpan={3} className="border border-black p-1.5 font-black text-sm">{permit.transportCompany || '—'}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 bg-slate-50 text-center">نوع السياره:</td>
                <td className="border border-black p-1.5">
                  <div className="flex gap-3 justify-center">
                    <span>{permit.vehicleType === 'أتوبيس' ? '☑' : '☐'} أتوبيس</span>
                    <span>{permit.vehicleType === 'كوستر' ? '☑' : '☐'} كوستر</span>
                    <span>{permit.vehicleType === 'ميكروباص' ? '☑' : '☐'} ميكروباص</span>
                    <span>{permit.vehicleType === 'ليموزين' ? '☑' : '☐'} ليموزين</span>
                  </div>
                </td>
                <td className="border border-black p-1.5 bg-slate-50 text-center font-bold">رقم السياره :</td>
                <td className="border border-black p-1.5 font-mono font-black text-sm text-center">{permit.vehicleNumber || '—'}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 bg-slate-50 text-center font-bold">السائق الأساسى :</td>
                <td className="border border-black p-1.5 font-black text-sm text-center">{permit.driverName || '—'}</td>
                <td className="border border-black p-1.5 bg-slate-50 text-center font-bold">رقم الهاتف :</td>
                <td className="border border-black p-1.5 font-mono font-black text-sm text-center">{permit.driverPhone || '—'}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 bg-slate-50 text-center">السائق الأحتياطى :</td>
                <td className="border border-black p-1.5 text-center">{permit.backupDriverName || '—'}</td>
                <td className="border border-black p-1.5 bg-slate-50 text-center">رقم الهاتف :</td>
                <td className="border border-black p-1.5 font-mono text-center">{permit.backupDriverPhone || '—'}</td>
              </tr>
            </tbody>
          </table>

          <div className="text-xs font-bold mb-1">■ بيانات الرحلة</div>
          <table className="w-full border-collapse border border-black text-xs mb-2 font-semibold">
            <tbody>
              <tr>
                <td className="border border-black p-1.5 w-1/4 bg-slate-50 text-center font-black text-xs sm:text-sm">نوع الرحله :</td>
                <td className="border border-black p-1.5 w-1/4 text-center font-black text-xl text-black bg-slate-100 py-2">{cleanRouteLabel}</td>
                <td className="border border-black p-1.5 w-1/4 bg-slate-50 text-center font-bold">البرنامج / أماكن الإقامه :</td>
                <td className="border border-black p-1.5 w-1/4 font-black text-sm text-center leading-snug">{permit.programText}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 bg-slate-50 text-center">الإتجاه :</td>
                <td colSpan={3} className="border border-black p-1.5">
                  <div className="flex gap-4 justify-around">
                    <span>{permit.permitType === 'cairo' ? '☑' : '☐'} القاهره</span>
                    <span>☐ الإسكندريه</span>
                    <span>☐ شرم الشيخ</span>
                    <span>{permit.permitType.includes('luxor') ? '☑' : '☐'} الأقصر</span>
                    <span>☐ أسوان</span>
                    {permit.permitType === 'hurghada' && <span>☑ الغردقة</span>}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 bg-slate-50 text-center">منفذ الخروج :</td>
                <td colSpan={3} className="border border-black p-1.5">
                  <div className="flex gap-4 justify-around">
                    <span>{permit.permitType === 'cairo' ? '☑' : '☐'} كمين الجونه</span>
                    <span>{permit.permitType.includes('luxor') ? '☑' : '☐'} كمين سفاجا - قنا</span>
                    <span>☐ كمين مرسى علم - إدفو</span>
                    {branch === 'بالاقصر' && <span>☑ كمين العشى</span>}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 bg-slate-50 text-center">توقيت الخروج من المنفذ :</td>
                <td colSpan={3} className="border border-black p-1.5">
                  <div className="grid grid-cols-2 text-[11px] gap-2">
                    <div className="border-l border-black pl-2">
                      <div>الذهاب: <span className="font-mono">.. : ..</span></div>
                      <div>العوده: <span className="font-mono">.. : ..</span></div>
                      <div className="text-[10px] text-slate-700 font-bold">طريق القاهره مفتوح طوال 24 ساعه</div>
                    </div>
                    <div className="pr-2">
                      <div>الذهاب: <span className="font-mono">.. : ..</span></div>
                      <div>العوده: <span className="font-mono">{permit.permitType.includes('luxor') ? '18:00' : '.. : ..'}</span></div>
                      <div className="text-[10px] text-slate-700 font-bold">طريق (سفاجا-الأقصر ومرسى علم – إدفو) مفتوح من الساعه 6 حتى 18 يوميا"</div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="text-[10px] font-bold text-center border-t border-b border-black py-1 mb-2 leading-normal">
            مع ملاحظة ضرورة الإلتزام بمرور السياره فى الذهاب والعوده من منفذ الخروج فى الميعاد المحدد مسبقا" من قبل الشركه والمدون بإخطارها والمثبت بتصريح المرور
          </div>

          <div className="flex justify-between items-center text-xs font-bold mb-2">
            <div>توقيع مدير الشركه : .............................</div>
            <div className="border-b border-black font-bold px-4 pb-0.5 text-blue-900">
              رقم التصريح : ...................................
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="border border-black p-2.5 text-xs space-y-1.5">
              <div className="font-bold underline text-center pb-0.5">مقدم الإخطار</div>
              <div>الإســم : <span className="font-bold">{submitterName}</span></div>
              <div>التوقيع : ...................................................</div>
              <div>رقم البطاقه : <span className="font-mono font-bold">{submitterId}</span></div>
            </div>

            <div className="border border-black p-2.5 flex flex-col justify-between text-xs">
              <div className="h-14 flex items-center justify-center font-bold text-slate-700">
                خـــــتم الشــــــــركه
              </div>
              <div className="border-t border-black pt-1">
                تحريرا فى : <span className="font-mono">{permit.issueDate}</span>
              </div>
            </div>
          </div>

          {/* Bottom Approvals: Police on Right, Chamber in Center, Ministry on Left */}
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            {/* 1. Right (اليمين دايماً): اعتماد شرطة تأمين الأفواج السياحية */}
            <div className="border border-black p-2 text-center space-y-1">
              <div className="font-bold text-blue-900 leading-tight">الإعتماد الأمنى لإدارة تأمين الأفواج السياحية بالشرطة</div>
              <div className="font-bold text-blue-900">بتمام المراجعة الأمنية</div>
              <div className="pt-2">التوقيع : ...............................</div>
              <div className="pt-1 font-bold">الختم:</div>
            </div>

            {/* 2. Center (الوسط): إعتماد فرع غرفة شركات السياحة */}
            <div className="border border-black p-2 text-center space-y-0.5">
              <div className="font-bold text-blue-900 leading-tight">إعتماد فرع غرفة شركات ووكالات السفر والسياحة {branch}</div>
              <div className="font-bold text-blue-900">بتمام المراجعة الإدارية والفنية</div>
              <div className="text-[9px] text-right pt-0.5">مراجع : ......................</div>
              <div className="text-[9px] text-right">مدخل بيانات : ......................</div>
              <div className="text-[9px] text-right">رئيس القسم : ......................</div>
              <div className="font-bold text-[9px]">الختم:</div>
            </div>

            {/* 3. Left (الشمال): الإعتماد النهائي لمكتب وزارة السياحة */}
            <div className="border border-black p-2 text-center space-y-1">
              <div className="font-bold text-blue-900 leading-tight">الإعتماد النهائى لمكتب وزارة السياحة {branch}</div>
              <div className="font-bold text-blue-900">بتمام المراجعة النهائية</div>
              <div className="pt-2">التوقيع : ...............................</div>
              <div className="pt-1 font-bold">الختم :</div>
            </div>
          </div>

          <div className="absolute bottom-3 left-0 right-0 text-center text-[10px] text-slate-500 font-mono">
            صفحة 3 من 7 — نموذج رقم (6) مكتب وزارة السياحة والآثار
          </div>
        </div>


        {/* ========================================================================= */}
        {/* CONDITIONAL PAGES 4, 5, 6, 7 ACCORDING TO ROUTE PATHWAY */}
        {/* ========================================================================= */}
        
        {/* PATHWAY A: المسار المشترك للشركتين (القاهرة / توصيلة الأقصر / مبيت الأقصر) */}
        {/* 3 إخطارات + 3 نسخ نيم ليست موزعة + استمارة إدارة البرامج = 7 ورقات */}
        {!isHurghadaRoute && (
          <>
            {/* PAGE 4 (Shared Route): نيم ليست - نسخة 1: إدارة تأمين الأفواج السياحية */}
            {renderRoomingListPage({
              pageNumber: 4,
              copyTitle: 'نسخة إدارة تأمين الأفواج السياحية بشرطة السياحة والآثار',
              copySubtitle: '■ صورة رسمية طبق الأصل معتمدة وموجهة لشرطة تأمين الأفواج السياحية لمطابقة جوازات الفوج عند الأكمنة والمنافذ',
              authorityBadge: 'كشف الروم ليست — نسخة إدارة تأمين الأفواج بالشرطة',
              footerSignatures: (
                <div className="flex justify-between items-center text-xs font-bold pt-3 border-t border-black">
                  <div className="space-y-1">
                    <div>توقيع المرشد المرافق : .............................</div>
                    <div className="text-[11px] text-slate-800 font-bold">هاتف: <span className="font-mono font-black text-xs">{permit.guidePhone}</span></div>
                  </div>
                  <div className="border border-black px-6 py-3 text-center">
                    <div>خــــتم الشــــركة</div>
                    <div className="text-[10px] text-slate-500 font-normal">معتمد بالدفتر</div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-blue-900">إعتماد شرطة تأمين الأفواج السياحية</div>
                    <div className="text-[10px]">التوقيع: .............................</div>
                  </div>
                </div>
              )
            })}

            {/* PAGE 5 (Shared Route): نيم ليست - نسخة 2: غرفة شركات ووكالات السفر والسياحة */}
            {renderRoomingListPage({
              pageNumber: 5,
              copyTitle: 'نسخة فرع غرفة شركات ووكالات السفر والسياحة',
              copySubtitle: `■ صورة رسمية معتمدة وموجهة لفرع غرفة شركات ووكالات السفر والسياحة ${branch} للمراجعة الإدارية والرسوم المقررة`,
              authorityBadge: 'كشف الروم ليست — نسخة فرع غرفة شركات السياحة',
              footerSignatures: (
                <div className="flex justify-between items-center text-xs font-bold pt-3 border-t border-black">
                  <div className="space-y-1">
                    <div>مندوب الشركة المعتمد : .............................</div>
                    <div className="text-[11px] text-slate-600">رقم البطاقة: <span className="font-mono">{submitterId}</span></div>
                  </div>
                  <div className="border border-black px-6 py-3 text-center">
                    <div>خــــتم الشــــركة</div>
                    <div className="text-[10px] text-slate-500 font-normal">تحريراً: {permit.issueDate}</div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-blue-900">مراجعة حسابات وقسم الرقابة بالغرفة</div>
                    <div className="text-[10px]">مراجع: ......................  ختم الغرفة:</div>
                  </div>
                </div>
              )
            })}

            {/* PAGE 6 (Shared Route): نيم ليست - نسخة 3: مكتب وزارة السياحة والآثار */}
            {renderRoomingListPage({
              pageNumber: 6,
              copyTitle: 'نسخة مكتب وزارة السياحة والآثار',
              copySubtitle: `■ صورة رسمية معتمدة وموجهة لمدير عام مكتب وزارة السياحة والآثار ${branch} للتفتيش والرقابة الفنية`,
              authorityBadge: 'كشف الروم ليست — نسخة مكتب وزارة السياحة والآثار',
              footerSignatures: (
                <div className="flex justify-between items-center text-xs font-bold pt-3 border-t border-black">
                  <div className="space-y-1">
                    <div>مدير عام الشركة المسؤول : .............................</div>
                    <div className="text-[11px] text-slate-600">{permit.companyName}</div>
                  </div>
                  <div className="border border-black px-6 py-3 text-center">
                    <div>خــــتم الشــــركة</div>
                    <div className="text-[10px] text-slate-500 font-normal">ترخيص رقم: {permit.licenseNumber}</div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-blue-900">الإعتماد الرقابي لمكتب وزارة السياحة</div>
                    <div className="text-[10px]">مفتش الوزارة: ...................... الختم:</div>
                  </div>
                </div>
              )
            })}

            {/* PAGE 7 (Shared Route): استمارة إدارة البرامج السياحية والتشغيل */}
            <div className={`official-government-paper bg-white text-black p-8 sm:p-10 mx-auto max-w-[794px] min-h-[1123px] border border-black shadow-2xl relative font-sans leading-tight ${viewAllPages || currentPage === 7 ? 'block' : 'hidden print:block'}`} style={{ width: '794px', minHeight: '1123px' }}>
              <div className="text-center font-bold pb-2 border-b-2 border-black mb-4">
                <h2 className="text-xl font-bold tracking-wide">
                  استمارة إدارة البرامج السياحية والتشغيل
                </h2>
                <div className="text-xs text-slate-700 mt-1">TOURIST PROGRAM OPERATION & DISPATCH SHEET</div>
              </div>

              <div className="border border-black p-4 text-xs space-y-3 mb-4">
                <div className="flex justify-between border-b border-black pb-2 font-bold">
                  <div>الشركة: {permit.companyName} (ترخيص {permit.licenseNumber})</div>
                  <div>الملف: <span className="font-mono">{permit.fileNo}</span></div>
                  <div>تاريخ التحرك: {permit.tripDate}</div>
                </div>

                <div>
                  <strong className="block mb-1 text-sm font-black">البرنامج المعتمد والمزارات:</strong>
                  <div className="p-3 bg-slate-50 border border-black rounded text-sm font-black leading-relaxed">
                    {permit.programText}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>فندق الانطلاق: <strong className="font-bold">{permit.hotelFrom || 'فندق الإقامة المحدد بالبرنامج'}</strong></div>
                  <div>فندق الوصول: <strong className="font-bold">{permit.hotelTo || 'المقصد السياحي'}</strong></div>
                </div>
              </div>

              {/* Program Image Slot */}
              <div className="border border-black p-4 text-center min-h-[460px] flex flex-col justify-center items-center">
                {permit.programImageData ? (
                  <img src={permit.programImageData} alt="صورة إدارة البرامج" className="max-h-[440px] w-auto object-contain mx-auto border border-slate-300 shadow-sm" />
                ) : (
                  <div className="text-slate-500 space-y-3 max-w-md mx-auto">
                    <div className="text-base font-bold text-slate-800">صورة برنامج الرحلة وختم البرامج المعتمد</div>
                    <p className="text-xs leading-relaxed text-slate-600">
                      يتم تضمين ختم واعتماد إدارة البرامج للرحلات المنظمة إلى ({permit.permitLabel}) مع الالتزام بكافة المزارات المقررة وفنادق الإقامة المعتمدة بوزارة السياحة.
                    </p>
                    <div className="p-2 border border-dashed border-slate-400 text-xs font-mono">
                      REF-PROG-DISPATCH: {permit.fileNo}-OPR
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center text-xs font-bold pt-6 border-t border-black mt-6">
                <div>إدارة البرامج والعمليات</div>
                <div className="border border-black px-6 py-4">ختم الشركة</div>
                <div>المدير المسؤول</div>
              </div>

              <div className="absolute bottom-3 left-0 right-0 text-center text-[10px] text-slate-500 font-mono">
                صفحة 7 من 7 — استمارة إدارة البرامج والتشغيل
              </div>
            </div>
          </>
        )}


        {/* PATHWAY B: مسار توصيلة الغردقة من الأقصر (Hurghada Transfer Pathway) */}
        {/* 3 إخطارات + نسخة نيم ليست (4) + إدارة البرامج (5) + إخطار شرطة الأقصر (6) + الورقة الإضافية (7) = 7 ورقات */}
        {isHurghadaRoute && (
          <>
            {/* PAGE 4 (Hurghada Route): كشف النيم ليست والروم ليست المعتمد للأفواج (نسخة معتمدة) */}
            {renderRoomingListPage({
              pageNumber: 4,
              copyTitle: 'كشف الروم ليست والنيم ليست المعتمد للأفواج السياحية (مسار الغردقة من الأقصر)',
              copySubtitle: '■ كشف ركاب الفوج السياحي الصيني المعتمد لتوصيلة الغردقة لمطابقة الأكمنة الأمنية وتفتيش المنافذ',
              authorityBadge: 'كشف الروم ليست والنيم ليست المعتمد للأفواج',
              footerSignatures: (
                <div className="flex justify-between items-center text-xs font-bold pt-4 border-t border-black">
                  <div>توقيع المرشد المرافق : .............................</div>
                  <div className="border border-black px-6 py-4">ختم الشركة المعتمد</div>
                  <div>مدير العمليات : .............................</div>
                </div>
              )
            })}

            {/* PAGE 5 (Hurghada Route): استمارة إدارة البرامج السياحية والتشغيل */}
            <div className={`official-government-paper bg-white text-black p-8 sm:p-10 mx-auto max-w-[794px] min-h-[1123px] border border-black shadow-2xl relative font-sans leading-tight ${viewAllPages || currentPage === 5 ? 'block' : 'hidden print:block'}`} style={{ width: '794px', minHeight: '1123px' }}>
              <div className="text-center font-bold pb-2 border-b-2 border-black mb-4">
                <h2 className="text-xl font-bold tracking-wide">
                  استمارة إدارة البرامج السياحية والتشغيل
                </h2>
                <div className="text-xs text-slate-700 mt-1">TOURIST PROGRAM OPERATION & DISPATCH SHEET</div>
              </div>

              <div className="border border-black p-4 text-xs space-y-3 mb-4">
                <div className="flex justify-between border-b border-black pb-2 font-bold">
                  <div>الشركة: {permit.companyName} (ترخيص {permit.licenseNumber})</div>
                  <div>الملف: <span className="font-mono">{permit.fileNo}</span></div>
                  <div>تاريخ التحرك: {permit.tripDate}</div>
                </div>

                <div>
                  <strong className="block mb-1 text-sm font-black">البرنامج المعتمد والمزارات:</strong>
                  <div className="p-3 bg-slate-50 border border-black rounded text-sm font-black leading-relaxed">
                    {permit.programText}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>فندق الانطلاق: <strong className="font-bold">{permit.hotelFrom || 'مرسى الأقصر'}</strong></div>
                  <div>فندق الوصول: <strong className="font-bold">{permit.hotelTo || 'منتجع الغردقة'}</strong></div>
                </div>
              </div>

              <div className="border border-black p-4 text-center min-h-[460px] flex flex-col justify-center items-center">
                {permit.programImageData ? (
                  <img src={permit.programImageData} alt="صورة إدارة البرامج" className="max-h-[440px] w-auto object-contain mx-auto border border-slate-300 shadow-sm" />
                ) : (
                  <div className="text-slate-500 space-y-3 max-w-md mx-auto">
                    <div className="text-base font-bold text-slate-800">صورة إدارة البرامج المعتمدة لمسار الغردقة</div>
                    <p className="text-xs leading-relaxed text-slate-600">
                      يتم إدراج صورة ختم البرامج المعتمد هنا للرحلة المنطلقة من الأقصر إلى الغردقة عبر مسار دندرة 85.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center text-xs font-bold pt-6 border-t border-black mt-6">
                <div>إدارة البرامج والعمليات</div>
                <div className="border border-black px-6 py-4">ختم الشركة</div>
                <div>المدير المسؤول</div>
              </div>

              <div className="absolute bottom-3 left-0 right-0 text-center text-[10px] text-slate-500 font-mono">
                صفحة 5 من 7 — استمارة إدارة البرامج السياحية والتشغيل
              </div>
            </div>

            {/* PAGE 6 (Hurghada Route): إخطار السيد اللواء مدير تأمين الأفواج السياحية بالأقصر */}
            <div className={`official-government-paper bg-white text-black p-8 sm:p-12 mx-auto max-w-[794px] min-h-[1123px] border border-black shadow-2xl relative font-sans leading-relaxed ${viewAllPages || currentPage === 6 ? 'block' : 'hidden print:block'}`} style={{ width: '794px', minHeight: '1123px' }}>
              
              {/* File Number Top Right White Zone */}
              <div className="flex justify-between items-center text-xs font-bold mb-4 pb-1 border-b border-black">
                <div className="text-right">
                  رقم الملف : <span className="font-mono font-black text-sm text-blue-950 px-1">{permit.fileNo}</span>
                </div>
                <div className="text-left font-mono text-[11px] text-slate-600">
                  تحريراً في: {permit.issueDate}
                </div>
              </div>

              <div className="text-center font-bold pb-6">
                <h3 className="text-lg font-bold">السيد اللواء / مدير تأمين الأفواج السياحية</h3>
                <div className="mt-4 font-bold text-sm">تحيه طيبه وبعد</div>
                <div className="mt-4 font-bold text-sm leading-loose">
                  نخطر سيادتكم علما نحن شركة <span className="font-black underline text-base px-1">{permit.companyName}</span> ترخيص رقم <span className="font-mono font-bold text-base px-1">{permit.licenseNumber}</span>
                  <br />
                  عن قيام رحلة سياحية من الاقصر
                </div>
              </div>

              {/* Table: بيانات السائق والبرنامج والجنسية */}
              <table className="w-full border-collapse border border-black text-right text-xs mb-8 font-semibold">
                <thead>
                  <tr className="bg-slate-50 text-center font-bold">
                    <th className="border border-black p-2.5 w-1/3">بيانات السائق</th>
                    <th className="border border-black p-2.5 w-1/3">البرنامج</th>
                    <th className="border border-black p-2.5 w-1/3">الجنسية</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black p-4 space-y-2 align-top">
                      <div>الأسم / <strong className="font-black text-sm">{permit.driverName || '—'}</strong></div>
                      <div>رقم الهاتف : <span className="font-mono font-black text-sm">{permit.driverPhone || '—'}</span></div>
                      <div className="pt-3 border-t border-slate-300">شركة النقل : <strong className="font-black text-sm">{permit.transportCompany || '—'}</strong></div>
                      <div>سيارة رقم : <span className="font-mono font-black text-sm">{permit.vehicleNumber || '—'}</span></div>
                      <div>نوع السيارة : <strong className="font-bold">{permit.vehicleType || '—'}</strong></div>
                    </td>

                    <td className="border border-black p-4 align-top text-center font-black text-sm leading-relaxed">
                      {permit.programText}
                      <div className="mt-3 text-[11px] text-slate-600 font-normal">فندق: {permit.hotelTo || 'مرسى الأقصر / منتجع الغردقة'}</div>
                    </td>

                    <td className="border border-black p-4 align-top text-center font-bold space-y-3">
                      <div className="text-sm font-bold">صيني</div>
                      <div>العدد : <span className="font-mono text-xl font-black">{permit.paxCount}</span></div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="text-center font-bold text-xs py-4">
                ولسيادتكم خالص جزيل الشكر .
              </div>

              <div className="flex justify-between items-center text-xs font-bold pt-12">
                <div className="text-center">
                  <div>ختم الشركة</div>
                  <div className="border border-black w-24 h-24 mx-auto mt-2 flex items-center justify-center text-slate-400">
                    ختم
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <div>المدير / المسئول</div>
                  <div className="pt-8">تحريرا في يوم : <span className="font-mono">{permit.issueDate}</span></div>
                </div>
              </div>

              <div className="absolute bottom-3 left-0 right-0 text-center text-[10px] text-slate-500 font-mono">
                صفحة 6 من 7 — إخطار السيد اللواء مدير تأمين الأفواج السياحية بالأقصر
              </div>
            </div>

            {/* PAGE 7 (Hurghada Route): الورقة الإضافية الملحقة (أمر الشغل وتصريح الطرق السريعة) */}
            <div className={`official-government-paper bg-white text-black p-8 sm:p-10 mx-auto max-w-[794px] min-h-[1123px] border border-black shadow-2xl relative font-sans leading-tight ${viewAllPages || currentPage === 7 ? 'block' : 'hidden print:block'}`} style={{ width: '794px', minHeight: '1123px' }}>
              <div className="text-center font-bold pb-2 border-b-2 border-black mb-4">
                <h2 className="text-xl font-bold tracking-wide">
                  أمر شغل وتصريح الطرق السريعة الملحق (الورقة الإضافية)
                </h2>
                <div className="text-xs text-slate-700 mt-1">TOURIST TRANSPORT EXTRA PERMIT & ROAD VOUCHER</div>
              </div>

              <div className="border border-black p-4 text-xs space-y-3 mb-4">
                <div className="flex justify-between font-bold border-b border-black pb-2">
                  <div>الشركة: {permit.companyName} (ترخيص {permit.licenseNumber})</div>
                  <div>رقم الملف: <span className="font-mono">{permit.fileNo}</span></div>
                  <div>التاريخ: {permit.tripDate}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>رقم الحافلة: <strong className="font-mono font-black text-base">{permit.vehicleNumber || 'سياحة'}</strong></div>
                  <div>السائق المستلم: <strong className="font-black text-sm">{permit.driverName || 'معتمد'}</strong></div>
                  <div>شركة النقل: <strong className="font-black text-sm">{permit.transportCompany || permit.companyName}</strong></div>
                  <div>إجمالي الركاب: <strong className="font-black text-base">{permit.paxCount} راكب</strong></div>
                </div>
              </div>

              {/* Extra page image or formal voucher */}
              <div className="border border-black p-4 text-center min-h-[440px] flex flex-col justify-center items-center">
                {permit.extraPageData ? (
                  <img src={permit.extraPageData} alt="الورقة الإضافية الملحقة" className="max-h-[420px] w-auto object-contain mx-auto border border-slate-300 shadow-sm" />
                ) : (
                  <div className="text-slate-700 space-y-4 max-w-lg mx-auto">
                    <div className="text-base font-bold text-slate-900 border-b border-black pb-2">
                      تصريح مرور خط السير لمسار الغردقة والأكمنة الإقليمية (كمين 85 والعشى)
                    </div>
                    <p className="text-xs leading-relaxed font-semibold text-slate-800">
                      يُصرح للحافلة المبينة أعلاه بالتحرك وفق البرنامج المعتمد الصادر بإخطار وزارة السياحة وشرطة السياحة والآثار، مع الالتزام التام بتعليمات ضباط أكمنة الطرق (الزعفرانة، كمين 85، كمين العشى، ونقاط التفتيش).
                    </p>
                    <div className="p-3 bg-slate-100 border border-black text-xs font-mono font-bold">
                      REF-ROAD-PERMIT: {permit.fileNo}-HURGHADA-EXTRA
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center text-xs font-bold pt-6 border-t border-black mt-6">
                <div>سائق الحافلة المستلم</div>
                <div className="border border-black px-6 py-4">ختم الشركة</div>
                <div>مدير تشغيل النقل السياحي</div>
              </div>

              <div className="absolute bottom-3 left-0 right-0 text-center text-[10px] text-slate-500 font-mono">
                صفحة 7 من 7 — الورقة الإضافية الملحقة (أمر الشغل وتصريح الطرق)
              </div>
            </div>
          </>
        )}

      </div>

      {/* Persistent Bottom Action Bar for Quick Print & PDF Download (no-print) */}
      <div className="sticky bottom-4 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3 shadow-2xl flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-bold text-white">
            ملف التصريح الموحد جاهز: 7 صفحات رسمية معتمدة
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline font-mono">
            ({permit.fileNo})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewAllPages(!viewAllPages)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
          >
            {viewAllPages ? 'عرض صفحة بصفحة' : 'معاينة الكل متتالي (7 ورقات)'}
          </button>
          <button
            onClick={handleDownloadUnifiedPdf}
            disabled={isGeneratingPdf}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isGeneratingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>{isGeneratingPdf ? 'جاري بناء الـ PDF...' : 'تنزيل PDF النهائي (7 ورقات)'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
