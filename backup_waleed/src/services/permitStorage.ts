import * as XLSX from 'xlsx';
import QRCode from 'qrcode';
import { TouristPassenger } from '../types';

export interface TourismCompany {
  id: string;
  name: string;
  licenseNumber: string;
  category: string;
  submitterName?: string;
  submitterNationalId?: string;
  stampImage?: string; // base64 or url
  signatureImage?: string;
  phone?: string;
  address?: string;
}

export interface IssuedPermit {
  id: string;
  fileNo: string;
  companyId: string;
  companyName: string;
  licenseNumber: string;
  permitType: string;
  permitLabel: string;
  tripDate: string;
  issueDate: string;
  paxCount: number;
  nationality?: string;
  guideName: string;
  guidePhone: string;
  driverName?: string;
  driverPhone?: string;
  backupDriverName?: string;
  backupDriverPhone?: string;
  vehicleNumber?: string;
  chassisNumber?: string;
  vehicleType?: 'أتوبيس' | 'كوستر' | 'ميكروباص' | 'ليموزين' | '' | string;
  transportCompany?: string;
  transportAuthority?: string;
  destination?: string;
  checkpoint?: string;
  departureTime?: string;
  returnTime?: string;
  hotelFrom?: string;
  hotelTo?: string;
  programText: string;
  submitterName: string;
  submitterNationalId: string;
  governorateBranch: 'البحر الأحمر' | 'بالاقصر';
  passengers: TouristPassenger[];
  qrCodeDataUrl?: string;
  createdAt: string;
  hasProgramImage?: boolean;
  hasExtraPage?: boolean;
  programImageData?: string;
  extraPageData?: string;
}

const STORAGE_KEYS = {
  COMPANIES: 'tasare7_companies_v3',
  HISTORY: 'tasare7_history_v3',
  MEMORY: 'tasare7_memory_v3',
  APP_SETTINGS: 'tasare7_settings_v3',
};

export const INITIAL_COMPANIES: TourismCompany[] = [
  {
    id: 'unlimited',
    name: 'ان ليميتد ايجيبت ترافيل',
    licenseNumber: '2257',
    category: 'أ',
    submitterName: 'رائد ناجح فرج عبد السيد',
    submitterNationalId: '29704062702113',
    phone: '0223456789',
    address: 'القاهرة - مصر',
  },
  {
    id: 'memory',
    name: 'ميمورى تريب تورز',
    licenseNumber: '1586',
    category: 'أ',
    submitterName: 'محمد عبدالناصر محمد',
    submitterNationalId: '29009011328331',
    phone: '0229876543',
    address: 'الغردقة / القاهرة - مصر',
  },
];

