import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  Smartphone, 
  X, 
  Copy, 
  Check, 
  Share2, 
  Download, 
  ExternalLink, 
  Sparkles,
  ArrowRight,
  HelpCircle,
  QrCode
} from 'lucide-react';

interface PhoneInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhoneInstallModal: React.FC<PhoneInstallModalProps> = ({ isOpen, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [deviceTab, setDeviceTab] = useState<'android' | 'ios'>('android');

  // Fallback to shared URL if inside iframe
  const appUrl = typeof window !== 'undefined'
    ? (window.location.origin.includes('localhost') 
        ? 'https://ais-pre-mhc4f3rn3wjcqauhbv7viy-243591669298.europe-west2.run.app'
        : window.location.href)
    : 'https://ais-pre-mhc4f3rn3wjcqauhbv7viy-243591669298.europe-west2.run.app';

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(appUrl, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 300,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR Gen error:', err));
    }
  }, [isOpen, appUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendToWhatsApp = () => {
    const text = `رابط تثبيت تطبيق تصاريح النقل السياحي على الهاتف:\n${appUrl}\n\n(افتح الرابط على هاتفك ثم اضغط "إضافة إلى الشاشة الرئيسية" ليثبت كأيقونة على هاتفك).`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-0 my-auto text-right">
        {/* Modal Top Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 p-5 text-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center shadow-md font-black text-lg">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black leading-tight">
                طريقة تنزيل وتثبيت التطبيق على هاتفك المحمول
              </h2>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                خطوتان بسيطتان ليصبح التطبيق على شاشة موبايلك ويعمل أوفلاين
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-950/20 hover:bg-slate-950/30 text-slate-950 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Quick Notice about iFrame */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-xs text-amber-200">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-semibold">
              <strong className="text-white">لماذا لم يبدأ التحميل تلقائياً؟</strong> لأنك تتصفح الآن من داخل نافذة المنصة السحابية. لتثبيت أي تطبيق (PWA) على هاتفك، يجب أولاً <strong className="text-amber-300">فتح الرابط المباشر في متصفح هاتفك (Safari أو Chrome)</strong>.
            </p>
          </div>

          {/* STEP 1: Open on Phone via QR or WhatsApp */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center">1</span>
              <span>الخطوة الأولى: افتح الرابط على هاتفك المحمول</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-md border border-slate-200">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="QR Code" className="w-40 h-40 object-contain" />
                ) : (
                  <div className="w-40 h-40 flex items-center justify-center text-slate-400 text-xs">جاري إنشاء الباركود...</div>
                )}
                <div className="flex items-center gap-1.5 mt-2 text-[11px] font-black text-slate-900">
                  <QrCode className="w-3.5 h-3.5 text-amber-600" />
                  <span>امسح بكاميرا هاتفك الآن</span>
                </div>
              </div>

              {/* Action buttons to send to mobile */}
              <div className="space-y-2.5">
                <p className="text-xs text-slate-300 leading-relaxed">
                  وجّه كاميرا هاتفك نحو الباركود، أو اختر الطريقة الأنسب لك:
                </p>

                <button
                  onClick={handleSendToWhatsApp}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>أرسل الرابط إلى واتساب الخاص بي</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'تم نسخ الرابط بنجاح!' : 'نسخ رابط التطبيق المباشر'}</span>
                </button>

                <div className="text-[10px] text-slate-500 font-mono truncate text-left dir-ltr p-1.5 bg-slate-900 rounded border border-slate-800">
                  {appUrl}
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: Instructions by OS */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center">2</span>
              <span>الخطوة الثانية: تثبيت التطبيق كأيقونة على الشاشة الرئيسية</span>
            </h3>

            {/* Platform Selector Tabs */}
            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setDeviceTab('android')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  deviceTab === 'android'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🤖 لهواتف أندرويد (سامسونج، شاومي، أوبو، ريلمي)
              </button>
              <button
                onClick={() => setDeviceTab('ios')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  deviceTab === 'ios'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🍏 لهواتف آيفون (Apple iOS)
              </button>
            </div>

            {/* Android Instructions */}
            {deviceTab === 'android' && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span>افتح الرابط في متصفح <strong className="text-white">Google Chrome</strong> على هاتفك.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span>ستظهر لك رسالة منبثقة بالأسفل أو اضغط على <strong className="text-white">زر القائمة (الثلاث نقاط)</strong> أعلى يسار المتصفح.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span>اختر <strong className="text-amber-400 font-black">"تثبيت التطبيق" (Install app)</strong> أو <strong className="text-amber-400 font-black">"إضافة إلى الشاشة الرئيسية" (Add to Home screen)</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
                  <span>مبروك! ستظهر أيقونة التطبيق الذهبية على شاشة هاتفك فوراً، وبضغطة واحدة يفتح التطبيق بكامل الشاشة وبدون شريط المتصفح!</span>
                </div>
              </div>
            )}

            {/* iOS Instructions */}
            {deviceTab === 'ios' && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span>تأكد من فتح الرابط في متصفح <strong className="text-white">Safari</strong> (متصفح آبل الأساسي).</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span>اضغط على زر المشاركة أسفل المتصفح <strong className="text-white">(المربع الأزرق الذي يخرج منه سهم للأعلى ⬆️)</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span>مرر للأسفل في القائمة واضغط على <strong className="text-amber-400 font-black">"إضافة إلى الشاشة الرئيسية" (Add to Home Screen ➕)</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
                  <span>اضغط على زر <strong className="text-white font-black">"إضافة" (Add)</strong> في أعلى الزاوية. سيصبح التطبيق متاحاً على شاشة هاتفك الرئيسية تماماً كأي تطبيق من App Store!</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>التطبيق آمن وخفيف ولا يشغل مساحة من ذاكرة الهاتف.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors"
          >
            فهمت، شكراً
          </button>
        </div>
      </div>
    </div>
  );
};
