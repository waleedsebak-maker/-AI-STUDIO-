import React, { useState } from 'react';
import { Smartphone, Download, CheckCircle2 } from 'lucide-react';
import { PhoneInstallModal } from './PhoneInstallModal';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { isInstalled, isInstallable, install } = usePWAInstall();

  const handleClick = async () => {
    // If browser natively supports beforeinstallprompt right now, try it first
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setIsModalOpen(true);
      }
    } else {
      // Otherwise open the Phone Connect & Install modal with QR code & WhatsApp link
      setIsModalOpen(true);
    }
  };

  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>مثبت على هاتفك</span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs md:text-sm shadow-md shadow-amber-500/20 transition-all active:scale-95 animate-pulse"
      >
        <Smartphone className="w-4 h-4" />
        <span>تثبيت التطبيق على هاتفك</span>
      </button>

      <PhoneInstallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
