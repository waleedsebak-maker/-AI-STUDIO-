import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Send, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  TrendingUp, 
  BadgePercent, 
  Clock, 
  FileCheck2,
  AlertCircle
} from 'lucide-react';

export interface CategoryACompany {
  id: string;
  nameAr: string;
  nameEn: string;
  licenseNumber: string;
  city: 'القاهرة' | 'الجيزة' | 'البحر الأحمر' | 'الأقصر' | 'الإسكندرية';
  email: string;
  secondaryEmail?: string;
  phone: string;
  fleetSizeEst: string;
  notes: string;
}

export const CATEGORY_A_COMPANIES: CategoryACompany[] = [
  {
    id: 'travco',
    nameAr: 'ترافكو للسياحة (مجموعة ترافكو)',
    nameEn: 'Travco Holidays & Travel Group',
    licenseNumber: '40',
    city: 'القاهرة',
    email: 'operations@travco.com',
    secondaryEmail: 'transport@travcogroup.com',
    phone: '0238541000',
    fleetSizeEst: '120+ حافلة',
    notes: 'أكبر أسطول نقل سياحي بمصر، خطوط القاهرة والغردقة والأقصر'
  },
  {
    id: 'spring',
    nameAr: 'سبرنج تورز للرحلات',
    nameEn: 'Spring Tours Egypt',
    licenseNumber: '12',
    city: 'القاهرة',
    email: 'operations@springtours.com',
    secondaryEmail: 'inbound@springtours.com',
    phone: '0227361845',
    fleetSizeEst: '70+ حافلة',
    notes: 'رحلات منتظمة للأفواج الصينية والأوروبية بالأقصر وأسوان'
  },
  {
    id: 'misr_travel',
    nameAr: 'مصر للسياحة (الشركة الوطنية)',
    nameEn: 'Misr Travel Co.',
    licenseNumber: '1',
    city: 'القاهرة',
    email: 'operations@misrtravel.net',
    secondaryEmail: 'transport@misrtravel.net',
    phone: '0223934445',
    fleetSizeEst: '85+ حافلة',
    notes: 'ترخيص رقم 1 بوزارة السياحة، فروع بكافة محافظات الجمهورية'
  },
  {
    id: 'memphis',
    nameAr: 'ممفيس تورز للسياحة',
    nameEn: 'Memphis Tours Egypt',
    licenseNumber: '154',
    city: 'الجيزة',
    email: 'operations@memphistours.com',
    secondaryEmail: 'info@memphistours.com',
    phone: '0237766020',
    fleetSizeEst: '55+ حافلة',
    notes: 'حركة يومية مكثفة بين القاهرة والغردقة والأقصر'
  },
  {
    id: 'flash_tour',
    nameAr: 'فلاش تور للرحلات',
    nameEn: 'Flash Tour Egypt',
    licenseNumber: '342',
    city: 'القاهرة',
    email: 'operations@flashtour.com',
    secondaryEmail: 'flashtour@flashtour.com',
    phone: '0224183800',
    fleetSizeEst: '45+ حافلة',
    notes: 'تخصص رئيسي في رحلات اليوم الواحد وتوصيلات البحر الأحمر'
  },
  {
    id: 'wings',
    nameAr: 'وينجز تورز آند نايل كروزس',
    nameEn: 'Wings Tours & Nile Cruises',
    licenseNumber: '98',
    city: 'القاهرة',
    email: 'cruises-ops@wingsegypt.com',
    secondaryEmail: 'transport@wingsegypt.com',
    phone: '0226900222',
    fleetSizeEst: '60+ حافلة',
    notes: 'ربط سياحي ضخم لمراكب النيل بالأقصر وأسوان مع الغردقة'
  },
  {
    id: 'bright_sky',
    nameAr: 'برايت سكاي ترافل',
    nameEn: 'Bright Sky Travel',
    licenseNumber: '514',
    city: 'البحر الأحمر',
    email: 'operations@brightskyegypt.com',
    secondaryEmail: 'dispatch@brightskyegypt.com',
    phone: '0653447810',
    fleetSizeEst: '50+ حافلة',
    notes: 'مقر رئيسي بالغردقة ومتابعة مستمرة لكمين 85 وسفاجا والجونة'
  },
  {
    id: 'excel',
    nameAr: 'إكسيل ترافل (وكيل أمريكان إكسبريس)',
    nameEn: 'Excel Travel Egypt',
    licenseNumber: '472',
    city: 'القاهرة',
    email: 'inbound@exceltravel.com.eg',
    secondaryEmail: 'ops@exceltravel.com.eg',
    phone: '0227943511',
    fleetSizeEst: '40+ حافلة',
    notes: 'خدمات سياحة فاخرة ونقل سياحي دولي ومحلي'
  },
  {
    id: 'sun_intl',
    nameAr: 'صن إنترناشونال تورز',
    nameEn: 'Sun International Tours',
    licenseNumber: '289',
    city: 'الجيزة',
    email: 'operations@suninternational.com.eg',
    secondaryEmail: 'info@suninternational.com.eg',
    phone: '0233379100',
    fleetSizeEst: '35+ حافلة',
    notes: 'رحلات منتظمة للأفواج الآسيوية والصينية'
  },
  {
    id: 'eastmar',
    nameAr: 'إيستمار للرحلات والسياحة',
    nameEn: 'Eastmar Travel Egypt',
    licenseNumber: '35',
    city: 'القاهرة',
    email: 'operations@eastmar.com',
    secondaryEmail: 'info@eastmar.com',
    phone: '0225753000',
    fleetSizeEst: '30+ حافلة',
    notes: 'من أقدم شركات السياحة فئة أ في تنظيم الرحلات البرية'
  },
  {
    id: 'blue_sky',
    nameAr: 'مجموعة بلو سكاي ترافل',
    nameEn: 'Blue Sky Travel Group',
    licenseNumber: '185',
    city: 'البحر الأحمر',
    email: 'operations@blueskygroup.net',
    secondaryEmail: 'transport@blueskygroup.net',
    phone: '0653443310',
    fleetSizeEst: '65+ حافلة',
    notes: 'عمليات يومية على مسارات الغردقة - سفاجا - الأقصر'
  },
  {
    id: 'karnak',
    nameAr: 'الكرنك للسياحة والخدمات السياحية',
    nameEn: 'Karnak Travel',
    licenseNumber: '77',
    city: 'الأقصر',
    email: 'karnak@karnaktravel.com',
    secondaryEmail: 'ops-luxor@karnaktravel.com',
    phone: '0952382000',
    fleetSizeEst: '25+ حافلة',
    notes: 'مركز عمليات رئيسي بالأقصر ومسار دندرة والبر الغربي'
  },
  {
    id: 'top_egypt',
    nameAr: 'توب إيجيبت ترافل',
    nameEn: 'Top Egypt Travel',
    licenseNumber: '670',
    city: 'القاهرة',
    email: 'ops@topegypttravel.com',
    phone: '0222601140',
    fleetSizeEst: '30+ حافلة',
    notes: 'حركة سياحية مكثفة بين فنادق القاهرة ومطار القاهرة'
  },
  {
    id: 'emak',
    nameAr: 'إيماك تورز للنقل والسياحة',
    nameEn: 'Emak Tours',
    licenseNumber: '812',
    city: 'البحر الأحمر',
    email: 'operations@emaktours.com',
    phone: '0653556010',
    fleetSizeEst: '28+ حافلة',
    notes: 'حافلات حديثة لنقل المجموعات السياحية بالبحر الأحمر والصعيد'
  },
  {
    id: 'overseas',
    nameAr: 'أوفرسيز ترافل سيرفيسز',
    nameEn: 'Overseas Travel Services',
    licenseNumber: '421',
    city: 'القاهرة',
    email: 'info@overseas-travel.com',
    secondaryEmail: 'operations@overseas-travel.com',
    phone: '0225247890',
    fleetSizeEst: '35+ حافلة',
    notes: 'تنظيم رحلات ثقافية وشاطئية مشتركة'
  }
];

