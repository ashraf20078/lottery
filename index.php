<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تسجيل العميل - نظام إدارة الكروت</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div class="container">
        <h1>تسجيل بيانات العميل</h1>
        
        <?php
        // تضمين ملف الإعدادات
        require_once 'config.php';
        // تتبع الزيارات
        $GLOBALS['no_auto_track'] = true; // منع التتبع التلقائي
        require_once 'track_visit.php';
        trackVisit('index.php - صفحة تسجيل العملاء');
        
        $message = "";
        
        // معالجة البيانات عند الإرسال
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $card_number = trim($_POST['card_number']);
            $customer_name = trim($_POST['customer_name']);
            $phone_number = trim($_POST['phone_number']);
            
            // التحقق من البيانات
            if (empty($card_number) || empty($customer_name) || empty($phone_number)) {
                $message = '<div class="error-message">جميع الحقول مطلوبة!</div>';
            } elseif (!isCardAllowed($card_number)) {
                $message = '<div class="error-message">رقم الكارت غير مسموح أو غير صالح!</div>';
            } else {
                try {
                    // الاتصال بقاعدة البيانات
                    $pdo = getDBConnection();
                    
                    // التحقق من عدم تكرار رقم الكارت
                    $stmt = $pdo->prepare("SELECT id FROM customers WHERE card_number = ?");
                    $stmt->execute([$card_number]);
                    
                    if ($stmt->rowCount() > 0) {
                        $message = '<div class="error-message">رقم الكارت موجود مسبقاً!</div>';
                    } else {
                        // إدراج البيانات مع معلومات الكارت
                        $cardInfo = getCardInfo($card_number);
                        $stmt = $pdo->prepare("INSERT INTO customers (card_number, customer_name, phone_number, created_at) VALUES (?, ?, ?, NOW())");
                        $stmt->execute([$card_number, $customer_name, $phone_number]);
                        
                        // حفظ معلومات الكارت في الجلسة لعرضها في صفحة الشكر
                        $_SESSION['card_info'] = $cardInfo;
                        $_SESSION['customer_data'] = [
                            'card_number' => $card_number,
                            'customer_name' => $customer_name,
                            'phone_number' => $phone_number
                        ];
                        
                        // إعادة توجيه لصفحة الشكر
                        header('Location: thank_you.php');
                        exit;
                    }
                } catch(PDOException $e) {
                    $message = '<div class="error-message">خطأ في الاتصال بقاعدة البيانات: ' . $e->getMessage() . '</div>';
                }
            }
        }
        
        echo $message;
        ?>
        
        <form method="POST" action="">
            <div class="form-group card-number-group">
                <label for="card_number">رقم الكارت:</label>
                <input type="number" id="card_number" name="card_number" 
                       value="<?php echo isset($_POST['card_number']) ? htmlspecialchars($_POST['card_number']) : ''; ?>" 
                       placeholder="أدخل رقم الكارت"
                       min="1"
                       step="1"
                       required>
            </div>
            
            <div class="form-group">
                <label for="customer_name">اسم العميل:</label>
                <input type="text" id="customer_name" name="customer_name" 
                       value="<?php echo isset($_POST['customer_name']) ? htmlspecialchars($_POST['customer_name']) : ''; ?>" 
                       required>
            </div>
            
            <div class="form-group">
                <label for="phone_number">رقم الهاتف:</label>
                <input type="tel" id="phone_number" name="phone_number" 
                       value="<?php echo isset($_POST['phone_number']) ? htmlspecialchars($_POST['phone_number']) : ''; ?>" 
                       required>
            </div>
            
            <input type="submit" value="تسجيل البيانات">
        </form>
        
        <div class="admin-link" style="display: none;">
            <a href="login.php">صفحة الإدارة</a>
        </div>
    </div>

    <script>
        // تحسين تجربة المستخدم لحقل رقم الكارت
        document.getElementById('card_number').addEventListener('input', function(e) {
            // إزالة أي أحرف غير رقمية
            this.value = this.value.replace(/[^0-9]/g, '');
            
            // تحديد الحد الأقصى لطول الرقم (مثلاً 10 أرقام)
            if (this.value.length > 10) {
                this.value = this.value.slice(0, 10);
            }
        });

        // تأثير بصري عند التركيز على الحقل
        document.getElementById('card_number').addEventListener('focus', function(e) {
            this.select(); // تحديد النص عند التركيز
        });

        // التحقق من صحة رقم الكارت قبل الإرسال
        document.querySelector('form').addEventListener('submit', function(e) {
            const cardNumber = document.getElementById('card_number').value;
            
            if (cardNumber.length < 3) {
                e.preventDefault();
                alert('رقم الكارت يجب أن يكون على الأقل 3 أرقام');
                document.getElementById('card_number').focus();
                return false;
            }
        });
    </script>
</body>
</html>