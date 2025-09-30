import type { Developer, InvestmentOpportunity, UserInvestment, AssetType, User, Transaction, City } from "@/types";

export const developers: Omit<Developer, 'opportunities'>[] = [
  {
    id: 1,
    name: 'شركة التطوير العمراني',
    description: 'شركة تطوير عقاري رائدة في المملكة، معروفة بمشاريعها عالية الجودة والالتزام بالمواعيد. تمتلك الشركة سجلاً حافلاً بالنجاح في تطوير وإدارة المشاريع السكنية والتجارية.',
    logoUrl: '/logos/dev-logo-1.svg',
  },
  {
    id: 2,
    name: 'بيوت جدة العقارية',
    description: 'متخصصون في المشاريع السكنية والتجارية الفاخرة على ساحل البحر الأحمر. نجمع بين التصميم العصري والجودة العالية لتقديم تجربة سكنية فريدة.',
    logoUrl: '/logos/dev-logo-2.svg',
  },
  {
    id: 3,
    name: 'لوجستيات المستقبل',
    description: 'نقدم حلولاً لوجستية وصناعية متكاملة تدعم النمو الاقتصادي للمملكة. مشاريعنا تتميز بالكفاءة التشغيلية والمواقع الاستراتيجية.',
    logoUrl: '/logos/dev-logo-3.svg',
  }
];

export const assetTypes: AssetType[] = [
  { id: 1, name: 'تجاري' },
  { id: 2, name: 'سكني' },
  { id: 3, name: 'صناعي' },
];

export const cities: City[] = [
  { id: 1, name: 'الرياض' },
  { id: 2, name: 'جدة' },
  { id: 3, name: 'الدمام' },
];

export const investmentOpportunities: Omit<InvestmentOpportunity, 'developer' | 'city' | 'assetType' | 'investments'>[] = [
  {
    id: 1,
    name: 'صندوق برج الرياض',
    assetTypeId: 1, // تجاري
    cityId: 1, // الرياض
    expectedReturn: 12.5,
    duration: '3 سنوات',
    funded: 75,
    status: 'متاحة',
    imageIds: ["office-tower", "riyadh-skyline"],
    description: 'فرصة للاستثمار في برج مكتبي حديث يقع في قلب المركز المالي لمدينة الرياض، مع عقود إيجارية طويلة الأمد لشركات كبرى.',
    developerId: 1,
  },
  {
    id: 2,
    name: 'مجمع فلل النخيل',
    assetTypeId: 2, // سكني
    cityId: 2, // جدة
    expectedReturn: 9.8,
    duration: '4 سنوات',
    funded: 100,
    status: 'مكتملة',
    imageIds: ["luxury-villa-compound", "jeddah-coast"],
    description: 'مجمع سكني فاخر يضم 50 فيلا على ساحل جدة، مصمم لتلبية احتياجات العائلات الباحثة عن الرفاهية والخصوصية.',
    developerId: 2,
  },
  {
    id: 3,
    name: 'مستودعات الشرقية اللوجستية',
    assetTypeId: 3, // صناعي
    cityId: 3, // الدمام
    expectedReturn: 14.2,
    duration: '5 سنوات',
    funded: 40,
    status: 'متاحة',
    imageIds: ["warehouse-logistics", "dammam-port"],
    description: 'مجمع مستودعات ذكية بالقرب من ميناء الدمام، يخدم قطاع الخدمات اللوجستية والشحن المتنامي في المنطقة الشرقية.',
    developerId: 3,
  },
  {
    id: 4,
    name: 'شقق العليا فيو',
    assetTypeId: 2, // سكني
    cityId: 1, // الرياض
    expectedReturn: 11.0,
    duration: '3 سنوات',
    funded: 92,
    status: 'متاحة',
    imageIds: ["modern-apartment-building", "apartment-interior"],
    description: 'برج سكني يوفر شققًا عصرية بإطلالات مميزة في حي العليا، مصمم للمهنيين الشباب والأسر الصغيرة.',
    developerId: 1,
  },
  {
    id: 5,
    name: 'مركز الروضة التجاري',
    assetTypeId: 1, // تجاري
    cityId: 2, // جدة
    expectedReturn: 10.5,
    duration: '5 سنوات',
    funded: 100,
    status: 'مغلقة',
    imageIds: ["shopping-center-exterior", "retail-space"],
    description: 'مركز تسوق حيوي يخدم منطقة الروضة السكنية، مع مزيج من المحلات التجارية والمطاعم ومناطق الترفيه.',
    developerId: 2,
  },
];


export const userInvestments: Omit<UserInvestment, 'opportunity' | 'user'>[] = [
    {
        id: 1,
        userId: 1,
        opportunityId: 2,
        amount: 40000,
        status: 'موزعة الأرباح',
        profit: 3920,
    },
    {
        id: 2,
        userId: 1,
        opportunityId: 1,
        amount: 60000,
        status: 'قيد التنفيذ',
    },
    {
        id: 3,
        userId: 1,
        opportunityId: 3,
        amount: 25000,
        status: 'قيد التنفيذ',
    }
];

export const users: Omit<User, 'investments' | 'transactions'>[] = [
    {
        id: 1,
        name: "عبدالله العامري",
        email: "a.alamri@example.com",
        avatar: "https://picsum.photos/seed/111/40/40",
        type: "مستثمر",
        status: "نشط",
        joinDate: "2023-01-15",
    },
    {
        id: 2,
        name: "فاطمة الزهراني",
        email: "f.zahrani@example.com",
        avatar: "https://picsum.photos/seed/112/40/40",
        type: "مستثمر",
        status: "نشط",
        joinDate: "2023-02-10",
    },
    {
        id: 3,
        name: "محمد الغامدي",
        email: "m.ghamdi@example.com",
        avatar: "https://picsum.photos/seed/113/40/40",
        type: "مستثمر",
        status: "محظور",
        joinDate: "2022-11-05",
    }
];

export const transactions: Omit<Transaction, 'user'>[] = [
  { id: 1, userId: 1, type: 'إيداع', amount: 5000, date: '2024-05-20', status: 'مكتمل' },
  { id: 2, userId: 1, type: 'سحب', amount: 1500, date: '2024-05-18', status: 'مكتمل' },
  { id: 3, userId: 1, type: 'استثمار', amount: 25000, date: '2024-05-15', status: 'مكتمل' },
  { id: 4, userId: 1, type: 'أرباح', amount: 3920, date: '2024-05-12', status: 'مكتمل' },
  { id: 5, userId: 1, type: 'إيداع', amount: 10000, date: '2024-05-10', status: 'قيد المعالجة' },
];
