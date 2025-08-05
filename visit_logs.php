<?php
session_start();

// التحقق من تسجيل الدخول
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}

require_once 'config.php';

// إعدادات الصفحة
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = 20;
$offset = ($page - 1) * $limit;

try {
    $pdo = getDBConnection();
    
    // إحصائيات عامة
    $stats_query = "
        SELECT 
            COUNT(*) as total_visits,
            COUNT(DISTINCT ip_address) as unique_visitors,
            COUNT(CASE WHEN DATE(visit_timestamp) = CURDATE() THEN 1 END) as today_visits,
            COUNT(CASE WHEN DATE(visit_timestamp) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 END) as week_visits
        FROM visit_logs
    ";
    $stats = $pdo->query($stats_query)->fetch(PDO::FETCH_ASSOC);
    
    // أكثر الصفحات زيارة
    $popular_pages = $pdo->query("
        SELECT page_visited, COUNT(*) as count 
        FROM visit_logs 
        WHERE page_visited != '' 
        GROUP BY page_visited 
        ORDER BY count DESC 
        LIMIT 5
    ")->fetchAll(PDO::FETCH_ASSOC);
    
    // أكثر المتصفحات استخداماً
    $browsers = $pdo->query("
        SELECT browser, COUNT(*) as count 
        FROM visit_logs 
        WHERE browser != 'غير معروف' 
        GROUP BY browser 
        ORDER BY count DESC 
        LIMIT 5
    ")->fetchAll(PDO::FETCH_ASSOC);
    
    // أنواع الأجهزة
    $devices = $pdo->query("
        SELECT device_type, COUNT(*) as count 
        FROM visit_logs 
        GROUP BY device_type 
        ORDER BY count DESC
    ")->fetchAll(PDO::FETCH_ASSOC);
    
    // سجل الزيارات الحديثة
    $visits_query = "
        SELECT * FROM visit_logs 
        ORDER BY visit_timestamp DESC 
        LIMIT $limit OFFSET $offset
    ";
    $visits = $pdo->query($visits_query)->fetchAll(PDO::FETCH_ASSOC);
    
    // العدد الكلي للصفحات
    $total_visits = $stats['total_visits'];
    $total_pages = ceil($total_visits / $limit);
    
} catch(PDOException $e) {
    die("خطأ في قاعدة البيانات: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>سجل زيارات الموقع</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/admin.css">
</head>
<body>
    <div class="admin-layout">
        <?php include 'includes/sidebar.php'; ?>

        <main class="main-content">
            <div class="content-header">
                <h1>📈 سجل زيارات الموقع</h1>
                <div class="user-info">
                    <span>مرحباً <?php echo $_SESSION['admin_username']; ?></span>
                </div>
            </div>

            <!-- إحصائيات سريعة -->
            <div class="stats-grid">
                <div class="stat-card primary">
                    <div class="stat-icon">👥</div>
                    <div class="stat-content">
                        <h3><?php echo number_format($stats['total_visits']); ?></h3>
                        <p>إجمالي الزيارات</p>
                    </div>
                </div>
                <div class="stat-card success">
                    <div class="stat-icon">🔥</div>
                    <div class="stat-content">
                        <h3><?php echo number_format($stats['unique_visitors']); ?></h3>
                        <p>زوار فريدين</p>
                    </div>
                </div>
                <div class="stat-card warning">
                    <div class="stat-icon">📅</div>
                    <div class="stat-content">
                        <h3><?php echo number_format($stats['today_visits']); ?></h3>
                        <p>زيارات اليوم</p>
                    </div>
                </div>
                <div class="stat-card info">
                    <div class="stat-icon">📊</div>
                    <div class="stat-content">
                        <h3><?php echo number_format($stats['week_visits']); ?></h3>
                        <p>زيارات الأسبوع</p>
                    </div>
                </div>
            </div>

            <!-- التحليلات -->
            <div class="analytics-grid">
                <!-- أكثر الصفحات زيارة -->
                <div class="analytics-card">
                    <h3>🔍 أكثر الصفحات زيارة</h3>
                    <div class="analytics-list">
                        <?php foreach($popular_pages as $page): ?>
                        <div class="analytics-item">
                            <span class="item-label"><?php echo htmlspecialchars($page['page_visited']); ?></span>
                            <span class="item-value"><?php echo number_format($page['count']); ?></span>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <!-- المتصفحات -->
                <div class="analytics-card">
                    <h3>🌐 المتصفحات الأكثر استخداماً</h3>
                    <div class="analytics-list">
                        <?php foreach($browsers as $browser): ?>
                        <div class="analytics-item">
                            <span class="item-label"><?php echo htmlspecialchars($browser['browser']); ?></span>
                            <span class="item-value"><?php echo number_format($browser['count']); ?></span>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <!-- أنواع الأجهزة -->
                <div class="analytics-card">
                    <h3>📱 أنواع الأجهزة</h3>
                    <div class="analytics-list">
                        <?php foreach($devices as $device): ?>
                        <div class="analytics-item">
                            <span class="item-label"><?php echo htmlspecialchars($device['device_type']); ?></span>
                            <span class="item-value"><?php echo number_format($device['count']); ?></span>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>

            <!-- سجل الزيارات -->
            <div class="table-container">
                <h3>📋 سجل الزيارات الحديثة</h3>
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>IP العنوان</th>
                                <th>الصفحة</th>
                                <th>المتصفح</th>
                                <th>نظام التشغيل</th>
                                <th>نوع الجهاز</th>
                                <th>وقت الزيارة</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach($visits as $visit): ?>
                            <tr>
                                <td>
                                    <code><?php echo htmlspecialchars($visit['ip_address']); ?></code>
                                </td>
                                <td>
                                    <span class="page-badge">
                                        <?php echo htmlspecialchars($visit['page_visited'] ?: '/'); ?>
                                    </span>
                                </td>
                                <td>
                                    <span class="browser-badge">
                                        <?php echo htmlspecialchars($visit['browser']); ?>
                                    </span>
                                </td>
                                <td>
                                    <span class="os-badge">
                                        <?php echo htmlspecialchars($visit['os']); ?>
                                    </span>
                                </td>
                                <td>
                                    <span class="device-badge <?php echo str_replace(' ', '-', strtolower($visit['device_type'])); ?>">
                                        <?php echo htmlspecialchars($visit['device_type']); ?>
                                    </span>
                                </td>
                                <td>
                                    <time datetime="<?php echo $visit['visit_timestamp']; ?>">
                                        <?php echo date('Y-m-d H:i:s', strtotime($visit['visit_timestamp'])); ?>
                                    </time>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>

                <!-- ترقيم الصفحات -->
                <?php if($total_pages > 1): ?>
                <div class="pagination">
                    <?php if($page > 1): ?>
                        <a href="?page=<?php echo $page-1; ?>" class="pagination-btn">السابق</a>
                    <?php endif; ?>
                    
                    <?php for($i = max(1, $page-2); $i <= min($total_pages, $page+2); $i++): ?>
                        <a href="?page=<?php echo $i; ?>" 
                           class="pagination-btn <?php echo $i == $page ? 'active' : ''; ?>">
                            <?php echo $i; ?>
                        </a>
                    <?php endfor; ?>
                    
                    <?php if($page < $total_pages): ?>
                        <a href="?page=<?php echo $page+1; ?>" class="pagination-btn">التالي</a>
                    <?php endif; ?>
                </div>
                <?php endif; ?>
            </div>
        </main>
    </div>

    <script src="assets/js/admin.js"></script>
</body>
</html>
