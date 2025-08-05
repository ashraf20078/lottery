<?php
session_start();

// إعدادات تسجيل الدخول
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD', 'admin123'); // يُنصح بتغيير كلمة المرور

$error_message = '';

// التحقق من تسجيل الدخول
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);
    
    if ($username === ADMIN_USERNAME && $password === ADMIN_PASSWORD) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_username'] = $username;
        header('Location: admin.php');
        exit;
    } else {
        $error_message = 'اسم المستخدم أو كلمة المرور غير صحيحة';
    }
}
?>

<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تسجيل دخول الإدارة - نظام إدارة الكروت</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div class="container login-container">
        <div class="login-header">
            <div class="login-icon">🔐</div>
            <h1>تسجيل دخول الإدارة</h1>
        </div>
        
        <?php if ($error_message): ?>
            <div class="error-message">
                <?php echo $error_message; ?>
            </div>
        <?php endif; ?>
        
        <form method="POST" action="">
            <div class="form-group">
                <label for="username">اسم المستخدم:</label>
                <input type="text" id="username" name="username" 
                       value="<?php echo isset($_POST['username']) ? htmlspecialchars($_POST['username']) : ''; ?>" 
                       required>
            </div>
            
            <div class="form-group">
                <label for="password">كلمة المرور:</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <input type="submit" value="تسجيل الدخول">
        </form>
        
        <div class="back-link">
            <a href="index.php">العودة للصفحة الرئيسية</a>
        </div>
    </div>
</body>
</html>
