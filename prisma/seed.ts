import { db } from '../src/lib/db'

async function main() {
  console.log('🌱 Seeding database...')

  // ─── 1. Admin User ───────────────────────────────────────────────
  const admin = await db.admin.upsert({
    where: { email: 'admin@kayan.com' },
    update: {},
    create: {
      email: 'admin@kayan.com',
      password: 'admin123',
      name: 'مدير النظام',
      role: 'admin',
    },
  })
  console.log(`✅ Admin created: ${admin.email}`)

  // ─── 2. Services ─────────────────────────────────────────────────
  const servicesData = [
    {
      title: 'توريد وتركيب ساندوتش بانل',
      titleEn: 'Supply and Installation of Sandwich Panels',
      description:
        'نقدم خدمات توريد وتركيب ألواح الساندوتش بانل بأعلى معايير الجودة والموثوقية. تشمل خدماتنا أنواعًا متعددة من الألواح العازلة التي تلبي احتياجات المباني الصناعية والتجارية والسكنية. نعمل مع أفضل المصنّعين المحليين والعالميين لضمان حصولكم على منتجات ذات عزل حراري ممتاز ومقاومة عالية للعوامل الجوية، مع فريق فني متخصص يضمن التركيب بدقة واحترافية.',
      descriptionEn:
        'We provide supply and installation services for sandwich panels with the highest quality and reliability standards. Our services include various types of insulating panels that meet the needs of industrial, commercial, and residential buildings.',
      icon: 'Layers',
      order: 1,
      isActive: true,
    },
    {
      title: 'عزل حراري وحراري',
      titleEn: 'Thermal and Heat Insulation',
      description:
        'نوفر حلول عزل حراري متكاملة تساهم في تقليل استهلاك الطاقة وتحسين كفاءة المباني. يشمل ذلك عزل الأسقف والجدران والأرضيات باستخدام أحدث التقنيات والمواد العازلة المتوافقة مع المعايير السعودية والدولية. فريقنا المتخصص يقوم بدراسة كل مشروع بعناية لتحديد الحل الأمثل الذي يضمن راحة السكان ويقلل التكاليف التشغيلية على المدى الطويل.',
      descriptionEn:
        'We provide comprehensive thermal insulation solutions that help reduce energy consumption and improve building efficiency. This includes insulation for roofs, walls, and floors using the latest technologies.',
      icon: 'Thermometer',
      order: 2,
      isActive: true,
    },
    {
      title: 'بناء هناجر ومستودعات',
      titleEn: 'Hangars and Warehouses Construction',
      description:
        'نتخصص في تصميم وتنفيذ الهناجر والمستودعات الصناعية والتجارية بمختلف الأحجام والمواصفات. نقدم حلولًا هندسية متكاملة تبدأ من التصميم الأولي وصولًا إلى التسليم النهائي، مع مراعاة أعلى معايير السلامة والجودة. نستخدم أحدث تقنيات البناء والهياكل الفولاذية لضمان متانة المنشآت وقدرتها على تحمل الظروف المناخية الصعبة في المملكة العربية السعودية.',
      descriptionEn:
        'We specialize in the design and construction of industrial and commercial hangars and warehouses of all sizes and specifications. We provide integrated engineering solutions from initial design to final delivery.',
      icon: 'Warehouse',
      order: 3,
      isActive: true,
    },
    {
      title: 'مباني صناعية وتجارية',
      titleEn: 'Industrial and Commercial Buildings',
      description:
        'نقوم بإنشاء المباني الصناعية والتجارية وفقًا لأحدث المعايير الهندسية والإنشائية. تشمل خدماتنا بناء المصانع والورش ومراكز التوزيع والمجمعات التجارية، مع التركيز على توفير بيئة عمل مثالية تلبي متطلبات العملاء. نعمل بشراكة مع مكاتب هندسية متخصصة لضمان تنفيذ المشاريع في الوقت المحدد وبأعلى مستويات الجودة.',
      descriptionEn:
        'We construct industrial and commercial buildings in accordance with the latest engineering and structural standards. Our services include building factories, workshops, distribution centers, and commercial complexes.',
      icon: 'Building2',
      order: 4,
      isActive: true,
    },
    {
      title: 'أعمال الصاج والمعادن',
      titleEn: 'Sheet Metal and Metal Works',
      description:
        'نقدم خدمات متخصصة في أعمال الصاج والمعادن لجميع أنواع المشاريع الإنشائية. يشمل ذلك تصنيع وتركيب الألواح المعدنية والهياكل الحديدية والأبواب والنوافذ المعدنية وأعمال التسقيف. يمتلك فريقنا خبرة واسعة في التعامل مع مختلف أنواع المعادن وتقنيات التصنيع الحديثة، مع الالتزام بمواعيد التسليم وجودة التنفيذ التي تتجاوز توقعات العملاء.',
      descriptionEn:
        'We offer specialized services in sheet metal and metal works for all types of construction projects. This includes manufacturing and installing metal sheets, steel structures, metal doors and windows, and roofing works.',
      icon: 'Wrench',
      order: 5,
      isActive: true,
    },
    {
      title: 'تصميم ودراسات هندسية',
      titleEn: 'Design and Engineering Studies',
      description:
        'نقدم خدمات التصميم الهندسي والدراسات الفنية الشاملة لجميع أنواع المشاريع الإنشائية. يشمل ذلك إعداد المخططات التنفيذية والرسومات الهندسية الثلاثية الأبعاد، بالإضافة إلى الدراسات الإنشائية والكهربائية والميكانيكية. يعمل فريقنا من المهندسين المتخصصين على تحويل رؤية العملاء إلى واقع ملموس مع مراعاة الجوانب الاقتصادية والبيئية والسلامة في كل مرحلة من مراحل التصميم.',
      descriptionEn:
        'We provide engineering design services and comprehensive technical studies for all types of construction projects. This includes preparing execution plans and 3D engineering drawings, as well as structural, electrical, and mechanical studies.',
      icon: 'Ruler',
      order: 6,
      isActive: true,
    },
  ]

  for (const service of servicesData) {
    await db.service.upsert({
      where: { id: service.order.toString() },
      update: {},
      create: service,
    })
  }
  console.log(`✅ ${servicesData.length} services created`)

  // ─── 3. Projects ─────────────────────────────────────────────────
  const projectsData = [
    {
      title: 'مشروع هنجر صناعي بالرياض',
      titleEn: 'Industrial Hangar Project - Riyadh',
      description:
        'تنفيذ هنجر صناعي متكامل بمساحة إجمالية تبلغ 5,000 متر مربع في منطقة الرياض. يتضمن المشروع هيكلًا فولاذيًا مقاومًا للرياح والزلازل، مع نظام عزل حراري متقدم باستخدام ألواح الساندوتش بانل. تم تجهيز الهنجر بنظام تهوية وتكييف مركزي وأرضيات صناعية مقاومة للتحميل الثقيل، ليكون جاهزًا للاستخدام الصناعي المباشر.',
      descriptionEn:
        'Execution of a comprehensive industrial hangar with a total area of 5,000 square meters in Riyadh. The project includes a wind and earthquake resistant steel structure with advanced thermal insulation.',
      image: '/images/project1.png',
      location: 'الرياض، المملكة العربية السعودية',
      client: 'شركة الخليج للتطوير الصناعي',
      completedAt: new Date('2024-06-15'),
      isFeatured: true,
      isActive: true,
    },
    {
      title: 'مستودع تبريد بجدة',
      titleEn: 'Cold Storage Warehouse - Jeddah',
      description:
        'إنشاء مستودع تبريد حديث بجدة بسعة تخزينية تصل إلى 3,000 طن. تم تصميم المستودع وفقًا لأعلى معايير سلامة الأغذية، مع نظام عزل حراري فائق الأداء يحافظ على درجات حرارة تتراوح بين -25 و+5 درجات مئوية. يشمل المشروع غرف تبريد متعددة بدرجات حرارة مختلفة، بالإضافة إلى مناطق تحميل وتفريغ مخصصة ومكاتب إدارية.',
      descriptionEn:
        'Construction of a modern cold storage warehouse in Jeddah with a storage capacity of up to 3,000 tons. Designed according to the highest food safety standards with ultra-performance thermal insulation.',
      image: '/images/project2.png',
      location: 'جدة، المملكة العربية السعودية',
      client: 'مؤسسة البحر الأحمر للتجارة',
      completedAt: new Date('2024-09-20'),
      isFeatured: true,
      isActive: true,
    },
    {
      title: 'مصنع بمدينة الدمام الصناعية',
      titleEn: 'Factory in Dammam Industrial City',
      description:
        'بناء مصنع صناعي كامل في مدينة الدمام الصناعية الثانية على مساحة 8,000 متر مربع. يشمل المشروع مبنى الإنتاج الرئيسي ومبنى المخازن والورش ومرافق العمال والمكاتب الإدارية. تم استخدام أحدث تقنيات البناء الصناعي مع نظام ساندوتش بانل عازل يوفر كفاءة طاقة عالية ويقلل من تكاليف التشغيل. المشروع متوافق تمامًا مع متطلبات هيئة المدن الصناعية ومناطق التقنية.',
      descriptionEn:
        'Construction of a complete industrial factory in Dammam Second Industrial City on an area of 8,000 square meters. The project includes the main production building, warehouses, workshops, worker facilities, and administrative offices.',
      image: '/images/project3.png',
      location: 'الدمام، المملكة العربية السعودية',
      client: 'شركة الوطنية للصناعات المتقدمة',
      completedAt: new Date('2024-12-10'),
      isFeatured: false,
      isActive: true,
    },
    {
      title: 'مبنى إداري تجاري بالرياض',
      titleEn: 'Commercial Administrative Building - Riyadh',
      description:
        'تنفيذ مبنى إداري تجاري أنيق في قلب مدينة الرياض يضم أربعة طوابق بمساحة إجمالية 2,500 متر مربع. يتميز المبنى بواجهة عصرية باستخدام ألواح الألمنيوم المركبة والزجاج العاكس، مع نظام عزل حراري متقدم يضمن كفاءة استهلاك الطاقة. يتضمن المبنى مكاتب مفتوحة وقاعات اجتماعات ومرافق خدمية متكاملة، مصممة وفقًا لأحدث معايير بيئة العمل الذكية.',
      descriptionEn:
        'Execution of an elegant commercial administrative building in the heart of Riyadh comprising four floors with a total area of 2,500 square meters. The building features a modern facade using aluminum composite panels.',
      image: '/images/hero.png',
      location: 'الرياض، المملكة العربية السعودية',
      client: 'شركة الرياض للاستثمار والتطوير',
      completedAt: new Date('2025-02-28'),
      isFeatured: true,
      isActive: true,
    },
  ]

  for (const project of projectsData) {
    await db.project.upsert({
      where: { id: project.title },
      update: {},
      create: project,
    })
  }
  console.log(`✅ ${projectsData.length} projects created`)

  // ─── 4. Blog Posts ───────────────────────────────────────────────
  const blogPostsData = [
    {
      title: 'مزايا استخدام الساندوتش بانل في المباني الصناعية',
      slug: 'sandwich-panel-benefits',
      excerpt:
        'اكتشف المزايا العديدة لاستخدام ألواح الساندوتش بانل في المباني الصناعية، من العزل الحراري الممتاز إلى سرعة التركيب وتوفير التكاليف.',
      content: `## مقدمة

تُعد ألواح الساندوتش بانل من أهم الحلول الإنشائية الحديثة التي تُستخدم على نطاق واسع في قطاع البناء الصناعي بالمملكة العربية السعودية. وقد شهدت هذه التقنية إقبالًا متزايدًا في السنوات الأخيرة نظرًا للفوائد المتعددة التي تقدمها للمقاولين وأصحاب المشاريع على حد سواء.

## العزل الحراري الممتاز

تتميز ألواح الساندوتش بانل بقدرتها الفائقة على العزل الحراري، حيث تتكون من طبقتين من الصاج المعدني تفصل بينهما مادة عازلة مثل البولي يوريثان أو البوليسترين. هذا التصميم يوفر مقاومة حرارية عالية تساهم في:
- تقليل استهلاك الطاقة بنسبة تصل إلى 40%
- الحفاظ على درجات حرارة مستقرة داخل المبنى
- توفير بيئة عمل مريحة للموظفين والعمال

## سرعة التركيب والتنفيذ

من أبرز مزايا الساندوتش بانل سرعة التركيب، حيث يمكن إنجاز مشاريع كبيرة في وقت قياسي مقارنة بطرق البناء التقليدية. الألواح تُصنّع بحسب المقاسات المطلوبة في المصنع، مما يقلل من الهدر ويضمن دقة التنفيذ.

## خفة الوزن والمتانة

رغم خفة وزنها، تتمتع ألواح الساندوتش بانل بصلابة ومتانة عالية تتحمل الأحمال الميكانيكية والرياح والعوامل الجوية المختلفة، مما يجعلها خيارًا مثاليًا للمباني ذات الأ spannات الكبيرة.

## العزل الصوتي

إلى جانب العزل الحراري، توفر ألواح الساندوتش بانل مستوى جيدًا من العزل الصوتي، مما يساعد في تقليل التلوث الضوضائي داخل المباني الصناعية ويحسن بيئة العمل.

## مقاومة الحريق

تتوفر ألواح ساندوتش بانل بمواصفات مقاومة للحريق تلبي معايير السلامة السعودية والدولية، مما يوفر حماية إضافية للمباني والمحتوى الداخلي.

## خاتمة

في ضوء رؤية المملكة 2030 والتوسع الكبير في القطاع الصناعي، يُتوقع أن تشهد تقنية الساندوتش بانل نموًا مستمرًا. تقدم شركة كيان القمة حلولًا متكاملة لتوريد وتركيب ألواح الساندوتش بانل بأعلى معايير الجودة والسلامة.`,
      image: '/images/project1.png',
      author: 'كيان القمة',
      published: true,
    },
    {
      title: 'دليل شامل لأنواع العزل الحراري',
      slug: 'thermal-insulation-guide',
      excerpt:
        'دليل مفصل يشمل جميع أنواع العزل الحراري المستخدمة في المباني الصناعية والتجارية بالمملكة، مع مقارنة بينها وشرح مميزات كل نوع.',
      content: `## أهمية العزل الحراري

يُعد العزل الحراري عنصرًا حاسمًا في تصميم وتنفيذ المباني الصناعية والتجارية، خاصة في المناخ الحار للمملكة العربية السعودية. يساعد العزل الحراري المناسب في تقليل استهلاك الطاقة، وتحسين الراحة الحرارية، وحماية المعدات والمنتجات المخزنة.

## أنواع العزل الحراري

### 1. البولي يوريثان (Polyurethane)

يُعتبر من أفضل مواد العزل الحراري المتاحة، حيث يتميز بمعامل توصيل حراري منخفض يصل إلى 0.022 واط/متر كلفن. يُستخدم بكثرة في مستودعات التبريد والمباني الصناعية التي تتطلب عزلًا حراريًا عالي الأداء.

### 2. البوليسترين الممدد (EPS)

خيار اقتصادي يوفر عزلًا حراريًا جيدًا بمعامل توصيل يتراوح بين 0.032 و0.038 واط/متر كلفن. يُستخدم في عزل الأسقف والجدران والعزل تحت الأرضيات.

### 3. البوليسترين الممدد بالبخار (XPS)

أكثر كثافة ومتانة من EPS، مع مقاومة أعلى للرطوبة والضغط. مثالي للتطبيقات التي تتطلب مقاومة عالية للأحمال والعوامل البيئية القاسية.

### 4. الصوف الصخري (Rock Wool)

يتميز بمقاومة ممتازة للحريق، حيث يتحمل درجات حرارة تصل إلى 1,000 درجة مئوية. كما يوفر عزلًا صوتيًا ممتازًا ويُستخدم في تطبيقات السلامة المتقدمة.

### 5. الصوف الزجاجي (Fiberglass)

مادة عازلة شائعة الاستخدام بمعامل توصيل يتراوح بين 0.030 و0.040 واط/متر كلفن. سهلة التركيب واقتصادية، لكنها تحتاج إلى حماية من الرطوبة.

### 6. العزل الانعكاسي

يعتمد على عكس الإشعاع الحراري بدلًا من امتصاصه، ويتكون من طبقات رقيقة من الألمنيوم. فعّال بشكل خاص في المناخات الحارة.

## معايير اختيار العزل المناسب

عند اختيار نظام العزل الحراري المناسب لمشروعك، يجب مراعاة العوامل التالية:
- **نوع المبنى واستخدامه**: المصانع والمستودعات لها متطلبات مختلفة عن المباني التجارية
- **الميزانية**: التوازن بين التكلفة الأولية والتوفير طويل المدى
- **معايير السلامة**: متطلبات مقاومة الحريق حسب نوع النشاط
- **المناخ المحلي**: درجات الحرارة والرطوبة في منطقة المشروع
- **عمر المشروع**: المتانة المطلوبة للعزل على المدى البعيد

## الخلاصة

اختيار نظام العزل الحراري المناسب يتطلب دراسة معمقة لمتطلبات المشروع والاستشارة مع متخصصين. في كيان القمة، نقدم خدمات استشارية متخصصة لمساعدتكم في اختيار الحل الأمثل لعزل مشاريعكم.`,
      image: '/images/project2.png',
      author: 'كيان القمة',
      published: true,
    },
    {
      title: 'كيف تختار الشركة المناسبة لتركيب الساندوتش بانل',
      slug: 'choose-panel-company',
      excerpt:
        'نصائح وإرشادات مهمة لاختيار الشركة المتخصصة في توريد وتركيب الساندوتش بانل، لتضمن تنفيذ مشروعك بأعلى معايير الجودة.',
      content: `## مقدمة

يُعد اختيار الشركة المناسبة لتركيب الساندوتش بانل خطوة حاسمة تؤثر مباشرة على جودة المشروع النهائية وعمره الافتراضي. في هذا المقال، نقدم دليلًا شاملًا لمساعدتكم في اتخاذ القرار الصحيح.

## 1. الخبرة والسجل المهني

ابحث عن شركة تمتلك سجلًا حافلًا من المشاريع المنجزة بنجاح. تحقق من:
- عدد سنوات الخبرة في السوق
- حجم ونوع المشاريع السابقة
- شهادات العملاء والتوصيات
- المشاريع المشابهة لمشروعك

## 2. التراخيص والشهادات

تأكد من أن الشركة تمتلك جميع التراخيص المطلوبة للعمل في المملكة العربية السعودية، بما في ذلك:
- سجل تجاري ساري المفعول
- ترخيص من البلدية المختصة
- شهادات الجودة ISO
- شهادات العمالة المعتمدة

## 3. جودة المواد المستخدمة

الشركة الموثوقة تستخدم مواد عالية الجودة من مصادر معروفة. استفسر عن:
- موردي الألواح والمواد العازلة
- شهادات الجودة للمواد المستخدمة
- ضمان الألواح ضد العيوب المصنعية

## 4. فريق العمل الفني

جودة التركيب تعتمد بشكل أساسي على مهارة الفريق المنفذ. تأكد من:
- وجود مهندسين متخصصين في الإشراف
- تدريب الفنيين وشهاداتهم
- الالتزام بمعايير السلامة أثناء العمل

## 5. الأسعار والشفافية

احصل على عروض أسعار مفصلة من عدة شركات وقارن بينها. انتبه إلى:
- تفصيل واضح لجميع البنود والتكاليف
- عدم وجود رسوم خفية
- شروط الدفع والجدول الزمني
- شروط الضمان وما بعد البيع

## 6. الضمان وخدمة ما بعد البيع

الشركة المحترفة تقدم ضمانًا شاملًا على أعمالها. تأكد من:
- مدة الضمان ونطاق التغطية
- سرعة الاستجابة لطلبات الصيانة
- وجود فريق دعم فني متخصص

## 7. القدرة على الالتزام بالمواعيد

استفسر عن الجدول الزمني المقترح للمشروع وتأكد من قدرة الشركة على الالتزام به. المشاريع المتأخرة تؤدي إلى زيادة التكاليف وتأخير بدء التشغيل.

## لماذا كيان القمة؟

في شركة كيان القمة، نفتخر بخبرة تمتد لأكثر من عشر سنوات في مجال توريد وتركيب الساندوتش بانل. نتميز بفريق فني متخصص، واستخدام أفضل المواد، والالتزام بأعلى معايير الجودة والسلامة. نقدم ضمانًا شاملًا على جميع أعمالنا مع خدمة ما بعد البيع متميزة.

تواصلوا معنا اليوم للحصول على استشارة مجانية وعرض سعر مفصل لمشروعكم.`,
      image: '/images/project3.png',
      author: 'كيان القمة',
      published: true,
    },
  ]

  for (const post of blogPostsData) {
    await db.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    })
  }
  console.log(`✅ ${blogPostsData.length} blog posts created`)

  console.log('🎉 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
