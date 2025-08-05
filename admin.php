<?php
session_start();

// التحقق من تسجيل الدخول
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}

// تضمين ملف الإعدادات
require_once 'config.php';

// إعدادات الصفحة والبحث
$page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$limit = 20;
$offset = ($page - 1) * $limit;

// معايير البحث
$card_number = isset($_GET['card_number']) ? trim($_GET['card_number']) : '';
$customer_name = isset($_GET['customer_name']) ? trim($_GET['customer_name']) : '';
$phone_number = isset($_GET['phone_number']) ? trim($_GET['phone_number']) : '';

$hasSearch = !empty($card_number) || !empty($customer_name) || !empty($phone_number);

$customers = [];
$total_customers = 0;
$total_pages = 0;
$stats = [];

try {
    $pdo = getDBConnection();
    
    // بناء استعلام البحث
    $whereConditions = [];
    $params = [];
    
    if (!empty($card_number)) {
        $whereConditions[] = "card_number LIKE ?";
        $params[] = "%" . $card_number . "%";
    }
    
    if (!empty($customer_name)) {
        $whereConditions[] = "customer_name LIKE ?";
        $params[] = "%" . $customer_name . "%";
    }
    
    if (!empty($phone_number)) {
        $whereConditions[] = "phone_number LIKE ?";
        $params[] = "%" . $phone_number . "%";
    }
    
    $whereClause = '';
    if (!empty($whereConditions)) {
        $whereClause = " WHERE " . implode(" AND ", $whereConditions);
    }
    
    // العدد الكلي للعملاء (للـ pagination)
    $countSql = "SELECT COUNT(*) as total FROM customers" . $whereClause;
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($params);
    $total_customers = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // حساب عدد الصفحات
    $total_pages = ceil($total_customers / $limit);
    
    // جلب العملاء للصفحة الحالية
    $sql = "SELECT * FROM customers" . $whereClause . " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // إحصائيات عامة
    if (!$hasSearch) {
        $stats['total'] = $total_customers;
        
        $statsQueries = [
            'today' => "SELECT COUNT(*) as count FROM customers WHERE DATE(created_at) = CURDATE()",
            'week' => "SELECT COUNT(*) as count FROM customers WHERE WEEK(created_at) = WEEK(NOW()) AND YEAR(created_at) = YEAR(NOW())",
            'month' => "SELECT COUNT(*) as count FROM customers WHERE MONTH(created_at) = MONTH(NOW()) AND YEAR(created_at) = YEAR(NOW())"
        ];
        
        foreach ($statsQueries as $key => $query) {
            $result = $pdo->query($query)->fetch(PDO::FETCH_ASSOC);
            $stats[$key] = $result['count'];
        }
    }
    
} catch(PDOException $e) {
    $error_message = "خطأ في قاعدة البيانات: " . $e->getMessage();
}

// دالة بناء رابط الصفحة مع الحفاظ على معايير البحث
function buildPageUrl($page) {
    $params = $_GET;
    $params['page'] = $page;
    return '?' . http_build_query($params);
}
?>

