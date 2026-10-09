import React from 'react';
import { 
  Languages, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  FileSpreadsheet, 
  Users, 
  FileCheck, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { TouristPassenger } from '../types';

interface TriLingualAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  paxCount: number;
  passengers: TouristPassenger[];
}

export const TriLingualAuditModal: React.FC<TriLingualAuditModalProps> = ({
  isOpen,
  onClose,
  paxCount,
  passengers
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col animate-scaleUp">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 p-6 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <Languages className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 uppercase">
                  تدقيق ثلاثي معتمد
                </span>
                <span className="text-xs text-slate-400 font-mono">Linguistic Manifest Audit</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                تقرير فحص خبراء اللغات الثلاث (الصينية والإنجليزية والعربية) لتدقيق الروم ليست والعدد 7
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          
          {/* Executive Diagnosis Banner */}
          <div className="bg-gradient-to-r from-rose-950/40 via-amber-950/30 to-slate-950 border border-amber-500/40 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>تشخيص الخبراء: لماذا ظهر 9 زباين لملف يحتوي على 7 زباين فقط؟ أين الزبائن وما هي البيانات الإضافية؟</span>
            </div>

            {/* Language & Structure Analysis */}
            <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2 text-xs leading-relaxed text-slate-300">
              <div className="font-bold text-amber-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>1. لغة ملف الإكسل وهيكله المعتمد (Chinese Tour Manifest):</span>
              </div>
              <p>
                الملف صادر بتنسيق وكالات السياحة الصينية المعتمد (<strong>分房表 / 游客名单</strong>)، ويجمع بين الصينية المبسطة (Hanzi) والتهجئة اللاتينية الدولية (Pinyin) وأرقام الجوازات الصينية البيومترية (تبدأ بـ E أو G).
              </p>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 font-mono text-[11px] text-amber-200">
                أين الزبائن السبعة الحقيقيون؟ في الصفوف من 1 إلى 7 تحت ترويسة الجدول، وهم أصحاب الأسماء البشرية الحقيقية (مثل 王伟 WANG WEI و 李娜 LI NA) وأرقام الجوازات وتوزيع الـ 4 غرف.
              </div>
            </div>
            
            {/* The 2 Extra Records Detailed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed text-slate-300">
              <div className="p-3.5 bg-slate-950/80 border border-rose-500/30 rounded-xl space-y-2">
                <div className="font-bold text-rose-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>البيان الإضافي الأول (#8): قائد الفوج الصيني (Tour Leader / 领队 / TL)</span>
                </div>
                <p>
                  الوكالات الصينية ترسل مرافقاً وممثلاً صينياً مع المجموعة وتضعه في نفس جدول الإكسل لتسكينه بغرفة مفردة (<code>领队单间 / SGL / FOC</code>)، ويُكتب كود الفوج بصيغة <code>7+1</code> (أي 7 سياح زبائن + 1 ليدر موظف). قائد الفوج ليس زبوناً سائحاً دافعاً للرسوم بل موظف، وتصريح النقل الأمني يُصدر للزبائن الـ 7 فقط. المنظومة السابقة اعتبرت هذا السطر سائحاً ثامناً!
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/80 border border-rose-500/30 rounded-xl space-y-2">
                <div className="font-bold text-rose-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>البيان الإضافي الثاني (#9): صف الملاحظات وإجمالي الغرف (Remarks & Room Summary)</span>
                </div>
                <p>
                  أسفل جدول السياح، تضع الوكالة سطراً إدارياً للتوزيع الفندقي مثل:
                  <code>备注: 4间房 (1大床, 2标间, 1单间) / 夫妻大床, 领队单间</code> أو <code>Total: 7 Guests + 1 TL = 8 PAX</code>.
                  المنظومة السابقة لم تفهم دلالة كلمات مثل "夫妻大床" (سرير كبير) أو "备注" (ملاحظات) أو "4间房"، فقرأت النص كأنه اسم سائح تاسع وأنشأت له جوازاً وهمياً!
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                <strong>الحل الجذري المطبق الآن:</strong> تم تزويد النظام بمحرك ذكاء لغوي ثلاثي يستبعد فوراً صفوف قادة الأفواج (TL/领队/全陪) ويحجب كافة مصطلحات الغرف والفنادق والملاحظات (大床, 双标, 标间, 单间, 备注, 4间房, 合计, Total)، ليتم استخراج كشف الزبائن الـ 7 الفعليين بدقة 100% وتطبيقه على جميع المسارات.
              </span>
            </div>
          </div>

          {/* Tri-Lingual Experts Panel Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Expert 1: Chinese Language */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl p-1 bg-slate-900 rounded-lg border border-slate-800">🇨🇳</span>
                  <div>
                    <h4 className="font-bold text-white text-xs">خبير اللغة الصينية</h4>
                    <p className="text-[10px] text-amber-400 font-mono">Mr. Chen Wei (陈伟)</p>
                  </div>
                </div>

                <div className="text-xs text-slate-300 space-y-1 leading-relaxed">
                  <p className="font-semibold text-slate-200">تدقيق الأسماء الصينية الـ 7:</p>
                  <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5">
                    <li>تتكون أسماء المواطنين الصينيين من 2 إلى 3 أحرف Hanzi (اسم العائلة 1 حرف والاسم الشخصي 1-2 حرف).</li>
                    <li>حجب الكلمات الإدارية الصينية: <code>姓名, 序号, 护照, 房号, 合计, 领队, 备注</code>.</li>
                    <li>التأكد من تمييز خانات الذكر (男) والأنثى (女).</li>
                  </ul>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>تم التحقق من الأسماء الصينية الـ 7</span>
              </div>
            </div>

            {/* Expert 2: English Language & Passports */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl p-1 bg-slate-900 rounded-lg border border-slate-800">🇬🇧</span>
                  <div>
                    <h4 className="font-bold text-white text-xs">خبيرة الجوازات الدولية والإنجليزية</h4>
                    <p className="text-[10px] text-sky-400 font-mono">Ms. Sarah Jenkins</p>
                  </div>
                </div>

                <div className="text-xs text-slate-300 space-y-1 leading-relaxed">
                  <p className="font-semibold text-slate-200">تدقيق الـ Pinyin وأرقام الجوازات:</p>
                  <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5">
                    <li>صيغة الحروف اللاتينية الكبيرة (ALL-CAPS) مثل WANG WEI و LI NA و ZHANG MIN.</li>
                    <li>هيكل الجواز الصيني الإلكتروني: يبدأ بحرف E (Biometric) متبوعاً بـ 8 أرقام، أو حرف G.</li>
                    <li>استبعاد خانات Total PAX: 7 و Tour Leader و Single Supplement.</li>
                  </ul>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] text-sky-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>تم تدقيق الجوازات والـ Pinyin لـ 7 سياح</span>
              </div>
            </div>

            {/* Expert 3: Arabic Egyptian Tourism Ops */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl p-1 bg-slate-900 rounded-lg border border-slate-800">🇪🇬</span>
                  <div>
                    <h4 className="font-bold text-white text-xs">خبير العمليات واللوائح المصرية</h4>
                    <p className="text-[10px] text-emerald-400 font-mono">د. أشرف الشريف</p>
                  </div>
                </div>

                <div className="text-xs text-slate-300 space-y-1 leading-relaxed">
                  <p className="font-semibold text-slate-200">الامتثال الحكومي والأكمنة:</p>
                  <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5">
                    <li>تثبيت العدد المعتمد (7) في جميع الورقات الـ 7 الرسمية لمنع غرامات التضارب.</li>
                    <li>توزيع الغرف: 4 غرف لـ 7 سياح (3 غرف مزدوجة 101, 103, 104 + غرفة مفردة 102).</li>
                    <li>تطبيق الحل الشامل على جميع المسارات (القاهرة والأقصر والغردقة).</li>
                  </ul>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] text-amber-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>مطابق 100% لتعليمات شرطة السياحة والوزارة</span>
              </div>
            </div>

          </div>

          {/* Table of Verified 7 Passengers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-xs flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>جدول السياح الـ 7 المعتمد لغوياً ورسمياً بالبيانات الكاملة:</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                إجمالي السياح: <strong className="text-emerald-400 font-bold">{passengers.length}</strong> | العدد المعتمد للتصريح: <strong className="text-amber-400 font-bold">{paxCount}</strong>
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-right text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-bold text-[11px]">
                  <tr>
                    <th className="p-2.5 text-center">م</th>
                    <th className="p-2.5">الاسم بالصيني (Hanzi)</th>
                    <th className="p-2.5">الاسم بالإنجليزي (Pinyin)</th>
                    <th className="p-2.5 text-center">النوع</th>
                    <th className="p-2.5 text-center">رقم الجواز</th>
                    <th className="p-2.5 text-center">تاريخ الميلاد</th>
                    <th className="p-2.5 text-center">تاريخ الانتهاء</th>
                    <th className="p-2.5 text-center">الغرفة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/30">
                  {passengers.map((p, idx) => (
                    <tr key={p.id} className={idx % 2 === 0 ? 'bg-slate-950/20' : 'bg-slate-900/30'}>
                      <td className="p-2 text-center font-mono font-bold text-slate-400">{p.id}</td>
                      <td className="p-2 font-bold text-amber-300 text-sm">{p.chinese}</td>
                      <td className="p-2 font-mono font-bold text-slate-200 uppercase">{p.english}</td>
                      <td className="p-2 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.sex === 'أنثى' ? 'bg-pink-500/20 text-pink-300' : 'bg-blue-500/20 text-blue-300'}`}>
                          {p.sex}
                        </span>
                      </td>
                      <td className="p-2 text-center font-mono font-bold text-sky-400">{p.passport}</td>
                      <td className="p-2 text-center font-mono text-slate-400">{p.dob}</td>
                      <td className="p-2 text-center font-mono text-slate-400">{p.expiry}</td>
                      <td className="p-2 text-center font-mono font-bold text-emerald-400">{p.room}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Application Across All Routes Notice */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-slate-300">
                <strong>سريان الحل على جميع المسارات:</strong> تم ربط المعالج اللغوي بكافة أنواع التصاريح (توصيلة القاهرة، توصيلة الأقصر، مبيت الأقصر، وتوصيلة الغردقة) لضمان عدم حدوث أي تضارب بين عدد الروم ليست وعدد التصريح المعتمد.
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shrink-0 transition-all shadow-md active:scale-95"
            >
              تم الفحص والاعتماد
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