export const B2BCompanyOutreach: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('الكل');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [isCopiedPitch, setIsCopiedPitch] = useState<boolean>(false);
  const [isCopiedAllEmails, setIsCopiedAllEmails] = useState<boolean>(false);

  // Filtered companies
  const filteredCompanies = CATEGORY_A_COMPANIES.filter(comp => {
    const matchCity = selectedCity === 'الكل' || comp.city === selectedCity;
    const matchSearch = comp.nameAr.includes(searchQuery) || 
      comp.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.licenseNumber.includes(searchQuery) ||
      comp.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCity && matchSearch;
  });

  const allEmailsList = CATEGORY_A_COMPANIES.map(c => c.email).join(', ');

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2500);
  };

  const handleCopyAllEmails = () => {
    navigator.clipboard.writeText(allEmailsList);
    setIsCopiedAllEmails(true);
    setTimeout(() => setIsCopiedAllEmails(false), 3000);
  };

  const exportToCSV = () => {
    const headers = 'م,اسم الشركة عربي,اسم الشركة إنجليزي,رقم الترخيص,المدينة,البريد الإلكتروني,البريد البديل,الهاتف,الأسطول التقديري,ملاحظات التشغيل\n';
    const rows = CATEGORY_A_COMPANIES.map((c, i) => 
      `"${i + 1}","${c.nameAr}","${c.nameEn}","${c.licenseNumber}","${c.city}","${c.email}","${c.secondaryEmail || ''}","${c.phone}","${c.fleetSizeEst}","${c.notes}"`
    ).join('\n');

    const csvContent = '\uFEFF' + headers + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `قائمة_شركات_السياحة_المعتمدة_فئة_أ_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Official B2B Outreach Pitch Template
  const emailSubject = `[هام لشركات السياحة فئة أ] الامتثال لتحديثات وزارة السياحة: منظومة إصدار تصاريح النقل وإخطارات (نموذج 6) الرقمية المعتمدة`;
  
  const emailBodyText = `السادة الأفاضل / رئيس مجلس الإدارة والمدير العام ومدير إدارة العمليات والنقل السياحي المحترمين،
شركة: [اسم الشركة الموقرة] (ترخيص فئة أ)

تحية طيبة وبعد،،،

في ضوء التوجيهات والقرارات التنظيمية الأخيرة الصادرة عن وزارة السياحة والآثار بالتعاون مع شرطة السياحة والآثار وغرفة شركات ووكالات السفر والسياحة، والخاصة بالتحول الإلزامي نحو رقمنة تصاريح النقل السياحي الميداني واعتماد الأكواد المشفرة (QR Code) ومطابقة كشوفات الـ Rooming List تلقائياً عند الأكمنة والمنافذ الحدودية (كمين الجونة، كمين سفاجا 85، كمين العشى بالأقصر، وأكمنة القاهرة السريعة)...

يسعدنا أن نضع بين أيديكم المنظومة السحابية الميدانية المتخصصة:
«منظومة تصاريحك الذكية للنقل السياحي المصري — Smart Tourist Permit System»
والتي تم تصميمها وتطويرها خصيصاً لتلبية متطلبات شركات السياحة فئة (أ) وحل كافة المعضلات اليومية التي تواجه طواقم الحركة ومديري العمليات.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
أهم المزايا التشغيلية لمنظومتنا:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. استخراج حزمة الـ 7 ورقات الرسمية بنقرة واحدة (PDF موحد عالي الدقة):
   توليد فوري لكافة الإخطارات الرسمية الثلاثة بنموذج رقم (6) الحكومي (إدارة تأمين الأفواج + فرع غرفة الشركات + مكتب وزارة السياحة) + نسخ الروم ليست الموزعة + استمارة إدارة البرامج المعتمدة، مع الفصل الدقيق بين مسارات القاهرة والأقصر وتوصيلة الغردقة.

2. معالجة آلية وفورية لكشوفات الـ Rooming List من ملفات Excel:
   قراءة واستخراج أسماء السياح الصينيين والأجانب وجوازات سفرهم وغرفهم في ثانية واحدة، مع منع الأخطاء الإملائية التي تؤدي لتعطيل الأتوبيس أو تحرير مخالفات بأكمنة الطرق.

3. تشفير بيانات التصريح بكود QR معتمد:
   يتيح لضباط الأكمنة ومفتشي وزارة السياحة مسح الكود والتحقق من صحة الرحلة والسائق والحافلة فورياً دون تأخير للأفواج.

4. إرسال مباشر لواتساب السائقين والمرشدين بنقرة زر واحدة:
   تقليل أكثر من 85% من الوقت المهدر في طباعة الأوراق والمكالمات الهاتفية، مع تخزين سحابي لكافة التصاريح للرجوع إليها وقت الحاجة.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
باقات الاشتراك الشهري المعتمدة (مع دعم فني متواصل 24/7):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
يسرنا تقديم باقات اشتراك مرنة مصممة خصيصاً لمعدلات تشغيل شركات الفئة (أ):

• الباقة الأساسية (فرع واحد / حتى 60 تصريح شهرياً):
  1,450 جنيه مصري / شهرياً (وفر شهرين عند الدفع السنوي).

• الباقة الاحترافية الذهبية (الأكثر طلباً — فروع غير محدودة / تصاريح مفتوحة + ربط واتساب السائقين):
  2,450 جنيه مصري / شهرياً (شاملة تحديثات لوائح الوزارة مجاناً).

• باقة الأساطيل الكبرى (Enterprise — سحابة مخصصة + تدريب كامل لطاقم الحركة + تخصيص أختام وشعارات الشركة):
  4,850 جنيه مصري / شهرياً.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
عرض التجربة المجانية الحصري:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
يسعدنا منح شركتكم الموقرة تجربة مجانية كاملة وغير مقيدة لمدة 14 يوماً للوقوف على كفاءة وسرعة المنظومة عملياً داخل قسم العمليات والحركة لديكم قبل اتخاذ أي قرار تعاقدي.

لطلب تشغيل النسخة التجريبية فوراً أو لجدولة عرض تقديمي لفريق العمليات:
• هاتف / واتساب العمليات: 01099887766
• البريد الإلكتروني المباشر: waleedsebak@gmail.com
• رابط المعاينة السريعة للمنظومة: متاح عبر الرابط المرفق.

وتفضلوا بقبول فائق الاحترام والتقدير،،،

وليد السنبسي
استشاري تطوير حلول النقل والعمليات السياحية
منظومة تصاريح النقل السياحي المعتمدة`;

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(`الموضوع: ${emailSubject}\n\n${emailBodyText}`);
    setIsCopiedPitch(true);
    setTimeout(() => setIsCopiedPitch(false), 3000);
  };

  const handleOpenMailClient = () => {
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBodyText)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>دليل المراسلات والتسويق لشركات السياحة فئة (أ)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              دليل شركات السياحة فئة (أ) المعتمدة وعروض التسويق المباشر (B2B SaaS)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              استثمر قرار وزارة السياحة بالتحول الإلزامي للتصاريح الرقمية عبر مراسلة كبرى شركات السياحة المصرية فئة (أ)، مع عروض أسعار مدروسة شهرياً وتجربة مجانية 14 يوماً.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={exportToCSV}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-md"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>تصدير القائمة (Excel / CSV)</span>
            </button>
            <button
              onClick={handleCopyAllEmails}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-amber-500/20"
            >
              {isCopiedAllEmails ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{isCopiedAllEmails ? 'تم نسخ كافة الإيميلات!' : 'نسخ قائمة كافة الإيميلات (BCC)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: Pricing Tiers & Expert Review Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Tier 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden hover:border-slate-700 transition-all">
          <div className="flex justify-between items-start">
            <div className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 text-slate-300">
              الباقة الأساسية (فرع واحد)
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">حتى 60 تصريح شهرياً</span>
          </div>
          <div>
            <div className="text-2xl font-black text-white">1,450 <span className="text-xs font-normal text-slate-400">ج.م / شهرياً</span></div>
            <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">وفر شهرين (14,500 ج.م سنوياً)</div>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
            <li className="flex items-center gap-1.5">✓ استخراج الـ 7 ورقات الرسمية بملف PDF</li>
            <li className="flex items-center gap-1.5">✓ معالجة كشوفات Excel تلقائياً</li>
            <li className="flex items-center gap-1.5">✓ دعم فني عبر الواتساب</li>
          </ul>
        </div>

        {/* Tier 2: Most Popular */}
        <div className="bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-900 border-2 border-indigo-500/60 rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-xl">
          <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
            الأكثر طلباً للشركات
          </div>
          <div className="flex justify-between items-start">
            <div className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              الباقة الاحترافية الذهبية
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white">2,450 <span className="text-xs font-normal text-slate-400">ج.م / شهرياً</span></div>
            <div className="text-[11px] text-indigo-300 font-semibold mt-0.5">تصاريح غير محدودة لجميع الفروع</div>
          </div>
          <ul className="text-xs text-slate-200 space-y-1.5 pt-2 border-t border-slate-800">
            <li className="flex items-center gap-1.5 font-bold text-white">✓ كافة مسارات القاهرة والغردقة والأقصر</li>
            <li className="flex items-center gap-1.5">✓ إرسال التصاريح وكود QR لواتساب السائق والمرشد</li>
            <li className="flex items-center gap-1.5">✓ تخزين سحابي دائم وأرشيف بحث سريع</li>
            <li className="flex items-center gap-1.5">✓ تحديثات فورية لأي تعديل وزاري جديد</li>
          </ul>
        </div>

        {/* Tier 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden hover:border-slate-700 transition-all">
          <div className="flex justify-between items-start">
            <div className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
              باقة الأساطيل (Enterprise)
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">للشركات الكبرى</span>
          </div>
          <div>
            <div className="text-2xl font-black text-white">4,850 <span className="text-xs font-normal text-slate-400">ج.م / شهرياً</span></div>
            <div className="text-[11px] text-amber-400 font-semibold mt-0.5">مخدم سحابي خاص + أختام مخصصة</div>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
            <li className="flex items-center gap-1.5">✓ تدريب عملي مباشر لطاقم الحركة والتشغيل</li>
            <li className="flex items-center gap-1.5">✓ إدارة أسطول وصلاحيات متقدمة للمستخدمين</li>
            <li className="flex items-center gap-1.5">✓ مدير حساب ودعم VIP على مدار الساعة</li>
          </ul>
        </div>
      </div>

      {/* SECTION 2: Ready-to-Send Outreach Email Proposal */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-black text-white">مسودة العرض التجاري الموجه لشركات السياحة فئة (أ)</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              صيغة رسمية راجعها خبراء العمليات والتسويق تلفت انتباه الشركات للقرارات الوزارية الجديدة والتحول للتصاريح الرقمية.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPitch}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              {isCopiedPitch ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{isCopiedPitch ? 'تم نسخ المسودة بنجاح!' : 'نسخ نص الإيميل كاملاً'}</span>
            </button>
            <button
              onClick={handleOpenMailClient}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-all active:scale-95"
            >
              <Send className="w-4 h-4 text-amber-400" />
              <span>إرسال عبر برنامج الإيميل (Mailto)</span>
            </button>
          </div>
        </div>

        {/* Email Preview Container */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 text-xs text-slate-200 space-y-3 font-sans leading-relaxed">
          <div className="pb-3 border-b border-slate-800/80 space-y-1">
            <div className="text-slate-400"><strong className="text-slate-300">الموضوع:</strong> {emailSubject}</div>
            <div className="text-slate-400"><strong className="text-slate-300">المستلم:</strong> شركات السياحة فئة أ (قسم العمليات والنقل السياحي)</div>
          </div>
          <div className="whitespace-pre-line text-slate-300 leading-relaxed font-sans text-xs">
            {emailBodyText}
          </div>
        </div>
      </div>

      {/* SECTION 3: Filterable Category (A) Companies Directory */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-black text-white">دليل شركات السياحة فئة (أ) المعتمدة بمصر ({filteredCompanies.length} شركة)</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              بيانات التواصل المباشرة بإدارات العمليات والنقل لشركات الفئة (أ) المسجلة بغرفة شركات السياحة.
            </p>
          </div>

          {/* Search & City Filter */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="relative grow sm:grow-0">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث بالاسم أو الترخيص أو الإيميل..."
                className="bg-slate-950 border border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 w-full sm:w-64"
              />
            </div>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500 font-bold"
            >
              <option value="الكل">كافة المحافظات</option>
              <option value="القاهرة">القاهرة</option>
              <option value="الجيزة">الجيزة</option>
              <option value="البحر الأحمر">البحر الأحمر</option>
              <option value="الأقصر">الأقصر</option>
            </select>
          </div>
        </div>

        {/* Directory Cards Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredCompanies.map((comp) => (
            <div 
              key={comp.id}
              className="bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4.5 space-y-3 transition-all hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-white">{comp.nameAr}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      ترخيص {comp.licenseNumber}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">{comp.nameEn}</div>
                </div>

                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-800 text-slate-300 flex items-center gap-1 shrink-0">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>{comp.city}</span>
                </span>
              </div>

              {/* Emails & Phones */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs">
                <div className="flex items-center justify-between gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="font-mono text-slate-200 text-[11px] truncate">{comp.email}</span>
                  </div>
                  <button
                    onClick={() => handleCopyEmail(comp.email)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0"
                    title="نسخ الإيميل"
                  >
                    {copiedEmail === comp.email ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {comp.secondaryEmail && (
                  <div className="flex items-center justify-between gap-2 bg-slate-900/40 px-2 py-1.5 rounded-xl border border-slate-800/60 text-[11px]">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-[10px] text-slate-500">بديل:</span>
                      <span className="font-mono text-slate-300 truncate">{comp.secondaryEmail}</span>
                    </div>
                    <button
                      onClick={() => handleCopyEmail(comp.secondaryEmail!)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
                    >
                      {copiedEmail === comp.secondaryEmail ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-slate-500" />
                    <span className="font-mono text-slate-300">{comp.phone}</span>
                  </div>
                  <span className="text-[10px] bg-slate-800/80 px-2 py-0.5 rounded text-slate-300 font-mono">
                    الأسطول: {comp.fleetSizeEst}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 italic bg-slate-900/40 p-2 rounded-xl">
                {comp.notes}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
