<?php
session_start();

// التحقق من تسجيل الدخول
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}

// تضمين ملف الإعدادات
require_once 'config.php';

// التحقق من نوع العملية
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action == 'export') {
    // تصدير البيانات إلى CSV
    try {
        $pdo = getDBConnection();
        $stmt = $pdo->prepare("SELECT card_number, customer_name, phone_number, created_at FROM customers ORDER BY created_at DESC");
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // إعداد headers للتحميل
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=customers_export_' . date('Y-m-d_H-i-s') . '.csv');
        
        // إنشاء ملف CSV
        $output = fopen('php://output', 'w');
        
        // كتابة BOM لدعم UTF-8 في Excel
        fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
        
        // كتابة رؤوس الأعمدة
        fputcsv($output, array('رقم الكارت', 'اسم العميل', 'رقم الهاتف', 'تاريخ التسجيل'));
        
        // كتابة البيانات
        foreach ($results as $row) {
            fputcsv($output, array(
                $row['card_number'],
                $row['customer_name'],
                $row['phone_number'],
                $row['created_at']
            ));
        }
        
        fclose($output);
        exit;
        
    } catch(PDOException $e) {
        die("خطأ في تصدير البيانات: " . $e->getMessage());
    }
}

if ($action == 'import' && $_SERVER['REQUEST_METHOD'] == 'POST') {
    // استيراد البيانات من CSV
    if (isset($_FILES['csv_file']) && $_FILES['csv_file']['error'] == 0) {
        try {
            $pdo = getDBConnection();
            
            // قراءة الملف مع دعم UTF-8
            $fileContent = file_get_contents($_FILES['csv_file']['tmp_name']);
            
            // إزالة BOM إذا كان موجوداً
            $fileContent = str_replace("\xEF\xBB\xBF", '', $fileContent);
            
            // تحويل الترميز إلى UTF-8 إذا لم يكن كذلك
            if (!mb_check_encoding($fileContent, 'UTF-8')) {
                $fileContent = mb_convert_encoding($fileContent, 'UTF-8', 'auto');
            }
            
            // إنشاء ملف مؤقت للبيانات المنظفة
            $tempFile = tmpfile();
            fwrite($tempFile, $fileContent);
            rewind($tempFile);
            
            // تخطي السطر الأول (رؤوس الأعمدة)
            fgetcsv($tempFile);
            
            $imported = 0;
            $errors = 0;
            $duplicates = 0;
            $lineNumber = 2; // بدءاً من السطر الثاني
            
            $pdo->beginTransaction(); // بدء معاملة لضمان تناسق البيانات
            
            while (($data = fgetcsv($tempFile, 0, ",")) !== FALSE) {
                // تنظيف البيانات
                $data = array_map(function($item) {
                    return trim($item, " \t\n\r\0\x0B\"'");
                }, $data);
                
                if (count($data) >= 3 && !empty($data[0]) && !empty($data[1]) && !empty($data[2])) {
                    $card_number = $data[0];
                    $customer_name = $data[1];
                    $phone_number = $data[2];
                    
                    // التحقق من صحة البيانات
                    if (strlen($card_number) > 0 && strlen($customer_name) > 0 && strlen($phone_number) > 0) {
                        try {
                            // التحقق من عدم تكرار رقم الكارت
                            $check_stmt = $pdo->prepare("SELECT id FROM customers WHERE card_number = ?");
                            $check_stmt->execute([$card_number]);
                            
                            if ($check_stmt->rowCount() == 0) {
                                $stmt = $pdo->prepare("INSERT INTO customers (card_number, customer_name, phone_number, created_at) VALUES (?, ?, ?, NOW())");
                                if ($stmt->execute([$card_number, $customer_name, $phone_number])) {
                                    $imported++;
                                } else {
                                    $errors++;
                                }
                            } else {
                                $duplicates++;
                            }
                        } catch(PDOException $e) {
                            $errors++;
                            error_log("خطأ في السطر $lineNumber: " . $e->getMessage());
                        }
                    } else {
                        $errors++;
                    }
                } else {
                    if (!empty(array_filter($data))) { // تجاهل الأسطر الفارغة تماماً
                        $errors++;
                    }
                }
                $lineNumber++;
            }
            
            $pdo->commit(); // تأكيد المعاملة
            fclose($tempFile);
            
            // إنشاء رسالة مفصلة
            $message = "تم استيراد $imported عميل بنجاح";
            if ($duplicates > 0) {
                $message .= "، تم تجاهل $duplicates عميل مكرر";
            }
            if ($errors > 0) {
                $message .= "، $errors أخطاء في البيانات";
            }
            
        } catch(Exception $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollback(); // التراجع عن المعاملة في حالة الخطأ
            }
            $message = "خطأ في استيراد الملف: " . $e->getMessage();
            $imported = 0;
        }
    } else {
        $uploadError = '';
        switch ($_FILES['csv_file']['error']) {
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                $uploadError = 'حجم الملف كبير جداً';
                break;
            case UPLOAD_ERR_PARTIAL:
                $uploadError = 'تم تحميل الملف جزئياً فقط';
                break;
            case UPLOAD_ERR_NO_FILE:
                $uploadError = 'لم يتم اختيار ملف';
                break;
            default:
                $uploadError = 'خطأ في تحميل الملف';
        }
        $message = "يرجى اختيار ملف CSV صالح. $uploadError";
        $imported = 0;
    }
}
?>

