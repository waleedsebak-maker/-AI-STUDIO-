import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Eye, 
  Trash2, 
  Share2, 
  Calendar, 
  Users, 
  FileText, 
  CheckCircle2,
  Building2,
  ExternalLink
} from 'lucide-react';
import { permitStorage, IssuedPermit } from '../services/permitStorage';

interface PermitsHistoryProps {
  onOpenPermit: (permit: IssuedPermit) => void;
}

export const PermitsHistory: React.FC<PermitsHistoryProps> = ({ onOpenPermit }) => {
  const [permits, setPermits] = useState<IssuedPermit[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const loadPermits = () => {
    setPermits(permitStorage.getPermits());
  };

  useEffect(() => {
    loadPermits();
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('هل ترغب في حذف هذا التصريح من الأرشيف؟')) {
      permitStorage.deletePermit(id);
      loadPermits();
    }
  };

  const filteredPermits = permits.filter(p => {
    const q = searchTerm.toLowerCase();
    return (
      (p.fileNo || '').toLowerCase().includes(q) ||
      (p.companyName || '').toLowerCase().includes(q) ||
      (p.permitLabel || '').toLowerCase().includes(q) ||
      (p.guideName || '').toLowerCase().includes(q) ||
      (p.driverName || '').toLowerCase().includes(q) ||
      (p.vehicleNumber || '').toLowerCase().includes(q) ||
      (p.tripDate || '').includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <span>أرشيف التصاريح الصادرة (سجلات أوفلاين دائمة)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            محفوظة بأمان في الذاكرة المحلية لجهازك، قابلة للفتح والطباعة وإعادة الإرسال عبر WhatsApp بدون إنترنت.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث برقم الملف، الشركة، المرشد..."
            className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl pr-9 pl-4 py-2.5 outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Permits Grid */}
      {filteredPermits.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl space-y-3">
          <FileText className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-slate-400">لا توجد تصاريح محفوظة حتى الآن</p>
          <p className="text-xs text-slate-500">قم بإصدار تصريح جديد من خلال تبويب "إصدار تصريح جديد" ليظهر في أرشيفك هنا.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPermits.map((p) => (
            <div
              key={p.id}
              onClick={() => onOpenPermit(p)}
              className="p-5 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 rounded-2xl cursor-pointer transition-all space-y-3 shadow-md group"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-amber-400 text-base">{p.fileNo}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {p.permitLabel}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">{p.companyName} (ترخيص {p.licenseNumber})</h4>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleDelete(p.id, e)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                    title="حذف من الأرشيف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>تاريخ الرحلة: {p.tripDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-bold text-slate-200">{p.paxCount} سائح</span>
                </div>
                <div className="text-slate-400 truncate">
                  المرشد: {p.guideName}
                </div>
                <div className="text-slate-400 truncate">
                  الحافلة: {p.vehicleNumber || 'معتمدة'}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300">
                <span>فتح الـ 7 ورقات للطباعة والتنزيل</span>
                <Eye className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
