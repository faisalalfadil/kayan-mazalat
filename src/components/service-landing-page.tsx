'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sun,
  Layers,
  Paintbrush,
  Phone,
  Home,
  ChevronLeft,
  ShieldCheck,
  Clock,
  DollarSign,
  Eye,
  Award,
  Users,
  HeadphonesIcon,
  MessageCircle,
  Star,
  CheckCircle2,
  Lightbulb,
  Ruler,
  Hammer,
  TreePine,
  Diamond,
  SquareStack,
  LayoutGrid,
  Wallpaper,
  Sparkles,
  Monitor,
  BedDouble,
  Bath,
  Palette,
  Wind,
  Warehouse,
  Car,
  PanelTop,
  ArrowLeftRight,
  Zap,
  Send,
  Maximize,
} from 'lucide-react';

// ─── Props ───────────────────────────────────────────────────────────────────

export interface ServiceContentData {
  heroTagline: string;
  overview: string[];
  stats: { value: string; label: string; icon: string }[];
  features: { title: string; description: string; icon: string }[];
  advantages: { title: string; description: string; icon: string }[];
  faqs: { question: string; answer: string }[];
}

interface ServiceLandingPageProps {
  service: {
    id: string;
    title: string;
    titleEn?: string | null;
    slug: string;
    description: string;
    descriptionEn?: string | null;
    icon: string;
    image?: string | null;
    order: number;
  };
  settings: {
    phone: string;
    phone2?: string;
    whatsapp: string;
    email: string;
    companyName: string;
  };
  content?: ServiceContentData;
  onBack: () => void;
  onOpenQuote: () => void;
}

// ─── Icon Map ────────────────────────────────────────────────────────────────

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sun,
  Layers,
  Paintbrush,
  TreePine,
  Diamond,
  SquareStack,
  LayoutGrid,
  Wallpaper,
  Sparkles,
  Monitor,
  BedDouble,
  Bath,
  Palette,
  Wind,
  Warehouse,
  Car,
  PanelTop,
  Hammer,
  Ruler,
  Lightbulb,
  // Additional icons used in DB content
  ArrowLeftRight,
  Home,
  Maximize,
  ShieldCheck,
  Award,
  Users,
  DollarSign,
  Eye,
  Star,
  Clock,
  HeadphonesIcon,
  Zap,
  MessageCircle,
};

// ─── Service Content Data ────────────────────────────────────────────────────

interface ServiceFeature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface FAQ {
  question: string;
  answer: string;
}

