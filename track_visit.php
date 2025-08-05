<?php
// ملف تتبع الزيارات
require_once 'config.php';

function trackVisit($page = '') {
    try {
        $pdo = getDBConnection();
        
        // الحصول على معلومات الزائر
        $ip_address = getClientIpAddress();
        $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';
        $page_visited = $page ?: ($_SERVER['REQUEST_URI'] ?? '');
        $referer = $_SERVER['HTTP_REFERER'] ?? '';
        
        // تحليل معلومات المتصفح والجهاز
        $browser_info = getBrowserInfo($user_agent);
        $device_type = getDeviceType($user_agent);
        
        // إدراج بيانات الزيارة
        $stmt = $pdo->prepare("
            INSERT INTO visit_logs 
            (ip_address, user_agent, page_visited, referer, browser, os, device_type, visit_timestamp) 
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        ");
        
        $stmt->execute([
            $ip_address,
            $user_agent,
            $page_visited,
            $referer,
            $browser_info['browser'],
            $browser_info['os'],
            $device_type
        ]);
        
    } catch(PDOException $e) {
        // تجاهل الأخطاء في التتبع لعدم تعطيل الموقع
        error_log("خطأ في تتبع الزيارة: " . $e->getMessage());
    }
}

function getClientIpAddress() {
    $ip_keys = ['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'];
    
    foreach ($ip_keys as $key) {
        if (array_key_exists($key, $_SERVER) === true) {
            foreach (explode(',', $_SERVER[$key]) as $ip) {
                $ip = trim($ip);
                if (filter_var($ip, FILTER_VALIDATE_IP, 
                    FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false) {
                    return $ip;
                }
            }
        }
    }
    
    return $_SERVER['REMOTE_ADDR'] ?? 'غير معروف';
}

function getBrowserInfo($user_agent) {
    $browser = 'غير معروف';
    $os = 'غير معروف';
    
    // تحديد المتصفح
    if (strpos($user_agent, 'Chrome') !== false) {
        $browser = 'Chrome';
    } elseif (strpos($user_agent, 'Firefox') !== false) {
        $browser = 'Firefox';
    } elseif (strpos($user_agent, 'Safari') !== false) {
        $browser = 'Safari';
    } elseif (strpos($user_agent, 'Edge') !== false) {
        $browser = 'Edge';
    } elseif (strpos($user_agent, 'Opera') !== false) {
        $browser = 'Opera';
    }
    
    // تحديد نظام التشغيل
    if (strpos($user_agent, 'Windows') !== false) {
        $os = 'Windows';
    } elseif (strpos($user_agent, 'Mac') !== false) {
        $os = 'macOS';
    } elseif (strpos($user_agent, 'Linux') !== false) {
        $os = 'Linux';
    } elseif (strpos($user_agent, 'Android') !== false) {
        $os = 'Android';
    } elseif (strpos($user_agent, 'iOS') !== false) {
        $os = 'iOS';
    }
    
    return ['browser' => $browser, 'os' => $os];
}

function getDeviceType($user_agent) {
    if (strpos($user_agent, 'Mobile') !== false || 
        strpos($user_agent, 'Android') !== false || 
        strpos($user_agent, 'iPhone') !== false) {
        return 'هاتف محمول';
    } elseif (strpos($user_agent, 'Tablet') !== false || 
              strpos($user_agent, 'iPad') !== false) {
        return 'جهاز لوحي';
    } else {
        return 'حاسوب مكتبي';
    }
}

// تشغيل التتبع تلقائياً إذا تم استدعاء الملف مباشرة
if (!isset($GLOBALS['no_auto_track'])) {
    trackVisit();
}
?>
