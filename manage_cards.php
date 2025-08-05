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

// تصدير الكروت المسموح بها
if ($action == 'export_cards') {
    try {
        $pdo = getDBConnection();
        $stmt = $pdo->prepare("SELECT card_number, is_active, created_at FROM allowed_cards ORDER BY created_at DESC");
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // إعداد headers للتحميل
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=allowed_cards_export_' . date('Y-m-d_H-i-s') . '.csv');
        
        // إنشاء ملف CSV
        $output = fopen('php://output', 'w');
        
        // كتابة BOM لدعم UTF-8 في Excel
        fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
        
        // كتابة رؤوس الأعمدة
        fputcsv($output, array('رقم الكارت', 'نشط', 'تاريخ الإضافة'));
        
        // كتابة البيانات
        foreach ($results as $row) {
            fputcsv($output, array(
                $row['card_number'],
                $row['is_active'] ? 'نعم' : 'لا',
                $row['created_at']
            ));
        }
        
        fclose($output);
        exit;
        
    } catch(PDOException $e) {
        die("خطأ في تصدير البيانات: " . $e->getMessage());
    }
}

// استيراد الكروت المسموح بها
if ($action == 'import_cards' && $_SERVER['REQUEST_METHOD'] == 'POST') {
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
            $updated = 0;
            $lineNumber = 2;
            
            $pdo->beginTransaction();
            
            while (($data = fgetcsv($tempFile, 0, ",")) !== FALSE) {
                // تنظيف البيانات
                $data = array_map(function($item) {
                    return trim($item, " \t\n\r\0\x0B\"'");
                }, $data);
                
                if (count($data) >= 1 && !empty($data[0])) {
                    $card_number = $data[0];
                    $is_active = 1; // افتراضياً نشط
                    
                    // التحقق من الكلمات المفتاحية للحالة إذا كان العمود الثاني موجود
                    if (isset($data[1]) && !empty($data[1])) {
                        $status = strtolower(trim($data[1]));
                        if (in_array($status, ['لا', 'غير نشط', 'معطل', 'false', '0', 'no'])) {
                            $is_active = 0;
                        }
                    }
                    
                    try {
                        // التحقق من وجود الكارت
                        $check_stmt = $pdo->prepare("SELECT id FROM allowed_cards WHERE card_number = ?");
                        $check_stmt->execute([$card_number]);
                        
                        if ($check_stmt->rowCount() == 0) {
                            // إدراج كارت جديد
                            $stmt = $pdo->prepare("INSERT INTO allowed_cards (card_number, is_active, created_at) VALUES (?, ?, NOW())");
                            if ($stmt->execute([$card_number, $is_active])) {
                                $imported++;
                            } else {
                                $errors++;
                            }
                        } else {
                            // تحديث الكارت الموجود
                            $stmt = $pdo->prepare("UPDATE allowed_cards SET is_active = ?, updated_at = NOW() WHERE card_number = ?");
                            if ($stmt->execute([$is_active, $card_number])) {
                                $updated++;
                            } else {
                                $duplicates++;
                            }
                        }
                    } catch(PDOException $e) {
                        $errors++;
                        error_log("خطأ في السطر $lineNumber: " . $e->getMessage());
                    }
                } else {
                    if (!empty(array_filter($data))) {
                        $errors++;
                    }
                }
                $lineNumber++;
            }
            
            $pdo->commit();
            fclose($tempFile);
            
            // إنشاء رسالة مفصلة
            $message = "تمت العملية بنجاح: ";
            $parts = [];
            if ($imported > 0) $parts[] = "تم إضافة $imported كارت جديد";
            if ($updated > 0) $parts[] = "تم تحديث $updated كارت موجود";
            if ($duplicates > 0) $parts[] = "$duplicates كارت مكرر";
            if ($errors > 0) $parts[] = "$errors أخطاء";
            
            $message .= implode('، ', $parts);
            
        } catch(Exception $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollback();
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

// حذف كارت
if ($action == 'delete_card' && isset($_GET['id'])) {
    try {
        $pdo = getDBConnection();
        $stmt = $pdo->prepare("DELETE FROM allowed_cards WHERE id = ?");
        if ($stmt->execute([$_GET['id']])) {
            $message = "تم حذف الكارت بنجاح";
        } else {
            $message = "خطأ في حذف الكارت";
        }
    } catch(PDOException $e) {
        $message = "خطأ في حذف الكارت: " . $e->getMessage();
    }
}

// تغيير حالة الكارت
if ($action == 'toggle_card' && isset($_GET['id'])) {
    try {
        $pdo = getDBConnection();
        $stmt = $pdo->prepare("UPDATE allowed_cards SET is_active = NOT is_active WHERE id = ?");
        if ($stmt->execute([$_GET['id']])) {
            $message = "تم تغيير حالة الكارت بنجاح";
        } else {
            $message = "خطأ في تغيير حالة الكارت";
        }
    } catch(PDOException $e) {
        $message = "خطأ في تغيير حالة الكارت: " . $e->getMessage();
    }
}

// إضافة كارت جديد
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['add_card'])) {
    $card_number = trim($_POST['card_number']);
    
    if (!empty($card_number)) {
        try {
            $pdo = getDBConnection();
            
            // التحقق من عدم تكرار رقم الكارت
            $check_stmt = $pdo->prepare("SELECT id FROM allowed_cards WHERE card_number = ?");
            $check_stmt->execute([$card_number]);
            
            if ($check_stmt->rowCount() == 0) {
                $stmt = $pdo->prepare("INSERT INTO allowed_cards (card_number, created_at) VALUES (?, NOW())");
                if ($stmt->execute([$card_number])) {
                    $message = "تم إضافة الكارت بنجاح";
                } else {
                    $message = "خطأ في إضافة الكارت";
                }
            } else {
                $message = "رقم الكارت موجود مسبقاً";
            }
        } catch(PDOException $e) {
            $message = "خطأ في إضافة الكارت: " . $e->getMessage();
        }
    } else {
        $message = "رقم الكارت مطلوب";
    }
}

