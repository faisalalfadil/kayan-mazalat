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
      id: '1',
      slug: 'electric-awnings',
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
      id: '2',
      slug: 'mullay-sheboud',
      title: 'بديل الشيبود مُلاي',
      titleEn: 'Mullay Chipboard Alternative',
      description:
        'بديل الشيبود مُلاي هو الحل الأمثل لتغطية الجدران والأسقف بتصاميم عصرية أنيقة. يتميز بمتانة عالية، مقاومة للرطوبة والعوامل الجوية، سهولة التركيب والصيانة، ويأتي بتشكيلة واسعة من الألوان والتصاميم التي تناسب جميع الأذواق والمشاريع.',
      descriptionEn:
        'Mullay chipboard alternative is the optimal solution for covering walls and ceilings with modern elegant designs. It features high durability, moisture resistance, easy installation, and comes in a wide variety of colors and designs.',
      icon: 'Layers',
      order: 2,
      isActive: true,
    },
    {
      id: '3',
      slug: 'interior-decoration',
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
      where: { id: service.id },
      update: {},
      create: service,
    })
  }
  console.log(`✅ ${servicesData.length} services created`)

  // ─── 4. Projects ─────────────────────────────────────────────────
  const projectsData = [
    {
      id: 'project-1',
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
      id: 'project-2',
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
      id: 'project-3',
      title: 'مشروع بديل شيبود مُلاي - حي العليا',
      titleEn: 'Mullay Chipboard Project - Al-Olaya District',
      description:
        'تنفيذ مشروع بديل الشيبود مُلاي لمجمع تجاري في حي العليا بالرياض. شمل المشروع تغطية جدران وأسقف بألواح مُلاي بتصاميم عصرية مع إضاءة LED مخفية، نتج عنه مظهر فاخر ومتانة عالية.',
      descriptionEn:
        'Complete Mullay chipboard alternative project for a commercial complex in Al-Olaya district, Riyadh. The project included covering walls and ceilings with Mullay boards in modern designs with hidden LED lighting, resulting in a luxurious appearance and high durability.',
      image: '/images/project3.png',
      location: 'الرياض، حي العليا',
      completedAt: new Date('2024-12-10'),
      isFeatured: true,
      isActive: true,
    },
  ]

  for (const project of projectsData) {
    await db.project.upsert({
      where: { id: project.id },
      update: {},
      create: project,
    })
  }
  console.log(`✅ ${projectsData.length} projects created`)

  // ─── 5. Blog Posts ───────────────────────────────────────────────
  const blogPostsData = [
    {
      id: 'blog-1',
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
      id: 'blog-2',
      title: 'كل ما تحتاج معرفته عن بديل الشيبود مُلاي: الحل العصري لدهانات الجدران',
      slug: 'mullay-sheboud-guide',
      excerpt:
        'بديل الشيبود مُلاي هو حل حديث وعصري لتغطية الجدران والأسقف، يتميز بمتانته العالية ومقاومته للرطوبة وسهولة تركيبه.',
      content: `## ما هو بديل الشيبود مُلاي؟

بديل الشيبود مُلاي هو حل حديث وعصري لتغطية الجدران والأسقف كبديل ممتاز للدهانات التقليدية وألواح الشيبود العادية. يتميز بتصاميمه العصرية ومتانته العالية ومقاومته للرطوبة والعوامل الجوية، مما يجعله الخيار الأمثل للمشاريع السكنية والتجارية.

## مميزات بديل الشيبود مُلاي

- **متانة عالية**: يتحمل الاستخدام اليومي لسنوات طويلة دون تلف
- **مقاومة للرطوبة**: مثالي للمناطق ذات الرطوبة العالية
- **سهولة التركيب**: يتم تركيبه بسرعة وسهولة دون فوضى
- **تنظيف سهل**: سطح أملس يسهل تنظيفه من أي أوساخ
- **تشكيلة واسعة**: يتوفر بألوان وتصاميم متعددة تناسب جميع الأذواق
- **عزل حراري وصوتي**: يساهم في تحسين عزل المبنى

## أين يمكن استخدام بديل الشيبود مُلاي؟

- المجالس وغرف الجلوس
- غرف النوم
- المطابخ والحمامات
- المكاتب والمجمعات التجارية
- المطاعم والكافيهات
- المدارس والمستشفيات

## كيف تختار التصميم المناسب؟

عند اختيار بديل الشيبود مُلاي لمشروعك، يجب مراعاة لون الجدران والأرضيات المحيطة، أسلوب الديكور العام، والإضاءة المتاحة. في كيان القمة، نقدم استشارة مجانية لمساعدتك في اختيار التصميم المناسب.`,
      image: '/images/project3.png',
      author: 'مؤسسة كيان القمة',
      published: true,
    },
    {
      id: 'blog-3',
      title: 'دليل شامل للديكورات الداخلية: أحدث الأفكار والتوجهات لعام 2025',
      slug: 'interior-decoration-guide-2025',
      excerpt:
        'الديكورات الداخلية عنصر أساسي في إبراز جمال المنازل والفلل. مع التطور في مواد البناء وتقنيات الإضاءة، أصبحت المساحات الداخلية أكثر وظيفة وجمالاً.',
      content: `## أهمية الديكورات الداخلية

الديكورات الداخلية عنصر أساسي في إبراز جمال المنازل والفلل. مع التطور في مواد البناء وتقنيات الإضاءة، أصبحت المساحات الداخلية أكثر وظيفة وجمالاً. تساهم الديكورات الداخلية في رفع قيمة العقار وتحسين جودة الحياة.

## أبرز حلول الديكورات الداخلية

### بديل الخشب
ألواح بديل الخشب بألوان وأشكال متعددة تناسب جميع الأذواق، مثالية للجدران والأرضيات.

### بديل الرخام
ديكورات بديل الرخام للجدران والأرضيات بمنظر فاخر ومقاومة عالية للماء والاستهلاك.

### جبس بورد
ديكورات جبس بورد للأسقف والجدران مع إضاءة LED مخفية للمسة فخامة.

### باركيه SPC
أرضيات باركيه عصرية مقاومة للماء بألوان خشبية طبيعية متعددة.

### ورق جدران 3D
تشكيلة واسعة من ورق الجدران بتصاميم حديثة مع إمكانية الطباعة حسب الطلب.

## أحدث توجهات 2025

- **البساطة والأنيقة**: النزعة نحو التصاميم البسيطة والعصرية
- **الألوان الترابية**: استخدام درجات الألوان الطبيعية والترابية
- **الإضاءة المخفية**: تركيز على إضاءة LED المخفية في الأسقف والجدران
- **المواد المبتكرة**: استخدام مواد حديثة مثل بديل الشيبود مُلاي

في مؤسسة كيان القمة، نقدم حلول ديكورات داخلية متكاملة بتصاميم عصرية وجودة عالية. تواصلوا معنا اليوم!`,
      image: '/images/project1.png',
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
