import React, { useState } from 'react';
import { 
  Server, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Database, 
  Code, 
  Copy, 
  Check, 
  Layers, 
  CloudRain, 
  Smartphone,
  MessageSquare
} from 'lucide-react';
import { UPGRADE_CODE_SNIPPETS } from '../data/projectData';

export const ArchitectureComparison: React.FC = () => {
  const [activeSnippet, setActiveSnippet] = useState<'fastapi' | 'security' | 'db'>('fastapi');
  const [copied, setCopied] = useState<boolean>(false);

  const getCode = () => {
    switch (activeSnippet) {
      case 'fastapi':
        return UPGRADE_CODE_SNIPPETS.fastapiBackend;
      case 'security':
        return UPGRADE_CODE_SNIPPETS.securityAuth;
      case 'db':
        return UPGRADE_CODE_SNIPPETS.databaseSchema;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 md:p-8">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
          <Server className="w-4 h-4" />
          <span>المعمارية السحابية والترقية الهندسية</span>
        </div>
        <h2 className="text-2xl font-black text-white">
          خارطة الطريق: الانتقال من سكريبت تجريبي إلى منصة مؤسسية (Enterprise SaaS)
        </h2>
        <p className="text-slate-400 text-sm mt-1 max-w-3xl">
          أعد هذه الخطة م. كريم النجار (خبير المعمارية السحابية) ود. مريم رضوان (أمن المعلومات) لتمكين وليد من تحويل المشروع إلى نظام قوي يستوعب آلاف الشركات السياحية دون توقف.
        </p>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current State */}
        <div className="bg-slate-900/60 rounded-2xl border border-rose-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <h3 className="font-extrabold text-white text-base">المعمارية الحالية (Current Stack)</h3>
            </div>
            <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
              PythonAnywhere Monolith
            </span>
          </div>

          <div className="space-y-3 text-xs md:text-sm">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-semibold block mb-0.5">السيرفر والمعالجة:</span>
              <p className="text-slate-200">
                سيرفر بايثون فلاسك على استضافة مشتركة (PythonAnywhere). المعالجة متزامنة ومحدودة بـ CPU Quota، وأي ضغط يسبب توقف الموقع.
              </p>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-semibold block mb-0.5">قاعدة البيانات والأرشيف:</span>
              <p className="text-slate-200">
                لا توجد قاعدة بيانات خلفية! يتم حفظ السجل والمرفقات في متصفح المستخدم فقط (IndexedDB + LocalStorage)، وتضيع عند تبديل الجهاز.
              </p>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-semibold block mb-0.5">الأمان والمصادقة:</span>
              <p className="text-slate-200">
                مفتوح للعامة دون تسجيل دخول أو حماية لجوازات السفر وأسماء المسافرين.
              </p>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-semibold block mb-0.5">التوزيع والتسليم:</span>
              <p className="text-slate-200">
                تنزيل ملف PDF يدوي فقط للكمبيوتر ثم إرساله يدوياً بالبريد أو الواتساب.
              </p>
            </div>
          </div>
        </div>

        {/* Target Production SaaS */}
        <div className="bg-slate-900 rounded-2xl border border-emerald-900/40 p-6 space-y-4 shadow-xl shadow-emerald-950/20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <h3 className="font-extrabold text-white text-base">المعمارية السحابية المقترحة (Target SaaS)</h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Cloud Native Microservices
            </span>
          </div>

          <div className="space-y-3 text-xs md:text-sm">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-emerald-900/20">
              <span className="text-emerald-400 font-semibold block mb-0.5">السيرفر والمعالجة غير المتزامنة:</span>
              <p className="text-slate-200">
                FastAPI + Celery Worker + Redis. معالجة وتوليد الـ PDF في ثوانٍ بالخلفية دون أي تجميد لصفحة المستخدم مهما كبر الملف.
              </p>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-emerald-900/20">
              <span className="text-emerald-400 font-semibold block mb-0.5">قاعدة بيانات مشفرة وسحابة ملفات:</span>
              <p className="text-slate-200">
                قاعدة بيانات PostgreSQL متعددة الشركات (Multi-Tenant) مع تشفير حقول الجوازات، وتخزين الـ PDF في S3 / R2.
              </p>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-emerald-900/20">
              <span className="text-emerald-400 font-semibold block mb-0.5">نظام صلاحيات صارم (RBAC & 2FA):</span>
              <p className="text-slate-200">
                تسجيل دخول لكل شركة برقم ترخيصها المعتمد لدى وزارة السياحة، مع تتبع كل تصريح ومن قام بإنشائه وتعديله.
              </p>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-emerald-900/20">
              <span className="text-emerald-400 font-semibold block mb-0.5">توزيع فوري عبر WhatsApp & QR Code:</span>
              <p className="text-slate-200">
                إرسال الـ 7 ورقات تلقائياً لهاتف السائق والمرشد بنقرة زر، وطباعة QR Code للتحقق الفوري في الكمائن.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Code Snippets Vault */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-amber-400" />
              <span>أكواد جاهزة مقترحة للترقية الفورية (Ready-to-Use Snippets)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              يمكن لوليد نسخ هذه الأكواد لتحديث كود بايثون إني وير أو بناء الإصدار الثاني فوراً.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveSnippet('fastapi')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                  activeSnippet === 'fastapi' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                FastAPI Backend
              </button>
              <button
                onClick={() => setActiveSnippet('security')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                  activeSnippet === 'security' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                حماية الصلاحيات
              </button>
              <button
                onClick={() => setActiveSnippet('db')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                  activeSnippet === 'db' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                مخطط PostgreSQL
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ!' : 'نسخ الكود'}</span>
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden dir-ltr text-left">
          <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>{activeSnippet === 'fastapi' ? 'fastapi_app.py' : activeSnippet === 'security' ? 'security_middleware.py' : 'postgres_schema.sql'}</span>
            <span className="text-amber-400 font-sans">Python 3.12 / SQL</span>
          </div>
          <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-96">
            <code>{getCode()}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