<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إدارة العملاء - نظام إدارة الكروت</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/admin.css">
</head>
<body>
    <div class="admin-layout">
        <?php include 'includes/sidebar.php'; ?>

        <main class="main-content">
            <div class="content-header">
                <h1>👥 إدارة العملاء</h1>
                <div class="user-info">
                    <span>مرحباً <?php echo $_SESSION['admin_username']; ?></span>
                </div>
            </div>

            <?php if (isset($error_message)): ?>
                <div class="error-message">
                    <?php echo $error_message; ?>
                </div>
            <?php endif; ?>

            <!-- إحصائيات سريعة (عند عدم وجود بحث) -->
            <?php if (!$hasSearch && !empty($stats)): ?>
            <div class="stats-grid">
                <div class="stat-card primary">
                    <div class="stat-icon">👥</div>
                    <div class="stat-content">
                        <h3><?php echo number_format($stats['total']); ?></h3>
                        <p>إجمالي العملاء</p>
                    </div>
                </div>
                
                <div class="stat-card success">
                    <div class="stat-icon">📅</div>
                    <div class="stat-content">
                        <h3><?php echo number_format($stats['today']); ?></h3>
                        <p>تسجيلات اليوم</p>
                    </div>
                </div>
                
                <div class="stat-card warning">
                    <div class="stat-icon">📊</div>
                    <div class="stat-content">
                        <h3><?php echo number_format($stats['week']); ?></h3>
                        <p>تسجيلات الأسبوع</p>
                    </div>
                </div>
                
                <div class="stat-card info">
                    <div class="stat-icon">�</div>
                    <div class="stat-content">
                        <h3><?php echo number_format($stats['month']); ?></h3>
                        <p>تسجيلات الشهر</p>
                    </div>
                </div>
            </div>
            <?php endif; ?>
            
            <!-- نموذج البحث -->
            <div class="table-container">
                <h3>🔍 البحث في بيانات العملاء</h3>
                <div style="padding: 1.5rem;">
                    <form method="GET" action="" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: end;">
                        <div class="form-group" style="margin: 0;">
                            <label for="card_number">رقم الكارت:</label>
                            <input type="text" id="card_number" name="card_number" 
                                   value="<?php echo htmlspecialchars($card_number); ?>"
                                   placeholder="ادخل رقم الكارت">
                        </div>
                        
                        <div class="form-group" style="margin: 0;">
                            <label for="customer_name">اسم العميل:</label>
                            <input type="text" id="customer_name" name="customer_name" 
                                   value="<?php echo htmlspecialchars($customer_name); ?>"
                                   placeholder="ادخل اسم العميل">
                        </div>
                        
                        <div class="form-group" style="margin: 0;">
                            <label for="phone_number">رقم الهاتف:</label>
                            <input type="text" id="phone_number" name="phone_number" 
                                   value="<?php echo htmlspecialchars($phone_number); ?>"
                                   placeholder="ادخل رقم الهاتف">
                        </div>
                        
                        <div style="display: flex; gap: 0.5rem;">
                            <button type="submit" class="btn btn-primary">🔍 بحث</button>
                            <a href="admin.php" class="btn btn-secondary">🔄 مسح</a>
                        </div>
                    </form>
                </div>
            </div>

            <!-- عرض النتائج -->
            <div class="table-container">
                <?php if ($hasSearch): ?>
                    <h3>نتائج البحث (<?php echo number_format($total_customers); ?> عميل)</h3>
                <?php else: ?>
                    <h3>جميع العملاء (<?php echo number_format($total_customers); ?> عميل)</h3>
                <?php endif; ?>
                
                <?php if (!empty($customers)): ?>
                    <div class="table-responsive">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>رقم الكارت</th>
                                    <th>اسم العميل</th>
                                    <th>رقم الهاتف</th>
                                    <th>تاريخ التسجيل</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($customers as $customer): ?>
                                <tr>
                                    <td>
                                        <code style="background: var(--primary-color); color: white; padding: 0.25rem 0.5rem; border-radius: 4px;">
                                            <?php echo htmlspecialchars($customer['card_number']); ?>
                                        </code>
                                    </td>
                                    <td>
                                        <strong><?php echo htmlspecialchars($customer['customer_name']); ?></strong>
                                    </td>
                                    <td>
                                        <span style="direction: ltr; display: inline-block;">
                                            <?php echo htmlspecialchars($customer['phone_number']); ?>
                                        </span>
                                    </td>
                                    <td>
                                        <time datetime="<?php echo $customer['created_at']; ?>">
                                            <?php echo date('Y-m-d H:i:s', strtotime($customer['created_at'])); ?>
                                        </time>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>

                    <!-- أدوات التصدير والطباعة -->
                    <div style="text-align: center; padding: 1rem; border-top: 1px solid var(--border-color);">
                        <button onclick="window.print()" class="btn btn-primary">🖨️ طباعة النتائج</button>
                        <a href="import_export.php" class="btn btn-secondary">📁 تصدير إلى Excel</a>
                    </div>

                    <!-- ترقيم الصفحات -->
                    <?php if ($total_pages > 1): ?>
                    <div class="pagination">
                        <?php if ($page > 1): ?>
                            <a href="<?php echo buildPageUrl(1); ?>" class="pagination-btn">الأولى</a>
                            <a href="<?php echo buildPageUrl($page - 1); ?>" class="pagination-btn">السابق</a>
                        <?php endif; ?>
                        
                        <?php
                        $start = max(1, $page - 2);
                        $end = min($total_pages, $page + 2);
                        ?>
                        
                        <?php for ($i = $start; $i <= $end; $i++): ?>
                            <a href="<?php echo buildPageUrl($i); ?>" 
                               class="pagination-btn <?php echo $i == $page ? 'active' : ''; ?>">
                                <?php echo $i; ?>
                            </a>
                        <?php endfor; ?>
                        
                        <?php if ($page < $total_pages): ?>
                            <a href="<?php echo buildPageUrl($page + 1); ?>" class="pagination-btn">التالي</a>
                            <a href="<?php echo buildPageUrl($total_pages); ?>" class="pagination-btn">الأخيرة</a>
                        <?php endif; ?>
                    </div>
                    
                    <div style="text-align: center; margin-top: 1rem; color: var(--text-color); font-size: 0.9rem;">
                        عرض <?php echo number_format($offset + 1); ?> - <?php echo number_format(min($offset + $limit, $total_customers)); ?> 
                        من <?php echo number_format($total_customers); ?> عميل
                        (الصفحة <?php echo $page; ?> من <?php echo $total_pages; ?>)
                    </div>
                    <?php endif; ?>
                    
                <?php else: ?>
                    <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">
                            <?php echo $hasSearch ? '�' : '�📋'; ?>
                        </div>
                        <h3>
                            <?php echo $hasSearch ? 'لا توجد نتائج مطابقة لبحثك' : 'لا توجد عملاء مسجلين بعد'; ?>
                        </h3>
                        <p>
                            <?php if ($hasSearch): ?>
                                جرب تعديل معايير البحث أو مسح الحقول للعرض الكامل
                            <?php else: ?>
                                سيظهر العملاء هنا عند تسجيلهم في النظام
                            <?php endif; ?>
                        </p>
                    </div>
                <?php endif; ?>
            </div>
        </main>
    </div>
    
    <script src="assets/js/admin.js"></script>
</body>
</html>
