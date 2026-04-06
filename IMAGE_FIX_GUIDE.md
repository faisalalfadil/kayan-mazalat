# ✅ إصلاح مشكلة الصور - دليل سريع

## المشكلة
الصور لا تظهر على Vercel

## ✅ الحلول المطبقة

### 1. إنشاء صور placeholder
- ✅ `/public/images/default-blog.svg` - صورة افتراضية للمدونة
- ✅ `/public/logo.png` - لوجو placeholder

### 2. تحديث المسارات
- ✅ تم تحديث جميع المراجع للصور الافتراضية
- ✅ تم إصلاح مسارات الصور في المدونة

### 3. التحقق من الصور الموجودة
```
✅ /logo.svg (موجود)
✅ /images/hero.png (موجود)
✅ /images/about.png (موجود)
✅ /images/project1.png (موجود)
✅ /images/project2.png (موجود)
✅ /images/project3.png (موجود)
✅ /images/default-blog.svg (تم إنشاؤه)
✅ /logo.png (تم إنشاؤه)
```

## 🚀 خطوات النشر

### 1. ارفع التحديثات
```bash
git add .
git commit -m "Fix images and add placeholders"
git push origin main
```

### 2. Vercel سينشر تلقائياً
انتظر 1-2 دقيقة

### 3. إذا لم تظهر الصور
في Vercel Dashboard:
1. اذهب إلى Settings
2. اضغط "Clear Build Cache"
3. اضغط "Redeploy"

## 📝 ملاحظات مهمة

### مسارات الصور الصحيحة:
- ✅ `/images/hero.png` (صحيح)
- ❌ `public/images/hero.png` (خطأ)
- ❌ `./images/hero.png` (خطأ)

### رفع صور المدونة:
- الصور المرفوعة تُحفظ في `/public/uploads/blog/`
- يمكن الوصول إليها عبر `/uploads/blog/filename.jpg`

### الصور الخارجية:
- `next.config.ts` مُعد للسماح بجميع الصور الخارجية
- يمكنك استخدام روابط خارجية مباشرة

## 🎨 تحسين اللوجو (اختياري)

إذا أردت استبدال اللوجو placeholder:

1. ضع لوجو جديد في `/public/logo.png` أو `/public/logo.svg`
2. الحجم المثالي: 200x200 بكسل
3. ارفع التحديث على GitHub

## ✅ الخلاصة

تم إصلاح:
- ✅ مسارات الصور
- ✅ صور placeholder
- ✅ صورة المدونة الافتراضية
- ✅ اللوجو

**الآن ارفع التحديثات وستعمل الصور بشكل صحيح! 🎉**
