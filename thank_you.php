<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>شكراً لك - نظام إدارة الكروت</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <?php session_start(); ?>
    <div class="container thank-you-container">
        <div class="thank-you-icon">✅</div>
        <h1 class="thank-you-title">تم التسجيل بنجاح!</h1>
        
        <?php if (isset($_SESSION['customer_data'])): ?>
            <div style="background: white; padding: 1.5rem; border-radius: var(--border-radius); margin: 1.5rem 0; box-shadow: var(--shadow); border-left: 4px solid var(--success-color);">
                <h3 style="color: var(--primary-color); margin-top: 0;">📄 تفاصيل التسجيل:</h3>
                <div style="text-align: right;">
                    <p><strong>رقم الكارت:</strong> <?php echo htmlspecialchars($_SESSION['customer_data']['card_number']); ?></p>
                    <p><strong>اسم العميل:</strong> <?php echo htmlspecialchars($_SESSION['customer_data']['customer_name']); ?></p>
                    <p><strong>رقم الهاتف:</strong> <?php echo htmlspecialchars($_SESSION['customer_data']['phone_number']); ?></p>
                    
                    <?php if (isset($_SESSION['card_info']) && $_SESSION['card_info']): ?>
                        <p><strong>حالة الكارت:</strong> 
                            <span style="background: var(--success-color); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: bold;">
                                مُسجل ومُفعل
                            </span>
                        </p>
                    <?php endif; ?>
                    
                    <p><strong>تاريخ التسجيل:</strong> <?php echo date('Y-m-d H:i:s'); ?></p>
                </div>
            </div>
            
            <?php 
                // مسح البيانات من الجلسة بعد العرض
                unset($_SESSION['customer_data']);
                unset($_SESSION['card_info']);
            ?>
        <?php endif; ?>
        
        <div class="thank-you-message">
            <p>شكراً لك على تسجيل بياناتك معنا</p>
            <p>تم حفظ معلوماتك بأمان في النظام</p>
            <p>يمكنك الآن الاستفادة من خدماتنا</p>
        </div>
        
        <div class="action-buttons">
            <a href="index.php" class="btn btn-primary">تسجيل عميل جديد</a>
            <a href="#" onclick="window.print()" class="btn btn-secondary">طباعة التأكيد</a>
        </div>
        
        <div class="back-link">
            <p>إذا كان لديك أي استفسار، يرجى التواصل معنا</p>
        </div>
    </div>

    <script>
        // إعادة توجيه تلقائي بعد 15 ثانية
        setTimeout(function() {
            if (confirm('هل تريد العودة لتسجيل عميل جديد؟')) {
                window.location.href = 'index.php';
            }
        }, 15000);
    </script>
</body>
</html>
