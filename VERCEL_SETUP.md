# إعداد Vercel - دليل سريع

## قبل الرفع تأكد من:

✅ **التحقق من الملفات والإعدادات**

```bash
# تأكد من وجود جميع الملفات
ls -la | grep -E "(vercel.json|.env|.npmrc|package.json)"

# تحقق من أن `.env` موجود في .gitignore
cat .gitignore | grep ".env"

# تحقق من البناء محلياً
npm run build
npm run preview
```

## خطوة بخطوة للنشر على Vercel

### 1️⃣ تسجيل الدخول / الإنشاء
- اذهب إلى https://vercel.com
- سجل دخول أو أنشئ حساباً (استخدم GitHub)

### 2️⃣ ربط GitHub
- الموافقة على الوصول إلى حسابك
- اختر Repository "AI-Manager-main"

### 3️⃣ استيراد المشروع
- اضغط "New Project"
- اختر Repository من قائمة مشاريعك

### 4️⃣ إعدادات المشروع
```
Framework: Other (Vite)
Build Command: npm run build
Output Directory: dist
```

### 5️⃣ متغيرات البيئة
**أضف المتغيرات التالية:**

| Variable | Value | Production |
|----------|-------|-----------|
| `GEMINI_API_KEY` | `AIzaSyC...` | ✅ |

### 6️⃣ انقر Deploy
- انتظر انتهاء البناء
- سيحصل على URL مثل: `https://ai-manager-xxx.vercel.app`

## بعد النشر

### 1. اختبر التطبيق
- افتح موقعك على الرابط المعطى
- تأكد من عمل جميع الميزات

### 2. المشاكل الشائعة

#### ❌ خطأ: API Key لم يتم العثور عليه
```
الحل: 
1. اذهب إلى Project Settings
2. اضغط Environment Variables
3. أضف GEMINI_API_KEY مع القيمة الصحيحة
4. أعد نشر (Redeploy)
```

#### ❌ خطأ: 404 في البيانات
```
الحل:
- تأكد من أن vercel.json موجود
- تحقق من أن server.ts يحتوي على endpoints
- انظر logs: Project > Deployments > Logs
```

#### ❌ خطأ: better-sqlite3 لم يبنَ
```
الحل:
Vercel لا يدعم better-sqlite3 بسهولة.
الخيارات:
1. استخدم قاعدة بيانات سحابية
2. استخدم في الذاكرة مع localStorage على الواجهة
3. استخدم Supabase أو Firebase
```

## شاهد Logs

```bash
# عبر CLI
vercel logs

# أو من Dashboard
Project > Deployments > Click on deployment > View Logs
```

## مزيد من الأوامر المفيدة

```bash
# تسجيل الدخول
vercel login

# عرض معلومات المشروع
vercel projects

# إعادة النشر
vercel redeploy

# فتح مجلد المشروع
vercel inspect
```

## الخطوات التالية

- 🔗 ربط دومين مخصص (Domain)
- 🚀 إعداد CI/CD تلقائي
- 📊 مراقبة الأداء عبر Analytics
- 💾 ترقية قاعدة البيانات (إذا لزم)

## المساعدة

- Documentation: https://vercel.com/docs
- Community: https://vercel.com/support
- عندك مشكلة؟ تحقق من Server Logs أولاً!
