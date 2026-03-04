# دليل نشر على Vercel

## المتطلبات
- حساب GitHub (للربط مع Vercel)
- حساب Vercel مجاني أو مدفوع
- API Key من Google Gemini

## خطوات النشر

### 1. إعداد المتغيرات البيئية
إذا لم تكن قد نسخت الملف بعد:
```bash
cp .env.example .env
```

تأكد من أن `.env` يحتوي على:
```
GEMINI_API_KEY=your_actual_api_key
```

### 2. دفع الكود إلى GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push -u origin main
```

### 3. نشر على Vercel

#### الطريقة الأولى: عبر Dashboard (الأسهل)
1. اذهب إلى [vercel.com](https://vercel.com)
2. اضغط على "New Project"
3. اختر repository من GitHub
4. في خطوة Environment Variables:
   - أضف `GEMINI_API_KEY` مع قيمتك الفعلية
5. اضغط "Deploy"

#### الطريقة الثانية: عبر CLI
```bash
npm install -g vercel
vercel
```
ثم اتبع التعليمات التفاعلية واضف المتغيرات البيئية عند السؤال.

### 4. ملاحظات مهمة

⚠️ **قاعدة البيانات:**
- التطبيق الحالي يستخدم SQLite محلياً (ai_tools.db)
- Vercel يحذف الملفات المحلية بعد كل نشر
- للإنتاج، ستحتاج إلى:
  - قاعدة بيانات سحابية (Firebase, Supabase, MongoDB, أو PostgreSQL)
  - أو تخزين البيانات في الذاكرة (مؤقت فقط)

### 5. التكوين الحالي
- `vercel.json` - معالج المسارات والعمليات
- `vite.config.ts` - إعدادات Vite للبناء
- `server.ts` - خادم Node.js (يعمل كـ serverless function على Vercel)

### 6. المشاكل الشائعة

**المشكلة: قاعدة البيانات فارغة بعد النشر**
- السبب: Vercel لا يحفظ الملفات المحلية
- الحل: استخدم قاعدة بيانات سحابية

**المشكلة: GEMINI_API_KEY غير موجود**
- السبب: لم تضف المتغير في Vercel Dashboard
- الحل: أضفه في Project Settings > Environment Variables

**المشكلة: better-sqlite3 لا يعمل**
- السبب: مشاكل في البناء على Vercel
- الحل: استخدم قاعدة بيانات بديلة

## دعم قاعدة البيانات السحابية (اختياري)

إذا أردت دعم قاعدة بيانات دائمة على الإنتاج:

### خيار 1: Google Firebase (موصى به - مجاني)
```bash
npm install firebase-admin
```

### خيار 2: PostgreSQL مع Supabase (مجاني 500MB)
```bash
npm install pg
```

### خيار 3: MongoDB (مجاني 512MB)
```bash
npm install mongoose
```

اطلب مساعدة إذا أردت تنفيذ أي من هذه الخيارات.
