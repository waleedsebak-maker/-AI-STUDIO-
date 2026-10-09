import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  FileCheck, 
  Database, 
  Server, 
  Lock, 
  FileSpreadsheet, 
  Sparkles, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Cpu,
  ShieldAlert,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { PROJECT_DETAILS } from '../data/projectData';

export const ProjectOverview: React.FC<{ onConsultExpert: (expertId?: string) => void }> = ({ onConsultExpert }) => {
  const [activePagePreview, setActivePagePreview] = useState<number>(1);
  const [showCodeDetails, setShowCodeDetails] = useState<boolean>(false);
  const [pathwayView, setPathwayView] = useState<'shared' | 'hurghada'>('shared');

  const currentStructure = pathwayView === 'shared' 
    ? (PROJECT_DETAILS as any).sharedRoutesSevenPagesStructure || PROJECT_DETAILS.pdfSevenPagesStructure
    : (PROJECT_DETAILS as any).hurghadaRouteSevenPagesStructure || PROJECT_DETAILS.pdfSevenPagesStructure;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Executive Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>فحص ودراسة المشروع الميداني</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
              مشروع: مولّد تصاريح النقل السياحي (7 صفحات رسمية)
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              قمنا بإجراء فحص هندسي وميداني كامل للنظام المنشور على الرابط{' '}
              <a 
                href={PROJECT_DETAILS.url} 
                target="_blank" 
                rel="noreferrer" 
                className="text-amber-400 underline font-mono dir-ltr inline-flex items-center gap-1 hover:text-amber-300"
              >
                waleedalsenbesy.pythonanywhere.com
                <ExternalLink className="w-3 h-3" />
              </a>
              . صمم النظام لحل واحدة من أعقد العقبات البيروقراطية في قطاع السياحة المصري: <strong className="text-amber-300">أتمتة استخراج ملف PDF الموحد المكون من 7 صفحات</strong> لشركات السياحة المصرية فئة (أ) المعتمدة لدى وزارة السياحة وشرطة السياحة والآثار.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={() => onConsultExpert('general')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>استشر مجلس الخبراء الآن</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={PROJECT_DETAILS.url}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <span>زيارة الموقع المباشر</span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/50 rounded-xl p-3.5 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">الوقت الموفر لكل تصريح</div>
            <div className="text-xl md:text-2xl font-black text-emerald-400 mt-1">~65 دقيقة</div>
            <div className="text-[11px] text-slate-500 mt-0.5">مقارنة بالتنسيق اليدوي والطباعة</div>
          </div>
          <div className="bg-slate-950/50 rounded-xl p-3.5 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">حجم الحزمة الناتجة</div>
            <div className="text-xl md:text-2xl font-black text-amber-400 mt-1">7 صفحات PDF</div>
            <div className="text-[11px] text-slate-500 mt-0.5">3 إخطارات + روم ليست + ملحقات</div>
          </div>
          <div className="bg-slate-950/50 rounded-xl p-3.5 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">الاستضافة والبيئة</div>
            <div className="text-xl md:text-2xl font-black text-sky-400 mt-1">PythonAnywhere</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Python WSGI Flask Server</div>
          </div>
          <div className="bg-slate-950/50 rounded-xl p-3.5 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">التقييم العام المبدئي</div>
            <div className="text-xl md:text-2xl font-black text-indigo-400 mt-1">72 / 100</div>
            <div className="text-[11px] text-slate-500 mt-0.5">جاهز تشغيلياً / يحتاج حماية سحابية</div>
          </div>
        </div>
      </div>

      {/* The 7-Pages Dossier Visualizer */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <FileCheck className="w-4 h-4" />
              <span>هيكل المخرجات الرسمية</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              المستندات السبعة المجمعة في ملف الـ PDF النهائي
            </h3>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              هذا الترتيب إلزامي لمرور الحافلات السياحية عبر أكمنة الطرق الرئيسية (الزعفرانة، كمين 85، الأقصر، الغردقة).
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => { setPathwayView('shared'); setActivePagePreview(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                pathwayView === 'shared'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              المسارات المشتركة (3 إخطارات + 3 نيم ليست + برامج)
            </button>
            <button
              onClick={() => { setPathwayView('hurghada'); setActivePagePreview(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                pathwayView === 'hurghada'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              مسار الغردقة (+ شرطة الأقصر + ورقة إضافية)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {currentStructure.map((doc: any) => {
            const isSelected = activePagePreview === doc.page;
            return (
              <div
                key={doc.page}
                onClick={() => setActivePagePreview(doc.page)}
                className={`cursor-pointer rounded-xl p-4 transition-all border ${
                  isSelected
                    ? pathwayView === 'hurghada' 
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-md shadow-amber-500/5' 
                      : 'bg-emerald-500/10 border-emerald-500/40 shadow-md shadow-emerald-500/5'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black ${
                    isSelected 
                      ? pathwayView === 'hurghada' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950' 
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {doc.page}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium truncate max-w-[130px]">{doc.authority}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-100 line-clamp-1">{doc.title}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">{doc.type || doc.authority}</p>
              </div>
            );
          })}
        </div>

        {/* Selected Page Deep Explanation */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs md:text-sm">
          <div className="flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full ${pathwayView === 'hurghada' ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
            <span className="text-slate-300">
              الصفحة {activePagePreview}:{' '}
              <strong className="text-white">
                {currentStructure.find((p: any) => p.page === activePagePreview)?.title}
              </strong>
            </span>
          </div>
          <span className="text-amber-400 font-semibold">
            الجهة الرقابية المعنية: {currentStructure.find((p: any) => p.page === activePagePreview)?.authority}
          </span>
        </div>
      </div>

      {/* Architecture Flow & Engineering Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technical Architecture Overview */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider mb-2">
              <Server className="w-4 h-4" />
              <span>المعمارية التقنية الحالية (Current Stack)</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-4">
              كيف يعمل النظام في كود وليد السنبسي؟
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">التخزين المحلي الهجين (Local-First Hybrid)</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    يستخدم المتصفح لحفظ تاريخ الملفات في <code className="text-amber-300">tasare7_history_v2</code>، وابتكر نظام حفظ مرفقات كامل في <code className="text-amber-300">IndexedDB</code> كـ ArrayBuffers لاسترجاع الصور والإكسل دون إعادة رفعها!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">تحليل كشوف الركاب (Excel Parser)</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    عبر نقطة النهاية <code className="text-amber-300">/api/preview-rooming</code> يقرأ السيرفر ملفات (.xlsx / .xls) ويستخرج بيانات الأفواج الصينية (الاسم الصيني، الإنجليزي، رقم الجواز، وتاريخ الانتهاء) ويحسب العدد تلقائياً.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">محرك التوليد والدمج (PDF Engine)</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    يقوم سيرفر بايثون في <code className="text-amber-300">/api/generate</code> بملء القوالب الرسمية، ودمج صور البرنامج والورقة الإضافية، لإنتاج ملف PDF نهائي موحد للتحميل الفوري.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">الشركات المدمجة كودياً:</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300 font-medium">ان ليميتد (2257)</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300 font-medium">ميمورى تريب (1586)</span>
            </div>
          </div>
        </div>

        {/* SWOT Matrix */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
              <TrendingUp className="w-4 h-4" />
              <span>مصفوفة التحليل الرباعي (SWOT Analysis)</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-4">
              نقاط القوة والمخاطر والفرص الكبرى للمشروع
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/50 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>نقاط القوة (Strengths)</span>
                </div>
                <ul className="text-slate-300 space-y-1 list-disc list-inside text-[11px]">
                  <li>فهم تشغيلي سياحي دقيق بنسبة 100%.</li>
                  <li>حفظ المرفقات محلياً بـ IndexedDB ذكي جداً.</li>
                  <li>واجهة بسيطة وسريعة لمدخلي البيانات.</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/50 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-rose-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>نقاط الضعف (Weaknesses)</span>
                </div>
                <ul className="text-slate-300 space-y-1 list-disc list-inside text-[11px]">
                  <li>غياب تسجيل الدخول (Public Access).</li>
                  <li>توليد تزامني يهدد بالـ Timeout في بايثون إني وير.</li>
                  <li>الشركات والمسارات مدمجة كودياً (Hardcoded).</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-800/50 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-sky-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>الفرص الذهبية (Opportunities)</span>
                </div>
                <ul className="text-slate-300 space-y-1 list-disc list-inside text-[11px]">
                  <li>تحويله لـ SaaS باشتراك شهري (2,000+ شركة).</li>
                  <li>إرسال التصاريح للسائق والمرشد عبر WhatsApp.</li>
                  <li>إضافة قراءة الجوازات بكاميرا الموبايل (OCR).</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/50 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>التهديدات (Threats)</span>
                </div>
                <ul className="text-slate-300 space-y-1 list-disc list-inside text-[11px]">
                  <li>مخاطر حماية بيانات الجوازات وقانون 151.</li>
                  <li>توقف استضافة PythonAnywhere فجأة لنفاد الـ CPU.</li>
                  <li>فقدان سجلات التصاريح إذا تعطل متصفح الموظف.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <button
              onClick={() => onConsultExpert('systems_architect')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all text-center"
            >
              عرض توصيات مهندس المعمارية لحل مشكلة السيرفر
            </button>
          </div>
        </div>
      </div>

      {/* Code Discoveries & Smart Tweaks Found */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowCodeDetails(!showCodeDetails)}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">تفاصيل كود الموقع المكتشفة في الفحص المباشر</h3>
              <p className="text-xs text-slate-400">حيل برمجية ذكية اكتشفناها داخل موقع waleedalsenbesy.pythonanywhere.com</p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-white p-2">
            {showCodeDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {showCodeDetails && (
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-4 text-xs md:text-sm text-slate-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-amber-400 block mb-1">1. ميزة مزامنة هاتف المرشد التلقائية (Guide-Phone Sync)</span>
                <p className="text-slate-400 text-xs">
                  قام وليد بإنشاء نظام ذاكرة ذكي: عند اختيار اسم المرشد، يتم ملء رقم هاتفه فورياً من الذاكرة، وإذا تم تغيير الهاتف يتم حفظ الاقتران الجديد تلقائياً لتوفير تكرار الإدخال.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-amber-400 block mb-1">2. قفل العدد اليدوي (Manual Pax Lock)</span>
                <p className="text-slate-400 text-xs">
                  كود محكم يضمن عدم تجاوز أو الكتابة فوق العدد اليدوي إذا تم تعديله من قبل الموظف، حتى لو أعاد تحميل كشف الإكسل، لحل مشكلة نقص أو زيادة مقاعد السائقين.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-amber-400 block mb-1">3. تخزين الملفات عبر IndexedDB (TASARE7_HISTORY_FILES_967)</span>
                <p className="text-slate-400 text-xs">
                  يتم تحويل الملفات المرفوعة إلى DataTransfer كائنات ملفية كاملة وتخزينها في جدول IndexedDB محلي، مما يتيح استعادة تصريح قديم وتعديله دون الحاجة لإعادة رفع الإكسل والصور مرة أخرى.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-amber-400 block mb-1">4. المعاملة الخاصة لمسار الغردقة وميموري تريب</span>
                <p className="text-slate-400 text-xs">
                  في حالة اختيار مسار الغردقة، يقوم الكود تلقائياً بإلزام المستخدم برفع صورة إدارة البرامج والورقة الإضافية، ويتيح رفع صورة سكرين شوت بدلاً من ملف الإكسل لتسهيل العمليات السريعة.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
