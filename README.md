# موقع الإعلانات المبوبة

موقع ويب عصري وجذاب للإعلانات المبوبة باستخدام Firebase كخدمة خلفية.

## المميزات

- **تصميم عصري وجذاب**: واجهة مستخدم حديثة مع تأثيرات بصرية متقدمة
- **مصادقة المستخدمين**: تسجيل الدخول وإنشاء حسابات جديدة باستخدام Firebase Auth
- **إدارة الإعلانات**: إضافة وعرض وإدارة الإعلانات
- **رفع الصور**: رفع صور المنتجات باستخدام Firebase Storage
- **قاعدة بيانات فورية**: حفظ واسترجاع البيانات باستخدام Firebase Realtime Database
- **تصميم متجاوب**: يعمل بشكل مثالي على جميع الأجهزة
- **نظام الطلبات**: نظام طلب المنتجات مع معلومات الدفع

## الملفات والمجلدات

```
classifieds_website/
├── index.html              # الصفحة الرئيسية
├── login.html              # صفحة تسجيل الدخول/إنشاء حساب
├── add-ad.html             # صفحة إضافة إعلان
├── ad-details.html         # صفحة تفاصيل الإعلان
├── order.html              # صفحة الطلب
├── css/
│   └── style.css           # ملف الأنماط الرئيسي
├── js/
│   ├── main.js             # JavaScript للصفحة الرئيسية
│   ├── auth.js             # JavaScript للمصادقة
│   ├── add-ad.js           # JavaScript لإضافة الإعلانات
│   ├── ad-details.js       # JavaScript لتفاصيل الإعلان
│   └── order.js            # JavaScript لصفحة الطلب
├── images/                 # مجلد الصور والأيقونات
└── README.md               # هذا الملف
```

## إعداد Firebase

تم تكوين المشروع للعمل مع Firebase باستخدام الإعدادات التالية:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyAzYZMxqNmnLMGYnCyiJYPg2MbxZMt0co0",
    authDomain: "osama-91b95.firebaseapp.com",
    databaseURL: "https://osama-91b95-default-rtdb.firebaseio.com",
    projectId: "osama-91b95",
    storageBucket: "osama-91b95.appspot.com",
    messagingSenderId: "118875905722",
    appId: "1:118875905722:web:200bff1bd99db2c1caac83",
    measurementId: "G-LEM5PVPJZC"
};
```

## الخدمات المستخدمة

- **Firebase Authentication**: لتسجيل الدخول وإدارة المستخدمين
- **Firebase Realtime Database**: لحفظ بيانات الإعلانات والمستخدمين
- **Firebase Storage**: لرفع وحفظ صور المنتجات

## هيكل قاعدة البيانات

```
firebase-database/
├── users/
│   └── [userId]/
│       ├── name
│       ├── phone
│       ├── email
│       └── createdAt
├── ads/
│   └── [adId]/
│       ├── title
│       ├── description
│       ├── price
│       ├── location
│       ├── category
│       ├── imageUrl
│       ├── userId
│       ├── userEmail
│       ├── timestamp
│       └── status
├── orders/
│   └── [orderId]/
│       ├── adId
│       ├── adTitle
│       ├── adPrice
│       ├── sellerEmail
│       ├── orderDate
│       └── status
└── reports/
    └── [reportId]/
        ├── adId
        ├── adTitle
        ├── reason
        ├── details
        └── timestamp
```

## كيفية الاستخدام

1. **الصفحة الرئيسية**: عرض جميع الإعلانات المتاحة
2. **تسجيل الدخول**: إنشاء حساب جديد أو تسجيل الدخول
3. **إضافة إعلان**: نشر إعلان جديد (يتطلب تسجيل الدخول)
4. **عرض التفاصيل**: مشاهدة تفاصيل أي إعلان
5. **طلب المنتج**: طلب منتج مع معلومات الدفع

## نظام الدفع

يستخدم الموقع نظام الدفع عبر التحويل البنكي:
- **البنك**: بنك الكريمي
- **رقم الحساب**: 39532797587
- **طريقة التأكيد**: رسائل SMS تلقائية من البنك

## التقنيات المستخدمة

- **HTML5**: هيكل الصفحات
- **CSS3**: التصميم والتنسيق مع تأثيرات متقدمة
- **JavaScript (ES6+)**: الوظائف التفاعلية
- **Firebase SDK**: الخدمات الخلفية
- **Responsive Design**: التصميم المتجاوب

## المتطلبات

- متصفح ويب حديث يدعم ES6+
- اتصال بالإنترنت للوصول لخدمات Firebase
- حساب Firebase مُفعل مع الخدمات المطلوبة

## الرفع على GitHub

1. إنشاء مستودع جديد على GitHub
2. رفع جميع الملفات إلى المستودع
3. تفعيل GitHub Pages لنشر الموقع

## الدعم والتواصل

للدعم الفني أو الاستفسارات:
- البريد الإلكتروني: support@example.com
- الهاتف: +966 50 123 4567

## الترخيص

هذا المشروع مفتوح المصدر ومتاح للاستخدام والتطوير.

---

تم تطوير هذا المشروع باستخدام أحدث التقنيات لضمان تجربة مستخدم مميزة وأداء عالي.

