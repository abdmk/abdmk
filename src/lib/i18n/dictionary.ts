import type { Lang } from '@/lib/content/types';

/**
 * UI strings. Content strings live in /content; this file is only the chrome.
 * Keys are grouped by where they appear.
 */
const dict = {
  nav: {
    home: { ar: 'الرئيسية', en: 'Home' },
    work: { ar: 'الأعمال', en: 'Work' },
    fonts: { ar: 'الخطوط', en: 'Fonts' },
    services: { ar: 'الخدمات', en: 'Services' },
    companies: { ar: 'الشركات', en: 'Companies' },
    workshops: { ar: 'الورش', en: 'Workshops' },
    courses: { ar: 'الكورسات', en: 'Courses' },
    about: { ar: 'نبذة', en: 'About' },
    contact: { ar: 'تواصل', en: 'Contact' },
    menu: { ar: 'القائمة', en: 'Menu' },
    close: { ar: 'إغلاق', en: 'Close' },
    skipToContent: { ar: 'تخطَّ إلى المحتوى', en: 'Skip to content' },
    switchLanguage: { ar: 'Switch to English', en: 'التبديل إلى العربية' },
  },
  home: {
    featuredWork: { ar: 'أعمال مختارة', en: 'Selected Work' },
    selectedFonts: { ar: 'خطوط مختارة', en: 'Selected Fonts' },
    workedWith: { ar: 'عملت مع', en: 'Worked With' },
    services: { ar: 'الخدمات', en: 'Services' },
    workshops: { ar: 'ورش وكورسات', en: 'Workshops & Courses' },
    about: { ar: 'نبذة عني', en: 'About' },
    viewWork: { ar: 'شاهد الأعمال', en: 'View My Work' },
    contactMe: { ar: 'تواصل معي', en: 'Contact Me' },
    viewAllWork: { ar: 'كل الأعمال', en: 'View All Work' },
    viewAllFonts: { ar: 'كل الخطوط', en: 'View All Fonts' },
    viewAllCompanies: { ar: 'كل الشركات', en: 'View All Companies' },
    viewAllWorkshops: { ar: 'كل الورش', en: 'View All Workshops' },
    viewAllServices: { ar: 'كل الخدمات', en: 'View All Services' },
    readMore: { ar: 'اقرأ المزيد', en: 'Read More' },
    ctaTitle: { ar: 'لنعمل معًا', en: "Let's work together" },
  },
  work: {
    title: { ar: 'الأعمال', en: 'Work' },
    all: { ar: 'الكل', en: 'All' },
    filter: { ar: 'تصنيف', en: 'Filter' },
    projectCount: { ar: 'مشروع', en: 'projects' },
    empty: { ar: 'لا توجد مشاريع في هذا التصنيف بعد.', en: 'No projects in this category yet.' },
  },
  project: {
    year: { ar: 'السنة', en: 'Year' },
    client: { ar: 'العميل', en: 'Client' },
    role: { ar: 'الدور', en: 'Role' },
    services: { ar: 'الخدمات', en: 'Services' },
    tools: { ar: 'الأدوات', en: 'Tools' },
    categories: { ar: 'التصنيفات', en: 'Categories' },
    fontsUsed: { ar: 'الخطوط المستخدمة', en: 'Fonts Used' },
    visitProject: { ar: 'زيارة المشروع', en: 'Visit Project' },
    share: { ar: 'مشاركة', en: 'Share' },
    copyLink: { ar: 'نسخ الرابط', en: 'Copy Link' },
    copied: { ar: 'تم النسخ', en: 'Copied' },
    previousProject: { ar: 'المشروع السابق', en: 'Previous Project' },
    nextProject: { ar: 'المشروع التالي', en: 'Next Project' },
    related: { ar: 'مشاريع ذات صلة', en: 'Related Projects' },
    backToWork: { ar: 'كل الأعمال', en: 'All Work' },
  },
  gallery: {
    open: { ar: 'تكبير الصورة', en: 'Open image' },
    previous: { ar: 'السابق', en: 'Previous' },
    next: { ar: 'التالي', en: 'Next' },
    close: { ar: 'إغلاق', en: 'Close' },
    zoom: { ar: 'تكبير', en: 'Zoom' },
    counter: { ar: 'من', en: 'of' },
  },
  fonts: {
    title: { ar: 'الخطوط', en: 'Fonts' },
    intro: {
      ar: 'خطوط عربية أصمّمها وأطوّرها — من الفكرة إلى ملف جاهز للاستخدام.',
      en: 'Arabic typefaces I design and produce — from concept to a shipping font file.',
    },
    weights: { ar: 'الأوزان', en: 'Weights' },
    features: { ar: 'الخصائص', en: 'Features' },
    specimens: { ar: 'نماذج', en: 'Specimens' },
    license: { ar: 'الترخيص', en: 'License' },
    buy: { ar: 'شراء الخط', en: 'Purchase' },
    download: { ar: 'تحميل', en: 'Download' },
    usedIn: { ar: 'مشاريع تستخدم هذا الخط', en: 'Projects Using This Font' },
    relatedFonts: { ar: 'خطوط أخرى', en: 'More Fonts' },
    type: { ar: 'النوع', en: 'Type' },
  },
  tester: {
    title: { ar: 'جرّب الخط', en: 'Type Tester' },
    placeholder: { ar: 'اكتب نصًا لتجربته…', en: 'Type something to test…' },
    size: { ar: 'الحجم', en: 'Size' },
    weight: { ar: 'الوزن', en: 'Weight' },
    lineHeight: { ar: 'تباعد الأسطر', en: 'Line height' },
    letterSpacing: { ar: 'تباعد الحروف', en: 'Letter spacing' },
    alignment: { ar: 'المحاذاة', en: 'Alignment' },
    alignStart: { ar: 'بداية', en: 'Start' },
    alignCenter: { ar: 'وسط', en: 'Center' },
    alignJustify: { ar: 'ضبط', en: 'Justify' },
    script: { ar: 'اللغة', en: 'Script' },
    arabic: { ar: 'عربي', en: 'Arabic' },
    latin: { ar: 'لاتيني', en: 'Latin' },
    reset: { ar: 'إعادة ضبط', en: 'Reset' },
    previewNote: {
      ar: 'المعاينة بخط الموقع — ملف الخط النهائي يُرفع من لوحة التحكم.',
      en: 'Previewed in the site typeface — upload the release font file from the admin.',
    },
  },
  companies: {
    title: { ar: 'الشركات والعملاء', en: 'Companies & Clients' },
    intro: {
      ar: 'الجهات التي عملت معها — استوديوهات ووكالات وعلامات ومؤسسات.',
      en: 'The places I have worked with — studios, agencies, brands and organisations.',
    },
    role: { ar: 'الدور', en: 'Role' },
    period: { ar: 'الفترة', en: 'Period' },
    type: { ar: 'النوع', en: 'Type' },
    selectedProjects: { ar: 'مشاريع مختارة', en: 'Selected Projects' },
    visitSite: { ar: 'زيارة الموقع', en: 'Visit Website' },
    noProjects: { ar: 'لا توجد مشاريع منشورة لهذه الجهة بعد.', en: 'No published projects for this client yet.' },
    types: {
      company: { ar: 'شركة', en: 'Company' },
      studio: { ar: 'استوديو', en: 'Studio' },
      agency: { ar: 'وكالة', en: 'Agency' },
      client: { ar: 'عميل', en: 'Client' },
      organization: { ar: 'مؤسسة', en: 'Organization' },
      personal: { ar: 'عميل شخصي', en: 'Personal Client' },
    },
  },
  about: {
    title: { ar: 'نبذة', en: 'About' },
    experience: { ar: 'الخبرة', en: 'Experience' },
    approach: { ar: 'طريقة العمل', en: 'Approach' },
    tools: { ar: 'الأدوات', en: 'Tools' },
    interests: { ar: 'اهتمامات', en: 'Interests' },
    achievements: { ar: 'محطات', en: 'Achievements' },
    downloadCv: { ar: 'تحميل السيرة الذاتية', en: 'Download CV' },
    present: { ar: 'الآن', en: 'Present' },
  },
  services: {
    title: { ar: 'الخدمات', en: 'Services' },
    intro: {
      ar: 'ما أقدّمه للعلامات والمؤسسات — من الهوية الكاملة إلى خط مخصّص.',
      en: 'What I offer brands and institutions — from a full identity to a bespoke typeface.',
    },
    deliverables: { ar: 'ما تحصل عليه', en: 'What you get' },
    relatedWork: { ar: 'أعمال ذات صلة', en: 'Related Work' },
    enquire: { ar: 'اطلب هذه الخدمة', en: 'Enquire About This' },
  },
  workshops: {
    title: { ar: 'ورش العمل', en: 'Workshops' },
    coursesTitle: { ar: 'الكورسات', en: 'Courses' },
    intro: {
      ar: 'ورش وكورسات في التايبوغرافي العربي والهوية البصرية.',
      en: 'Workshops and courses in Arabic typography and visual identity.',
    },
    upcoming: { ar: 'القادمة', en: 'Upcoming' },
    past: { ar: 'السابقة', en: 'Past' },
    date: { ar: 'التاريخ', en: 'Date' },
    duration: { ar: 'المدة', en: 'Duration' },
    location: { ar: 'المكان', en: 'Location' },
    price: { ar: 'الرسوم', en: 'Price' },
    seats: { ar: 'المقاعد', en: 'Seats' },
    seatsLeft: { ar: 'مقعدًا', en: 'seats' },
    content: { ar: 'المحتوى', en: 'What we cover' },
    register: { ar: 'سجّل الآن', en: 'Register' },
    registrationClosed: { ar: 'انتهى التسجيل', en: 'Registration closed' },
    mode: {
      online: { ar: 'عن بُعد', en: 'Online' },
      offline: { ar: 'حضوري', en: 'In person' },
      hybrid: { ar: 'مدمج', en: 'Hybrid' },
    },
    noUpcoming: { ar: 'لا توجد مواعيد قادمة حاليًا.', en: 'Nothing scheduled right now.' },
  },
  contact: {
    title: { ar: 'تواصل', en: 'Contact' },
    intro: {
      ar: 'أخبرني عن مشروعك. أردّ عادة خلال يومي عمل.',
      en: 'Tell me about your project. I usually reply within two working days.',
    },
    name: { ar: 'الاسم', en: 'Name' },
    email: { ar: 'البريد الإلكتروني', en: 'Email' },
    projectType: { ar: 'نوع المشروع', en: 'Project Type' },
    budget: { ar: 'الميزانية', en: 'Budget' },
    message: { ar: 'الرسالة', en: 'Message' },
    send: { ar: 'إرسال', en: 'Send Message' },
    sending: { ar: 'جارٍ الإرسال…', en: 'Sending…' },
    success: { ar: 'وصلت رسالتك. سأعود إليك قريبًا.', en: 'Your message is in. I will get back to you shortly.' },
    error: { ar: 'تعذّر الإرسال. جرّب مراسلتي على البريد مباشرة.', en: 'Could not send. Please email me directly instead.' },
    select: { ar: 'اختر…', en: 'Select…' },
    required: { ar: 'مطلوب', en: 'required' },
    errors: {
      name: { ar: 'من فضلك اكتب اسمك.', en: 'Please enter your name.' },
      email: { ar: 'من فضلك اكتب بريدًا صحيحًا.', en: 'Please enter a valid email.' },
      message: { ar: 'من فضلك اكتب رسالتك.', en: 'Please write a message.' },
    },
    elsewhere: { ar: 'أو عبر', en: 'Or reach me on' },
    availability: { ar: 'التوفر', en: 'Availability' },
  },
  footer: {
    navigation: { ar: 'روابط', en: 'Navigation' },
    connect: { ar: 'تواصل', en: 'Connect' },
    rights: { ar: 'جميع الحقوق محفوظة', en: 'All rights reserved' },
    backToTop: { ar: 'إلى الأعلى', en: 'Back to top' },
  },
  common: {
    notFound: { ar: 'الصفحة غير موجودة', en: 'Page not found' },
    notFoundBody: {
      ar: 'الرابط الذي طلبته غير متاح. ربما تجد ما تبحث عنه في الأعمال.',
      en: 'That link does not exist. You may find what you are after in the work.',
    },
    goHome: { ar: 'العودة للرئيسية', en: 'Back home' },
    loading: { ar: 'جارٍ التحميل…', en: 'Loading…' },
    draft: { ar: 'مسودة', en: 'Draft' },
    published: { ar: 'منشور', en: 'Published' },
  },
} as const;

export type Dictionary = typeof dict;

/** Resolve a dictionary entry for a language. */
export function ui(lang: Lang) {
  const resolve = (node: unknown): unknown => {
    if (node && typeof node === 'object') {
      const obj = node as Record<string, unknown>;
      if (typeof obj.ar === 'string' && typeof obj.en === 'string') return obj[lang];
      return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, resolve(v)]));
    }
    return node;
  };
  return resolve(dict) as Translated<Dictionary>;
}

/** Recursively turn `{ar,en}` leaves into plain strings. */
export type Translated<T> = T extends { ar: string; en: string }
  ? string
  : T extends object
    ? { [K in keyof T]: Translated<T[K]> }
    : T;
