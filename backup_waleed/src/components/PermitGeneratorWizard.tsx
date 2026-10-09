import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  FileSpreadsheet, 
  UploadCloud, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  User, 
  Phone, 
  Calendar, 
  MapPin, 
  Truck, 
  Sparkles, 
  Plus, 
  Lock, 
  Unlock,
  AlertCircle,
  Eye,
  Layers,
  ArrowRight,
  Download,
  Compass,
  FileCheck2,
  Route,
  Zap,
  X,
  Trash2,
  BookmarkCheck,
  Save,
  Hotel,
  Search,
  Languages,
  UserPlus
} from 'lucide-react';
import { 
  permitStorage, 
  TourismCompany, 
  IssuedPermit, 
  INITIAL_COMPANIES 
} from '../services/permitStorage';
import { TouristPassenger, RouteCategoryType, PermitRouteType } from '../types';
import { SAMPLE_PASSENGERS } from '../data/projectData';
import { TriLingualAuditModal } from './TriLingualAuditModal';

interface PermitGeneratorWizardProps {
  onPermitGenerated: (permit: IssuedPermit) => void;
  onOpenCompanyManager: () => void;
}

export const PermitGeneratorWizard: React.FC<PermitGeneratorWizardProps> = ({ 
  onPermitGenerated,
  onOpenCompanyManager 
}) => {
  const [companies, setCompanies] = useState<TourismCompany[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('unlimited');
  
  // Pathway selection: shared_routes vs hurghada_route
  const [routeCategory, setRouteCategory] = useState<RouteCategoryType>('shared_routes');
  const [permitType, setPermitType] = useState<PermitRouteType>('cairo');
  // Auto-filled default file number so submission is NEVER blocked, user can edit anytime
  const [fileNo, setFileNo] = useState<string>(() => `CH${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-14GZL`);
  const [submitError, setSubmitError] = useState<string>('');
  
  // Pax & Manual Lock
  const [pax, setPax] = useState<number>(SAMPLE_PASSENGERS.length);
  const [isManualPax, setIsManualPax] = useState<boolean>(false);

  // Guide & Phone (starts EMPTY, linked together)
  const [guide, setGuide] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [guideDirectory, setGuideDirectory] = useState<Record<string, string>>({});
  const [showAddGuideModal, setShowAddGuideModal] = useState<boolean>(false);
  const [newGuideName, setNewGuideName] = useState<string>('');
  const [newGuidePhone, setNewGuidePhone] = useState<string>('');

  // Dates
  const [tripDate, setTripDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [issueDate, setIssueDate] = useState<string>(new Date().toISOString().slice(0, 10));

  // Itinerary & Hotels
  const [programText, setProgramText] = useState<string>('زعفرانه – خان – ازهر – مصر القديمه – عشاء – الفندق');
  const [hotelFrom, setHotelFrom] = useState<string>('');
  const [hotelTo, setHotelTo] = useState<string>('');
  const [savedHotels, setSavedHotels] = useState<string[]>([]);
  const [hotelPickerTarget, setHotelPickerTarget] = useState<'from' | 'to' | null>(null);
  const [hotelSearchQuery, setHotelSearchQuery] = useState<string>('');
  const [hotelFilterCity, setHotelFilterCity] = useState<string>('all');
  const [newHotelArchiveName, setNewHotelArchiveName] = useState<string>('');

  // Guide & Driver Modal Pickers
  const [showGuidePickerModal, setShowGuidePickerModal] = useState<boolean>(false);
  const [guideSearchQuery, setGuideSearchQuery] = useState<string>('');
  const [showDriverPickerModal, setShowDriverPickerModal] = useState<boolean>(false);
  const [driverSearchQuery, setDriverSearchQuery] = useState<string>('');

  // Transport details (OPTIONAL - not mandatory, no forced bus or defaults)
  // Starts completely empty so user never has to backspace or erase
  const [transportCompany, setTransportCompany] = useState<string>('');
  const [vehicleNumber, setVehicleNumber] = useState<string>('');
  const [chassisNumber, setChassisNumber] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<'أتوبيس' | 'كوستر' | 'ميكروباص' | 'ليموزين' | ''>('');
  
  // Driver & Driver Phone (starts EMPTY, linked together)
  const [driverName, setDriverName] = useState<string>('');
  const [driverPhone, setDriverPhone] = useState<string>('');
  const [driverDirectory, setDriverDirectory] = useState<Record<string, string>>({});
  const [savedVehicles, setSavedVehicles] = useState<string[]>([]);
  const [savedTransportCompanies, setSavedTransportCompanies] = useState<string[]>([]);
  const [showAddDriverModal, setShowAddDriverModal] = useState<boolean>(false);
  const [newDriverName, setNewDriverName] = useState<string>('');
  const [newDriverPhone, setNewDriverPhone] = useState<string>('');
  const [showAddVehicleModal, setShowAddVehicleModal] = useState<boolean>(false);
  const [newVehiclePlate, setNewVehiclePlate] = useState<string>('');

  const [backupDriverName, setBackupDriverName] = useState<string>('');
  const [backupDriverPhone, setBackupDriverPhone] = useState<string>('');
  const [governorateBranch, setGovernorateBranch] = useState<'البحر الأحمر' | 'بالاقصر'>('البحر الأحمر');
  const [submitterName, setSubmitterName] = useState<string>('رائد ناجح فرج عبد السيد');
  const [submitterNationalId, setSubmitterNationalId] = useState<string>('29704062702113');

  // Passengers list
  const [passengers, setPassengers] = useState<TouristPassenger[]>(SAMPLE_PASSENGERS);
  const [excelFileName, setExcelFileName] = useState<string>('كشف الـ 7 سياح القياسي المعتمد');
  const [excelAuditNotice, setExcelAuditNotice] = useState<string>('');
  const [isParsingExcel, setIsParsingExcel] = useState<boolean>(false);
  const [showAuditModal, setShowAuditModal] = useState<boolean>(false);
  const [showAddPassengerModal, setShowAddPassengerModal] = useState<boolean>(false);
  const [newPaxChinese, setNewPaxChinese] = useState<string>('');
  const [newPaxEnglish, setNewPaxEnglish] = useState<string>('');
  const [newPaxSex, setNewPaxSex] = useState<'ذكر' | 'أنثى'>('ذكر');
  const [newPaxPassport, setNewPaxPassport] = useState<string>('');
  const [newPaxDob, setNewPaxDob] = useState<string>('1990-01-01');
  const [newPaxExpiry, setNewPaxExpiry] = useState<string>('2030-01-01');
  const [newPaxRoom, setNewPaxRoom] = useState<string>('101');

  // Attachments
  const [programImage, setProgramImage] = useState<string | null>(null);
  const [extraPageImage, setExtraPageImage] = useState<string | null>(null);

  // Status & Loading
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const comps = permitStorage.getCompanies();
    setCompanies(comps);
    setGuideDirectory(permitStorage.getGuideDirectory());
    setDriverDirectory(permitStorage.getDriverDirectory());
    setSavedVehicles(permitStorage.getSavedVehicles());
    setSavedTransportCompanies(permitStorage.getSavedTransportCompanies());
    setSavedHotels(permitStorage.getSavedHotels());
  }, []);

  // Hotel Picker Handlers
  const handleOpenHotelPicker = (target: 'from' | 'to') => {
    setHotelPickerTarget(target);
    setHotelSearchQuery('');
    setHotelFilterCity('all');
  };

  const handleSelectHotelFromArchive = (hotel: string) => {
    if (hotelPickerTarget === 'from') {
      setHotelFrom(hotel);
    } else if (hotelPickerTarget === 'to') {
      handleHotelToChange(hotel);
    }
    setHotelPickerTarget(null);
  };

  const handleSaveHotelToArchive = (hotelToSave?: string) => {
    const val = (hotelToSave || newHotelArchiveName || (hotelPickerTarget === 'from' ? hotelFrom : hotelTo)).trim();
    if (!val) return;
    permitStorage.saveHotel(val);
    setSavedHotels(permitStorage.getSavedHotels());
    setNewHotelArchiveName('');
  };

  const handleDeleteHotelFromArchive = (hotelToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    permitStorage.deleteHotel(hotelToDelete);
    setSavedHotels(permitStorage.getSavedHotels());
  };

  const handleDeleteDriver = (driverToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    permitStorage.deleteDriverPair(driverToDelete);
    setDriverDirectory(permitStorage.getDriverDirectory());
    if (driverName === driverToDelete) {
      setDriverName('');
      setDriverPhone('');
    }
  };

  const handleDeleteGuide = (guideToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    permitStorage.deleteGuidePair(guideToDelete);
    setGuideDirectory(permitStorage.getGuideDirectory());
    if (guide === guideToDelete) {
      setGuide('');
      setPhone('');
    }
  };

  // Guide Handlers (مقترن تلقائياً بالهاتف)
  const handleGuideSelect = (name: string) => {
    setGuide(name);
    if (name && guideDirectory[name]) {
      setPhone(guideDirectory[name]);
    }
  };

  const handleGuideInputChange = (name: string) => {
    setGuide(name);
    if (guideDirectory[name.trim()]) {
      setPhone(guideDirectory[name.trim()]);
    }
  };

  const handleSaveNewGuide = () => {
    if (!newGuideName.trim()) return;
    permitStorage.saveGuidePair(newGuideName.trim(), newGuidePhone.trim());
    const updated = permitStorage.getGuideDirectory();
    setGuideDirectory(updated);
    setGuide(newGuideName.trim());
    setPhone(newGuidePhone.trim());
    setShowAddGuideModal(false);
    setNewGuideName('');
    setNewGuidePhone('');
  };

  // Driver Handlers (مقترن تلقائياً بالهاتف)
  const handleDriverSelect = (name: string) => {
    setDriverName(name);
    if (name && driverDirectory[name]) {
      setDriverPhone(driverDirectory[name]);
    }
  };

  const handleDriverInputChange = (name: string) => {
    setDriverName(name);
    if (driverDirectory[name.trim()]) {
      setDriverPhone(driverDirectory[name.trim()]);
    }
  };

  const handleSaveNewDriver = () => {
    if (!newDriverName.trim()) return;
    permitStorage.saveDriverPair(newDriverName.trim(), newDriverPhone.trim());
    const updated = permitStorage.getDriverDirectory();
    setDriverDirectory(updated);
    setDriverName(newDriverName.trim());
    setDriverPhone(newDriverPhone.trim());
    setShowAddDriverModal(false);
    setNewDriverName('');
    setNewDriverPhone('');
  };

  // Vehicle Numbers Handlers (يحفظ أرقام العربيات المكررة)
  const handleVehicleSelect = (plate: string) => {
    setVehicleNumber(plate);
  };

  const handleSaveVehicleNumber = (plateToSave?: string) => {
    const val = (plateToSave || newVehiclePlate || vehicleNumber).trim();
    if (!val) return;
    permitStorage.saveVehicleNumber(val);
    setSavedVehicles(permitStorage.getSavedVehicles());
    setVehicleNumber(val);
    setNewVehiclePlate('');
    setShowAddVehicleModal(false);
  };

  const handleDeleteSavedVehicle = (plateToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    permitStorage.deleteVehicleNumber(plateToDelete);
    setSavedVehicles(permitStorage.getSavedVehicles());
    if (vehicleNumber === plateToDelete) {
      setVehicleNumber('');
    }
  };

  // Transport Company Handlers
  const handleTransportCompanySelect = (comp: string) => {
    setTransportCompany(comp);
  };

  // Helper to sync destination hotel / airport into program text
  const handleHotelToChange = (newHotelTo: string) => {
    const prev = hotelTo;
    setHotelTo(newHotelTo);
    setProgramText(current => {
      if (prev && current.includes(prev)) {
        return current.replace(prev, newHotelTo || 'الفندق');
      }
      if (current.includes('الفندق')) {
        return current.replace('الفندق', newHotelTo || 'الفندق');
      }
      return current;
    });
  };

  const handleRouteCategoryChange = (category: RouteCategoryType) => {
    setRouteCategory(category);
    if (category === 'shared_routes') {
      setPermitType('cairo');
      setProgramText(`زعفرانه – خان – ازهر – مصر القديمه – عشاء – ${hotelTo || 'المقصد'}`);
      setGovernorateBranch('البحر الأحمر');
      setExtraPageImage(null);
    } else {
      setPermitType('hurghada');
      setProgramText(`دندره 85 – طريق الغردقة – ${hotelTo || 'الغردقة'}`);
      setGovernorateBranch('بالاقصر');
    }
  };

  const handlePermitTypeChange = (type: PermitRouteType) => {
    setPermitType(type);
    const dest = hotelTo || 'المقصد';
    if (type === 'hurghada') {
      setRouteCategory('hurghada_route');
      setProgramText(`دندره 85 – طريق الغردقة – ${dest}`);
      setGovernorateBranch('بالاقصر');
    } else {
      setRouteCategory('shared_routes');
      if (type === 'cairo') {
        setProgramText(`زعفرانه – خان – ازهر – مصر القديمه – عشاء – ${dest}`);
        setGovernorateBranch('البحر الأحمر');
      } else if (type === 'luxor_transfer') {
        setProgramText(`85 – دندره – ملوك – ممنون – ${dest}`);
      } else if (type === 'luxor_overnight') {
        setProgramText(`85 – دندره – ملوك – ممنون – مبيت ${dest}`);
      }
    }
  };

  const handleCompanySelect = (compId: string) => {
    setSelectedCompanyId(compId);
    const comp = companies.find(c => c.id === compId);
    if (comp) {
      if (comp.submitterName) setSubmitterName(comp.submitterName);
      if (comp.submitterNationalId) setSubmitterNationalId(comp.submitterNationalId);
    } else if (compId === 'unlimited') {
      setSubmitterName('رائد ناجح فرج عبد السيد');
      setSubmitterNationalId('29704062702113');
    } else if (compId === 'memory') {
      setSubmitterName('محمد عبدالناصر محمد');
      setSubmitterNationalId('29009011328331');
    }
  };

  // Quick Preset Buttons
  const applyQuickPreset = (companyId: string, pType: PermitRouteType) => {
    handleCompanySelect(companyId);
    handlePermitTypeChange(pType);
  };

  // 1-Click Complete Demo Sample Loaders for Cairo and Hurghada
  const loadCompleteCairoSample = () => {
    handleCompanySelect('unlimited');
    setRouteCategory('shared_routes');
    setPermitType('cairo');
    setFileNo('CH202610-09GZL');
    setPax(SAMPLE_PASSENGERS.length);
    setGuide('أحمد منصور');
    setPhone('01012345678');
    setTripDate(new Date().toISOString().slice(0, 10));
    setProgramText('زعفرانه – خان – ازهر – مصر القديمه – عشاء – الفندق');
    setHotelFrom('فندق رمسيس هيلتون');
    setHotelTo('فندق ميركيور الأقصر');
    setTransportCompany('ميد إيجيبت للنقل السياحي');
    setVehicleNumber('س ي ف 1234');
    setVehicleType('أتوبيس');
    setDriverName('محمد إبراهيم السيد');
    setDriverPhone('01099887766');
    setGovernorateBranch('البحر الأحمر');
    setSubmitterName('رائد ناجح فرج عبد السيد');
    setSubmitterNationalId('29704062702113');
    setPassengers(SAMPLE_PASSENGERS);
    setExtraPageImage(null);
  };

  const loadCompleteHurghadaSample = () => {
    handleCompanySelect('memory');
    setRouteCategory('hurghada_route');
    setPermitType('hurghada');
    setFileNo('CH202610-14GZL');
    setPax(SAMPLE_PASSENGERS.length);
    setGuide('محمود الشناوي');
    setPhone('01198765432');
    setTripDate(new Date().toISOString().slice(0, 10));
    setProgramText('دندره 85 – طريق الغردقة');
    setHotelFrom('مرسى الأقصر السياحي');
    setHotelTo('منتجع شتايجنبرجر الداو الغردقة');
    setTransportCompany('ميمورى تريب للنقل السياحي');
    setVehicleNumber('ط ر ج 5678');
    setVehicleType('أتوبيس');
    setDriverName('أحمد كمال عبد الله');
    setDriverPhone('01223344556');
    setGovernorateBranch('بالاقصر');
    setSubmitterName('محمد عبدالناصر محمد');
    setSubmitterNationalId('29009011328331');
    setPassengers(SAMPLE_PASSENGERS);
  };

  // Excel File Upload Handler
  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelFileName(file.name);
    setIsParsingExcel(true);
    setExcelAuditNotice('');

    try {
      const parsed = await permitStorage.parseRoomingExcel(file);
      if (parsed.length > 0) {
        setPassengers(parsed);
        setExcelAuditNotice(
          `تم فحص وتدقيق الملف بنجاح عبر محرك اللغات الثلاث: تم استخراج ${parsed.length} سياح معتمدين رسمياً وتصفية أي بيانات إضافية (صف قائد الفوج TL وملاحظات الغرف والإجمالي).`
        );
        // تم فصل عدد الزبائن المعتمد تماماً عن كشف الروم ليست: العدد المكتوب بالخانة هو المعتمد دائماً ولا يتغير تلقائياً
      }
    } catch (err: any) {
      alert(`تنبيه في قراءة ملف الإكسل: ${err.message || 'تعذر القراءة'}`);
    } finally {
      setIsParsingExcel(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setter(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const downloadSampleTemplate = () => {
    const csvContent = "\uFEFF" + "م,الاسم بالصيني,الاسم بالإنجليزي,النوع,الميلاد,الجواز,الانتهاء,الغرفة\n" +
      "1,王伟,WANG WEI,ذكر,1985-04-12,EJ4891023,2030-05-18,101\n" +
      "2,李娜,LI NA,أنثى,1988-11-23,EJ5910244,2031-08-14,101\n" +
      "3,张敏,ZHANG MIN,أنثى,1992-02-05,EJ7182901,2029-12-01,102\n" +
      "4,刘洋,LIU YANG,ذكر,1979-07-30,EJ3849102,2028-09-09,103\n" +
      "5,陈静,CHEN JING,أنثى,1981-10-15,EJ9012485,2032-01-20,103\n" +
      "6,赵强,ZHAO QIANG,ذكر,1987-03-25,EJ6124890,2031-04-10,104\n" +
      "7,孙丽,SUN LI,أنثى,1990-09-18,EJ8340192,2030-10-05,104\n";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'قالب_الروم_ليست_السياحي_7_سياح.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeletePassenger = (id: number) => {
    setPassengers(prev => prev.filter(p => p.id !== id).map((p, idx) => ({ ...p, id: idx + 1 })));
  };

  const handleUpdatePassenger = (id: number, field: keyof TouristPassenger, value: string) => {
    setPassengers(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  const handleAddNewPassenger = () => {
    if (!newPaxChinese.trim() && !newPaxEnglish.trim()) {
      alert('يرجى إدخال اسم السائح بالصيني أو بالإنجليزي على الأقل.');
      return;
    }
    const newId = passengers.length + 1;
    const added: TouristPassenger = {
      id: newId,
      chinese: newPaxChinese.trim() || `سائح ${newId}`,
      english: (newPaxEnglish.trim() || `TOURIST ${newId}`).toUpperCase(),
      sex: newPaxSex,
      passport: (newPaxPassport.trim() || `E${2000000 + newId}`).toUpperCase(),
      dob: newPaxDob || '1990-01-01',
      expiry: newPaxExpiry || '2030-01-01',
      room: newPaxRoom || `${101 + Math.floor((newId - 1) / 2)}`
    };
    setPassengers(prev => [...prev, added]);
    setShowAddPassengerModal(false);
    setNewPaxChinese('');
    setNewPaxEnglish('');
    setNewPaxPassport('');
  };

  const handleResetToStandard7Pax = () => {
    setPassengers(SAMPLE_PASSENGERS);
    setExcelFileName('كشف الـ 7 سياح القياسي المعتمد');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const activeCompany = companies.find(c => c.id === selectedCompanyId) || companies[0] || INITIAL_COMPANIES[0];

      // Safe saving of memory items (non-blocking)
      try {
        if (guide.trim() && phone.trim()) {
          permitStorage.saveGuidePair(guide.trim(), phone.trim());
        }
        if (driverName.trim()) {
          permitStorage.saveDriverPair(driverName.trim(), driverPhone.trim());
        }
        if (vehicleNumber.trim()) {
          permitStorage.saveVehicleNumber(vehicleNumber.trim());
        }
        if (transportCompany.trim()) {
          permitStorage.saveTransportCompany(transportCompany.trim());
        }
        if (hotelFrom.trim()) {
          permitStorage.saveHotel(hotelFrom.trim());
        }
        if (hotelTo.trim()) {
          permitStorage.saveHotel(hotelTo.trim());
        }
      } catch (memErr) {
        console.warn('Memory save warning:', memErr);
      }

      // Clean official permit labels without internal notes like (مسار مشترك)
      const permitLabelMap: Record<string, string> = {
        cairo: 'توصيلة القاهرة',
        luxor_transfer: 'توصيلة الأقصر',
        luxor_overnight: 'مبيت الأقصر',
        hurghada: 'توصيلة الغردقة من الأقصر'
      };

      // Ensure "الفندق" is replaced by the actual destination hotel or airport
      let finalProgram = (programText || '').trim() || 'زعفرانه – خان – ازهر – مصر القديمه – عشاء – الفندق';
      if (hotelTo && finalProgram.includes('الفندق')) {
        finalProgram = finalProgram.replace(/الفندق/g, hotelTo);
      } else if (hotelTo && !finalProgram.includes(hotelTo)) {
        finalProgram = `${finalProgram} – ${hotelTo}`;
      }

      const generatedFileNo = (fileNo || '').trim() || `CH${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(10 + Math.random() * 89)}GZL`;
      const finalTripDate = (tripDate || '').trim() || new Date().toISOString().slice(0, 10);
      const finalIssueDate = (issueDate || '').trim() || new Date().toISOString().slice(0, 10);
      const finalPaxCount = pax && pax > 0 ? pax : (passengers.length > 0 ? passengers.length : 7);

      const newPermit: IssuedPermit = {
        id: `permit-${Date.now()}`,
        fileNo: generatedFileNo,
        companyId: activeCompany.id,
        companyName: activeCompany.name,
        licenseNumber: activeCompany.licenseNumber,
        permitType,
        permitLabel: permitLabelMap[permitType] || permitType,
        tripDate: finalTripDate,
        issueDate: finalIssueDate,
        paxCount: finalPaxCount,
        guideName: (guide || '').trim(),
        guidePhone: (phone || '').trim(),
        driverName: (driverName || '').trim(),
        driverPhone: (driverPhone || '').trim(),
        backupDriverName: (backupDriverName || '').trim(),
        backupDriverPhone: (backupDriverPhone || '').trim(),
        vehicleNumber: (vehicleNumber || '').trim(),
        chassisNumber: (chassisNumber || '').trim(),
        vehicleType: (vehicleType || '').trim(),
        transportCompany: (transportCompany || '').trim(),
        hotelFrom: (hotelFrom || '').trim(),
        hotelTo: (hotelTo || '').trim(),
        programText: finalProgram,
        submitterName: (submitterName || '').trim() || activeCompany.submitterName || 'رائد ناجح فرج عبد السيد',
        submitterNationalId: (submitterNationalId || '').trim() || activeCompany.submitterNationalId || '29704062702113',
        governorateBranch,
        passengers: passengers.length > 0 ? passengers : SAMPLE_PASSENGERS,
        createdAt: new Date().toISOString(),
        hasProgramImage: !!programImage,
        hasExtraPage: !!extraPageImage,
        programImageData: programImage || undefined,
        extraPageData: extraPageImage || undefined,
      };

      // Generate Road Checkpoint QR Code safely
      try {
        const qrCode = await permitStorage.generatePermitQR(newPermit);
        newPermit.qrCodeDataUrl = qrCode;
      } catch (qrErr) {
        console.warn('QR Code generation warning:', qrErr);
      }

      // Save to local persistence safely without blocking the permit viewing
      try {
        permitStorage.savePermit(newPermit);
      } catch (storageErr) {
        console.warn('Permit storage warning:', storageErr);
      }

      // Refresh memory lists
      try {
        setGuideDirectory(permitStorage.getGuideDirectory());
        setDriverDirectory(permitStorage.getDriverDirectory());
        setSavedVehicles(permitStorage.getSavedVehicles());
        setSavedTransportCompanies(permitStorage.getSavedTransportCompanies());
        setSavedHotels(permitStorage.getSavedHotels());
      } catch (refreshErr) {
        console.warn('Refresh memory warning:', refreshErr);
      }

      // Open the 7-page viewer immediately!
      onPermitGenerated(newPermit);
    } catch (err: any) {
      console.error('Error generating permit:', err);
      setSubmitError(err?.message || 'تعذر إصدار التصريح، يرجى مراجعة البيانات والمحاولة مجدداً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isHurghada = permitType === 'hurghada';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Wizard Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>نظام إعداد وتجميع الـ 7 ورقات الرسمية (مفصول المسارين 100%)</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mt-1">
            إصدار تصريح نقل سياحي رسمي معتمد
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5">
            يدعم شركات السياحة فئة (أ)، مع الفصل الدقيق بين مسار الغردقة ومسارات القاهرة والأقصر المشتركة.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCompanyManager}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Building2 className="w-4 h-4" />
          <span>إدارة الشركات والأختام الرسمية</span>
        </button>
      </div>

      {/* 1-Click Fast Full Demos Selector */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white">تعبئة نموذج تجريبي فوري متطابق مع موقع بايثون:</h4>
            <p className="text-[11px] text-slate-400">انقر لتعبئة كافة بيانات المسار المختار ومعاينته في ثوانٍ معدودة</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={loadCompleteCairoSample}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>⚡ تعبئة مسار القاهرة (ان ليميتد)</span>
          </button>

          <button
            type="button"
            onClick={loadCompleteHurghadaSample}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>⚡ تعبئة مسار الغردقة + شرطة الأقصر (ميمورى)</span>
          </button>
        </div>
      </div>

      {/* Main Wizard Form with noValidate to prevent silent browser blocking */}
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        
        {/* ========================================================================= */}
        {/* SECTION 1: Pathway & Route Mode Selection (CRITICAL SEPARATION) */}
        {/* ========================================================================= */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Route className="w-4 h-4 text-amber-400" />
              <span>1. تحديد مسار الرحلة ونظام الـ 7 ورقات المطلوب</span>
            </h3>
            <span className="text-[11px] text-amber-400 font-mono font-bold">فصل المسارين معتمد</span>
          </div>

          {/* TWO MAIN PATHWAY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Pathway 1: Shared Routes (Cairo / Luxor Transfer / Luxor Overnight) */}
            <div 
              onClick={() => handleRouteCategoryChange('shared_routes')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                routeCategory === 'shared_routes'
                  ? 'bg-slate-800/80 border-emerald-500 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  المسارات المشتركة للشركتين
                </span>
                <span className="text-xs font-mono font-bold text-slate-300">7 ورقات موحدة</span>
              </div>
              <h4 className="text-sm font-extrabold text-white mb-1">
                مسار القاهرة وتوصيلة الأقصر ومبيت الأقصر
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                تشترك فيه الشركتان (ان ليميتد + ميمورى): يتكون الملف من <strong>3 إخطارات رقم 6</strong> + <strong>3 نسخ أصلية من النيم ليست</strong> (نسخة لكل جهة) + <strong>استمارة إدارة البرامج</strong> (الورقة 7).
              </p>
            </div>

            {/* Pathway 2: Hurghada Transfer from Luxor */}
            <div 
              onClick={() => handleRouteCategoryChange('hurghada_route')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                routeCategory === 'hurghada_route'
                  ? 'bg-slate-800/80 border-amber-500 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  مسار توصيلة الغردقة من الأقصر
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">7 ورقات موحدة</span>
              </div>
              <h4 className="text-sm font-extrabold text-white mb-1">
                توصيلة الغردقة (الأقصر - الغردقة)
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                يتكون الملف من <strong>3 إخطارات رقم 6</strong> + <strong>نسخة واحدة من النيم ليست (4)</strong> + <strong>إدارة البرامج (5)</strong> + <strong>إخطار شرطة الأقصر (6)</strong> + <strong>الورقة الإضافية الملحقة (7)</strong>.
              </p>
            </div>

          </div>

          {/* Quick Presets Classified Clearly */}
          <div className="space-y-2 pt-1 border-t border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 block">اختصارات الشركات والمسارات بنقرة واحدة:</span>
            
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] text-slate-500 font-bold ml-1">مسارات مشتركة:</span>
                <button
                  type="button"
                  onClick={() => applyQuickPreset('unlimited', 'cairo')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    permitType === 'cairo' && selectedCompanyId === 'unlimited'
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  قاهرة / ان ليميتد (2257)
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickPreset('unlimited', 'luxor_transfer')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    permitType === 'luxor_transfer' && selectedCompanyId === 'unlimited'
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  توصيلة أقصر / ان ليميتد
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickPreset('unlimited', 'luxor_overnight')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    permitType === 'luxor_overnight' && selectedCompanyId === 'unlimited'
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  مبيت أقصر / ان ليميتد
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickPreset('memory', 'cairo')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    permitType === 'cairo' && selectedCompanyId === 'memory'
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  قاهرة / ميمورى (1586)
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickPreset('memory', 'luxor_transfer')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    permitType === 'luxor_transfer' && selectedCompanyId === 'memory'
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  توصيلة أقصر / ميمورى
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] text-amber-500 font-bold ml-1">مسار الغردقة:</span>
                <button
                  type="button"
                  onClick={() => applyQuickPreset('memory', 'hurghada')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    permitType === 'hurghada' && selectedCompanyId === 'memory'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300'
                  }`}
                >
                  توصيلة الغردقة + شرطة الأقصر (ميمورى 1586)
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickPreset('unlimited', 'hurghada')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    permitType === 'hurghada' && selectedCompanyId === 'unlimited'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300'
                  }`}
                >
                  توصيلة الغردقة + شرطة الأقصر (ان ليميتد 2257)
                </button>
              </div>
            </div>
          </div>

          {/* Form Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">الشركة السياحية المنفذة:</label>
              <select
                value={selectedCompanyId}
                onChange={(e) => handleCompanySelect(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs font-bold rounded-xl p-3 outline-none focus:border-amber-500"
              >
                {companies.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} — ترخيص {c.licenseNumber}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">المسار والبرنامج المختار:</label>
              <select
                value={permitType}
                onChange={(e) => handlePermitTypeChange(e.target.value as PermitRouteType)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs font-bold rounded-xl p-3 outline-none focus:border-amber-500"
              >
                <optgroup label="المسارات المشتركة (3 إخطارات + 3 نيم ليست + إدارة البرامج)">
                  <option value="cairo">توصيلة القاهرة</option>
                  <option value="luxor_transfer">توصيلة الأقصر</option>
                  <option value="luxor_overnight">مبيت الأقصر</option>
                </optgroup>
                <optgroup label="مسار الغردقة من الأقصر (مع شرطة الأقصر والورقة الإضافية)">
                  <option value="hurghada">توصيلة الغردقة من الأقصر</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">فرع غرفة ووزارة السياحة:</label>
              <select
                value={governorateBranch}
                onChange={(e) => setGovernorateBranch(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs font-bold rounded-xl p-3 outline-none focus:border-amber-500"
              >
                <option value="البحر الأحمر">فرع البحر الأحمر (الغردقة)</option>
                <option value="بالاقصر">فرع الأقصر</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">نوع السيارة (نموذج 6 - اختياري):</label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs font-bold rounded-xl p-3 outline-none focus:border-amber-500"
              >
                <option value="">-- بدون تحديد / اختياري --</option>
                <option value="أتوبيس">أتوبيس سياحي</option>
                <option value="كوستر">كوستر سياحي</option>
                <option value="ميكروباص">ميكروباص سياحي</option>
                <option value="ليموزين">ليموزين سياحي</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">رقم الملف السياحي (File No):</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFileNo(`CH${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(10 + Math.random() * 89)}GZL`)}
                    className="text-[10px] text-emerald-400 hover:underline"
                  >
                    رقم جديد تلقائي
                  </button>
                  {fileNo && (
                    <button
                      type="button"
                      onClick={() => setFileNo('')}
                      className="text-[10px] text-amber-400 hover:underline"
                    >
                      تفريغ
                    </button>
                  )}
                </div>
              </div>
              <input
                type="text"
                value={fileNo}
                onChange={(e) => setFileNo(e.target.value)}
                placeholder="اتركه فارغاً للتوليد التلقائي (أو اكتب مثلاً: CH202610-09GZL)"
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs font-mono rounded-xl p-3 outline-none focus:border-amber-500 dir-ltr text-right"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">مقدم الإخطار المعتمد:</label>
              <input
                type="text"
                value={submitterName}
                onChange={(e) => setSubmitterName(e.target.value)}
                placeholder="اسم مقدم الإخطار"
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs font-bold rounded-xl p-3 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">الرقم القومي لمقدم الإخطار:</label>
              <input
                type="text"
                value={submitterNationalId}
                onChange={(e) => setSubmitterNationalId(e.target.value)}
                placeholder="الرقم القومي 14 رقم"
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs font-mono rounded-xl p-3 outline-none focus:border-amber-500 dir-ltr text-right"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">إجمالي عدد الزبائن المعتمد (PAX):</label>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/80 px-1.5 py-0.5 rounded">
                  ✓ الرقم المعتمد دائماً
                </span>
              </div>
              <input
                type="number"
                min={1}
                value={pax}
                onChange={(e) => setPax(Math.max(1, Number(e.target.value) || 1))}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs font-bold rounded-xl p-3 outline-none focus:border-amber-500 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                العدد الذي تكتبه هنا هو المعتمد رسمياً بالتصريح ولا يرتبط إطلاقاً بعدد كشف الروم ليست.
              </span>
            </div>
          </div>

          {/* Explicit Notice Badge */}
          {isHurghada ? (
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>نظام مسار الغردقة من الأقصر مفعّل (7 ورقات):</strong>
                <span className="block mt-0.5 text-[11px] text-amber-200/80">
                  سيتم توليد: ورقة 1 (تأمين الأفواج) + ورقة 2 (غرفة الشركات) + ورقة 3 (وزارة السياحة) + ورقة 4 (كشف النيم ليست المعتمد) + ورقة 5 (إدارة البرامج) + <strong>ورقة 6 (إخطار شرطة الأقصر)</strong> + <strong>ورقة 7 (الورقة الإضافية للغردقة)</strong>.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>نظام المسارات المشتركة مفعّل (7 ورقات):</strong>
                <span className="block mt-0.5 text-[11px] text-emerald-200/80">
                  تشترك فيه الشركتان: سيتم توليد: ورقة 1 (تأمين الأفواج) + ورقة 2 (غرفة الشركات) + ورقة 3 (وزارة السياحة) + <strong>ورقة 4 (نيم ليست تأمين الأفواج)</strong> + <strong>ورقة 5 (نيم ليست غرفة الشركات)</strong> + <strong>ورقة 6 (نيم ليست وزارة السياحة)</strong> + <strong>ورقة 7 (استمارة إدارة البرامج)</strong>.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: Guide & Dates */}
        {/* ========================================================================= */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-sky-400" />
              <span>2. بيانات المرشد السياحي ومواعيد الرحلة</span>
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowGuidePickerModal(true)}
                className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 bg-sky-950/60 border border-sky-800/80 px-2.5 py-1 rounded-lg"
              >
                <Search className="w-3.5 h-3.5" />
                <span>أرشيف المرشدين (نافذة منبثقة)</span>
              </button>
              <button
                type="button"
                onClick={() => setShowAddGuideModal(true)}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-950/40 border border-amber-800/60 px-2.5 py-1 rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة مرشد للذاكرة</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">اسم المرشد الكامل:</label>
                {guide && (
                  <button
                    type="button"
                    onClick={() => { setGuide(''); setPhone(''); }}
                    className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"
                  >
                    <X className="w-3 h-3" />
                    <span>تفريغ</span>
                  </button>
                )}
              </div>
              <div className="space-y-1.5">
                <select
                  value={guideDirectory[guide] ? guide : ''}
                  onChange={(e) => handleGuideSelect(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs font-bold rounded-xl p-2.5 outline-none focus:border-amber-500"
                >
                  <option value="">-- اختر من المرشدين المسجلين ({Object.keys(guideDirectory).length}) --</option>
                  {Object.keys(guideDirectory).map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={guide}
                  onChange={(e) => handleGuideInputChange(e.target.value)}
                  placeholder="اكتب اسم المرشد (فارغ افتراضياً)"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs font-bold rounded-xl p-2.5 outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">هاتف المرشد:</label>
                {phone && (
                  <button
                    type="button"
                    onClick={() => setPhone('')}
                    className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"
                  >
                    <X className="w-3 h-3" />
                    <span>تفريغ</span>
                  </button>
                )}
              </div>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010XXXXXXXX"
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs font-mono rounded-xl p-2.5 outline-none focus:border-amber-500 dir-ltr text-right mt-[38px]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                {guideDirectory[guide] ? '✓ مقترن تلقائياً بالمرشد المختار' : 'يظهر الهاتف فور اختيار المرشد'}
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">تاريخ بدء الرحلة:</label>
              <input
                type="date"
                value={tripDate}
                onChange={(e) => setTripDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs font-bold rounded-xl p-3 outline-none focus:border-amber-500 mt-[1px]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">تحريراً في (تاريخ الإصدار):</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs font-bold rounded-xl p-3 outline-none focus:border-amber-500 mt-[1px]"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 3: Transport & Driver & Vehicle (OPTIONAL - غير إجباري) */}
        {/* ========================================================================= */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>3. بيانات النقل والسائق والسيارة (اختياري بالكامل - غير إجباري)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                النقل اختياري بالكامل: لن يتم فرض أي حافلة أو نوع؛ وإذا تُرك فارغاً فسيُترك التصريح كما كان دون فرض أي بيانات.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowDriverPickerModal(true)}
                className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 bg-sky-950/60 border border-sky-800/80 px-2.5 py-1 rounded-lg"
              >
                <Search className="w-3.5 h-3.5" />
                <span>أرشيف السائقين (نافذة منبثقة)</span>
              </button>
              <button
                type="button"
                onClick={() => setShowAddDriverModal(true)}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-950/40 border border-amber-800/60 px-2.5 py-1 rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة سائق للذاكرة</span>
              </button>
              <span className="text-slate-600">|</span>
              <button
                type="button"
                onClick={() => setShowAddVehicleModal(true)}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-1 rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة رقم سيارة</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Driver Name */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">اسم السائق الأساسي:</label>
                {driverName && (
                  <button
                    type="button"
                    onClick={() => { setDriverName(''); setDriverPhone(''); }}
                    className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"
                  >
                    <X className="w-3 h-3" />
                    <span>تفريغ</span>
                  </button>
                )}
              </div>
              <div className="space-y-1.5">
                <select
                  value={driverDirectory[driverName] ? driverName : ''}
                  onChange={(e) => handleDriverSelect(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs font-bold rounded-xl p-2.5 outline-none focus:border-amber-500"
                >
                  <option value="">-- اختر من السائقين المسجلين ({Object.keys(driverDirectory).length}) --</option>
                  {Object.keys(driverDirectory).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => handleDriverInputChange(e.target.value)}
                  placeholder="اسم السائق (فارغ افتراضياً)"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-xl p-2.5 outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Driver Phone */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">هاتف السائق:</label>
                {driverPhone && (
                  <button
                    type="button"
                    onClick={() => setDriverPhone('')}
                    className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"
                  >
                    <X className="w-3 h-3" />
                    <span>تفريغ</span>
                  </button>
                )}
              </div>
              <input
                type="tel"
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                placeholder="010XXXXXXXX"
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs font-mono rounded-xl p-2.5 outline-none focus:border-amber-500 dir-ltr text-right mt-[38px]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                {driverDirectory[driverName] ? '✓ مقترن تلقائياً بالسائق المختار' : 'يظهر هاتف السائق فور اختياره'}
              </span>
            </div>

            {/* Transport Company */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">شركة النقل السياحي:</label>
                {transportCompany && (
                  <button
                    type="button"
                    onClick={() => setTransportCompany('')}
                    className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"
                  >
                    <X className="w-3 h-3" />
                    <span>تفريغ</span>
                  </button>
                )}
              </div>
              <div className="space-y-1.5">
                <select
                  value={savedTransportCompanies.includes(transportCompany) ? transportCompany : ''}
                  onChange={(e) => handleTransportCompanySelect(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs font-bold rounded-xl p-2.5 outline-none focus:border-amber-500"
                >
                  <option value="">-- اختر شركة نقل مسجلة ({savedTransportCompanies.length}) --</option>
                  {savedTransportCompanies.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={transportCompany}
                  onChange={(e) => setTransportCompany(e.target.value)}
                  placeholder="اسم شركة النقل (فارغ افتراضياً)"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-xl p-2.5 outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Vehicle Plate Number (Keeps recurring plate numbers) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">رقم لوحة الحافلة / العربية:</label>
                <div className="flex items-center gap-2">
                  {vehicleNumber && (
                    <button
                      type="button"
                      onClick={() => handleSaveVehicleNumber(vehicleNumber)}
                      className="text-[10px] text-emerald-400 hover:underline flex items-center gap-0.5"
                      title="حفظ هذا الرقم في الذاكرة لتكراره لاحقاً"
                    >
                      <Save className="w-3 h-3" />
                      <span>حفظ الرقم</span>
                    </button>
                  )}
                  {vehicleNumber && (
                    <button
                      type="button"
                      onClick={() => setVehicleNumber('')}
                      className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"
                    >
                      <X className="w-3 h-3" />
                      <span>تفريغ</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <select
                  value={savedVehicles.includes(vehicleNumber) ? vehicleNumber : ''}
                  onChange={(e) => handleVehicleSelect(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs font-bold rounded-xl p-2.5 outline-none focus:border-amber-500"
                >
                  <option value="">-- اختر لوحة محفوظة مكررة ({savedVehicles.length}) --</option>
                  {savedVehicles.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  placeholder="مثال: س ي ف 1234 (فارغ افتراضياً)"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs font-bold rounded-xl p-2.5 outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Quick Clickable Badges for Saved Vehicle Numbers (المحافظة على أرقام السيارات المكررة) */}
          {savedVehicles.length > 0 && (
            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                  <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>لوحات العربيات المكررة المسجلة (انقر للاختيار الفوري):</span>
                </span>
                <span className="text-[10px] text-slate-500">ميزة حفظ الأرقام المتكررة تلقائياً</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {savedVehicles.map(v => (
                  <div
                    key={v}
                    onClick={() => handleVehicleSelect(v)}
                    className={`group cursor-pointer px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border transition-all ${
                      vehicleNumber === v
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                        : 'bg-slate-950 border-slate-700/80 hover:border-amber-500/60 text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <span>{v}</span>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteSavedVehicle(v, e)}
                      title="حذف هذا الرقم من الذاكرة"
                      className="opacity-40 group-hover:opacity-100 hover:text-rose-400 p-0.5 rounded transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 4: Program & Itinerary */}
        {/* ========================================================================= */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>4. البرنامج وخط السير وأماكن الإقامة والفنادق</span>
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenHotelPicker('from')}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-lg transition-colors"
              >
                <Hotel className="w-3.5 h-3.5" />
                <span>أرشيف فنادق الانطلاق (نافذة منبثقة)</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenHotelPicker('to')}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-950/60 border border-amber-800/80 px-2.5 py-1 rounded-lg transition-colors"
              >
                <Hotel className="w-3.5 h-3.5" />
                <span>أرشيف فنادق الوصول (نافذة منبثقة)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">البرنامج / المزارات / نقاط التفتيش:</label>
            <textarea
              rows={2}
              value={programText}
              onChange={(e) => setProgramText(e.target.value)}
              placeholder="زعفرانه – خان – ازهر – مصر القديمه – عشاء – الفندق"
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-xl p-3 outline-none focus:border-amber-500 leading-relaxed font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Hotel From */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <Hotel className="w-3.5 h-3.5 text-emerald-400" />
                  <span>فندق / مكان الانطلاق:</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenHotelPicker('from')}
                    className="text-[10px] text-emerald-400 hover:underline flex items-center gap-0.5"
                  >
                    <Search className="w-3 h-3" />
                    <span>النافذة المنبثقة</span>
                  </button>
                  {hotelFrom && (
                    <button
                      type="button"
                      onClick={() => handleSaveHotelToArchive(hotelFrom)}
                      className="text-[10px] text-sky-400 hover:underline flex items-center gap-0.5"
                      title="حفظ هذا الفندق بالأرشيف"
                    >
                      <Save className="w-3 h-3" />
                      <span>حفظ</span>
                    </button>
                  )}
                  {hotelFrom && (
                    <button
                      type="button"
                      onClick={() => setHotelFrom('')}
                      className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"
                    >
                      <X className="w-3 h-3" />
                      <span>تفريغ</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <select
                  value={savedHotels.includes(hotelFrom) ? hotelFrom : ''}
                  onChange={(e) => setHotelFrom(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs font-bold rounded-xl p-2.5 outline-none focus:border-amber-500"
                >
                  <option value="">-- اختر فندق انطلاق من الأرشيف ({savedHotels.length}) --</option>
                  {savedHotels.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={hotelFrom}
                  onChange={(e) => setHotelFrom(e.target.value)}
                  placeholder="مثال: فندق رمسيس هيلتون أو مرسى الأقصر"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-xl p-2.5 outline-none focus:border-amber-500"
                />
              </div>

              {/* Quick tags for departure */}
              <div className="flex flex-wrap items-center gap-1 mt-2">
                <span className="text-[10px] text-slate-500 font-bold">خيارات شائعة:</span>
                {[
                  'فندق رمسيس هيلتون القاهرة',
                  'مرسى الأقصر السياحي (نايل كروز)',
                  'فندق ماريوت الزمالك القاهرة',
                  'فندق فورسيزونز نايل بلازا القاهرة'
                ].map(h => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHotelFrom(h)}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 transition-colors border border-slate-800 hover:border-emerald-500/50"
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {/* Hotel To */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <Hotel className="w-3.5 h-3.5 text-amber-400" />
                  <span>فندق / مكان الوصول (المقصد أو المطار):</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenHotelPicker('to')}
                    className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"
                  >
                    <Search className="w-3 h-3" />
                    <span>النافذة المنبثقة</span>
                  </button>
                  {hotelTo && (
                    <button
                      type="button"
                      onClick={() => handleSaveHotelToArchive(hotelTo)}
                      className="text-[10px] text-sky-400 hover:underline flex items-center gap-0.5"
                      title="حفظ هذا الفندق بالأرشيف"
                    >
                      <Save className="w-3 h-3" />
                      <span>حفظ</span>
                    </button>
                  )}
                  {hotelTo && (
                    <button
                      type="button"
                      onClick={() => handleHotelToChange('')}
                      className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"
                    >
                      <X className="w-3 h-3" />
                      <span>تفريغ</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <select
                  value={savedHotels.includes(hotelTo) ? hotelTo : ''}
                  onChange={(e) => handleHotelToChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs font-bold rounded-xl p-2.5 outline-none focus:border-amber-500"
                >
                  <option value="">-- اختر فندق وصول من الأرشيف ({savedHotels.length}) --</option>
                  {savedHotels.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={hotelTo}
                  onChange={(e) => handleHotelToChange(e.target.value)}
                  placeholder="مثال: فندق ميركيور الأقصر أو مطار القاهرة الدولي"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-xl p-2.5 outline-none focus:border-amber-500"
                />
              </div>

              {/* Quick tags for destination */}
              <div className="flex flex-wrap items-center gap-1 mt-2">
                <span className="text-[10px] text-slate-500 font-bold">خيارات شائعة:</span>
                {[
                  'مطار القاهرة الدولي (صالة 3)',
                  'فندق ميركيور الأقصر',
                  'منتجع شتيجنبرجر الداو الغردقة',
                  'مطار الغردقة الدولي',
                  'فندق شتيجنبرجر نايل بالاس الأقصر'
                ].map(dest => (
                  <button
                    key={dest}
                    type="button"
                    onClick={() => handleHotelToChange(dest)}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 transition-colors border border-slate-800 hover:border-amber-500/50"
                  >
                    {dest}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 5: Rooming List Excel Reader */}
        {/* ========================================================================= */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>5. كشف الروم ليست والأفواج (ملف النيم ليست والجوازات)</span>
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  محرك لغوي ثلاثي ذكي
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                تتم قراءة كشف الركاب مع فحص لغوي ذكي يستبعد ترويسات الأعمدة وصف الإجمالي الصيني تلقائياً. العدد المعتمد للتصريح هو ما تحدده أنت في خانة (PAX: {pax}).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAuditModal(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Languages className="w-3.5 h-3.5 text-amber-400" />
                <span>فحص خبراء اللغات الثلاث (تشخيص 7 مقابل 9)</span>
              </button>

              <button
                type="button"
                onClick={handleResetToStandard7Pax}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 transition-all"
              >
                <span>استعادة كشف الـ 7 سياح القياسي</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAddPassengerModal(true)}
                className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة سائح</span>
              </button>

              <button
                type="button"
                onClick={downloadSampleTemplate}
                className="px-2.5 py-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تنزيل قالب 7 سياح</span>
              </button>
            </div>
          </div>

          {/* Pax vs Rooming List Comparison Bar */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-slate-400">عدد التصريح الرسمي المعتمد:</span>{' '}
                <strong className="text-amber-400 font-mono text-sm">{pax} سائح</strong>
              </div>
              <div className="h-4 w-px bg-slate-800"></div>
              <div>
                <span className="text-slate-400">سياح كشف الروم ليست:</span>{' '}
                <strong className="text-emerald-400 font-mono text-sm">{passengers.length} سياح</strong>
              </div>
            </div>

            {pax === passengers.length ? (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold flex items-center gap-1 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>العدد متطابق ومعتمد رسمياً ({pax} = {passengers.length})</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold flex items-center gap-1 border border-amber-500/30">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>العدد المعتمد في كل الأوراق هو ({pax}) وكشف الروم ليست يحوي ({passengers.length})</span>
              </span>
            )}
          </div>

          {/* Audit Verification Notice Bar */}
          {excelAuditNotice && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-950 to-indigo-950/40 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{excelAuditNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAuditModal(true)}
                className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 rounded-lg font-bold text-[11px] shrink-0 transition-colors"
              >
                عرض تفاصيل الفحص
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-300 block mb-1">رفع ملف النيم ليست Excel:</span>
                <label className="cursor-pointer flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-xl bg-slate-900/50 transition-colors">
                  <UploadCloud className="w-6 h-6 text-amber-400 mb-1" />
                  <span className="text-xs font-bold text-slate-200">اختر ملف (.xlsx أو .xls)</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">مع فحص لغوي صيني وإنجليزي فوري</span>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleExcelUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {isParsingExcel ? (
                <div className="text-xs text-amber-400 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  <span>جاري تحليل أسماء وجوازات الفوج واستبعاد الترويسات...</span>
                </div>
              ) : (
                <div className="text-[11px] text-slate-400">
                  الملف الحالي: <span className="font-mono text-emerald-400 font-bold">{excelFileName}</span> ({passengers.length} ركاب معتمدين)
                </div>
              )}
            </div>

            {/* Extracted Passenger Table Preview & Direct Editor */}
            <div className="md:col-span-2 overflow-x-auto rounded-xl border border-slate-800 max-h-72">
              <table className="w-full text-right text-[11px] text-slate-300">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 sticky top-0 font-bold">
                  <tr>
                    <th className="p-2 w-8 text-center">م</th>
                    <th className="p-2">الاسم بالصيني</th>
                    <th className="p-2">الاسم بالإنجليزي</th>
                    <th className="p-2">الجواز</th>
                    <th className="p-2 w-16">النوع</th>
                    <th className="p-2 w-16">الغرفة</th>
                    <th className="p-2 w-10 text-center">حذف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                  {passengers.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="p-2 font-mono text-center text-slate-400">{p.id}</td>
                      <td className="p-1">
                        <input
                          type="text"
                          value={p.chinese}
                          onChange={(e) => handleUpdatePassenger(p.id, 'chinese', e.target.value)}
                          placeholder="الاسم الصيني"
                          className="w-full bg-slate-900 border border-slate-700/80 rounded px-2 py-1 text-xs text-amber-300 font-bold focus:border-amber-500 outline-none"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="text"
                          value={p.english}
                          onChange={(e) => handleUpdatePassenger(p.id, 'english', e.target.value.toUpperCase())}
                          placeholder="ENGLISH NAME"
                          className="w-full bg-slate-900 border border-slate-700/80 rounded px-2 py-1 text-xs text-slate-200 font-mono uppercase focus:border-amber-500 outline-none"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="text"
                          value={p.passport}
                          onChange={(e) => handleUpdatePassenger(p.id, 'passport', e.target.value.toUpperCase())}
                          placeholder="PASSPORT"
                          className="w-full bg-slate-900 border border-slate-700/80 rounded px-2 py-1 text-xs text-sky-400 font-mono focus:border-amber-500 outline-none"
                        />
                      </td>
                      <td className="p-1">
                        <select
                          value={p.sex}
                          onChange={(e) => handleUpdatePassenger(p.id, 'sex', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700/80 rounded px-1.5 py-1 text-xs text-slate-300 focus:border-amber-500 outline-none"
                        >
                          <option value="ذكر">ذكر</option>
                          <option value="أنثى">أنثى</option>
                        </select>
                      </td>
                      <td className="p-1">
                        <input
                          type="text"
                          value={p.room}
                          onChange={(e) => handleUpdatePassenger(p.id, 'room', e.target.value)}
                          placeholder="101"
                          className="w-full bg-slate-900 border border-slate-700/80 rounded px-1.5 py-1 text-xs text-emerald-400 font-mono font-bold focus:border-amber-500 outline-none"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeletePassenger(p.id)}
                          title="حذف هذا السائح"
                          className="p-1 hover:text-rose-400 text-slate-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 6: Route Specific Attachments (Dynamic based on route) */}
        {/* ========================================================================= */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>6. المرفقات والصور الملحقة (تتكيف تلقائياً مع المسار المختار)</span>
            </h3>
            {isHurghada ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                مرفقات مسار الغردقة الميداني
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                مرفقات المسارات المشتركة
              </span>
            )}
          </div>

          {/* Conditional Display of Attachments */}
          {isHurghada ? (
            /* Hurghada Pathway: Extra Page is shown and highlighted */
            <div className="space-y-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>مسار الغردقة من الأقصر يفرض الورقة الإضافية الملحقة وإخطار شرطة الأقصر لاستكمال الـ 7 ورقات الرسمية.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-300 block">
                      صورة إدارة البرامج المعتمدة (ورقة 5):
                    </label>
                    <span className="text-[10px] text-slate-500">اختياري</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setProgramImage)}
                    className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-amber-400 hover:file:bg-slate-700 w-full"
                  />
                  {programImage && (
                    <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تم إرفاق صورة ختم البرامج للصفحة 5</span>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border-2 border-amber-500/40 space-y-2 shadow-md">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-400 block flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>الورقة الإضافية الملحقة لأمر الشغل (ورقة 7 للغردقة):</span>
                    </label>
                    <span className="text-[10px] text-amber-400 font-bold">إلزامي للمسار</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setExtraPageImage)}
                    className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 w-full font-bold"
                  />
                  {extraPageImage ? (
                    <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تم إرفاق صورة الورقة الإضافية بنجاح للصفحة 7</span>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-500 leading-normal">
                      إذا لم ترفق صورة سيتم توليد أمر شغل رسمي وتصريح طرق سريعة معتمد لكمين 85 والعشى تلقائياً في الصفحة 7.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Shared Pathway: Extra page is hidden, 3 Rooming list copies are generated automatically */
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>المسار المشترك المعتمد (القاهرة / توصيلة الأقصر / مبيت الأقصر):</span>
                </div>
                <p className="text-[11px] text-emerald-200/80 leading-relaxed pr-6">
                  وفقاً للتعليمات الرسمية، لا حاجة لإرفاق ورقة إضافية أو إخطار شرطة الأقصر في هذا المسار. بدلاً من ذلك، سيقوم النظام تلقائياً بتوليد <strong>3 نسخ رسمية من كشف النيم ليست</strong> (نسخة تأمين الأفواج + نسخة غرفة الشركات + نسخة وزارة السياحة) متبوعة باستمارة إدارة البرامج (الورقة 7) ليكتمل الـ 7 صفحات بدقة تامة.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 block">
                    صورة ختم إدارة البرامج المعتمد (اختياري للصفحة 7):
                  </label>
                  <span className="text-[10px] text-slate-500">صفحة 7</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setProgramImage)}
                  className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-amber-400 hover:file:bg-slate-700"
                />
                {programImage && (
                  <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>تم إرفاق صورة ختم البرامج للصفحة 7</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Submit Error Banner if any */}
        {submitError && (
          <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Submit Button & Verification Badge */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            <ShieldCheck className="w-6 h-6" />
            <span>
              {isSubmitting 
                ? 'جاري تجميع حزمة الـ 7 ورقات وتوليد كود الـ QR...' 
                : `إنشاء وتوليد ملف الـ 7 صفحات (${isHurghada ? 'مسار الغردقة + شرطة الأقصر' : 'مسار مشترك: 3 إخطارات + 3 نيم ليست + برامج'})`}
            </span>
          </button>
        </div>
      </form>

      {/* Add New Guide Modal */}
      {showAddGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4 animate-fadeIn">
            <h3 className="font-extrabold text-white text-base">إضافة مرشد جديد للذاكرة التلقائية</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">اسم المرشد الكامل:</label>
                <input
                  type="text"
                  value={newGuideName}
                  onChange={(e) => setNewGuideName(e.target.value)}
                  placeholder="مثال: كريم حامد"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">رقم الهاتف:</label>
                <input
                  type="tel"
                  value={newGuidePhone}
                  onChange={(e) => setNewGuidePhone(e.target.value)}
                  placeholder="010XXXXXXXX"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono dir-ltr text-right"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleSaveNewGuide}
                className="flex-1 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400"
              >
                حفظ واقتران
              </button>
              <button
                type="button"
                onClick={() => setShowAddGuideModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-700"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Driver Modal */}
      {showAddDriverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4 animate-fadeIn">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <User className="w-4 h-4 text-sky-400" />
              <span>إضافة سائق جديد للذاكرة</span>
            </h3>
            <p className="text-xs text-slate-400">
              سيتم حفظ السائق واقتران هاتفه تلقائياً، ليظهر الرقم فور اختياره في أي تصريح مستقبلي.
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">اسم السائق المسؤول:</label>
                <input
                  type="text"
                  value={newDriverName}
                  onChange={(e) => setNewDriverName(e.target.value)}
                  placeholder="مثال: حسام حسن محمود"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">رقم هاتف السائق:</label>
                <input
                  type="tel"
                  value={newDriverPhone}
                  onChange={(e) => setNewDriverPhone(e.target.value)}
                  placeholder="010XXXXXXXX"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono dir-ltr text-right"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleSaveNewDriver}
                className="flex-1 py-2 bg-sky-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-sky-400"
              >
                حفظ واقتران السائق
              </button>
              <button
                type="button"
                onClick={() => setShowAddDriverModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-700"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hotel Archive Picker Popup Modal */}
      {hotelPickerTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Hotel className={`w-5 h-5 ${hotelPickerTarget === 'from' ? 'text-emerald-400' : 'text-amber-400'}`} />
                <h3 className="font-extrabold text-white text-base">
                  {hotelPickerTarget === 'from' ? 'أرشيف فنادق ومواقع الانطلاق' : 'أرشيف فنادق ومواقع الوصول (المقصد)'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setHotelPickerTarget(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              اختر فندقاً محفوظاً بنقرة واحدة، أو احفظ فندقاً جديداً في الأرشيف الدائم ليظهر دائماً في النوافذ المنبثقة.
            </p>

            {/* Quick Add Hotel to Archive */}
            <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <input
                type="text"
                value={newHotelArchiveName}
                onChange={(e) => setNewHotelArchiveName(e.target.value)}
                placeholder="اسم فندق جديد لإضافته للأرشيف..."
                className="flex-1 bg-transparent text-xs text-white outline-none px-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSaveHotelToArchive();
                  }
                }}
              />
              <button
                type="button"
                onClick={() => handleSaveHotelToArchive()}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>حفظ بالأرشيف</span>
              </button>
            </div>

            {/* Search within archive */}
            <div>
              <div className="relative">
                <input
                  type="text"
                  value={hotelSearchQuery}
                  onChange={(e) => setHotelSearchQuery(e.target.value)}
                  placeholder="بحث سريع في قائمة الفنادق والمطارات والمراسي المحفوظة..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 pl-9 text-xs text-white outline-none focus:border-amber-500"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Hotels Grid / List */}
            <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {savedHotels
                .filter(h => !hotelSearchQuery.trim() || h.toLowerCase().includes(hotelSearchQuery.toLowerCase()))
                .map(h => (
                  <div
                    key={h}
                    onClick={() => handleSelectHotelFromArchive(h)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800/80 hover:border-amber-500/50 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Hotel className="w-4 h-4 text-amber-400/80 group-hover:text-amber-400" />
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-white">{h}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-emerald-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        اختيار ✓
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteHotelFromArchive(h, e)}
                        title="حذف هذا الفندق من الأرشيف"
                        className="opacity-20 group-hover:opacity-100 hover:text-rose-400 p-1 text-slate-400 rounded transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setHotelPickerTarget(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guide Archive Picker Popup Modal */}
      {showGuidePickerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-sky-400" />
                <h3 className="font-extrabold text-white text-base">
                  أرشيف المرشدين السياحيين المعتمدين
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuidePickerModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              اختر المرشد ليتم تعيين اسمه وهاتفه المقترن به فورياً وتلقائياً.
            </p>

            {/* Quick search */}
            <div className="relative">
              <input
                type="text"
                value={guideSearchQuery}
                onChange={(e) => setGuideSearchQuery(e.target.value)}
                placeholder="بحث باسم المرشد أو الهاتف..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 pl-9 text-xs text-white outline-none focus:border-sky-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>

            {/* Guide List */}
            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {Object.entries(guideDirectory)
                .filter(([gName, gPhone]) => 
                  !guideSearchQuery.trim() || 
                  gName.toLowerCase().includes(guideSearchQuery.toLowerCase()) ||
                  gPhone.includes(guideSearchQuery)
                )
                .map(([gName, gPhone]) => (
                  <div
                    key={gName}
                    onClick={() => {
                      handleGuideSelect(gName);
                      setShowGuidePickerModal(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800/80 hover:border-sky-500/50 cursor-pointer transition-all group"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-white">{gName}</div>
                      <div className="text-[11px] font-mono text-sky-400">{gPhone || 'بدون هاتف'}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-sky-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        اختيار المرشد ✓
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteGuide(gName, e)}
                        title="حذف هذا المرشد من الأرشيف"
                        className="opacity-20 group-hover:opacity-100 hover:text-rose-400 p-1 text-slate-400 rounded transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setShowGuidePickerModal(false);
                  setShowAddGuideModal(true);
                }}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة مرشد جديد للذاكرة</span>
              </button>
              <button
                type="button"
                onClick={() => setShowGuidePickerModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Driver Archive Picker Popup Modal */}
      {showDriverPickerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-white text-base">
                  أرشيف السائقين المعتمدين
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDriverPickerModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              اختر السائق ليتم تعيين اسمه وهاتفه المقترن به فورياً وتلقائياً دون الحاجة لكتابة أو تعديل.
            </p>

            {/* Quick search */}
            <div className="relative">
              <input
                type="text"
                value={driverSearchQuery}
                onChange={(e) => setDriverSearchQuery(e.target.value)}
                placeholder="بحث باسم السائق أو الهاتف..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 pl-9 text-xs text-white outline-none focus:border-amber-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>

            {/* Driver List */}
            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {Object.entries(driverDirectory)
                .filter(([dName, dPhone]) => 
                  !driverSearchQuery.trim() || 
                  dName.toLowerCase().includes(driverSearchQuery.toLowerCase()) ||
                  dPhone.includes(driverSearchQuery)
                )
                .map(([dName, dPhone]) => (
                  <div
                    key={dName}
                    onClick={() => {
                      handleDriverSelect(dName);
                      setShowDriverPickerModal(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800/80 hover:border-amber-500/50 cursor-pointer transition-all group"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-white">{dName}</div>
                      <div className="text-[11px] font-mono text-amber-400">{dPhone || 'بدون هاتف'}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-amber-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        اختيار السائق ✓
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteDriver(dName, e)}
                        title="حذف هذا السائق من الأرشيف"
                        className="opacity-20 group-hover:opacity-100 hover:text-rose-400 p-1 text-slate-400 rounded transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setShowDriverPickerModal(false);
                  setShowAddDriverModal(true);
                }}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة سائق جديد للذاكرة</span>
              </button>
              <button
                type="button"
                onClick={() => setShowDriverPickerModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Vehicle Plate Modal */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4 animate-fadeIn">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>إضافة وحفظ لوحة سيارة بالذاكرة</span>
            </h3>
            <p className="text-xs text-slate-400">
              أرقام العربيات المكررة تُحفظ دائماً للاختيار السريع بنقرة واحدة في جميع التصاريح.
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">رقم لوحة الحافلة / السيارة:</label>
                <input
                  type="text"
                  value={newVehiclePlate}
                  onChange={(e) => setNewVehiclePlate(e.target.value)}
                  placeholder="مثال: س ي ف 1234 أو ط ر ج 9876"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-bold"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleSaveVehicleNumber(newVehiclePlate)}
                className="flex-1 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-emerald-400"
              >
                حفظ اللوحة بالذاكرة
              </button>
              <button
                type="button"
                onClick={() => setShowAddVehicleModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-700"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tri-Lingual Linguistic Audit Modal (Chinese, English, Arabic) */}
      <TriLingualAuditModal
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
        paxCount={pax}
        passengers={passengers}
      />

      {/* Add New Passenger Modal */}
      {showAddPassengerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-amber-400" />
                <span>إضافة سائح جديد لكشف الروم ليست</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddPassengerModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">الاسم بالصيني (Hanzi):</label>
                  <input
                    type="text"
                    value={newPaxChinese}
                    onChange={(e) => setNewPaxChinese(e.target.value)}
                    placeholder="مثال: 赵强"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-amber-300 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">الاسم بالإنجليزي (Pinyin):</label>
                  <input
                    type="text"
                    value={newPaxEnglish}
                    onChange={(e) => setNewPaxEnglish(e.target.value)}
                    placeholder="مثال: ZHAO QIANG"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white uppercase font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">رقم الجواز:</label>
                  <input
                    type="text"
                    value={newPaxPassport}
                    onChange={(e) => setNewPaxPassport(e.target.value)}
                    placeholder="مثال: EJ6124890"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-sky-400 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">النوع:</label>
                  <select
                    value={newPaxSex}
                    onChange={(e) => setNewPaxSex(e.target.value as 'ذكر' | 'أنثى')}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-bold"
                  >
                    <option value="ذكر">ذكر (M)</option>
                    <option value="أنثى">أنثى (F)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">تاريخ الميلاد:</label>
                  <input
                    type="date"
                    value={newPaxDob}
                    onChange={(e) => setNewPaxDob(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">انتهاء الجواز:</label>
                  <input
                    type="date"
                    value={newPaxExpiry}
                    onChange={(e) => setNewPaxExpiry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">رقم الغرفة:</label>
                  <input
                    type="text"
                    value={newPaxRoom}
                    onChange={(e) => setNewPaxRoom(e.target.value)}
                    placeholder="101"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-emerald-400 font-mono font-bold text-center"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handleAddNewPassenger}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md active:scale-95"
              >
                إضافة السائح للكشف
              </button>
              <button
                type="button"
                onClick={() => setShowAddPassengerModal(false)}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-700"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
