<?php
// التأكد من أن المستخدم مسجل دخول
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    return;
}

// تحديد الصفحة النشطة
$current_page = basename($_SERVER['PHP_SELF']);
?>

<button class="mobile-menu-btn" onclick="toggleSidebar()">☰</button>

<aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
        <h3>🎫 نظام الكروت</h3>
    </div>
    <nav class="sidebar-nav">
        <a href="admin.php" class="nav-item <?php echo $current_page == 'admin.php' ? 'active' : ''; ?>">
            <span class="nav-icon">👥</span>
            <span class="nav-text">إدارة العملاء</span>
        </a>
        <a href="manage_cards.php" class="nav-item <?php echo $current_page == 'manage_cards.php' ? 'active' : ''; ?>">
            <span class="nav-icon">🎫</span>
            <span class="nav-text">إدارة الكروت</span>
        </a>
        <a href="card_generator.php" class="nav-item <?php echo $current_page == 'card_generator.php' ? 'active' : ''; ?>">
            <span class="nav-icon">🎲</span>
            <span class="nav-text">مولد الكروت</span>
        </a>
        <a href="lottery.php" class="nav-item <?php echo $current_page == 'lottery.php' ? 'active' : ''; ?>">
            <span class="nav-icon">🎯</span>
            <span class="nav-text">نظام السحب</span>
        </a>
        <a href="lottery_history.php" class="nav-item <?php echo $current_page == 'lottery_history.php' ? 'active' : ''; ?>">
            <span class="nav-icon">📊</span>
            <span class="nav-text">سجل السحوبات</span>
        </a>
        <a href="import_export.php" class="nav-item <?php echo $current_page == 'import_export.php' ? 'active' : ''; ?>">
            <span class="nav-icon">📁</span>
            <span class="nav-text">استيراد/تصدير</span>
        </a>
        <a href="visit_logs.php" class="nav-item <?php echo $current_page == 'visit_logs.php' ? 'active' : ''; ?>">
            <span class="nav-icon">📈</span>
            <span class="nav-text">سجل الزيارات</span>
        </a>
        <a href="logout.php" class="nav-item logout">
            <span class="nav-icon">🚪</span>
            <span class="nav-text">تسجيل خروج</span>
        </a>
    </nav>
</aside>