// جلب جميع الكروت
try {
    $pdo = getDBConnection();
    $stmt = $pdo->prepare("SELECT * FROM allowed_cards ORDER BY created_at DESC");
    $stmt->execute();
    $cards = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    $cards = [];
    $message = "خطأ في جلب البيانات: " . $e->getMessage();
}
?>

<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إدارة الكروت المسموح بها</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/admin.css">
</head>
<body>
    <div class="admin-layout">
        <?php include 'includes/sidebar.php'; ?>

        <main class="main-content">
            <div class="content-header">
                <h1>🎫 إدارة الكروت المسموح بها</h1>
                <div class="user-info">
                    <span>مرحباً <?php echo $_SESSION['admin_username']; ?></span>
                </div>
            </div>
        
        <?php if (isset($message)): ?>
            <div class="<?php echo (isset($imported) && $imported > 0) || (isset($message) && strpos($message, 'بنجاح') !== false) ? 'success-message' : 'error-message'; ?>">
                <?php echo $message; ?>
            </div>
        <?php endif; ?>
        
        <!-- قسم إضافة كارت جديد -->
        <div class="section">
            <h2 style="color: var(--secondary-color);">➕ إضافة كارت جديد</h2>
            <form method="POST">
                <div class="form-row">
                    <div class="form-group">
                        <label for="card_number">رقم الكارت:</label>
                        <input type="number" id="card_number" name="card_number" required 
                               placeholder="أدخل رقم الكارت" 
                               style="width: 100%; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: var(--border-radius);">
                    </div>
                    <div class="form-group">
                        <input type="submit" name="add_card" value="➕ إضافة الكارت" class="btn btn-primary">
                    </div>
                </div>
            </form>
        </div>
        
        <!-- قسم الاستيراد والتصدير -->
        <div class="section">
            <h2 style="color: var(--success-color);">📊 استيراد وتصدير الكروت</h2>
            
            <div style="background: white; padding: 1rem; border-radius: var(--border-radius); margin-bottom: 1rem; border-left: 4px solid var(--warning-color);">
                <strong style="color: var(--warning-color);">📋 تعليمات استيراد الكروت:</strong>
                <ul style="margin: 0.5rem 0; padding-right: 1.5rem;">
                    <li>يجب أن يكون الملف بصيغة CSV مع ترميز UTF-8</li>
                    <li>ترتيب الأعمدة: رقم الكارت، الحالة (اختياري)</li>
                    <li>الحالة: استخدم "نعم" أو "لا" لتفعيل/إلغاء تفعيل الكارت (افتراضياً نشط)</li>
                    <li>سيتم تحديث الكروت الموجودة بدلاً من تجاهلها</li>
                    <li><strong>للنص العربي:</strong> احفظ الملف بصيغة CSV (UTF-8 with BOM)</li>
                </ul>
                <div style="margin-top: 1rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                    <a href="download_samples.php?type=cards" class="btn btn-secondary" style="font-size: 0.9rem; padding: 0.5rem 1rem;">
                        📥 تحميل ملف نموذجي للكروت
                    </a>
                    <a href="?action=export_cards" class="btn btn-primary" style="font-size: 0.9rem; padding: 0.5rem 1rem;">
                        📤 تصدير الكروت الحالية
                    </a>
                    <a href="csv_help.php" class="btn" style="background: var(--warning-color); color: white; font-size: 0.9rem; padding: 0.5rem 1rem; text-decoration: none;">
                        ❓ مساعدة مع النص العربي
                    </a>
                </div>
            </div>
            
            <form method="POST" enctype="multipart/form-data">
                <input type="hidden" name="action" value="import_cards">
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="csv_file">📁 اختر ملف CSV:</label>
                        <input type="file" id="csv_file" name="csv_file" accept=".csv" required 
                               style="padding: 0.75rem; border: 2px dashed var(--border-color); background: white;">
                    </div>
                    <div class="form-group">
                        <input type="submit" value="📤 استيراد الكروت" class="btn btn-secondary">
                    </div>
                </div>
            </form>
        </div>
        
        <!-- قسم عرض الكروت -->
        <div class="section">
            <h2 style="color: var(--primary-color);">📋 الكروت المسموح بها (<?php echo count($cards); ?> كارت)</h2>
            
            <?php if (count($cards) > 0): ?>
                <div class="results-count">عدد الكروت: <?php echo count($cards); ?></div>
                
                <table class="results-table">
                    <thead>
                        <tr>
                            <th>رقم الكارت</th>
                            <th>الحالة</th>
                            <th>تاريخ الإضافة</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($cards as $card): ?>
                            <tr>
                                <td>
                                    <code style="background: var(--bg-light); padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: bold;">
                                        <?php echo htmlspecialchars($card['card_number']); ?>
                                    </code>
                                </td>
                                <td>
                                    <span style="color: <?php echo $card['is_active'] ? 'var(--success-color)' : 'var(--danger-color)'; ?>; font-weight: bold;">
                                        <?php echo $card['is_active'] ? '✅ نشط' : '❌ معطل'; ?>
                                    </span>
                                </td>
                                <td><?php echo date('Y-m-d H:i', strtotime($card['created_at'])); ?></td>
                                <td>
                                    <a href="?action=toggle_card&id=<?php echo $card['id']; ?>" 
                                       style="color: var(--warning-color); text-decoration: none; margin-left: 10px;"
                                       title="<?php echo $card['is_active'] ? 'إلغاء تفعيل' : 'تفعيل'; ?>">
                                        <?php echo $card['is_active'] ? '⏸️' : '▶️'; ?>
                                    </a>
                                    <a href="?action=delete_card&id=<?php echo $card['id']; ?>" 
                                       style="color: var(--danger-color); text-decoration: none;"
                                       onclick="return confirm('هل أنت متأكد من حذف هذا الكارت؟')"
                                       title="حذف">
                                        🗑️
                                    </a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <div class="no-results">لا توجد كروت مسموح بها حالياً</div>
            <?php endif; ?>
        </div>
        </main>
    </div>

    <script src="assets/js/admin.js"></script>
    <script>
        // تأكيد الحذف المخصص
        function confirmDelete(cardNumber) {
            return confirm('هل أنت متأكد من حذف الكارت: ' + cardNumber + '؟');
        }
    </script>
</body>
</html>
