export interface Expert {
  id: 'tourism_ops' | 'systems_architect' | 'security' | 'product_saas' | 'general';
  name: string;
  title: string;
  role: string;
  avatar: string;
  badge: string;
  score: number; // Out of 100
  verdict: 'متميز مع نواقص تشغيلية' | 'متميز ومطابق للوائح' | 'يحتاج إعادة هيكلة سحابية' | 'حرج أمنياً' | 'فرصة تجارية واعدة' | 'تقييم عام';
  keyInsights: string[];
  recommendations: {
    priority: 'عاجل' | 'متوسط' | 'تحسين مستقبلي';
    text: string;
    impact: string;
  }[];
  detailedReview: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'expert';
  expertId: string;
  expertName?: string;
  text: string;
  timestamp: string;
}

export interface TouristPassenger {
  id: number;
  chinese: string;
  english: string;
  sex: 'ذكر' | 'أنثى';
  dob: string;
  passport: string;
  expiry: string;
  room: string;
}

export type PermitRouteType = 'cairo' | 'luxor_transfer' | 'luxor_overnight' | 'hurghada';
export type RouteCategoryType = 'shared_routes' | 'hurghada_route';

export interface PermitWorkflowState {
  company: 'unlimited' | 'memory';
  routeCategory: RouteCategoryType;
  permitType: PermitRouteType;
  fileNo: string;
  paxCount: number;
  manualPaxOverride: boolean;
  guideName: string;
  guidePhone: string;
  tripDate: string;
  issueDate: string;
  programText: string;
  hotelFrom: string;
  hotelTo: string;
  transportCompany: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  hasExcel: boolean;
  hasRoomingImage: boolean;
  hasProgramImage: boolean;
  hasExtraPage: boolean;
}