interface ServiceContent {
  heroTagline: string;
  overview: string[];
  stats: { value: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
  features: ServiceFeature[];
  advantages: { title: string; description: string; icon: React.ComponentType<{ className?: string }> }[];
  faqs: FAQ[];
}

const serviceContentMap: Record<string, ServiceContent> = {
  'electric-awnings': {
    heroTagline: 'حلول تظليل ذكية ومتطورة تحمي من أشعة الشمس وتضيف لمسة جمالية لمساحتك',
    overview: [
      'نقدم في كيان القمة أحدث أنظمة المظلات الكهربائية المتحركة التي تجمع بين الأداء العالي والتصميم الأنيق. تعتمد مظلاتنا على أحدث التقنيات الألمانية والإيطالية لضمان متانة وكفاءة عالية في جميع الظروف المناخية.',
      'تتميز مظلاتنا الكهربائية بإمكانية التحكم بها عن بُعد عبر جهاز تحكم أو تطبيق هاتف ذكي، مع خيارات متعددة للألوان والأقمشة المقاومة للأشعة فوق البنفسجية والظروف المناخية القاسية في المملكة العربية السعودية.',
      'نقدم حلول تظليل شاملة تشمل الفلل والمنازل والمطاعم والفنادق والمقاهي والمنشآت التجارية، مع ضمان شامل وخدمة ما بعد البيع تضمن راحتك ورضاك التام.',
    ],
    stats: [
      { value: '+500', label: 'مظلة مثبتة', icon: Warehouse },
      { value: '+15', label: 'نوع مختلف', icon: Layers },
      { value: '10', label: 'سنوات ضمان', icon: ShieldCheck },
      { value: '100%', label: 'مواد ألمانية', icon: Award },
    ],
    features: [
      {
        title: 'مظلات الكاسيت',
        description: 'تصميم أنيق مع هيكل كاسيت مغلق يحمي القماش عند الطي، مثالية للشرفات والنوافذ',
        icon: PanelTop,
      },
      {
        title: 'مظلات الذراع المفصلي',
        description: 'ذراع قابلة للتمدد حتى 7 أمتار، مثالية للحدائق والمساحات المفتوحة',
        icon: ArrowLeftRight,
      },
      {
        title: 'مظلات البيرجولا',
        description: 'هيكل ثابت بأقمشة قابلة للانزلاق، مثالية لتراسات المطاعم والفنادق',
        icon: Warehouse,
      },
      {
        title: 'مظلات الشرفات',
        description: 'حلول مخصصة لشرفات المنازل والفلل بأحجام وأشكال متنوعة',
        icon: Home,
      },
      {
        title: 'مظلات مواقف السيارات',
        description: 'حماية شاملة لسيارتك من الشمس والأمطار بأغطية مقاومة للعوامل الجوية',
        icon: Car,
      },
      {
        title: 'مظلات النوافذ',
        description: 'تظليل ذكي للنوافذ يتحكم بكمية الضوء والدخان ويساعد في توفير الطاقة',
        icon: Maximize,
      },
    ],
    advantages: [
      { title: 'خبرة أكثر من 15 عاماً', description: 'سنوات طويلة من الخبرة في تركيب وصيانة المظلات الكهربائية', icon: Award },
      { title: 'فنيون متخصصون', description: 'فريق فني مدرب على أحدث التقنيات العالمية في التركيب والصيانة', icon: Users },
      { title: 'ضمان شامل 10 سنوات', description: 'ضمان شامل على الأجزاء والمحركات مع صيانة دورية مجانية', icon: ShieldCheck },
      { title: 'أسعار تنافسية', description: 'أفضل الأسعار في السوق السعودي مع خيارات دفع مرنة', icon: DollarSign },
      { title: 'معاينة مجانية', description: 'فريقنا يزورك مجاناً لمعاينة المكان وتقديم المقاسات الصحيحة', icon: Eye },
      { title: 'مواد ألمانية عالية الجودة', description: 'نستخدم أقمشة ومحركات من أفضل المصانع الألمانية والإيطالية', icon: Star },
      { title: 'الالتزام بالمواعيد', description: 'نلتزم بجدول زمني دقيق لتنفيذ المشروع دون تأخير', icon: Clock },
      { title: 'خدمة ما بعد البيع', description: 'دعم فني متواصل وصيانة دورية لضمان أداء المظلة على المدى الطويل', icon: HeadphonesIcon },
    ],
    faqs: [
      {
        question: 'ما هي المظلات الكهربائية المتحركة؟',
        answer: 'المظلات الكهربائية المتحركة هي أنظمة تظليل تعمل بمحرك كهربائي يمكن فتحها وإغلاقها تلقائياً عبر جهاز تحكم عن بُعد أو تطبيق هاتف ذكي. توفر حماية من الشمس والأمطار مع إمكانية التحكم بكمية الظل حسب الحاجة.',
      },
      {
        question: 'ما أنواع المظلات الكهربائية المتوفرة؟',
        answer: 'نوفر عدة أنواع تشمل: مظلات الكاسيت، مظلات الذراع المفصلي، مظلات البيرجولا، مظلات الشرفات، مظلات مواقف السيارات، ومظلات النوافذ. كل نوع مصمم ليناسب استخداماً محدداً ومساحات مختلفة.',
      },
      {
        question: 'هل يمكن التحكم بالمظلة عن بعد؟',
        answer: 'نعم، جميع مظلاتنا الكهربائية تأتي مع جهاز تحكم عن بُعد، كما يمكن إضافة نظام تحكم عبر تطبيق الهاتف الذكي أو ربطها بنظام التحكم الذكي في المنزل (Smart Home).',
      },
      {
        question: 'ما مدة ضمان المظلات الكهربائية؟',
        answer: 'نقدم ضماناً شاملاً لمدة 10 سنوات على المحركات و5 سنوات على الأقمشة والأجزاء الهيكلية. يشمل الضمان الصيانة الدورية والإصلاحات المجانية خلال فترة الضمان.',
      },
      {
        question: 'هل المظلات تتحمل الرياح؟',
        answer: 'نعم، مظلاتنا مصممة لتتحمل سرعات رياح تصل إلى 80 كم/ساعة في وضع الفتح و120 كم/ساعة في وضع الإغلاق. نستخدم أقمشة مقاومة للعوامل الجوية وهيكل من الألمنيوم المعالج.',
      },
      {
        question: 'ما تكلفة تركيب مظلة كهربائية؟',
        answer: 'تختلف التكلفة حسب نوع المظلة والمساحة والمواد المستخدمة. نقدم معاينة مجانية وتسعيرة مفصلة بعد زيارة الموقع. تواصل معنا للحصول على عرض سعر مخصص لمشروعك.',
      },
    ],
  },
  'mullay-sheboud': {
    heroTagline: 'بديل عصري ومبتكر للشيبود التقليدي بألوان وتصاميم متنوعة تناسب جميع المساحات',
    overview: [
      'ألواح الشيبود هي البديل المثالي للشيبود التقليدي، مصنوعة من مواد PVC عالية الجودة المقاومة للماء والرطوبة والحشرات. تتميز بسهولة التركيب والتنظيف وعمر افتراضي أطول بكثير مقارنة بالشيبود العادي.',
      'تتوفر ألواح الشيبود بمجموعة واسعة من التصاميم والألوان العصرية التي تناسب جميع أنواع المساحات الداخلية، من الجدران والأسقف إلى الحمامات والمطابخ. كما يمكن دمجها مع إضاءة LED مخفية لإضفاء لمسة ساحرة على ديكورك.',
      'في كيان القمة، نقدم حلولاً متكاملة بألواح الشيبود تشمل التصميم والتركيب بمعايير احترافية عالية. فريقنا المتخصص يضمن لك نتيجة نهائية تعكس ذوقك الرفيع وتلبي توقعاتك.',
    ],
    stats: [
      { value: '+300', label: 'مشروع منجز', icon: Hammer },
      { value: '+50', label: 'تصميم متوفر', icon: Palette },
      { value: '100%', label: 'مقاوم للماء', icon: ShieldCheck },
      { value: '20+', label: 'سنة عمر افتراضي', icon: Clock },
    ],
    features: [
      {
        title: 'ألواح الشيبود للجدران',
        description: 'ألواح بتصاميم متنوعة لتغطية الجدران وإضفاء مظهر عصري وأنيق',
        icon: LayoutGrid,
      },
      {
        title: 'ألواح الشيبود للأسقف',
        description: 'حلول سقفية خفيفة الوزن بتصاميم جذابة مع إمكانية إخفاء الإضاءة',
        icon: PanelTop,
      },
      {
        title: 'ألواح الشيبود ثلاثية الأبعاد',
        description: 'تصاميم 3D بارزة تضيف عمقاً وحيوية للجدران والأسقف',
        icon: Diamond,
      },
      {
        title: 'ألواح الشيبود للحمامات',
        description: 'ألواح مقاومة للماء والرطوبة مثالية لأسقف وجدران الحمامات',
        icon: Bath,
      },
      {
        title: 'إضاءة LED مخفية',
        description: 'تكامل مثالي مع ألواح الشيبود لإضاءة مخفية تخلق أجواءً ساحرة',
        icon: Lightbulb,
      },
      {
        title: 'تصاميم مخصصة',
        description: 'إمكانية طلب تصاميم خاصة تناسب ذوقك واحتياجات مساحتك',
        icon: Palette,
      },
    ],
    advantages: [
      { title: 'خبرة أكثر من 15 عاماً', description: 'سنوات طويلة من الخبرة في تركيب ألواح الشيبود بمختلف أنواعها', icon: Award },
      { title: 'فريق فني متخصص', description: 'فنيون مدربون على أحدث تقنيات تركيب ألواح الشيبود', icon: Users },
      { title: 'ضمان شامل', description: 'ضمان شامل على الألواح والتركيب مع التزام بمعايير الجودة', icon: ShieldCheck },
      { title: 'أسعار تنافسية', description: 'أسعار تنافسية مع خيارات متعددة تناسب مختلف الميزانيات', icon: DollarSign },
      { title: 'معاينة مجانية', description: 'معاينة مجانية للموقع مع تقديم استشارة فنية شاملة', icon: Eye },
      { title: 'مواد عالية الجودة', description: 'ألواح الشيبود من أفضل الشركات المصنعة بأوروبا وتركيا', icon: Star },
      { title: 'الالتزام بالمواعيد', description: 'تنفيذ المشاريع في الوقت المحدد مع الالتزام بالمواعيد', icon: Clock },
      { title: 'خدمة ما بعد البيع', description: 'متابعة مستمرة بعد التسليم وضمان جودة العمل على المدى الطويل', icon: HeadphonesIcon },
    ],
    faqs: [
      {
        question: 'ما هو بديل الشيبود؟',
        answer: 'الشيبود هو بديل حديث للشيبود التقليدي مصنوع من مواد PVC عالية الجودة. يتميز بمقاومته للماء والرطوبة والحشرات، وسهولة تركيبه وتنظيفه، مع تصاميم عصرية متنوعة تتفوق على الشيبود التقليدي.',
      },
      {
        question: 'ما الفرق بين الشيبود والشيبود العادي؟',
        answer: 'ألواح الشيبود تتميز عن الشيبود التقليدي بعدة مميزات: مقاومة أعلى للماء والرطوبة، عمر افتراضي أطول (20+ سنة)، تصاميم عصرية متنوعة، سهولة التنظيف، عدم انتشار الحشرات، وإمكانية دمجها مع إضاءة LED مخفية.',
      },
      {
        question: 'هل يمكن استخدامه في الحمامات؟',
        answer: 'نعم، نوفر ألواح الشيبود خصيصاً للحمامات مصنوعة من مواد مقاومة للماء والرطوبة بنسبة 100%. مثالية لتغطية أسقف وجدران الحمامات وتحل محل السيراميك والبلاط بشكل عصري.',
      },
      {
        question: 'ما مدة العمر الافتراضي لألواح الشيبود؟',
        answer: 'ألواح الشيبود لها عمر افتراضي يتراوح بين 20 إلى 30 سنة عند التركيب الصحيح. هي لا تتأثر بالرطوبة أو الحشرات ولا تحتاج لصيانة دورية، مما يجعلها استثماراً طويل الأمد.',
      },
      {
        question: 'هل يمكن تنظيف ألواح الشيبود بسهولة؟',
        answer: 'بالتأكيد! من أهم مميزات ألواح الشيبود سهولة التنظيف. يكفي مسحها بقطعة قماش رطبة أو استخدام المكنسة الكهربائية. لا تحتاج لمنظفات خاصة أو مواد كيميائية قوية.',
      },
      {
        question: 'ما هي الألوان والتصاميم المتوفرة؟',
        answer: 'نوفر مجموعة واسعة من الألوان والتصاميم تشمل: ألوان خشبية طبيعية، ألوان سادة عصرية، تصاميم 3D بارزة، تصاميم رخامية، وأكثر من 50 تصميماً مختلفاً. كما يمكننا تقديم تصاميم مخصصة حسب طلبك.',
      },
    ],
  },
  'interior-decoration': {
    heroTagline: 'نحول مساحتك الداخلية إلى تحفة فنية بتصاميم عصرية وجودة احترافية لا مثيل لها',
    overview: [
      'نقدم في كيان القمة خدمات ديكورات داخلية متكاملة تشمل أحدث التقنيات والمواد في عالم التصميم الداخلي. من بديل الخشب والرخام إلى باركيه SPC وجبس بورد، نوفر كل ما تحتاجه لتحويل منزلك أو مكتبك إلى مساحة أنيقة وعملية.',
      'يعمل فريقنا من المصممين والفنيين المحترفين على تحقيق رؤيتك التصميمية بأعلى معايير الجودة. نستخدم مواد عالية الجودة من أفضل المصانع العالمية مع الالتزام بأحدث الاتجاهات في عالم الديكور الداخلي.',
      'نخدم عملاءنا في جميع أنحاء المملكة العربية السعودية، من الرياض وجدة والدمام إلى بقية المدن والمحافظات. نسعى دائماً لتقديم تجربة عملاء استثنائية من الاستشارة الأولى حتى التسليم النهائي.',
    ],
    stats: [
      { value: '+1000', label: 'مشروع منجز', icon: Hammer },
      { value: '+200', label: 'عميل سعيد', icon: Users },
      { value: '30+', label: 'نوع ديكور', icon: Palette },
      { value: '+15', label: 'سنة خبرة', icon: Award },
    ],
    features: [
      {
        title: 'بديل خشب',
        description: 'ألواح خشبية صناعية بتصاميم واقعية تناسب المجالس والجدران والأسقف',
        icon: TreePine,
      },
      {
        title: 'بديل رخام',
        description: 'حلول رخام صناعية بألوان وتصاميم متعددة للجدران والأرضيات',
        icon: Diamond,
      },
      {
        title: 'باركيه SPC',
        description: 'أرضيات SPC مقاومة للماء والخدش سهلة التركيب بأشكال خشبية حديثة',
        icon: SquareStack,
      },
      {
        title: 'جبس بورد',
        description: 'أعمال جبس بورد للأسقف المعلقة والأقواس والتصاميم الداخلية المتنوعة',
        icon: LayoutGrid,
      },
      {
        title: 'ورق جدران 3D',
        description: 'خلفيات ثلاثية الأبعاد بتصاميم عصرية تضيف عمقاً وجمالاً للجدران',
        icon: Wallpaper,
      },
      {
        title: 'ديكورات فوم',
        description: 'نماذج فوم ديكورية للأسقف والجدران بتصاميم كلاسيكية وعصرية',
        icon: Sparkles,
      },
      {
        title: 'بديل الشيبود',
        description: 'ألواح PVC عصرية بديلة للشيبود التقليدي بمقاومة عالية للماء',
        icon: Layers,
      },
      {
        title: 'مرايا جدارية',
        description: 'مرايا جدارية بتصاميم مختلفة لإضفاء اتساع وجمال على المساحات',
        icon: Star,
      },
      {
        title: 'خلفيات تلفزيون',
        description: 'تصاميم خلفيات تلفزيون مميزة بالرخام والخشب والديكورات المبتكرة',
        icon: Monitor,
      },
      {
        title: 'هيدبورد غرف نوم',
        description: 'تصاميم هيدبورد أنيقة بلمسات خشبية وديكورية لغرف النوم',
        icon: BedDouble,
      },
    ],
    advantages: [
      { title: 'خبرة أكثر من 15 عاماً', description: 'خبرة واسعة في تنفيذ مشاريع الديكورات الداخلية بمختلف أنواعها', icon: Award },
      { title: 'فريق فني متخصص', description: 'مصممون وفنيون محترفون متخصصون في أحدث تقنيات الديكور', icon: Users },
      { title: 'ضمان شامل', description: 'ضمان على جميع الأعمال والمواد المستخدمة مع متابعة ما بعد التسليم', icon: ShieldCheck },
      { title: 'أسعار تنافسية', description: 'أسعار منافسة مع خيارات متعددة تناسب جميع الميزانيات', icon: DollarSign },
      { title: 'معاينة مجانية', description: 'معاينة مجانية للموقع مع استشارة تصميمية شاملة من خبرائنا', icon: Eye },
      { title: 'مواد عالية الجودة', description: 'نستخدم مواد من أفضل المصانع العالمية لضمان جودة ودوام العمل', icon: Star },
      { title: 'الالتزام بالمواعيد', description: 'التزام تام بالمواعيد المحددة مع خطة عمل واضحة ومتابعة مستمرة', icon: Clock },
      { title: 'خدمة ما بعد البيع', description: 'دعم ومتابعة مستمرة بعد التسليم لضمان رضا العملاء التام', icon: HeadphonesIcon },
    ],
    faqs: [
      {
        question: 'ما هي الخدمات التي تشملها الديكورات الداخلية؟',
        answer: 'تشمل خدماتنا بديل الخشب والرخام، باركيه SPC، جبس بورد، ورق جدران 3D، ديكورات فوم، بديل الشيبود، مرايا جدارية، خلفيات تلفزيون، وهيدبورد غرف نوم. نقدم حلاً متكاملاً لجميع احتياجات الديكور الداخلي.',
      },
      {
        question: 'كم تستغرق مدة تنفيذ مشروع الديكورات؟',
        answer: 'تختلف المدة حسب حجم المشروع ونوع الأعمال المطلوبة. المشاريع الصغيرة تستغرق 3-5 أيام عمل، والمشاريع المتوسطة 1-2 أسابيع، والمشاريع الكبيرة 2-4 أسابيع. نقدم جدولاً زمنياً واضحاً قبل بدء العمل.',
      },
      {
        question: 'هل تقدمون خدمة التصميم؟',
        answer: 'نعم، نوفر خدمة تصميم شاملة تتضمن استشارة مجانية ومقترحات تصميمية ثلاثية الأبعاد (3D) لمساعدتك في تخيل النتيجة النهائية قبل البدء بالتنفيذ.',
      },
      {
        question: 'ما هي المواد المستخدمة في الديكورات؟',
        answer: 'نستخدم مواد عالية الجودة من أفضل المصانع العالمية تشمل ألواح PVC، ألواح SPC، ألواح جبس بورد، ورق جدران 3D، نماذج فوم، ومرايا عالية الجودة. جميع المواد معتمدة وذات مواصفات عالمية.',
      },
      {
        question: 'هل يمكنني اختيار التصميم واللون؟',
        answer: 'بالتأكيد! نوفر كتالوج واسع من التصاميم والألوان للاختيار منها، كما يمكننا تنفيذ تصاميم مخصصة حسب رغبتك. فريق التصميم لدينا يساعدك في اختيار الأنسب لمساحتك وذوقك.',
      },
      {
        question: 'ما هي مناطق خدمتكم؟',
        answer: 'نخدم جميع مناطق المملكة العربية السعودية. يوجد لدينا فريق عمل في الرياض وجدة والدمام والخبر والمدينة المنورة. لأي منطقة أخرى نتواصل معك لترتيب زيارة فريق العمل.',
      },
    ],
  },
};

// ─── Animation Variants ──────────────────────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// ─── Process Steps ───────────────────────────────────────────────────────────

const processSteps = [
  { step: 1, title: 'الاستشارة', description: 'استشارة مجانية لفهم متطلباتك وتقديم أفضل الحلول', icon: MessageCircle },
  { step: 2, title: 'المعاينة', description: 'زيارة الموقع وقياس المساحات بدقة وتحديد المتطلبات', icon: Ruler },
  { step: 3, title: 'التصميم', description: 'إعداد التصميم والعرض السعر النهائي مع الموافقة', icon: Lightbulb },
  { step: 4, title: 'التنفيذ', description: 'تنفيذ المشروع بمعايير احترافية عالية والتسليم في الوقت المحدد', icon: Hammer },
];

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ServiceLandingPage({
  service,
  settings,
  content: propsContent,
  onBack,
  onOpenQuote,
}: ServiceLandingPageProps) {
  const [scrolled, setScrolled] = useState(false);

  // Get service-specific content: from prop (DB) or fallback to hardcoded map
  const dbContent = propsContent;
  const fallbackContent = serviceContentMap[service.slug] || serviceContentMap['electric-awnings'];

  // Helper: resolve icon name string to component
  const resolveIcon = (iconName: string): React.ComponentType<{ className?: string }> => {
    return iconMap[iconName] || Sun;
  };

  // Merge DB content with fallback, using DB values when available
  const content = {
    heroTagline: dbContent?.heroTagline || fallbackContent.heroTagline,
    overview: dbContent?.overview?.length ? dbContent.overview : fallbackContent.overview,
    stats: dbContent?.stats?.length
      ? dbContent.stats.map((s) => ({ ...s, icon: resolveIcon(s.icon) }))
      : fallbackContent.stats,
    features: dbContent?.features?.length
      ? dbContent.features.map((f) => ({ ...f, icon: resolveIcon(f.icon) }))
      : fallbackContent.features,
    advantages: dbContent?.advantages?.length
      ? dbContent.advantages.map((a) => ({ ...a, icon: resolveIcon(a.icon) }))
      : fallbackContent.advantages,
    faqs: dbContent?.faqs?.length ? dbContent.faqs : fallbackContent.faqs,
  };

  const ServiceIcon = iconMap[service.icon] || Sun;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sticky nav scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`مرحباً، أريد الاستفسار عن خدمة ${service.title}`)}`;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* ─── 1. Navigation Bar ──────────────────────────────────────── */}
      <nav
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Company Name */}
            <button onClick={onBack} className="flex items-center gap-3 group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                scrolled ? 'bg-primary text-white' : 'bg-white/20 backdrop-blur-sm text-white'
              }`}>
                <ServiceIcon className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <h3 className={`font-bold text-sm transition-colors ${scrolled ? 'text-foreground' : 'text-white'}`}>
                  {settings.companyName}
                </h3>
                <p className={`text-xs transition-colors ${scrolled ? 'text-muted-foreground' : 'text-white/70'}`}>
                  {service.title}
                </p>
              </div>
            </button>

            {/* Nav Links */}
            <div className="flex items-center gap-3">
              {/* Phone */}
              <a
                href={`tel:${settings.phone}`}
                className={`hidden md:flex items-center gap-2 text-sm font-medium transition-colors ${
                  scrolled ? 'text-foreground' : 'text-white/90'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span dir="ltr">{settings.phone}</span>
              </a>

              {/* Home Link */}
              <button
                onClick={onBack}
                className={`hidden sm:flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                  scrolled ? 'text-foreground hover:bg-muted' : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <Home className="w-4 h-4" />
                الرئيسية
              </button>

              {/* CTA Button */}
              <Button
                onClick={onOpenQuote}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">طلب عرض سعر</span>
                <span className="sm:hidden">عرض سعر</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── 2. Hero Section ───────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        {service.image && (
          <div className="absolute inset-0">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/80" />
            <div className="absolute inset-0 bg-primary/10" />
          </div>
        )}
        {!service.image && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-sky-500/10" />
        )}

        {/* Decorative Blurs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="bg-white/15 backdrop-blur-sm border-white/20 text-white px-4 py-1.5 text-sm font-medium">
                {settings.companyName}
              </Badge>
            </motion.div>

            {/* Service Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="my-8"
            >
              <div className="inline-flex w-20 h-20 md:w-24 md:h-24 bg-white/15 backdrop-blur-md border border-white/20 rounded-3xl items-center justify-center">
                <ServiceIcon className="w-10 h-10 md:w-12 md:h-12 text-primary" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
            >
              {service.title}
            </motion.h1>

            {/* English Subtitle */}
            {service.titleEn && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg md:text-xl text-primary font-medium mb-6"
                dir="ltr"
              >
                {service.titleEn}
              </motion.p>
            )}

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              {content.heroTagline}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a
                href={`tel:${settings.phone}`}
                className="inline-flex items-center justify-center gap-2 bg-white text-primary hover:bg-white/90 font-semibold px-8 h-12 text-base rounded-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5"
              >
                <Phone className="w-4 h-4" />
                تواصل معنا
              </a>
              <Button
                onClick={onOpenQuote}
                size="lg"
                variant="outline"
                className="border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:text-white font-semibold px-8 h-12 text-base rounded-lg transition-all hover:-translate-y-0.5"
              >
                <Send className="w-4 h-4" />
                اطلب عرض سعر
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <button
            onClick={() => {
              document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center gap-2 text-white/60 hover:text-white/80 transition-colors"
          >
            <span className="text-xs">اكتشف المزيد</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
              <div className="w-1 h-2 bg-white/60 rounded-full" />
            </div>
          </button>
        </div>
      </section>

      {/* ─── 3. Service Overview Section ────────────────────────────── */}
      <section id="overview" className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Badge className="bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                عن الخدمة
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                <span className="text-primary">{service.title}</span>
                <br />
                بأعلى معايير الجودة
              </h2>
              <div className="space-y-4">
                {content.overview.map((paragraph, idx) => (
                  <p key={idx} className="text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button onClick={onOpenQuote} className="bg-primary hover:bg-primary/90 text-white">
                  <Send className="w-4 h-4" />
                  اطلب عرض سعر
                </Button>
                <a
                  href={`tel:${settings.phone}`}
                  className="inline-flex items-center gap-2 px-6 h-10 border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  تواصل معنا
                </a>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-2 gap-4"
            >
              {content.stats.map((stat) => {
                const StatIcon = stat.icon;
                return (
                  <motion.div key={stat.label} variants={staggerItem}>
                    <Card className="border-0 bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-shadow">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                          <StatIcon className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-3xl font-bold text-primary block">{stat.value}</span>
                        <span className="text-sm text-muted-foreground mt-1 block">{stat.label}</span>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── 4. Service Features/Types Section ─────────────────────── */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <Badge className="bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              أنواعنا وتصاميمنا
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              ما <span className="text-primary">نقدمه لك</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              تشكيلة واسعة من الخيارات والتصاميم المتنوعة التي تناسب جميع الأذواق والاحتياجات
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className={`grid gap-5 ${
              service.slug === 'interior-decoration'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {content.features.map((feature, idx) => {
              const FeatureIcon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  variants={staggerItem}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                >
                  <Card className="group h-full border hover:border-primary/20 hover:shadow-lg transition-all duration-300 overflow-hidden">
                    {/* Top accent bar */}
                    <div className="h-1 bg-gradient-to-l from-primary to-primary/60" />
                    <CardContent className="p-6 pt-5">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                        <FeatureIcon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── 5. Advantages Section ─────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <Badge className="bg-sky-50 text-sky-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              مميزاتنا
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              لماذا <span className="text-primary">تختارنا؟</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              نتميز بخبرة طويلة وجودة عالية وخدمة عملاء متميزة تجعلنا الخيار الأول
            </p>
          </motion.div>

          {/* Advantages Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {content.advantages.map((adv, idx) => {
              const AdvIcon = adv.icon;
              return (
                <motion.div key={idx} variants={staggerItem}>
                  <Card className="group h-full hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                          <AdvIcon className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                            {adv.title}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {adv.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── 6. Work Process Section ───────────────────────────────── */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <Badge className="bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              كيف نعمل
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              مراحل <span className="text-primary">العمل</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              نتبع منهجية عمل احترافية لضمان حصولك على أفضل النتائج
            </p>
          </motion.div>

          {/* Process Steps */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="relative max-w-4xl mx-auto"
          >
            {/* Connecting Line (desktop) */}
            <div className="hidden lg:block absolute top-16 right-[calc(12.5%+24px)] left-[calc(12.5%+24px)] h-0.5 bg-gradient-to-l from-primary/30 via-primary to-primary/30" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step) => {
                const StepIcon = step.icon;
                return (
                  <motion.div key={step.step} variants={staggerItem} className="relative">
                    <Card className="h-full text-center border hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                      <CardContent className="p-6 pt-8">
                        {/* Step Number */}
                        <div className="relative z-10 w-12 h-12 mx-auto mb-5 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-primary/30">
                          {step.step}
                        </div>
                        {/* Icon */}
                        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <StepIcon className="w-7 h-7 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Arrow for mobile/tablet */}
                    {step.step < 4 && (
                      <div className="hidden sm:flex lg:hidden absolute -left-4 top-1/2 -translate-y-1/2 z-10">
                        <ChevronLeft className="w-6 h-6 text-primary/40" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── 7. FAQ Section ────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <Badge className="bg-sky-50 text-sky-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              إجابات شاملة
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              الأسئلة <span className="text-primary">الشائعة</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              إجابات على أكثر الأسئلة شيوعاً حول خدمة {service.title}
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-3xl mx-auto"
          >
            <Accordion type="single" collapsible className="space-y-3">
              {content.faqs.map((faq, idx) => (
                <AccordionItem
                  key={idx}
                  value={`faq-${idx}`}
                  className="bg-card border rounded-xl px-6 data-[state=open]:shadow-md data-[state=open]:border-primary/20 transition-all"
                >
                  <AccordionTrigger className="text-base font-semibold text-foreground hover:no-underline hover:text-primary py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed text-sm pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* FAQ CTA */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mt-10"
          >
            <p className="text-muted-foreground mb-4">
              لديك سؤال آخر؟ تواصل معنا وسنجيبك فوراً
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`tel:${settings.phone}`}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-6 h-10 text-sm rounded-lg transition-colors"
              >
                <Phone className="w-4 h-4" />
                اتصل بنا
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 h-10 text-sm rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                واتساب
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── 8. CTA Section ────────────────────────────────────────── */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-orange-600" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />

        {/* Decorative Blurs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-2xl mx-auto"
          >
            {/* Icon */}
            <div className="inline-flex w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              جاهز لبدء مشروعك؟
            </h2>
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              تواصل معنا الآن للحصول على استشارة مجانية وعرض سعر خاص لمشروعك.
              فريقنا جاهز لخدمتك في جميع أنحاء المملكة.
            </p>

            {/* Contact Info */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span dir="ltr">{settings.phone}</span>
              </a>
              {settings.phone2 && (
                <a
                  href={`tel:${settings.phone2}`}
                  className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span dir="ltr">{settings.phone2}</span>
                </a>
              )}
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
              >
                <Zap className="w-5 h-5" />
                <span>{settings.email}</span>
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`tel:${settings.phone}`}
                className="inline-flex items-center justify-center gap-2 bg-white text-primary hover:bg-white/90 font-semibold px-8 h-12 text-base rounded-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5"
              >
                <Phone className="w-5 h-5" />
                تواصل معنا
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 h-12 text-base rounded-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5" />
                واتساب
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── 9. Footer (minimal) ───────────────────────────────────── */}
      <footer className="bg-foreground text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Company Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <ServiceIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">{settings.companyName}</h3>
                <p className="text-white/60 text-xs">{service.title}</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex items-center gap-6">
              <button
                onClick={onBack}
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                الرئيسية
              </button>
              <button
                onClick={onOpenQuote}
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                طلب عرض سعر
              </button>
              <a
                href={`tel:${settings.phone}`}
                className="text-white/70 hover:text-white text-sm transition-colors flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" />
                <span dir="ltr">{settings.phone}</span>
              </a>
            </div>

            {/* Copyright */}
            <p className="text-white/50 text-xs">
              © {new Date().getFullYear()} {settings.companyName}. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
