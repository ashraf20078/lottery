<?php
session_start();

// التحقق من تسجيل الدخول
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}

// تضمين ملف الإعدادات
require_once 'config.php';

// جلب سجل السحوبات
try {
    $pdo = getDBConnection();
    
    // جلب سجل السحوبات مع بيانات الفائزين (تم إزالة card_type)
    $stmt = $pdo->prepare("
        SELECT ld.*, c.card_number, c.customer_name, c.phone_number
        FROM lottery_draws ld 
        JOIN customers c ON ld.winner_customer_id = c.id 
        ORDER BY ld.draw_timestamp DESC 
        LIMIT 100
    ");
    $stmt->execute();
    $draws = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // إحصائيات السحوبات
    $stmt = $pdo->prepare("SELECT COUNT(*) as total_draws, SUM(total_participants) as total_participants FROM lottery_draws");
    $stmt->execute();
    $stats = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // إحصائيات أخرى
    $stmt = $pdo->prepare("SELECT COUNT(*) as draws_this_month FROM lottery_draws WHERE MONTH(draw_timestamp) = MONTH(NOW()) AND YEAR(draw_timestamp) = YEAR(NOW())");
    $stmt->execute();
    $monthly_stats = $stmt->fetch(PDO::FETCH_ASSOC);
    
} catch(Exception $e) {
    $draws = [];
    $stats = ['total_draws' => 0, 'total_participants' => 0];
    $monthly_stats = ['draws_this_month' => 0];
}
?>

<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>سجل السحوبات</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/admin.css">
    <link rel="stylesheet" href="assets/css/lottery-history.css">
</head>
<body>
    <div class="admin-layout">
        <?php include 'includes/sidebar.php'; ?>

        <main class="main-content">
            <div class="content-header">
                <h1>📊 سجل السحوبات</h1>
                <div class="user-info">
                    <span>مرحباً <?php echo $_SESSION['admin_username']; ?></span>
                </div>
            </div>
        
            <!-- إحصائيات عامة -->
            <div class="stats-grid">
                <div class="stat-card primary">
                    <div class="stat-icon">🎯</div>
                    <div class="stat-content">
                        <h3><?php echo $stats['total_draws']; ?></h3>
                        <p>إجمالي السحوبات</p>
                    </div>
                </div>
                
                <div class="stat-card success">
                    <div class="stat-icon">👥</div>
                    <div class="stat-content">
                        <h3><?php echo $stats['total_participants']; ?></h3>
                        <p>إجمالي المشاركات</p>
                    </div>
                </div>
                
                <div class="stat-card warning">
                    <div class="stat-icon">📅</div>
                    <div class="stat-content">
                        <h3><?php echo $monthly_stats['draws_this_month']; ?></h3>
                        <p>سحوبات هذا الشهر</p>
                    </div>
                </div>
                
                <div class="stat-card info">
                    <div class="stat-icon">📊</div>
                    <div class="stat-content">
                        <h3><?php echo count($draws) > 0 ? round($stats['total_participants'] / $stats['total_draws'], 1) : 0; ?></h3>
                        <p>متوسط المشاركين</p>
                    </div>
                </div>
            </div>
            
            <div class="new-draw-section">
                <h3>🎯 هل تريد إجراء سحب جديد؟</h3>
                <p>ابدأ سحباً جديداً واختر الفائز من بين المشاركين</p>
                <a href="lottery.php" class="btn btn-primary">🎰 سحب جديد</a>
            </div>
            
            <!-- سجل السحوبات -->
            <?php if (count($draws) > 0): ?>
                <div class="table-container">
                    <h3 class="section-title">
                        📋 تاريخ السحوبات (<?php echo count($draws); ?> سحب)
                    </h3>
                    
                    <div class="timeline">
                        <?php foreach ($draws as $draw): ?>
                            <div class="timeline-item">
                                <div class="draw-header">
                                    <div class="draw-title">
                                        <h4 style="color: var(--primary-color); margin: 0; font-size: 1.1rem;">
                                            🏆 سحب رقم #<?php echo $draw['id']; ?>
                                        </h4>
                                        <p style="color: var(--text-muted); margin: 0.25rem 0 0 0; font-size: 0.9rem;">
                                            📅 <?php echo date('d/m/Y - H:i', strtotime($draw['draw_timestamp'])); ?>
                                        </p>
                                    </div>
                                    <span class="admin-badge">
                                        👤 <?php echo htmlspecialchars($draw['admin_username']); ?>
                                    </span>
                                </div>
                                
                                <div class="winner-badge">
                                    🎉 الفائز: <?php echo htmlspecialchars($draw['customer_name']); ?>
                                </div>
                                
                                <div class="draw-meta">
                                    <div class="meta-item">
                                        <div class="meta-value">💳 <?php echo htmlspecialchars($draw['card_number']); ?></div>
                                        <div class="meta-label">رقم الكارت</div>
                                    </div>
                                    
                                    <div class="meta-item">
                                        <div class="meta-value">📱 <?php echo htmlspecialchars($draw['phone_number']); ?></div>
                                        <div class="meta-label">رقم الهاتف</div>
                                    </div>
                                    
                                    <div class="meta-item">
                                        <div class="meta-value">👥 <?php echo $draw['total_participants']; ?></div>
                                        <div class="meta-label">عدد المشاركين</div>
                                    </div>
                                    
                                    <div class="meta-item">
                                        <div class="meta-value">
                                            <span class="period-badge">
                                                <?php echo $draw['draw_date_from']; ?> → <?php echo $draw['draw_date_to']; ?>
                                            </span>
                                        </div>
                                        <div class="meta-label">فترة السحب</div>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php else: ?>
                <div class="empty-state">
                    <div class="empty-state-icon">🎰</div>
                    <h3>لا توجد سحوبات مسجلة</h3>
                    <p>لم يتم إجراء أي سحوبات حتى الآن</p>
                    <a href="lottery.php" class="btn btn-primary">🎯 ابدأ أول سحب</a>
                </div>
            <?php endif; ?>
        </main>
    </div>
    
    <script src="assets/js/admin.js"></script>
    <script src="assets/js/lottery-history.js"></script>
</body>
</html>