#!/bin/bash
# قائمة فحص ما قبل النشر على Vercel

echo "🔍 فحص استعداد المشروع للنشر على Vercel..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# تتبع النتائج
failed=0

# 1. التحقق من وجود ملفات التكوين
echo "📁 التحقق من ملفات التكوين..."
files=("vercel.json" ".npmrc" ".node-version" "package.json" "vite.config.ts" "server.ts")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file موجود"
    else
        echo -e "${RED}✗${NC} $file غير موجود"
        failed=$((failed + 1))
    fi
done
echo ""

# 2. التحقق من .gitignore
echo "🔐 التحقق من .gitignore..."
if grep -q ".env" .gitignore && grep -q "!.env.example" .gitignore; then
    echo -e "${GREEN}✓${NC} .env في .gitignore و .env.example مستثنى"
else
    echo -e "${RED}✗${NC} تأكد من أن .env في .gitignore و .env.example مستثنى"
    failed=$((failed + 1))
fi
echo ""

# 3. التحقق من .env.example
echo "📝 التحقق من .env.example..."
if grep -q "GEMINI_API_KEY" .env.example; then
    echo -e "${GREEN}✓${NC} GEMINI_API_KEY في .env.example"
else
    echo -e "${RED}✗${NC} أضف GEMINI_API_KEY إلى .env.example"
    failed=$((failed + 1))
fi
echo ""

# 4. التحقق من package.json scripts
echo "🏗️ التحقق من build scripts..."
if grep -q '"build"' package.json; then
    echo -e "${GREEN}✓${NC} build script موجود"
else
    echo -e "${RED}✗${NC} build script غير موجود في package.json"
    failed=$((failed + 1))
fi
echo ""

# 5. التحقق من أن .env لا يكون في git
echo "📦 التحقق من أن .env لم يُضاف إلى git..."
if git ls-files --error-unmatch .env 2>/dev/null; then
    echo -e "${RED}✗${NC} تحذير: .env مُتتبع في git! استخدم: git rm --cached .env"
    failed=$((failed + 1))
else
    echo -e "${GREEN}✓${NC} .env غير مُتتبع في git"
fi
echo ""

# 6. التحقق من أن المشروع بُني بنجاح
echo "🔨 اختبار البناء..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} البناء نجح"
else
    echo -e "${RED}✗${NC} البناء فشل - تحقق من الأخطاء أعلاه"
    failed=$((failed + 1))
fi
echo ""

# 7. التحقق من وجود dist
echo "📂 التحقق من مجلد dist..."
if [ -d "dist" ]; then
    echo -e "${GREEN}✓${NC} مجلد dist موجود وجاهز"
else
    echo -e "${RED}✗${NC} مجلد dist غير موجود"
    failed=$((failed + 1))
fi
echo ""

# النتائج النهائية
echo "═══════════════════════════════════════════════"
if [ $failed -eq 0 ]; then
    echo -e "${GREEN}✓ جميع الفحوصات نجحت! المشروع جاهز للنشر${NC}"
    echo ""
    echo "الخطوات التالية:"
    echo "1. تأكد من دفع الكود إلى GitHub:"
    echo "   git push -u origin main"
    echo ""
    echo "2. اذهب إلى https://vercel.com"
    echo "3. استورد المشروع من GitHub"
    echo "4. أضف GEMINI_API_KEY في Environment Variables"
    echo "5. اضغط Deploy"
    exit 0
else
    echo -e "${RED}✗ هناك $failed فحص فاشل. تحقق من الأخطاء أعلاه${NC}"
    exit 1
fi