export const permitStorage = {
  // Companies
  getCompanies(): TourismCompany[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPANIES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_COMPANIES;
  },

  saveCompany(company: TourismCompany) {
    const list = this.getCompanies();
    const index = list.findIndex(c => c.id === company.id);
    if (index >= 0) {
      list[index] = company;
    } else {
      list.push(company);
    }
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(list));
  },

  deleteCompany(id: string) {
    const list = this.getCompanies().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(list));
  },

  // History & Permits
  getPermits(): IssuedPermit[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return [];
  },

  savePermit(permit: IssuedPermit) {
    try {
      const list = this.getPermits();
      // Filter existing with same id or unshift
      const filtered = list.filter(p => p.id !== permit.id);
      filtered.unshift(permit);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(filtered.slice(0, 50)));
    } catch (err) {
      console.warn('Failed to save full permit to localStorage (quota limit), retrying with stripped images:', err);
      try {
        // Strip heavy base64 image data from history records to fit in localStorage quota
        const trimmedList = this.getPermits().map(p => ({
          ...p,
          programImageData: undefined,
          extraPageData: undefined
        }));
        const strippedPermit = { ...permit, programImageData: undefined, extraPageData: undefined };
        const filtered = trimmedList.filter(p => p.id !== strippedPermit.id);
        filtered.unshift(strippedPermit);
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(filtered.slice(0, 20)));
      } catch (err2) {
        console.warn('Could not save permit to history storage:', err2);
      }
    }
  },

  deletePermit(id: string) {
    const list = this.getPermits().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(list));
  },

  // Memory Management for Guides, Drivers, Vehicles, Transport Companies & Hotels
  getMemory(): {
    guidePhones?: Record<string, string>;
    driverPhones?: Record<string, string>;
    vehicleNumbers?: string[];
    transportCompanies?: string[];
    savedHotels?: string[];
  } {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMORY);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return {};
  },

  setMemory(patch: Record<string, any>) {
    try {
      const current = this.getMemory();
      const updated = { ...current, ...patch };
      localStorage.setItem(STORAGE_KEYS.MEMORY, JSON.stringify(updated));
    } catch (e) {}
  },

  // Guide-Phone Directory Memory
  getGuideDirectory(): Record<string, string> {
    const mem = this.getMemory();
    if (mem.guidePhones && Object.keys(mem.guidePhones).length > 0) {
      return mem.guidePhones;
    }
    return {
      'أحمد منصور': '01012345678',
      'محمود الشناوي': '01198765432',
      'مينا جرجس': '01233445566',
      'إبراهيم العطار': '01555667788',
    };
  },

  saveGuidePair(guide: string, phone: string) {
    if (!guide.trim()) return;
    const current = this.getGuideDirectory();
    current[guide.trim()] = phone.trim();
    this.setMemory({ guidePhones: current });
  },

  deleteGuidePair(guide: string) {
    const current = this.getGuideDirectory();
    delete current[guide];
    this.setMemory({ guidePhones: current });
  },

  // Driver-Phone Directory Memory
  getDriverDirectory(): Record<string, string> {
    const mem = this.getMemory();
    if (mem.driverPhones && Object.keys(mem.driverPhones).length > 0) {
      return mem.driverPhones;
    }
    return {
      'محمد إبراهيم السيد': '01099887766',
      'أحمد كمال عبد الله': '01223344556',
      'محمود عبد العال': '01144556677',
      'حسن عبد الفتاح': '01011223344',
      'سيد الشاذلي': '01066778899',
    };
  },

  saveDriverPair(driver: string, phone: string) {
    if (!driver.trim()) return;
    const current = this.getDriverDirectory();
    current[driver.trim()] = phone.trim();
    this.setMemory({ driverPhones: current });
  },

  deleteDriverPair(driver: string) {
    const current = this.getDriverDirectory();
    delete current[driver];
    this.setMemory({ driverPhones: current });
  },

  // Vehicle Numbers Memory (أرقام لوحات السيارات المحفوظة لمنع إعادة الكتابة)
  getSavedVehicles(): string[] {
    const mem = this.getMemory();
    if (mem.vehicleNumbers && Array.isArray(mem.vehicleNumbers) && mem.vehicleNumbers.length > 0) {
      return mem.vehicleNumbers;
    }
    return ['س ي ف 1234', 'ط ر ج 5678', 'ق هـ ر 9182', 'أ ب ج 4321', 'ن ق ل 7788'];
  },

  saveVehicleNumber(vehicle: string) {
    if (!vehicle.trim()) return;
    const clean = vehicle.trim();
    const current = this.getSavedVehicles();
    const updated = [clean, ...current.filter(v => v !== clean)].slice(0, 30);
    this.setMemory({ vehicleNumbers: updated });
  },

  deleteVehicleNumber(vehicle: string) {
    const current = this.getSavedVehicles();
    const updated = current.filter(v => v !== vehicle);
    this.setMemory({ vehicleNumbers: updated });
  },

  // Transport Companies Memory
  getSavedTransportCompanies(): string[] {
    const mem = this.getMemory();
    if (mem.transportCompanies && Array.isArray(mem.transportCompanies) && mem.transportCompanies.length > 0) {
      return mem.transportCompanies;
    }
    return ['ميد إيجيبت للنقل السياحي', 'ميمورى تريب للنقل السياحي', 'أون ليمتد ترانسبورت', 'ترافيل إكسبريس'];
  },

  saveTransportCompany(company: string) {
    if (!company.trim()) return;
    const clean = company.trim();
    const current = this.getSavedTransportCompanies();
    const updated = [clean, ...current.filter(c => c !== clean)].slice(0, 30);
    this.setMemory({ transportCompanies: updated });
  },

  // Hotels Archive Memory (أرشيف الفنادق للانطلاق والوصول)
  getSavedHotels(): string[] {
    const mem = this.getMemory();
    if (mem.savedHotels && Array.isArray(mem.savedHotels) && mem.savedHotels.length > 0) {
      return mem.savedHotels;
    }
    return [
      'فندق رمسيس هيلتون القاهرة',
      'فندق ميركيور الأقصر',
      'منتجع شتيجنبرجر الداو الغردقة',
      'مطار القاهرة الدولي (صالة 3)',
      'مرسى الأقصر السياحي (نايل كروز)',
      'فندق فورسيزونز نايل بلازا القاهرة',
      'فندق ماريوت الزمالك القاهرة',
      'فندق سوفيتيل الجزيرة القاهرة',
      'فندق سيتي ستارز إنتركونتيننتال',
      'فندق شتيجنبرجر نايل بالاس الأقصر',
      'فندق وندسور الأقصر',
      'منتجع ماريوت الغردقة',
      'منتجع الباتروس بالاس الغردقة',
      'فندق هيلتون بلازا الغردقة',
      'مطار الغردقة الدولي',
      'مطار الأقصر الدولي',
      'فندق موفنبيك أسوان'
    ];
  },

  saveHotel(hotel: string) {
    if (!hotel.trim()) return;
    const clean = hotel.trim();
    const current = this.getSavedHotels();
    const updated = [clean, ...current.filter(h => h !== clean)].slice(0, 60);
    this.setMemory({ savedHotels: updated });
  },

  deleteHotel(hotel: string) {
    const current = this.getSavedHotels();
    const updated = current.filter(h => h !== hotel);
    this.setMemory({ savedHotels: updated });
  },

  // Generate Real QR Code
  async generatePermitQR(permit: Partial<IssuedPermit>): Promise<string> {
    const payload = [
      `وزارة السياحة - تصريح نقل سياحي معتمد`,
      `الملف: ${permit.fileNo || ''}`,
      `الشركة: ${permit.companyName || ''} (ترخيص ${permit.licenseNumber || ''})`,
      `التاريخ: ${permit.tripDate || ''}`,
      `العدد: ${permit.paxCount || 0} سائح`,
      `المرشد: ${permit.guideName || ''} (${permit.guidePhone || ''})`,
      `السائق: ${permit.driverName || 'بدون'} - سيارة: ${permit.vehicleNumber || 'بدون'}`,
      `خط السير: ${permit.programText?.slice(0, 80) || ''}`,
      `كود التحقق: EGY-${Date.now().toString(36).toUpperCase()}`
    ].join('\n');

    try {
      return await QRCode.toDataURL(payload, {
        errorCorrectionLevel: 'M',
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });
    } catch (err) {
      console.error('QR code generation failed:', err);
      return '';
    }
  },

  // Parse Excel file in browser directly with Intelligent Tri-lingual Linguistic Engine (Chinese, English, Arabic)
  // Expert-designed to distinguish genuine tourist customers (7 PAX) from Tour Leaders (TL/领队), Room Notes (大床/标间/备注), and Totals (合计/7+1)
  async parseRoomingExcel(file: File): Promise<TouristPassenger[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          if (!json || json.length === 0) {
            throw new Error('الملف فارغ أو لا يحتوي على صفوف صالحة');
          }

          // CJK character regex
          const cjkRegex = /[\u4e00-\u9fa5]/;
          // Latin letters regex
          const latinRegex = /[a-zA-Z]/;
          // Passport format: standard Chinese/international passport
          const passportRegex = /^[A-Z0-9]{6,12}$/i;

          // Header keywords across Chinese, English, Arabic:
          const headerKeywords = [
            '序号', '编号', 'no', 'no.', 'id', 'م', 'رقم', 'sn',
            '姓名', '中文姓名', '中文名', '旅客姓名', '客人姓名', 'name', 'tourist', 'passenger', 'guest', 'الاسم', 'اسم السائح',
            '英文姓名', '英文名', '拼音', '拼音姓名', 'pinyin', 'english name', 'en name', 'الاسم بالانجليزي', 'الاسم باللاتيني',
            '性别', 'gender', 'sex', 'm/f', 'النوع', 'الجنس',
            '护照', '护照号', '护照号码', '证件号', '证件号码', 'passport', 'passport no', 'جواز السفر', 'رقم الجواز', 'جواز',
            '出生日期', '出生年月', '生日', 'dob', 'date of birth', 'birth', 'تاريخ الميلاد', 'الميلاد',
            '有效期', '护照有效期', '截止日期', '到期日', 'expiry', 'exp', 'validity', 'تاريخ الانتهاء', 'الانتهاء',
            '房号', '房间号', '分房', '房间', 'room', 'room no', 'الغرفة', 'رقم الغرفة', '房型', 'bed type',
            '备注', 'remarks', 'note', 'notes', 'ملاحظات'
          ];

          // 1. Staff / Tour Leader Keywords (领队 / TL / Escort / Guide / Driver)
          // In Chinese travel operations, a Tour Leader accompanies the group (7+1 PAX) and is lodged (TL single room)
          // but is NOT a paying tourist customer and MUST NEVER be added to the tourist passenger manifest!
          const isStaffOrLeaderText = (text: string): boolean => {
            const clean = text.trim().toLowerCase();
            return (
              clean === 'tl' ||
              clean === 't/l' ||
              clean === 't.l' ||
              clean === 't.l.' ||
              clean === 'leader' ||
              clean.startsWith('tl ') ||
              clean.endsWith(' tl') ||
              clean.includes('tour leader') ||
              clean.includes('tour-leader') ||
              clean.includes('leader:') ||
              clean.includes('tour escort') ||
              clean.includes('national guide') ||
              clean.includes('local guide') ||
              clean.includes('tour manager') ||
              clean.includes('group leader') ||
              clean.includes('领队') ||
              clean.includes('全陪') ||
              clean.includes('地陪') ||
              clean.includes('导游') ||
              clean.includes('司陪') ||
              clean.includes('司机') ||
              clean.includes('陪同') ||
              clean.includes('مرشد') ||
              clean.includes('قائد الفوج') ||
              clean.includes('قائد الرحلة') ||
              clean.includes('مرافق') ||
              clean.includes('سائق')
            );
          };

          // 2. Summary, Totals, Room breakdown & Meta rows
          const isSummaryOrMetaText = (text: string): boolean => {
            const clean = text.trim().toLowerCase();
            return (
              clean.startsWith('total') ||
              clean.startsWith('subtotal') ||
              clean.startsWith('sum') ||
              clean.startsWith('grand total') ||
              clean.startsWith('headcount') ||
              clean.startsWith('count') ||
              clean.startsWith('room') ||
              clean.startsWith('rooms') ||
              clean.startsWith('remarks') ||
              clean.startsWith('remark') ||
              clean.startsWith('note') ||
              clean.startsWith('notes') ||
              clean.startsWith('notice') ||
              clean.startsWith('flight') ||
              clean.startsWith('hotel') ||
              clean.startsWith('emergency') ||
              clean.startsWith('contact') ||
              clean.startsWith('single supplement') ||
              clean.startsWith('pax') ||
              clean.startsWith('7+') ||
              clean.startsWith('合计') ||
              clean.startsWith('总计') ||
              clean.startsWith('总人数') ||
              clean.startsWith('实到') ||
              clean.startsWith('应到') ||
              clean.startsWith('共计') ||
              clean.startsWith('小计') ||
              clean.startsWith('统计') ||
              clean.startsWith('总房数') ||
              clean.startsWith('间数') ||
              clean.startsWith('备注') ||
              clean.startsWith('说明') ||
              clean.startsWith('注意事项') ||
              clean.startsWith('提示') ||
              clean.startsWith('特别说明') ||
              clean.startsWith('团号') ||
              clean.startsWith('团队编号') ||
              clean.startsWith('线路') ||
              clean.startsWith('行程') ||
              clean.startsWith('航班') ||
              clean.startsWith('酒店') ||
              clean.startsWith('接机') ||
              clean.startsWith('送机') ||
              clean.startsWith('集合') ||
              clean.startsWith('紧急联系人') ||
              clean.startsWith('联系人') ||
              clean.startsWith('签单') ||
              clean.startsWith('签字') ||
              clean.startsWith('单房差') ||
              clean.startsWith('补房差') ||
              clean.startsWith('房型') ||
              clean.startsWith('配房') ||
              clean.startsWith('7+1') ||
              clean.startsWith('7大') ||
              clean.startsWith('7人') ||
              clean.startsWith('إجمالي') ||
              clean.startsWith('المجموع') ||
              clean.startsWith('ملاحظات') ||
              clean.startsWith('تنبيه') ||
              clean.startsWith('تعليمات') ||
              clean.startsWith('فندق') ||
              clean.startsWith('طيران') ||
              clean.includes('4间房') ||
              clean.includes('间房') ||
              clean.includes('大床') ||
              clean.includes('标间') ||
              clean.includes('单间')
            );
          };

          // 3. Room type / Bedding / Administrative terms that must NEVER be accepted as passenger names
          const isAdministrativeOrRoomWord = (word: string): boolean => {
            const clean = word.trim().toLowerCase();
            const forbiddenExact = [
              // Chinese administrative & room terms
              '大床', '大床房', '夫妻大床', '双标', '双标间', '标间', '标准间', '单间', '单人房', '三人间',
              '加床', '不占床', '占床', '拼房', '独住', '免房', '房型', '分房', '单房差', '补房差',
              '领队', '全陪', '地陪', '导游', '司机', '司陪', '陪同', '备注', '说明', '合计', '总计',
              '总人数', '团号', '航班', '酒店', '接机', '送机', '客人', '游客', '姓名', '拼音', '护照',
              '性别', '房号', '序号', '编号', '无烟', '无烟房', '禁烟', '含早',
              // English administrative & room terms
              'sgl', 'single', 'single room', 'dbl', 'double', 'double room', 'king', 'queen',
              'twn', 'twin', 'twin bed', 'twin room', 'standard', 'standard room', 'trp', 'triple',
              'extra bed', 'no bed', 'rollaway', 'foc', 'free of charge', 'single supplement', 'sharing',
              'remarks', 'remark', 'note', 'notes', 'notice', 'total', 'subtotal', 'sum', 'pax',
              'tour leader', 'leader', 'tl', 't/l', 'guide', 'driver', 'escort', 'flight', 'hotel',
              'emergency contact', 'contact', 'name', 'passport', 'gender', 'sex', 'dob', 'expiry',
              'tourist', 'guest', 'passenger', 'room', 'bed'
            ];

            if (forbiddenExact.includes(clean)) return true;
            // Chinese room descriptions like "1大床", "2标间", "4间房", "1间单间"
            if (/\d+间|\d+大床|\d+标间|\d+双标|\d+单间|间房/.test(word)) return true;
            return false;
          };

          const isHeaderRow = (row: any[]): boolean => {
            let headerMatches = 0;
            for (const cell of row) {
              if (!cell) continue;
              const val = String(cell).trim().toLowerCase();
              if (headerKeywords.some(kw => val === kw || (val.length < 25 && val.includes(kw)))) {
                headerMatches++;
              }
            }
            return headerMatches >= 2;
          };

          // Find column index mapping by scanning header rows
          const colMap = {
            chinese: -1,
            english: -1,
            sex: -1,
            dob: -1,
            passport: -1,
            expiry: -1,
            room: -1,
            id: -1,
            remarks: -1
          };

          let dataStartRow = 0;

          // Search first 8 rows for table header row
          for (let r = 0; r < Math.min(json.length, 8); r++) {
            const row = json[r];
            if (!Array.isArray(row)) continue;
            if (isHeaderRow(row)) {
              dataStartRow = r + 1;
              row.forEach((cell, cIdx) => {
                const val = String(cell || '').trim().toLowerCase();
                if (['序号', '编号', 'no', 'no.', 'id', 'م', 'sn'].includes(val)) colMap.id = cIdx;
                else if (['中文姓名', '中文名', '姓名', '客人姓名', '旅客姓名'].some(k => val.includes(k))) colMap.chinese = cIdx;
                else if (['英文姓名', '英文名', '拼音', '拼音姓名', 'english name', 'pinyin', 'en name'].some(k => val.includes(k))) colMap.english = cIdx;
                else if (['性别', 'gender', 'sex', 'النوع', 'الجنس', 'm/f'].some(k => val.includes(k))) colMap.sex = cIdx;
                else if (['护照', '护照号', '护照号码', '证件号', '证件号码', 'passport', 'passport no', 'جواز'].some(k => val.includes(k))) colMap.passport = cIdx;
                else if (['出生日期', '出生年月', 'dob', 'birth', 'ميلاد', '生日'].some(k => val.includes(k))) colMap.dob = cIdx;
                else if (['有效期', '到期日', 'expiry', 'انتهاء', '护照有效期'].some(k => val.includes(k))) colMap.expiry = cIdx;
                else if (['房号', '房间号', '分房', 'room', 'room no', 'غرفة', '房型'].some(k => val.includes(k))) colMap.room = cIdx;
                else if (['备注', 'remarks', 'note', 'ملاحظات'].some(k => val.includes(k))) colMap.remarks = cIdx;
              });
              break;
            }
          }

          const rawRows = json.slice(dataStartRow);
          const rawCandidates: TouristPassenger[] = [];

          for (const row of rawRows) {
            if (!Array.isArray(row) || row.length === 0) continue;
            
            const nonBlankCells = row.map(c => String(c ?? '').trim()).filter(Boolean);
            if (nonBlankCells.length === 0) continue;

            const rowString = nonBlankCells.join(' ').toLowerCase();

            // 1. Exclude if this is another header row repeated
            if (isHeaderRow(row)) continue;

            // 2. Exclude Tour Leader / Guide / Driver row
            // Check full row string and individual key columns
            if (isStaffOrLeaderText(rowString)) {
              continue;
            }
            if (colMap.id >= 0 && row[colMap.id] && isStaffOrLeaderText(String(row[colMap.id]))) {
              continue;
            }
            if (colMap.remarks >= 0 && row[colMap.remarks] && isStaffOrLeaderText(String(row[colMap.remarks]))) {
              continue;
            }

            // 3. Exclude summary rows ("Total: 7", "合计: 7", "4间房", "Remarks: ...", etc.)
            if (isSummaryOrMetaText(rowString)) {
              continue;
            }

            let chineseName = '';
            let englishName = '';
            let sexVal = '';
            let dobVal = '';
            let passportVal = '';
            let expiryVal = '';
            let roomVal = '';

            if (colMap.chinese >= 0 && row[colMap.chinese]) chineseName = String(row[colMap.chinese]).trim();
            if (colMap.english >= 0 && row[colMap.english]) englishName = String(row[colMap.english]).trim();
            if (colMap.passport >= 0 && row[colMap.passport]) passportVal = String(row[colMap.passport]).trim();
            if (colMap.sex >= 0 && row[colMap.sex]) sexVal = String(row[colMap.sex]).trim();
            if (colMap.dob >= 0 && row[colMap.dob]) dobVal = String(row[colMap.dob]).trim();
            if (colMap.expiry >= 0 && row[colMap.expiry]) expiryVal = String(row[colMap.expiry]).trim();
            if (colMap.room >= 0 && row[colMap.room]) roomVal = String(row[colMap.room]).trim();

            // If mapping wasn't complete or cell needs fallback inspection
            for (let i = 0; i < row.length; i++) {
              const cell = String(row[i] ?? '').trim();
              if (!cell) continue;

              // If any cell in this row reveals staff or summary markers, reject the whole row
              if (isStaffOrLeaderText(cell) || isAdministrativeOrRoomWord(cell)) {
                // If the mapped chineseName or englishName matches this administrative word, clear it!
                if (chineseName === cell) chineseName = '';
                if (englishName === cell) englishName = '';
                continue;
              }

              // Check if contains authentic Chinese characters (Hanzi name: 2-4 chars)
              if (cjkRegex.test(cell) && !headerKeywords.includes(cell) && !isSummaryOrMetaText(cell) && !isAdministrativeOrRoomWord(cell)) {
                if (!chineseName && cell.length >= 2 && cell.length <= 6 && !/\d/.test(cell)) {
                  chineseName = cell;
                }
              }
              // Check if Latin letters and looks like person's name or passport
              else if (latinRegex.test(cell) && !headerKeywords.includes(cell.toLowerCase()) && !isSummaryOrMetaText(cell) && !isAdministrativeOrRoomWord(cell)) {
                if (passportRegex.test(cell) && /\d/.test(cell) && !passportVal && cell.length >= 6 && cell.length <= 12) {
                  passportVal = cell.toUpperCase();
                } else if (!englishName && cell.length >= 2 && cell.length <= 35 && !cell.includes('@') && !/\d{4}/.test(cell) && !isAdministrativeOrRoomWord(cell)) {
                  englishName = cell.toUpperCase();
                }
              }

              // Gender
              if (!sexVal) {
                const cLower = cell.toLowerCase();
                if (['f', 'female', '女', 'أنثى', 'سيدة', 'mrs', 'ms'].includes(cLower)) sexVal = 'أنثى';
                else if (['m', 'male', '男', 'ذكر', 'mr'].includes(cLower)) sexVal = 'ذكر';
              }

              // Room number
              if (!roomVal && /^\d{2,4}$/.test(cell)) {
                roomVal = cell;
              }
            }

            // Check if names are valid and not fake administrative terms
            if (isAdministrativeOrRoomWord(chineseName)) chineseName = '';
            if (isAdministrativeOrRoomWord(englishName)) englishName = '';

            // A genuine tourist customer MUST have a valid human name and cannot be blank or administrative
            if (!chineseName && !englishName) {
              continue;
            }

            if (!chineseName && englishName) {
              chineseName = englishName;
            }
            if (!englishName && chineseName) {
              englishName = chineseName;
            }

            const normalizedSex: 'ذكر' | 'أنثى' = 
              sexVal.includes('女') || sexVal.toLowerCase().includes('f') || sexVal.includes('أنثى')
                ? 'أنثى'
                : 'ذكر';

            const pIdx = rawCandidates.length + 1;

            rawCandidates.push({
              id: pIdx,
              chinese: chineseName || `سائح ${pIdx}`,
              english: englishName || `TOURIST ${pIdx}`,
              sex: normalizedSex,
              dob: dobVal || '1990-01-01',
              passport: passportVal || `E${2000000 + pIdx}`,
              expiry: expiryVal || '2030-01-01',
              room: roomVal || `${101 + Math.floor((pIdx - 1) / 2)}`
            });
          }

          if (rawCandidates.length === 0) {
            throw new Error('لم يتم العثور على أي بيانات سياح صالحة في الملف. يرجى التأكد من ملف الإكسل.');
          }

          resolve(rawCandidates);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('فشل قراءة الملف'));
      reader.readAsArrayBuffer(file);
    });
  },

  // WhatsApp Message Generator
  createWhatsAppLink(phone: string, permit: IssuedPermit): string {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('0') ? '2' + cleanPhone : cleanPhone;
    
    const message = `السلام عليكم، مرفق تصريح النقل السياحي المعتمد للرحلة:\n` +
      `📌 *رقم الملف:* ${permit.fileNo}\n` +
      `🏢 *الشركة:* ${permit.companyName} (ترخيص ${permit.licenseNumber})\n` +
      `📅 *تاريخ الرحلة:* ${permit.tripDate}\n` +
      `👥 *عدد السياح:* ${permit.paxCount} سائح\n` +
      `📍 *البرنامج:* ${permit.programText}\n` +
      `🏨 *فندق الانطلاق:* ${permit.hotelFrom || 'غير محدد'}\n` +
      `🏨 *فندق الوصول:* ${permit.hotelTo || 'غير محدد'}\n` +
      `👨‍✈️ *المرشد:* ${permit.guideName} (${permit.guidePhone})\n` +
      `🚌 *الحافلة والسائق:* ${permit.driverName || ''} (${permit.vehicleNumber || ''})\n` +
      `✅ التصريح الأمني الـ 7 ورقات جاهز ومعتمد. رحلة موفقة!`;

    return `https://wa.me/${intlPhone}?text=${encodeURIComponent(message)}`;
  }
};
