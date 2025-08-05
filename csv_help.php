<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>دليل استخدام ملفات CSV</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div class="container admin-container">
        <h1>📖 دليل استخدام ملفات CSV مع النص العربي</h1>
        
        <!-- مشكلة النص العربي -->
        <div class="section">
            <h2 style="color: var(--danger-color);">❌ مشكلة النص العربي في ملفات CSV</h2>
            <p>إذا كان النص العربي يظهر بشكل غير مفهوم (رموز غريبة)، فهذا يعني مشكلة في ترميز الملف.</p>
            
            <div style="background: #f8d7da; padding: 1rem; border-radius: var(--border-radius); border-left: 4px solid var(--danger-color); margin: 1rem 0;">
                <strong>أمثلة على النص المشوه:</strong>
                <ul style="font-family: monospace; margin: 0.5rem 0;">
                    <li>أحمد → Ø£Ø­Ù…Ø¯</li>
                    <li>فاطمة → ÙØ§Ø·Ù…Ø©</li>
                    <li>محمد → Ù…Ø­Ù…Ø¯</li>
                </ul>
            </div>
        </div>
        
        <!-- الحلول -->
        <div class="section">
            <h2 style="color: var(--success-color);">✅ الحلول المتاحة</h2>
            
            <h3 style="color: var(--secondary-color);">الحل الأول: استخدام الملفات النموذجية (الأسهل)</h3>
            <div style="background: #d4edda; padding: 1rem; border-radius: var(--border-radius); margin-bottom: 1rem;">
                <ol>
                    <li>حمّل الملف النموذجي من النظام</li>
                    <li>افتح الملف في Excel أو أي برنامج جداول بيانات</li>
                    <li>عدّل البيانات حسب حاجتك</li>
                    <li>احفظ الملف بنفس الاسم والصيغة</li>
                </ol>
                <div style="margin-top: 1rem;">
                    <a href="download_samples.php" class="btn btn-primary">📥 تحميل الملفات النموذجية</a>
                </div>
            </div>
            
            <h3 style="color: var(--secondary-color);">الحل الثاني: إعداد Excel بشكل صحيح</h3>
            <div style="background: #fff3cd; padding: 1rem; border-radius: var(--border-radius); margin-bottom: 1rem;">
                <strong>عند فتح ملف CSV في Excel:</strong>
                <ol>
                    <li>افتح Excel</li>
                    <li>اذهب إلى File → Open</li>
                    <li>اختر "All Files" أو "Text Files"</li>
                    <li>اختر ملف CSV</li>
                    <li>في معالج الاستيراد:
                        <ul style="margin-top: 0.5rem;">
                            <li>اختر "Delimited"</li>
                            <li>في File Origin اختر "65001: Unicode (UTF-8)"</li>
                            <li>اختر Comma كفاصل</li>
                        </ul>
                    </li>
                </ol>
                
                <strong style="margin-top: 1rem; display: block;">عند حفظ الملف:</strong>
                <ol>
                    <li>اذهب إلى File → Save As</li>
                    <li>اختر "CSV UTF-8 (Comma delimited) (*.csv)" كصيغة</li>
                    <li>احفظ الملف</li>
                </ol>
            </div>
            
            <h3 style="color: var(--secondary-color);">الحل الثالث: استخدام محرر النصوص</h3>
            <div style="background: #e2e3e5; padding: 1rem; border-radius: var(--border-radius); margin-bottom: 1rem;">
                <strong>باستخدام Notepad++ (مجاني):</strong>
                <ol>
                    <li>حمّل وثبّت Notepad++ من الموقع الرسمي</li>
                    <li>افتح ملف CSV في Notepad++</li>
                    <li>من القائمة Encoding اختر "Convert to UTF-8-BOM"</li>
                    <li>احفظ الملف</li>
                </ol>
                
                <strong style="margin-top: 1rem; display: block;">باستخدام Visual Studio Code:</strong>
                <ol>
                    <li>افتح ملف CSV في VS Code</li>
                    <li>في الشريط السفلي ستجد "UTF-8"</li>
                    <li>اضغط عليه واختر "Save with Encoding"</li>
                    <li>اختر "UTF-8 with BOM"</li>
                </ol>
            </div>
        </div>
        
        <!-- نصائح إضافية -->
        <div class="section">
            <h2 style="color: var(--warning-color);">💡 نصائح إضافية</h2>
            
            <div style="background: white; padding: 1rem; border-radius: var(--border-radius); border-left: 4px solid var(--warning-color);">
                <ul>
                    <li><strong>تجنب استخدام الفواصل</strong> في النصوص (استخدم النقطة بدلاً من الفاصلة)</li>
                    <li><strong>تجنب علامات الاقتباس</strong> المزدوجة في النصوص</li>
                    <li><strong>تأكد من ترتيب الأعمدة</strong> حسب التعليمات</li>
                    <li><strong>اختبر الملف</strong> على عدد قليل من البيانات أولاً</li>
                    <li><strong>احتفظ بنسخة احتياطية</strong> من بياناتك قبل الاستيراد</li>
                </ul>
            </div>
        </div>
        
        <!-- أمثلة صحيحة -->
        <div class="section">
            <h2 style="color: var(--success-color);">📋 أمثلة على البيانات الصحيحة</h2>
            
            <h3>ملف العملاء:</h3>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: var(--border-radius); font-family: monospace; direction: ltr; text-align: left;">
رقم الكارت,اسم العميل,رقم الهاتف<br>
C001,أحمد محمد علي,01234567890<br>
C002,فاطمة حسن محمود,01098765432<br>
C003,محمود أحمد إبراهيم,01155555555
            </div>
            
            <h3>ملف الكروت المسموح بها:</h3>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: var(--border-radius); font-family: monospace; direction: ltr; text-align: left;">
رقم الكارت,نوع الكارت,الوصف,الحالة<br>
C100,ذهبي,كارت ذهبي للعملاء المميزين,نعم<br>
C101,فضي,كارت فضي للعملاء العاديين,نعم<br>
C102,برونزي,كارت برونزي للعملاء الجدد,لا
            </div>
        </div>
        
        <div class="back-link">
            <a href="import_export.php">استيراد وتصدير العملاء</a> |
            <a href="manage_cards.php">إدارة الكروت المسموح بها</a> |
            <a href="admin.php">لوحة الإدارة</a>
        </div>
    </div>
</body>
</html>
