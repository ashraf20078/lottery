<?php
session_start();

// تدمير جلسة المستخدم
session_destroy();

// إعادة توجيه لصفحة تسجيل الدخول
header('Location: login.php');
exit;
?>
