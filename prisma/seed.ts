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

  // ─── 2. Site Settings ───────────────────────────────────────────
  await db.siteSettings.upsert({
    where: { id: 'default-settings' },
    update: {},
    create: {
      id: 'default-settings',
      companyName: 'مؤسسة كيان القمة للمظلات والديكورات',
      companyEnName: 'Kayn Al-Quma for Awnings and Decorations',
      phone: '0537639422',
      phone2: '0566366447',
      whatsapp: '966537639422',
      email: 'office@kayan-qemma.com',
      address: 'الرياض، المملكة العربية السعودية',
      workingHours: 'الأحد - الخميس: 8:00 ص - 6:00 م',
    },
  })
  console.log('✅ Site settings created')

  // ─── 3. Services ─────────────────────────────────────────────────
  const servicesData = [
    {
      title: 'المظلات الكهربائية المتحركة',
      titleEn: 'Electric Motorized Awnings',
      description:
        'استمتع بأقصى درجات الراحة والتحكم مع مجموعتنا المتميزة من المظلات الكهربائية المتحركة. تصميم عصري، تشغيل سلس، وحماية مثالية من العوامل الجوية، بلمسة زر. نقدم تصاميم عصرية، متانة عالية، تحكم سهل، وحماية من الشمس والأمطار.',
      descriptionEn:
        'Enjoy maximum comfort and control with our premium collection of electric motorized awnings. Modern design, smooth operation, and perfect protection from weather elements at the touch of a button.',
      icon: 'Sun',
      order: 1,
      isActive: true,
    },
    {
      title: 'تركيب ساندوتش بانل',
      titleEn: 'Sandwich Panel Installation',
      description:
        'نوفر حلول متكاملة لتركيب ألواح الساندوتش بانل في الرياض للمستودعات، الهناجر، الملاحق، وغرف التبريد، بأعلى معايير العزل الحراري والصوتي وسرعة في التنفيذ. نوفر معاينة مجانية للموقع، ضمان على التركيب والعزل، وتنفيذ بأيدي فنيين مختصين.',
      descriptionEn:
        'We provide comprehensive sandwich panel installation solutions in Riyadh for warehouses, hangars, extensions, and cold rooms with the highest thermal and acoustic insulation standards and fast execution.',
      icon: 'Layers',
      order: 2,
      isActive: true,
    },
    {
      title: 'الديكورات الداخلية المتكاملة',
      titleEn: 'Integrated Interior Decorations',
      description:
        'تخصصنا في خلق مساحات داخلية فريدة تعبر عن الذوق الرفيع والعملية. نقدم مجموعة واسعة من الحلول المبتكرة التي تلائم كافة الأنماط: بديل رخام، ورق جدران، بديل خشب، بديل شيبورد، باركيه SPC، ارفف خشب.',
      descriptionEn:
        'We specialize in creating unique interior spaces that express refined taste and practicality. We offer a wide range of innovative solutions for all styles: marble alternative, wallpaper, wood alternative, chipboard alternative, SPC parquet, and wooden shelves.',
      icon: 'Paintbrush',
      order: 3,
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

  // ─── 4. Projects ─────────────────────────────────────────────────
  const projectsData = [
    {
      title: 'مشروع ديكور فيلا - حي النرجس',
      titleEn: 'Villa Decoration Project - Al-Narges District',
      description:
        'تنفيذ ديكورات داخلية متكاملة لفيلا فاخرة في حي النرجس بالرياض. شمل المشروع تركيب بديل الرخام والأرضيات SPC وورق الجدران والأرفف الخشبية، مع تصميم عصري يجمع بين الفخامة والعملية.',
      descriptionEn:
        'Complete interior decoration for a luxury villa in Al-Narges district, Riyadh. The project included installation of marble alternatives, SPC flooring, wallpaper, and wooden shelves with a modern design combining luxury and practicality.',
      image: '/images/project1.png',
      location: 'الرياض، حي النرجس',
      completedAt: new Date('2024-06-15'),
      isFeatured: true,
      isActive: true,
    },
    {
      title: 'مشروع مظلة سيارة - طريق الملك فهد',
      titleEn: 'Car Awning Project - King Fahd Road',
      description:
        'تركيب مظلة كهربائية متحركة لسيارات فيلا على طريق الملك فهد. مظلة بتصميم عصري مع تحكم كهربائي عن بعد، تحمل رياح وتوفر حماية كاملة من الشمس والأمطار.',
      descriptionEn:
        'Installation of an electric motorized awning for a villa car park on King Fahd Road. Modern design awning with remote electric control, wind-resistant, providing full protection from sun and rain.',
      image: '/images/project2.png',
      location: 'الرياض، طريق الملك فهد',
      completedAt: new Date('2024-09-20'),
      isFeatured: true,
      isActive: true,
    },
    {
      title: 'مشروع تركيب ساندوتش بانل - حي الخليج',
      titleEn: 'Sandwich Panel Installation Project - Al-Khaleej District',
      description:
        'تنفيذ مشروع ساندوتش بانل كامل لإنشاء ملحق سكني في حي الخليج بالرياض. شمل المشروع تركيب أسقف وجدران ساندوتش بانل بعزل حراري عالي مع هيكل حديدي متين.',
      descriptionEn:
        'Complete sandwich panel project for a residential extension in Al-Khaleej district, Riyadh. The project included installation of sandwich panel roofs and walls with high thermal insulation and a sturdy iron structure.',
      image: '/images/project3.png',
      location: 'الرياض، حي الخليج',
      completedAt: new Date('2024-12-10'),
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

  // ─── 5. Blog Posts ───────────────────────────────────────────────
  const blogPostsData = [
    {
      title: 'الدليل الشامل للمظلات الكهربائية: عندما تلتقي التكنولوجيا بالراحة',
      slug: 'electric-awnings-guide',
      excerpt:
        'المظلات الكهربائية هي أنظمة تظليل قابلة للطي والفتح آلياً باستخدام محرك كهربائي. أصبحت جزءاً من أنظمة المنازل الذكية.',
      content: `## ما هي المظلات الكهربائية؟

المظلات الكهربائية هي أنظمة تظليل قابلة للطي والفتح آلياً باستخدام محرك كهربائي. أصبحت جزءاً من أنظمة المنازل الذكية وواحدة من أهم الإضافات الحديثة للمنازل والفلل والمباني التجارية في المملكة العربية السعودية.

## مميزات المظلات الكهربائية

- **التحكم عن بعد**: يمكنك فتح وإغلاق المظلة بضغطة زر واحدة من أي مكان
- **الحماية من الشمس والأمطار**: توفر حماية شاملة من العوامل الجوية المختلفة
- **التصاميم العصرية**: تتوفر بتصاميم متنوعة تناسب جميع الأذواق والمعمار
- **سهولة الاستخدام**: لا تتطلب أي مجهود يدوي، تشغيل سلس وهادئ
- **المتانة العالية**: مصنوعة من مواد مقاومة للرياح والأشعة فوق البنفسجية

## أنواع المظلات الكهربائية

تتوفر عدة أنواع من المظلات الكهربائية في السوق السعودي، منها:
- المظلات الكهربائية ذات الذراع المفصلي
- المظلات الكهربائية المنزلقة
- مظلات الشرفات والمدرجات
- مظلات مواقف السيارات

## نصائح لاختيار المظلة المناسبة

عند اختيار مظلة كهربائية لمشروعك، يجب مراعاة حجم المساحة، اتجاه الشمس، مستوى تعرض المنطقة للرياح، والتصميم المعماري للمبنى.

في مؤسسة كيان القمة، نقدم أفضل أنواع المظلات الكهربائية بضمان شامل وتركيب احترافي. تواصلوا معنا لمعاينة مجانية واستشارة متخصصة.`,
      image: '/images/project2.png',
      author: 'مؤسسة كيان القمة',
      published: true,
    },
    {
      title: 'دليل شامل لواجهات الكلادينج: أحدث التوجهات والتقنيات لعام 2025',
      slug: 'cladding-guide-2025',
      excerpt:
        'أصبحت واجهات الكلادينج خياراً مفضلاً للمنازل والمنشآت التجارية لما توفره من جمال بصري وحماية عالية ومتانة طويلة الأمد.',
      content: `## ما هو الكلادينج؟

الكلادينج أو Cladding هو نظام تغطية خارجية للمباني يتكون من ألواح معدنية أو مركبة تُثبت على الواجهات الخارجية. أصبحت واجهات الكلادينج خياراً مفضلاً للمنازل والمنشآت التجارية لما توفره من جمال بصري وحماية عالية ومتانة طويلة الأمد.

## مميزات واجهات الكلادينج

- **جمال بصري متميز**: تضفي طابعاً عصرياً وأنيقاً على المبنى
- **حماية عالية**: تحمي الواجهة من العوامل الجوية والرطوبة والحرارة
- **متانة طويلة الأمد**: عمر افتراضي يصل إلى 25-30 سنة
- **تصاميم متنوعة**: تتوفر بألوان وأنماط مختلفة تناسب جميع الأذواق
- **مرونة عالية**: يمكن استخدامها على جميع أنواع المباني

## أنواع الكلادينج الأكثر شيوعاً

- ألواح الألمنيوم المركبة (ACM)
- كلادينج الفيبر سمنت
- كلادينج الحجر الطبيعي
- كلادينج الخشب المعالج
- كلادينج البوليمر

## توجهات الكلادينج لعام 2025

شهدت صناعة الكلادينج تطورات كبيرة في عام 2025، حيث اتجهت التصاميم نحو استخدام الألوان الترابية والخطوط الهندسية البسيطة، مع التركيز على المواد الصديقة للبيئة والعزل الحراري المتقدم.

تواصلوا مع مؤسسة كيان القمة للحصول على استشارة مجانية حول أفضل حلول الكلادينج لمشروعكم.`,
      image: '/images/project1.png',
      author: 'مؤسسة كيان القمة',
      published: true,
    },
    {
      title: 'دليل شامل للديكورات الخارجية: أحدث الأفكار والتوجهات لعام 2025',
      slug: 'exterior-decoration-guide-2025',
      excerpt:
        'الديكورات الخارجية عنصر أساسي في إبراز جمال المنازل والفلل والحدائق. مع التطور في مواد البناء وتقنيات الإضاءة، أصبحت مساحات الهواء الطلق أكثر وظيفة وراحة.',
      content: `## أهمية الديكورات الخارجية

الديكورات الخارجية عنصر أساسي في إبراز جمال المنازل والفلل والحدائق. مع التطور في مواد البناء وتقنيات الإضاءة، أصبحت مساحات الهواء الطلق أكثر وظيفة وراحة. تساهم الديكورات الخارجية في رفع قيمة العقار وتحسين جودة الحياة.

## عناصر الديكورات الخارجية

### الإضاءة الخارجية
تعتبر الإضاءة من أهم عناصر الديكور الخارجي، حيث تضيف جمالاً وأماناً للمساحات الخارجية في الليل. تتوفر أنواع متعددة من إضاءة الحدائق والواجهات والمسارات.

### المساحات الخضراء
توفر النباتات والأشجار جمالاً طبيعياً وظلاً منعشاً. يمكن تصميم حدائق صغيرة أو كبيرة حسب المساحة المتاحة.

### الأرضيات الخارجية
تتعدد خيارات الأرضيات الخارجية بين الحجر الطبيعي والبورسلين والخشب المعالج، لتناسب مختلف الأذواق والميزانيات.

### أثاث الحدائق
يتوفر أثاث خارجي بمواد مقاومة للعوامل الجوية، بتصاميم عصرية تناسب جميع المساحات.

## أحدث توجهات 2025

- **الاستدامة**: استخدام مواد صديقة للبيئة ومستدامة
- **التكنولوجيا الذكية**: إضاءة ذكية وأنظمة ري آلية
- **التصاميم البسيطة**: النزعة نحو البساطة والأناقة
- **المساحات متعددة الاستخدامات**: دمج مساحات الجلوس مع المطبخ الخارجي والمسبح

## نصائح لتصميم ديكور خارجي ناجح

- حدد ميزانيتك قبل البدء
- اختر مواد مناسبة للمناخ السعودي
- اعتمد على متخصصين في التصميم والتنفيذ
- وازن بين الجمال والعملية

في مؤسسة كيان القمة، نقدم حلول ديكورات خارجية متكاملة بتصاميم عصرية وجودة عالية. تواصلوا معنا اليوم!`,
      image: '/images/project3.png',
      author: 'مؤسسة كيان القمة',
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
