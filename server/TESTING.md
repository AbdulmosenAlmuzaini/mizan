# دليل اختبار API ميزان

لتجربة النظام، اتبع الخطوات التالية:

## 1. تشغيل الخادم
في مجلد `server` عبر التيرمينال، قم بتشغيل:
```bash
npm run dev
```

## 2. التسجيل (Register)
لإنشاء حساب مسؤول وشركة جديدة:
```bash
curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "email": "admin@mizan.auto",
  "password": "password123",
  "firstName": "Ahmed",
  "lastName": "Ali",
  "companyName": "Mizan Tech"
}'
```

## 3. تسجيل الدخول (Login)
للحصول على الـ `Token`:
```bash
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "admin@mizan.auto",
  "password": "password123"
}'
```
**ملاحظة**: انسخ قيمة الـ `token` من النتيجة لاستخدامها في الخطوات القادمة.

## 4. إضافة مصروف (Create Expense)
استبدل `YOUR_TOKEN` بالتوكن الذي حصلت عليه:
```bash
curl -X POST http://localhost:5000/api/expenses \
-H "Authorization: Bearer YOUR_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "amount": 250.50,
  "currency": "SAR",
  "description": "Office Supplies",
  "category": "OFFICE"
}'
```

## 5. عرض قائمة المصاريف (Get Expenses)
```bash
curl -X GET http://localhost:5000/api/expenses \
-H "Authorization: Bearer YOUR_TOKEN"
```

## 6. عرض سجل العمليات (Audit Logs)
للمسؤولين فقط:
```bash
curl -X GET http://localhost:5000/api/audit \
-H "Authorization: Bearer YOUR_TOKEN"
```

يمكنك استخدام نفس الطريقة لاختبار البطاقات (`api/cards`) والميزانيات (`api/budgets`).
