<?php
// إعدادات قاعدة البيانات
define('DB_HOST', 'localhost');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', '');
define('DB_NAME', 'customer_cards');

// دالة الاتصال بقاعدة البيانات
function getDBConnection() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USERNAME,
            DB_PASSWORD,
            array(
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            )
        );
        return $pdo;
    } catch(PDOException $e) {
        die("خطأ في الاتصال بقاعدة البيانات: " . $e->getMessage());
    }
}

// دالة التحقق من وجود قاعدة البيانات والجدول
function checkDatabaseSetup() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";charset=utf8mb4",
            DB_USERNAME,
            DB_PASSWORD
        );
        
        // التحقق من وجود قاعدة البيانات
        $stmt = $pdo->prepare("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?");
        $stmt->execute([DB_NAME]);
        
        if ($stmt->rowCount() == 0) {
            return false;
        }
        
        // التحقق من وجود الجداول
        $pdo->exec("USE " . DB_NAME);
        $stmt = $pdo->prepare("SHOW TABLES LIKE 'customers'");
        $stmt->execute();
        
        $customersExists = $stmt->rowCount() > 0;
        
        $stmt = $pdo->prepare("SHOW TABLES LIKE 'allowed_cards'");
        $stmt->execute();
        
        $allowedCardsExists = $stmt->rowCount() > 0;
        
        return $customersExists && $allowedCardsExists;
        
    } catch(PDOException $e) {
        return false;
    }
}

// دالة للتحقق من أن رقم الكارت مسموح
function isCardAllowed($cardNumber) {
    try {
        $pdo = getDBConnection();
        $stmt = $pdo->prepare("SELECT id FROM allowed_cards WHERE card_number = ? AND is_active = 1");
        $stmt->execute([$cardNumber]);
        
        return $stmt->rowCount() > 0;
    } catch(PDOException $e) {
        return false; // في حالة الخطأ، نرفض الكارت
    }
}

// دالة للحصول على معلومات الكارت المسموح
function getCardInfo($cardNumber) {
    try {
        $pdo = getDBConnection();
        $stmt = $pdo->prepare("SELECT id, card_number, is_active, created_at FROM allowed_cards WHERE card_number = ? AND is_active = 1");
        $stmt->execute([$cardNumber]);
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        return false;
    }
}
?>
