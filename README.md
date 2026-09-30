# مساعد سوق الوساط | Souq Alwisat Assistant

## التشغيل محلياً
npm install
npm run dev

## النشر على Netlify
1. ارفع المجلد إلى مستودع GitHub جديد.
2. Netlify > Add new site > Import from Git > اختر المستودع (الإعدادات تُقرأ من netlify.toml).
3. Site settings > Environment variables: أضف المتغيرات الموجودة في .env.example.
4. افتح الرابط من هاتفك: Android يعرض زر «تثبيت»، وiPhone يعرض خطوات «إضافة إلى الشاشة الرئيسية» (من Safari).

## ملاحظة
مفاتيح SUPABASE_SERVICE_ROLE_KEY وGEMINI_API_KEY تُستخدم في Netlify Functions فقط ولا تُكتب أبداً بمتغيرات تبدأ بـ VITE_.
