<div align="center">
<img width="1200" height="475" alt="AI Manager" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Manager

تطبيق إدارة أدوات الذكاء الاصطناعي بواجهة مستخدم حديثة وسهلة الاستخدام.

## الميزات

- 📋 إدارة قائمة أدوات AI الخاصة بك
- 🔍 البحث والتصفية حسب الفئات والعلامات
- ⭐ تقييم وتفضيل الأدوات
- 📊 إحصائيات الاستخدام
- 🎨 واجهة مستخدم حديثة وسريعة الاستجابة
- 🔄 إعادة ترتيب الأدوات بسهولة

## المتطلبات

- Node.js 20.x أو أحدث
- npm أو yarn
- API Key من Google Gemini (للإنالة المحلية)

## التثبيت والتشغيل المحلي

1. استنسخ البريبوزتوري:
```bash
git clone <repository-url>
cd AI-Manager-main
```

2. ثبت المتعلقات:
```bash
npm install
```

3. أنشئ ملف `.env` بالقالب:
```bash
cp .env.example .env
```

4. أضف API Key لـ Gemini:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

احصل على API Key من: https://aistudio.google.com/app/apikey

5. شغل التطبيق:
```bash
npm run dev
```

التطبيق سيكون متاح على `http://localhost:3000`

## البناء للإنتاج

```bash
npm run build
npm run preview
```

## النشر على Vercel

اطلع على [DEPLOYMENT.md](./DEPLOYMENT.md) للحصول على تعليمات مفصلة حول نشر التطبيق على Vercel.

### الخطوات السريعة:
1. ادفع الكود إلى GitHub
2. اذهب إلى [vercel.com](https://vercel.com)
3. استورد المشروع
4. أضف متغيرات البيئة في "Environment Variables"
5. اضغط "Deploy"

## البنية

```
src/
├── components/     # مكونات React
├── services/      # خدمات API والـ AI
├── utils/         # أدوات مساعدة
└── types.ts       # أنواع TypeScript

server.ts         # خادم Express
vite.config.ts    # إعدادات Vite
```

## التقنيات المستخدمة

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: SQLite (محلي)
- **AI**: Google Gemini API
- **Build**: Vite
- **Styling**: Tailwind CSS + Motion
- **Drag & Drop**: @dnd-kit

## الترخيص

هذا المشروع مفتوح المصدر ومتاح تحت رخصة MIT.

## الدعم

إذا واجهت أي مشاكل، يرجى فتح issue في المريبوزتوري. 