<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تصدير واستيراد البيانات</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/admin.css">
</head>
<body>
    <div class="admin-layout">
        <?php include 'includes/sidebar.php'; ?>

        <main class="main-content">
            <div class="content-header">
                <h1>📁 تصدير واستيراد البيانات</h1>
                <div class="user-info">
                    <span>مرحباً <?php echo $_SESSION['admin_username']; ?></span>
                </div>
            </div>
        
        <?php if (isset($message)): ?>
            <div class="<?php echo (isset($imported) && $imported > 0) ? 'success-message' : 'error-message'; ?>">
                <?php echo $message; ?>
            </div>
        <?php endif; ?>
        
        <!-- قسم التصدير -->
        <div class="section" style="background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 1.5rem; border-radius: var(--border-radius); margin-bottom: 2rem; box-shadow: var(--shadow);">
            <h2 style="color: var(--success-color); margin-top: 0;">📊 تصدير البيانات</h2>
            <p style="margin-bottom: 1rem;">تصدير جميع بيانات العملاء إلى ملف Excel (CSV)</p>
            <a href="?action=export" class="btn btn-primary">📥 تصدير البيانات</a>
        </div>
        
        <!-- قسم الاستيراد -->
        <div class="section" style="background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 1.5rem; border-radius: var(--border-radius); margin-bottom: 2rem; box-shadow: var(--shadow);">
            <h2 style="color: var(--secondary-color); margin-top: 0;">📤 استيراد البيانات</h2>
            
            <div style="background: white; padding: 1rem; border-radius: var(--border-radius); margin-bottom: 1rem; border-left: 4px solid var(--warning-color);">
                <strong style="color: var(--warning-color);">📋 تعليمات الاستيراد:</strong>
                <ul style="margin: 0.5rem 0; padding-right: 1.5rem;">
                    <li>يجب أن يكون الملف بصيغة CSV مع ترميز UTF-8</li>
                    <li>السطر الأول يجب أن يحتوي على عناوين الأعمدة</li>
                    <li>ترتيب الأعمدة: رقم الكارت، اسم العميل، رقم الهاتف</li>
                    <li>سيتم تجاهل أرقام الكروت المكررة</li>
                    <li>تأكد من أن الكارت موجود في قائمة الكروت المسموح بها</li>
                    <li><strong>للنص العربي:</strong> احفظ الملف بصيغة CSV (UTF-8 with BOM)</li>
                </ul>
                <div style="margin-top: 1rem;">
                    <a href="download_samples.php?type=customers" class="btn btn-secondary" style="font-size: 0.9rem; padding: 0.5rem 1rem;">
                        📥 تحميل ملف نموذجي للعملاء
                    </a>
                    <a href="csv_help.php" class="btn" style="background: var(--warning-color); color: white; font-size: 0.9rem; padding: 0.5rem 1rem; text-decoration: none;">
                        ❓ مساعدة مع النص العربي
                    </a>
                </div>
            </div>
            
            <form method="POST" enctype="multipart/form-data">
                <input type="hidden" name="action" value="import">
                
                <div class="form-group">
                    <label for="csv_file">📁 اختر ملف CSV:</label>
                    <input type="file" id="csv_file" name="csv_file" accept=".csv" required 
                           style="padding: 0.75rem; border: 2px dashed var(--border-color); background: white;">
                </div>
                
                <input type="submit" value="📤 استيراد البيانات" class="btn btn-secondary">
            </form>
        </div>
        </main>
    </div>

    <script src="assets/js/admin.js"></script>
</body>
</html>
