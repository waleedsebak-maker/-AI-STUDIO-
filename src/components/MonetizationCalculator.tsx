import React, { useState } from 'react';
import { DollarSign, TrendingUp, Users, Clock, CheckCircle, Sparkles, Building2 } from 'lucide-react';

export const MonetizationCalculator: React.FC = () => {
  const [agenciesCount, setAgenciesCount] = useState<number>(25);
  const [monthlySubscription, setMonthlySubscription] = useState<number>(2000);
  const [permitsPerAgency, setPermitsPerAgency] = useState<number>(60);

  const totalMonthlyPermits = agenciesCount * permitsPerAgency;
  const hoursSavedMonthly = Math.round((totalMonthlyPermits * 60) / 60); // 60 mins saved per permit
  const monthlyRevenueEGP = agenciesCount * monthlySubscription;
  const annualRevenueEGP = monthlyRevenueEGP * 12;

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 md:p-8 space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <DollarSign className="w-4 h-4" />
            <span>دراسة الجدوى والنمو المالي (SaaS Monetization)</span>
          </div>
          <h3 className="text-xl font-black text-white mt-1">
            حاسبة العائد الاستثماري والأرباح المتوقعة لوليد السنبسي
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            في مصر أكثر من 2,200 شركة سياحة مرخصة فئة (أ) تعتمد على النقل السياحي للأفواج.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          نموذج B2B Micro-SaaS
        </span>
      </div>

      {/* Sliders & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300">عدد الشركات المشتركة:</span>
            <span className="font-black text-amber-400 text-sm">{agenciesCount} شركة</span>
          </div>
          <input
            type="range"
            min="3"
            max="150"
            step="1"
            value={agenciesCount}
            onChange={(e) => setAgenciesCount(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <span className="text-[11px] text-slate-500 block">من إجمالي ~2,200 شركة فئة (أ) في مصر</span>
        </div>

        <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300">سعر الاشتراك الشهري للشركة:</span>
            <span className="font-black text-emerald-400 text-sm">{monthlySubscription.toLocaleString()} ج.م</span>
          </div>
          <input
            type="range"
            min="1000"
            max="5000"
            step="250"
            value={monthlySubscription}
            onChange={(e) => setMonthlySubscription(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <span className="text-[11px] text-slate-500 block">باقة غير محدودة للتصاريح + إرسال واتساب</span>
        </div>

        <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300">متوسط رحلات الشركة شهرياً:</span>
            <span className="font-black text-sky-400 text-sm">{permitsPerAgency} رحلة</span>
          </div>
          <input
            type="range"
            min="10"
            max="200"
            step="5"
            value={permitsPerAgency}
            onChange={(e) => setPermitsPerAgency(Number(e.target.value))}
            className="w-full accent-sky-500 cursor-pointer"
          />
          <span className="text-[11px] text-slate-500 block">بين القاهرة والأقصر والغردقة</span>
        </div>
      </div>

      {/* Projection Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block">الدخل الشهري المتكرر (MRR)</span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">
            {monthlyRevenueEGP.toLocaleString()} <span className="text-xs font-normal text-slate-400">ج.م</span>
          </span>
          <span className="text-[11px] text-emerald-400/80 mt-1 block font-medium">صافي تدفق نقدي شهري</span>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block">الدخل السنوي المتوقع (ARR)</span>
          <span className="text-2xl font-black text-amber-400 mt-1 block">
            {annualRevenueEGP.toLocaleString()} <span className="text-xs font-normal text-slate-400">ج.م</span>
          </span>
          <span className="text-[11px] text-amber-400/80 mt-1 block font-medium">بنسبة ربحية تتجاوز 90%</span>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block">ساعات العمل الموفرة شهرياً</span>
          <span className="text-2xl font-black text-sky-400 mt-1 block">
            {hoursSavedMonthly.toLocaleString()} <span className="text-xs font-normal text-slate-400">ساعة</span>
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">لقطاع التشغيل والعمليات</span>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block">تكلفة السحابة التقديرية</span>
          <span className="text-2xl font-black text-slate-300 mt-1 block">
            ~1,200 <span className="text-xs font-normal text-slate-400">ج.م/شهر</span>
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">سيرفر VPS + S3 + WhatsApp API</span>
        </div>
      </div>
    </div>
  );
};
