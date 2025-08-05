<?php
// ملف لتحميل الملفات النموذجية مع ترميز UTF-8 صحيح

if (isset($_GET['type'])) {
    $type = $_GET['type'];
    
    if ($type == 'customers') {
        // ملف نموذجي للعملاء
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=sample_customers.csv');
        
        $output = fopen('php://output', 'w');
        
        // كتابة BOM لدعم UTF-8 في Excel
        fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
        
        // كتابة رؤوس الأعمدة
        fputcsv($output, array('رقم الكارت', 'اسم العميل', 'رقم الهاتف'));
        
        // كتابة البيانات النموذجية
        fputcsv($output, array('C011', 'أحمد محمد علي', '01234567890'));
        fputcsv($output, array('C012', 'فاطمة حسن محمود', '01098765432'));
        fputcsv($output, array('C013', 'محمود أحمد إبراهيم', '01155555555'));
        fputcsv($output, array('C014', 'زينب علي حسن', '01177777777'));
        fputcsv($output, array('C015', 'عبدالله محمد صالح', '01188888888'));
        
        fclose($output);
        exit;
        
    } elseif ($type == 'cards') {
        // ملف نموذجي للكروت المسموح بها
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=sample_allowed_cards.csv');
        
        $output = fopen('php://output', 'w');
        
        // كتابة BOM لدعم UTF-8 في Excel
        fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
        
        // كتابة رؤوس الأعمدة
        fputcsv($output, array('رقم الكارت', 'الحالة'));
        
        // كتابة البيانات النموذجية
        fputcsv($output, array('100', 'نعم'));
        fputcsv($output, array('101', 'نعم'));
        fputcsv($output, array('102', 'نعم'));
        fputcsv($output, array('103', 'نعم'));
        fputcsv($output, array('104', 'نعم'));
        fputcsv($output, array('105', 'لا'));
        
        fclose($output);
        exit;
    }
}

// إذا لم يتم تحديد نوع، عرض صفحة اختيار
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تحميل الملفات النموذجية</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div class="container">
        <h1>📥 تحميل الملفات النموذجية</h1>
        
        <div class="section">
            <h2 style="color: var(--secondary-color);">اختر نوع الملف المطلوب:</h2>
            
            <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
                <a href="?type=customers" class="btn btn-primary" style="display: flex; align-items: center; gap: 0.5rem;">
                    👥 ملف نموذجي للعملاء
                </a>
                
                <a href="?type=cards" class="btn btn-secondary" style="display: flex; align-items: center; gap: 0.5rem;">
                    🎫 ملف نموذجي للكروت المسموح بها
                </a>
            </div>
            
            <div style="margin-top: 2rem; padding: 1rem; background: white; border-radius: var(--border-radius); border-left: 4px solid var(--warning-color);">
                <h3 style="color: var(--warning-color); margin-top: 0;">📋 ملاحظات مهمة:</h3>
                <ul style="padding-right: 1.5rem;">
                    <li>الملفات محفوظة بترميز UTF-8 مع BOM لضمان عرض النص العربي بشكل صحيح</li>
                    <li>يمكن فتح الملفات في Excel أو أي برنامج جداول بيانات</li>
                    <li>تأكد من عدم تغيير ترميز الملف عند التعديل</li>
                    <li>احفظ الملف بصيغة CSV (UTF-8) عند التعديل</li>
                </ul>
            </div>
        </div>
        
        <div class="back-link">
            <a href="import_export.php">العودة لصفحة الاستيراد والتصدير</a> |
            <a href="manage_cards.php">إدارة الكروت المسموح بها</a> |
            <a href="admin.php">لوحة الإدارة</a>
        </div>
    </div>
</body>
</html>
