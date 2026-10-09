import React from 'react';
import { X, Printer, Download, CheckCircle, ShieldAlert, Award, FileText, ExternalLink } from 'lucide-react';
import { EXPERT_PANEL, PROJECT_DETAILS } from '../data/projectData';

interface AuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-fadeIn">
        {/* Modal Top Bar */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-extrabold text-white text-sm">التقرير الاستشاري الرسمي المعتمد للمشروع</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة / حفظ كـ PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div id="printableReport" className="p-6 md:p-10 overflow-y-auto space-y-8 bg-slate-950 text-slate-100 font-sans">
          {/* Document Letterhead */}
          <div className="border-b-2 border-amber-500 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                وثيقة تدقيق واستشارة تقنية وتشغيلية
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
                تقرير فحص وتقييم: مولّد تصاريح النقل السياحي
              </h1>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                المشروع الميداني: {PROJECT_DETAILS.url}
              </p>
            </div>

            <div className="sm:text-left text-xs text-slate-400 space-y-1">
              <div><strong className="text-slate-200">صاحب المشروع:</strong> {PROJECT_DETAILS.author}</div>
              <div><strong className="text-slate-200">تاريخ الفحص:</strong> 5 أكتوبر 2026</div>
              <div><strong className="text-slate-200">النتيجة الإجمالية:</strong> <span className="text-emerald-400 font-bold">72 / 100 (ناجح مع توصيات عاجلة)</span></div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>1. الخلاصة التنفيذية (Executive Summary)</span>
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              يمثل مشروع وليد السنبسي نموذجاً استثنائياً للحلول التقنية الميدانية الدقيقة. يحل النظام مشكلة بيروقراطية ولوجستية يومية لشركات السياحة المصرية فئة (أ) عبر أتمتة إصدار ملف الـ PDF الموحد من 7 صفحات المعتمد لدى وزارة السياحة وشرطة السياحة والآثار، وقراءة كشوفات الركاب الأجانب من ملفات Excel.
              على الرغم من النضج التشغيلي الممتاز (88%)، فإن المعمارية التقنية الحالية (بايثون إني وير بدون قاعدة بيانات سحابية وبدون نظام مصادقة وحماية لبيانات الجوازات) تمثل خطراً تشغيلياً وأمنياً يتطلب المعالجة الفورية قبل التوسع التجاري.
            </p>
          </div>

          {/* Expert Board Scorecards */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>2. تقييم مجلس الخبراء المستقل</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EXPERT_PANEL.map((expert) => (
                <div key={expert.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{expert.name}</span>
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {expert.score} / 100
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">{expert.title}</div>
                  <div className="text-xs text-amber-300/90 font-semibold">حكم الخبير: {expert.verdict}</div>
                  <p className="text-[11px] text-slate-300 line-clamp-2 italic">
                    "{expert.detailedReview.slice(0, 140)}..."
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Urgent Action Plan */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>3. الإجراءات التصحيحية الإلزامية (Top Priorities)</span>
            </h3>

            <div className="space-y-2 text-xs md:text-sm">
              <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-900/50 flex items-start gap-2.5">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px] shrink-0 mt-0.5">عاجل 1</span>
                <div>
                  <strong className="text-white block">حماية بيانات الجوازات ووضع جدار مصادقة (Auth Gate):</strong>
                  <span className="text-slate-300 text-xs">إلزام المستخدمين بتسجيل الدخول لمنع الوصول العام غير المرخص لأرقام جوازات وتواريخ ميلاد السياح الأجانب بما يتوافق مع القانون 151.</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-900/50 flex items-start gap-2.5">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] shrink-0 mt-0.5">عاجل 2</span>
                <div>
                  <strong className="text-white block">نقل معالجة الـ PDF لـ Background Worker:</strong>
                  <span className="text-slate-300 text-xs">استخدام Celery أو Cloud Run لتوليد الـ PDF لمنع انقطاع الاتصال (504 Timeout) عند معالجة كشوفات الركاب الكبيرة على بايثون إني وير.</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-900/50 flex items-start gap-2.5">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] shrink-0 mt-0.5">عاجل 3</span>
                <div>
                  <strong className="text-white block">تحويل المشروع إلى منصة اشتراكات SaaS شهرية:</strong>
                  <span className="text-slate-300 text-xs">طرح اشتراكات تجارية لشركات السياحة فئة (أ) بقيمة تبدأ من 1500 ج.م شهرياً مع إضافة ميزة إرسال التصاريح للواتساب والـ QR Code.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Signatures & Certification */}
          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              <span>صدر هذا التقرير عبر منصة التدقيق الهندسي للأنظمة السياحية الذكية</span>
            </div>
            <div className="flex items-center gap-2 text-amber-400 font-mono">
              <span>REF: EGY-MOT-TASARE7-2026-967</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
