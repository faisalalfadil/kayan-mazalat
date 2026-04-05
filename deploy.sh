#!/bin/bash
# ==========================================
# سكريبت نشر موقع كيان القمة على Vercel
# ==========================================

set -e

echo "🚀 مرحباً بك في سكريبت نشر موقع كيان القمة"
echo "============================================="
echo ""

# 1. Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 تثبيت Vercel CLI..."
    npm install -g vercel
fi

# 2. Copy PostgreSQL schema
echo "📋 تجهيز قاعدة البيانات PostgreSQL..."
cp prisma/schema.postgresql.prisma prisma/schema.prisma

# 3. Generate Prisma Client
echo "🔧 إنشاء Prisma Client..."
npx prisma generate

# 4. Build the project
echo "🏗️ بناء المشروع..."
npm run build

# 5. Deploy to Vercel
echo "🚀 نشر المشروع على Vercel..."
vercel

echo ""
echo "✅ تم النشر بنجاح!"
echo "⚠️  لا تنسَ إعداد المتغيرات البيئية في Vercel Dashboard"
