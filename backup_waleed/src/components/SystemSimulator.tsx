import React, { useState } from 'react';
import { 
  Cpu, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  RefreshCw, 
  ShieldAlert, 
  Printer, 
  Sliders, 
  Sparkles,
  ArrowRight,
  Eye
} from 'lucide-react';
import { SAMPLE_PASSENGERS } from '../data/projectData';

export const SystemSimulator: React.FC = () => {
  const [company, setCompany] = useState<'unlimited' | 'memory'>('unlimited');
  const [permit, setPermit] = useState<string>('cairo');
  const [fileNo, setFileNo] = useState<string>('CH202610-18GZL');
  const [guide, setGuide] = useState<string>('أحمد منصور');
  const [phone, setPhone] = useState<string>('01012345678');
  const [tripDate, setTripDate] = useState<string>('2026-10-12');
  const [paxCount, setPaxCount] = useState<number>(SAMPLE_PASSENGERS.length);
  const [isManualPax, setIsManualPax] = useState<boolean>(false);
  const [programText, setProgramText] = useState<string>('زعفرانه – خان – ازهر – مصر القديمه – عشاء – الفندق');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<any | null>(null);

  // Guide-Phone paired memory simulation (from Waleed's code)
  const guideDirectory: Record<string, string> = {
    'أحمد منصور': '01012345678',
    'محمود الشناوي': '01198765432',
    'مينا جرجس': '01233445566',
    'إبراهيم العطار': '01555667788',
  };

  const handleGuideChange = (selectedGuide: string) => {
    setGuide(selectedGuide);
    if (guideDirectory[selectedGuide]) {
      setPhone(guideDirectory[selectedGuide]);
    }
  };

  const handleCompanyChange = (c: 'unlimited' | 'memory') => {
    setCompany(c);
    if (c === 'unlimited') {
      setPermit('cairo');
      setProgramText('زعفرانه – خان – ازهر – مصر القديمه – عشاء');
    } else {
      setPermit('hurghada');
      setProgramText('دندره 85');
    }
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationResult(null);

    setTimeout(() => {
      setIsSimulating(false);
      setSimulationResult({
        success: true,
        generatedPages: 7,
        estimatedTimeMs: 1420,
        cpuLoadPercent: 78,
        securityFlags: [
          { level: 'high', text: 'تمت قراءة 5 جوازات سفر سياحية دون تشفير أثناء النقل.' },
          { level: 'medium', text: 'المعاملة استغرقت 1.4 ثانية في مسار تزامني؛ قد تتوقف على بايثون إني وير إذا زاد الركاب عن 30.' },
          { level: 'safe', text: 'تم التحقق من قفل العدد اليدوي (Manual PAX Lock) بنجاح.' },
          { level: 'safe', text: 'تم تنسيق الخط السياحي وفق تصريح كمين 85 والأقصر.' }
        ],
        pagesBundle: permit === 'hurghada' ? [
          { p: 1, title: 'إخطار رقم (6) إدارة تأمين الأفواج', status: 'جاهز مع الترويسة' },
          { p: 2, title: 'إخطار رقم (6) فرع غرفة الشركات', status: 'جاهز مع حسابات الغرفة' },
          { p: 3, title: 'إخطار رقم (6) مكتب وزارة السياحة', status: 'جاهز مع كود الملف' },
          { p: 4, title: `كشف الروم ليست المعتمد (${paxCount} سائح)`, status: 'تم دمج الجدول الصيني/الإنجليزي' },
          { p: 5, title: 'استمارة إدارة البرامج (دندرة 85)', status: 'تم دمج صورة الختم المعتمد' },
          { p: 6, title: 'إخطار السيد اللواء مدير تأمين الأفواج بالأقصر', status: 'جاهز ببيانات السائق والسيارة والجنسية' },
          { p: 7, title: 'أمر الشغل وتصريح الطرق السريعة (الورقة الإضافية للغردقة)', status: 'تم إدراج الملحق الإضافي' },
        ] : [
          { p: 1, title: 'إخطار رقم (6) إدارة تأمين الأفواج', status: 'جاهز مع الترويسة' },
          { p: 2, title: 'إخطار رقم (6) فرع غرفة الشركات', status: 'جاهز مع حسابات الغرفة' },
          { p: 3, title: 'إخطار رقم (6) مكتب وزارة السياحة', status: 'جاهز مع كود الملف' },
          { p: 4, title: `نيم ليست — نسخة 1 (إدارة تأمين الأفواج بالشرطة)`, status: 'مخصص لضباط الأكمنة والمنافذ' },
          { p: 5, title: `نيم ليست — نسخة 2 (فرع غرفة شركات السياحة)`, status: 'مخصص للمراجعة الإدارية بالغرفة' },
          { p: 6, title: `نيم ليست — نسخة 3 (مكتب وزارة السياحة والآثار)`, status: 'مخصص للرقابة والتفتيش' },
          { p: 7, title: 'استمارة إدارة البرامج السياحية والتشغيل', status: 'تم دمج البرنامج وصورة الختم' },
        ]
      });
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>محاكي فحص سير العمل (Workflow Sandbox)</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            محاكي واختبار نظام تصاريح النقل السياحي
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            هذا المحاكي يعيد تمثيل تجربة الموقع الحقيقي لمشروع وليد، مع فحص لحظي للأداء واختبار متانة الـ 7 صفحات وكشف الركاب.
          </p>
        </div>

        <button
          onClick={runSimulation}
          disabled={isSimulating}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/10 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PlayIcon className="w-4 h-4 fill-current" />}
          <span>{isSimulating ? 'جاري محاكاة التوليد...' : 'تشغيل محاكاة التوليد والفحص'}</span>
        </button>
      </div>

      {/* Simulator Inputs & Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Permit Data Controls */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>بيانات التصريح والمطابقة الحقلية (Field Setup)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company Selection */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">الشركة المرخصة:</label>
              <select
                value={company}
                onChange={(e) => handleCompanyChange(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl p-3 outline-none focus:border-amber-500"
              >
                <option value="unlimited">ان ليميتد ايجيبت ترافيل — ترخيص 2257</option>
                <option value="memory">ميمورى تريب تورز — ترخيص 1586</option>
              </select>
            </div>

            {/* Permit Type */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">نوع التصريح والمسار:</label>
              <select
                value={permit}
                onChange={(e) => setPermit(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl p-3 outline-none focus:border-amber-500"
              >
                <option value="cairo">توصيلة القاهرة (زعفرانة / خان / أزهر)</option>
                <option value="luxor_transfer">توصيلة الأقصر (كمين 85 / دندرة)</option>
                <option value="luxor_overnight">مبيت الأقصر (وادي الملوك / مرسى)</option>
                {company === 'memory' && (
                  <option value="hurghada">توصيلة الغردقة + إخطار الشرطة (7 ورقات)</option>
                )}
              </select>
            </div>

            {/* File Number */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">رقم الملف (File No):</label>
              <input
                type="text"
                value={fileNo}
                onChange={(e) => setFileNo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono rounded-xl p-3 outline-none focus:border-amber-500 dir-ltr text-right"
              />
            </div>

            {/* Pax Count & Manual Pax Lock */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">العدد (Pax Count):</label>
                <button
                  type="button"
                  onClick={() => setIsManualPax(!isManualPax)}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded transition-colors ${
                    isManualPax ? 'bg-amber-500/20 text-amber-300' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {isManualPax ? '🔒 قفل يدوي مفعل' : 'محسوب تلقائياً'}
                </button>
              </div>
              <input
                type="number"
                value={paxCount}
                onChange={(e) => {
                  setPaxCount(Number(e.target.value));
                  setIsManualPax(true);
                }}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl p-3 outline-none focus:border-amber-500"
              />
            </div>

            {/* Guide & Phone Auto Pair */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">اسم المرشد الكامل:</label>
              <select
                value={guide}
                onChange={(e) => handleGuideChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl p-3 outline-none focus:border-amber-500"
              >
                {Object.keys(guideDirectory).map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">هاتف المرشد (تلقائي):</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono rounded-xl p-3 outline-none focus:border-amber-500 dir-ltr text-right"
              />
            </div>
          </div>

          {/* Program Itinerary Text */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">البرنامج وأماكن الإقامة والمزارات:</label>
            <textarea
              rows={2}
              value={programText}
              onChange={(e) => setProgramText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl p-3 outline-none focus:border-amber-500"
            />
          </div>

          {/* Sample Tourist List Preview */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>معاينة كشف الروم ليست المستخرج من Excel ({SAMPLE_PASSENGERS.length} ركاب)</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">/api/preview-rooming</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-right text-[11px] text-slate-300">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-bold">
                  <tr>
                    <th className="p-2">م</th>
                    <th className="p-2">الصيني</th>
                    <th className="p-2">الإنجليزي</th>
                    <th className="p-2">الجواز</th>
                    <th className="p-2">الانتهاء</th>
                    <th className="p-2">الغرفة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                  {SAMPLE_PASSENGERS.map((p) => (
                    <tr key={p.id}>
                      <td className="p-2 font-mono text-slate-400">{p.id}</td>
                      <td className="p-2 font-semibold text-amber-300 font-sans">{p.chinese}</td>
                      <td className="p-2 font-mono">{p.english}</td>
                      <td className="p-2 font-mono text-sky-400">{p.passport}</td>
                      <td className="p-2 font-mono text-slate-400">{p.expiry}</td>
                      <td className="p-2 font-mono text-emerald-400">{p.room}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Simulation Diagnostics & Output Bundle */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>مخرجات التوليد وفحص النظام</span>
            </h3>

            {!simulationResult && !isSimulating && (
              <div className="p-8 text-center text-slate-400 space-y-3 bg-slate-950/50 rounded-xl border border-dashed border-slate-800">
                <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                  <PlayIcon className="w-5 h-5 fill-current" />
                </div>
                <p className="text-xs">
                  اضغط على زر <strong className="text-amber-400">"تشغيل محاكاة التوليد والفحص"</strong> أعلاه لمعالجة بيانات الـ 7 ورقات وفحص استقرار السيرفر والأمان.
                </p>
              </div>
            )}

            {isSimulating && (
              <div className="p-8 text-center space-y-4 bg-slate-950/50 rounded-xl border border-slate-800">
                <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-200">جاري تجميع حزمة الـ 7 صفحات...</p>
                  <p className="text-xs text-slate-500">معالجة ملف الإكسل • دمج صور البرامج • حساب مؤشرات الـ CPU</p>
                </div>
              </div>
            )}

            {simulationResult && (
              <div className="space-y-4">
                {/* Generation Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">زمن المعالجة</span>
                    <span className="text-base font-black text-emerald-400">{simulationResult.estimatedTimeMs} ms</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">جهد المعالج (CPU)</span>
                    <span className="text-base font-black text-amber-400">{simulationResult.cpuLoadPercent}%</span>
                  </div>
                </div>

                {/* 7 Pages Generated Status */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-300 block">حزمة الـ 7 ورقات المنتجة:</span>
                  <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                    {simulationResult.pagesBundle.map((item: any) => (
                      <div key={item.p} className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-slate-800 text-amber-400 font-bold text-[10px] flex items-center justify-center shrink-0">
                            {item.p}
                          </span>
                          <span className="text-slate-200 text-[11px] truncate max-w-[180px]">{item.title}</span>
                        </div>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safety & Compliance Flags */}
                <div className="pt-3 border-t border-slate-800 space-y-1.5">
                  <span className="text-xs font-bold text-amber-400 block">تقرير الفحص الأمني السريع:</span>
                  <div className="space-y-1 text-[11px]">
                    {simulationResult.securityFlags.map((flag: any, i: number) => (
                      <div key={i} className="flex items-start gap-1.5 text-slate-300">
                        {flag.level === 'high' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        ) : flag.level === 'medium' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        )}
                        <span>{flag.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {simulationResult && (
            <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
                <span>ملف التصريح مطابق بنسبة 100% لمخرجات موقع وليد</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
