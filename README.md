# 🎫 نظام إدارة الكروت والسحوبات

نظام متكامل لإدارة كروت العملاء وتنظيم السحوبات العشوائية مع واجهة إدارية متطورة ومتجاوبة.

## 📋 المحتويات

- [📖 نظرة عامة](#نظرة-عامة)
- [✨ المميزات الرئيسية](#المميزات-الرئيسية)
- [🛠️ متطلبات التشغيل](#متطلبات-التشغيل)
- [⚙️ التثبيت والإعداد](#التثبيت-والإعداد)
- [🎯 كيفية الاستخدام](#كيفية-الاستخدام)
- [📁 هيكل المشروع](#هيكل-المشروع)
- [🔧 الإعدادات](#الإعدادات)
- [📱 التصميم المتجاوب](#التصميم-المتجاوب)
- [🔒 الأمان](#الأمان)
- [🐛 استكشاف الأخطاء](#استكشاف-الأخطاء)
- [📞 الدعم والمساعدة](#الدعم-والمساعدة)

## 📖 نظرة عامة

نظام إدارة الكروت هو تطبيق ويب متطور مصمم لإدارة كروت العملاء وتنظيم السحوبات العشوائية. يوفر النظام واجهة سهلة الاستخدام للعملاء لتسجيل بياناتهم ولوحة إدارية شاملة للمديرين.

### 🎯 الهدف من النظام
- تسهيل عملية تسجيل العملاء باستخدام أرقام الكروت
- إدارة قاعدة بيانات العملاء بكفاءة
- تنظيم سحوبات عشوائية عادلة وشفافة
- توفير تقارير وإحصائيات مفصلة
- تتبع زيارات الموقع والتفاعل

## ✨ المميزات الرئيسية

### 👥 إدارة العملاء
- ✅ تسجيل عملاء جدد بأرقام الكروت
- ✅ التحقق من صحة أرقام الكروت
- ✅ بحث متقدم في بيانات العملاء
- ✅ عرض مصفح للعملاء مع ترقيم الصفحات
- ✅ تصدير بيانات العملاء إلى Excel

### 🎫 إدارة الكروت
- ✅ إضافة وحذف أرقام الكروت المسموحة
- ✅ تفعيل وإلغاء تفعيل الكروت
- ✅ استيراد الكروت من ملفات CSV
- ✅ مولد أرقام عشوائية للكروت
- ✅ نظام تنبيهات للكروت المكررة

### 🎰 نظام السحوبات
- ✅ سحوبات عشوائية عادلة
- ✅ تحديد فترات زمنية للسحب
- ✅ تأثيرات بصرية متحركة للسحب
- ✅ حفظ تاريخ جميع السحوبات
- ✅ طباعة شهادات الفوز

### 📊 التقارير والإحصائيات
- ✅ إحصائيات شاملة للعملاء
- ✅ تقارير الزيارات اليومية والشهرية
- ✅ تحليل أنواع الأجهزة والمتصفحات
- ✅ سجل مفصل لجميع السحوبات
- ✅ رسوم بيانية تفاعلية

### 🎨 واجهة المستخدم
- ✅ تصميم عصري ومتجاوب
- ✅ دعم كامل للغة العربية (RTL)
- ✅ أيقونات تعبيرية وألوان متناسقة
- ✅ تأثيرات بصرية سلسة
- ✅ واجهة محمولة مُحسّنة

## 🛠️ متطلبات التشغيل

### متطلبات الخادم
- **PHP**: 7.4 أو أحدث
- **MySQL**: 5.7 أو أحدث (أو MariaDB 10.2+)
- **Apache/Nginx**: مع دعم .htaccess
- **التخزين**: 100 ميجابايت على الأقل

### المتطلبات الاختيارية
- **SSL Certificate**: للأمان (مُوصى به)
- **Composer**: لإدارة التبعيات (إذا لزم الأمر)
- **Node.js**: للتطوير وتحسين الأصول

### متطلبات PHP Extensions
```bash
- PDO MySQL
- mbstring
- fileinfo
- session
- json
```

## ⚙️ التثبيت والإعداد

### 1. تحميل الملفات
```bash
# استنساخ المشروع أو تحميل الملفات
git clone [repository-url]
# أو تحميل وفك ضغط الملفات يدوياً
```

### 2. إعداد قاعدة البيانات
```sql
-- إنشاء قاعدة بيانات جديدة
CREATE DATABASE customer_cards CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- استيراد الجداول
mysql -u username -p customer_cards < database.sql
```

### 3. تكوين الاتصال
```php
// تعديل ملف config.php
define('DB_HOST', 'localhost');
define('DB_NAME', 'customer_cards');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
```

### 4. تشغيل معالج التثبيت
1. انتقل إلى: `http://yourdomain.com/install.php`
2. اتبع التعليمات على الشاشة
3. أدخل بيانات قاعدة البيانات
4. إنشاء حساب المدير الأول

### 5. الأمان والصلاحيات
```bash
# تعيين صلاحيات الملفات
chmod 755 assets/
chmod 644 *.php
chmod 600 config.php

# حذف ملف التثبيت (مهم للأمان)
rm install.php
```

## 🎯 كيفية الاستخدام

### للعملاء
1. **زيارة الصفحة الرئيسية**: `index.php`
2. **إدخال رقم الكارت**: التأكد من صحة الرقم
3. **تعبئة البيانات الشخصية**: الاسم ورقم الهاتف
4. **تأكيد التسجيل**: استلام رسالة تأكيد

### للمديرين
1. **تسجيل الدخول**: `login.php`
2. **لوحة التحكم**: عرض الإحصائيات العامة
3. **إدارة العملاء**: البحث والعرض والتصدير
4. **إدارة الكروت**: إضافة وحذف الكروت
5. **تشغيل السحوبات**: اختيار الفترة وتشغيل السحب

### العمليات الأساسية

#### إضافة كروت جديدة
```php
// عبر الواجهة الإدارية
1. اذهب إلى "إدارة الكروت"
2. انقر "إضافة كارت جديد"
3. أدخل رقم الكارت
4. حدد حالة التفعيل

// عبر استيراد CSV
1. انقر "استيراد/تصدير"
2. اختر ملف CSV
3. تأكيد الاستيراد
```

#### تشغيل سحبة
```php
1. اذهب إلى "نظام السحب"
2. حدد تاريخ البداية والنهاية
3. انقر "بدء السحب"
4. مشاهدة التأثير المتحرك
5. طباعة النتيجة
```

## 📁 هيكل المشروع

```
📦 نظام إدارة الكروت
├── 📄 index.php              # الصفحة الرئيسية للعملاء
├── 📄 admin.php              # إدارة العملاء
├── 📄 login.php              # تسجيل دخول المديرين
├── 📄 logout.php             # تسجيل خروج
├── 📄 config.php             # إعدادات قاعدة البيانات
├── 📄 install.php            # معالج التثبيت
├── 📄 database.sql           # هيكل قاعدة البيانات
├── 📄 update_database.sql    # تحديثات قاعدة البيانات
├── 📄 track_visit.php        # تتبع الزيارات
├── 📄 thank_you.php          # صفحة شكر العملاء
├── 📄 template.php           # قالب الصفحات
├── 📄 README.md              # ملف الوثائق
│
├── 📁 assets/                # ملفات الواجهة
│   ├── 📁 css/
│   │   ├── 📄 style.css      # أنماط العملاء
│   │   ├── 📄 admin.css      # أنماط لوحة الإدارة
│   │   ├── 📄 responsive.css # التصميم المتجاوب
│   │   └── 📄 lottery-history.css
│   └── 📁 js/
│       ├── 📄 admin.js       # وظائف الإدارة
│       ├── 📄 lottery.js     # وظائف السحب
│       ├── 📄 card-generator.js
│       └── 📄 lottery-history.js
│
├── 📁 includes/              # ملفات مشتركة
│   └── 📄 sidebar.php        # القائمة الجانبية
│
├── 📁 management/            # إدارة النظام
│   ├── 📄 manage_cards.php   # إدارة الكروت
│   ├── 📄 card_generator.php # مولد الكروت
│   ├── 📄 lottery.php        # نظام السحب
│   ├── 📄 lottery_history.php # سجل السحوبات
│   ├── 📄 import_export.php  # استيراد/تصدير
│   ├── 📄 visit_logs.php     # سجل الزيارات
│   ├── 📄 csv_help.php       # مساعدة CSV
│   └── 📄 download_samples.php # تحميل نماذج
│
└── 📁 samples/               # ملفات نموذجية
    ├── 📄 sample_import.csv  # نموذج استيراد
    └── 📄 sample_allowed_cards.csv
```

## 🔧 الإعدادات

### إعدادات قاعدة البيانات
```php
// config.php
define('DB_HOST', 'localhost');      // عنوان الخادم
define('DB_NAME', 'customer_cards'); // اسم قاعدة البيانات
define('DB_USER', 'username');       // اسم المستخدم
define('DB_PASS', 'password');       // كلمة المرور
define('DB_CHARSET', 'utf8mb4');     // ترميز الأحرف
```

### إعدادات النظام
```php
// إعدادات الجلسة
ini_set('session.gc_maxlifetime', 3600); // ساعة واحدة
session_set_cookie_params(3600);

// إعدادات الصفحة
$itemsPerPage = 20;  // عدد العناصر في الصفحة
$maxFileSize = 5MB;  // حد رفع الملفات
```

### إعدادات الأمان
```php
// تفعيل HTTPS (مُوصى به)
if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
    $redirectURL = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    header("Location: $redirectURL");
    exit();
}
```

## 📱 التصميم المتجاوب

النظام مُصمم ليعمل على جميع الأجهزة:

### 📱 الهواتف الذكية (< 768px)
- قائمة جانبية قابلة للطي
- أزرار كبيرة سهلة اللمس
- نماذج مبسطة
- جداول قابلة للتمرير الأفقي

### 📟 الأجهزة اللوحية (768px - 1024px)
- تخطيط مُحسّن للشاشات المتوسطة
- أعمدة قابلة للتكيف
- قوائم متاحة بسهولة

### 🖥️ أجهزة سطح المكتب (> 1024px)
- عرض كامل للوحة الإدارة
- جداول تفصيلية
- إحصائيات متقدمة

## 🔒 الأمان

### آليات الحماية المُطبقة

#### 1. حماية قاعدة البيانات
```php
// استخدام Prepared Statements
$stmt = $pdo->prepare("SELECT * FROM customers WHERE card_number = ?");
$stmt->execute([$cardNumber]);
```

#### 2. تنظيف البيانات
```php
// تنظيف المدخلات
$cardNumber = filter_var($input, FILTER_SANITIZE_STRING);
$cardNumber = htmlspecialchars($cardNumber, ENT_QUOTES, 'UTF-8');
```

#### 3. حماية الجلسات
```php
// تجديد معرف الجلسة
session_regenerate_id(true);

// انتهاء صلاحية الجلسة
if (time() - $_SESSION['login_time'] > 3600) {
    session_destroy();
}
```

#### 4. التحقق من الصلاحيات
```php
// التحقق من تسجيل الدخول
if (!isset($_SESSION['admin_logged_in'])) {
    header('Location: login.php');
    exit;
}
```

### نصائح إضافية للأمان
- 🔐 استخدم كلمات مرور قوية
- 🔄 قم بتحديث النظام بانتظام
- 📄 اعمل نسخ احتياطية دورية
- 🛡️ فعّل SSL/HTTPS
- 🔒 قيّد الوصول لملفات الإدارة

## 🐛 استكشاف الأخطاء

### المشاكل الشائعة والحلول

#### 1. خطأ في الاتصال بقاعدة البيانات
```
Error: SQLSTATE[HY000] [2002] Connection refused
```
**الحل:**
- تحقق من صحة بيانات config.php
- تأكد من تشغيل خادم MySQL
- تحقق من صلاحيات المستخدم

#### 2. مشكلة في عرض الأحرف العربية
```
أ�راب� م���ر�
```
**الحل:**
```php
// إضافة إلى رأس الصفحة
header('Content-Type: text/html; charset=utf-8');
mysqli_set_charset($connection, "utf8mb4");
```

#### 3. مشكلة في رفع الملفات
```
Error: File too large
```
**الحل:**
```php
// في php.ini
upload_max_filesize = 10M
post_max_size = 12M
memory_limit = 128M
```

#### 4. القائمة الجانبية لا تعمل على الموبايل
**الحل:**
- تحقق من تحميل admin.js
- تأكد من وجود CSS للموبايل
- افحص وحدة تحكم المتصفح للأخطاء

#### 5. تأثيرات السحب لا تظهر
**الحل:**
- تحقق من تحميل lottery.js
- تأكد من وجود بيانات المشاركين
- افحص وحدة تحكم JavaScript

### تمكين وضع التشخيص
```php
// إضافة في أعلى الملفات للتشخيص
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

## 📞 الدعم والمساعدة

### قنوات الدعم
- 📧 **البريد الإلكتروني**: support@example.com
- 💬 **الدردشة المباشرة**: متوفرة في الموقع
- 📱 **الهاتف**: +1234567890
- 🌐 **الموقع**: https://example.com/support

### الوثائق والموارد
- 📖 [دليل المستخدم المفصل](docs/user-guide.md)
- 🔧 [دليل المطور](docs/developer-guide.md)
- ❓ [الأسئلة الشائعة](docs/faq.md)
- 🎥 [فيديوهات تعليمية](https://example.com/tutorials)

### المساهمة في المشروع
```bash
# استنساخ المشروع
git clone [repository-url]

# إنشاء فرع جديد
git checkout -b feature/new-feature

# إضافة التغييرات
git add .
git commit -m "Add new feature"

# رفع التغييرات
git push origin feature/new-feature
```

### الإبلاغ عن الأخطاء
عند الإبلاغ عن خطأ، يرجى تضمين:
- 🖥️ نوع المتصفح والإصدار
- 📱 نوع الجهاز ونظام التشغيل
- 📝 وصف مفصل للمشكلة
- 🖼️ لقطات شاشة إن أمكن
- 📄 رسائل الخطأ كاملة

## 🗄️ هيكل قاعدة البيانات

### جدول العملاء (customers)
```sql
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_number VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### جدول الكروت المسموحة (allowed_cards)
```sql
CREATE TABLE allowed_cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_number VARCHAR(50) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### جدول السحوبات (lottery_draws)
```sql
CREATE TABLE lottery_draws (
    id INT AUTO_INCREMENT PRIMARY KEY,
    winner_customer_id INT NOT NULL,
    draw_date_from DATE NOT NULL,
    draw_date_to DATE NOT NULL,
    total_participants INT NOT NULL,
    draw_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    admin_username VARCHAR(50),
    notes TEXT,
    FOREIGN KEY (winner_customer_id) REFERENCES customers(id)
);
```

### جدول سجل الزيارات (visit_logs)
```sql
CREATE TABLE visit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    page_visited VARCHAR(255),
    referer VARCHAR(500),
    country VARCHAR(100),
    city VARCHAR(100),
    browser VARCHAR(100),
    os VARCHAR(100),
    device_type VARCHAR(50),
    visit_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📈 الميزات المتقدمة

### تتبع الزيارات والتحليلات
- تسجيل تلقائي لجميع زيارات الموقع
- تحليل أنواع الأجهزة والمتصفحات
- إحصائيات الزيارات اليومية والشهرية
- تتبع الصفحات الأكثر زيارة

### نظام السحوبات المتطور
- سحوبات عشوائية مع تأثيرات بصرية
- تحديد فترات زمنية مخصصة للسحب
- حفظ تلقائي لجميع نتائج السحوبات
- إمكانية طباعة شهادات الفوز

### إدارة متقدمة للكروت
- نظام قائمة بيضاء للكروت المسموحة
- تفعيل وإلغاء تفعيل الكروت
- استيراد وتصدير جماعي للكروت
- مولد أرقام عشوائية للكروت

---

## 📄 الترخيص

هذا المشروع مرخص تحت [MIT License](LICENSE). يمكنك استخدامه وتعديله بحرية.

## 🙏 الشكر والتقدير

شكر خاص لجميع المساهمين في تطوير هذا النظام وتحسينه.

---

**تاريخ آخر تحديث**: أغسطس 2025  
**الإصدار الحالي**: v3.0.0  
**الحالة**: مستقر ✅

---

🎫 **نظام إدارة الكروت والسحوبات** - نظام متكامل لإدارة العملاء والسحوبات العشوائية
