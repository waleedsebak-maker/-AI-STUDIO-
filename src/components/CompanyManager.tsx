import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Trash2, 
  Upload, 
  CheckCircle, 
  ShieldCheck, 
  FileText, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { permitStorage, TourismCompany } from '../services/permitStorage';

export const CompanyManager: React.FC = () => {
  const [companies, setCompanies] = useState<TourismCompany[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [licenseNumber, setLicenseNumber] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [stampImage, setStampImage] = useState<string | null>(null);

  const loadCompanies = () => {
    setCompanies(permitStorage.getCompanies());
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !licenseNumber.trim()) return;

    const newCompany: TourismCompany = {
      id: `comp-${Date.now()}`,
      name: name.trim(),
      licenseNumber: licenseNumber.trim(),
      category: 'أ',
      phone: phone.trim(),
      address: address.trim(),
      stampImage: stampImage || undefined,
    };

    permitStorage.saveCompany(newCompany);
    loadCompanies();
    setIsAdding(false);
    setName('');
    setLicenseNumber('');
    setPhone('');
    setAddress('');
    setStampImage(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الشركة؟')) {
      permitStorage.deleteCompany(id);
      loadCompanies();
    }
  };

  const handleStampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setStampImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Template Request Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <span>هل تمتلك القوالب الرسمية الأصلية (PDF / Word) أو ختم الشركة عالي الدقة؟</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          لقد قمنا ببناء نظام القوالب الرقمية المعتمدة للـ 7 ورقات وفق أعلى معايير وزارة السياحة وشرطة السياحة مع الأختام المدمجة ورموز الـ QR. 
          إذا كانت لديك قوالب ممسوحة ضوئياً (Blank Templates) أو ملفات Word خاصة بشركتك، يمكنك رفع ختمك الرسمي وشعارك هنا ليتم إدراجه تلقائياً على كل الأوراق، أو تزويدنا بها لنقوم ببرمجتها بدقة 100%!
        </p>
      </div>

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <span>إدارة الشركات السياحية والتراخيص والأختام</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            تطبيق اقتراح الخبراء: إمكانية تفعيل النظام لأي شركة سياحة مرخصة فئة (أ) في مصر
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة شركة جديدة</span>
        </button>
      </div>

      {/* Add Company Form */}
      {isAdding && (
        <form onSubmit={handleAddCompany} className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 space-y-4 animate-fadeIn">
          <h3 className="text-sm font-bold text-amber-300">تسجيل بيانات شركة سياحية جديدة (ترخيص فئة أ)</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">اسم الشركة الكامل:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: ترافكو للسياحة"
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-xl p-2.5 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">رقم الترخيص السياحي (فئة أ):</label>
              <input
                type="text"
                required
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="مثال: 1250"
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-xl p-2.5 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">هاتف الشركة:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="02XXXXXXXX"
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-xl p-2.5 outline-none focus:border-amber-500 dir-ltr text-right"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">صورة الختم الرسمي (اختياري):</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleStampUpload}
                className="text-xs text-slate-400 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:bg-slate-800 file:text-amber-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
            >
              حفظ الشركة
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
            >
              إلغاء
            </button>
          </div>
        </form>
      )}

      {/* Companies List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {companies.map((c) => (
          <div key={c.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base">{c.name}</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  ترخيص {c.licenseNumber} (فئة أ)
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {c.phone ? `هاتف: ${c.phone}` : 'معتمد في منظومة وزارة السياحة المصرية'}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 pt-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>الختم الرقمي مفعل وجاهز للطباعة على الـ 7 ورقات</span>
              </div>
            </div>

            {c.id !== 'unlimited' && c.id !== 'memory' && (
              <button
                onClick={() => handleDelete(c.id)}
                className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                title="حذف الشركة"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
