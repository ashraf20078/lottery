<?php
session_start();

// التحقق من تسجيل الدخول
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}

// تضمين ملف الإعدادات
require_once 'config.php';

$message = '';
$generated_cards = [];

// معالجة طلب توليد الكروت
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['generate_cards'])) {
    $start_number = intval($_POST['start_number']);
    $end_number = intval($_POST['end_number']);
    $count = intval($_POST['count']);
    
    // التحقق من صحة البيانات
    if ($start_number >= $end_number) {
        $message = 'رقم البداية يجب أن يكون أصغر من رقم النهاية';
    } elseif ($count <= 0 || $count > 1000) {
        $message = 'عدد الكروت يجب أن يكون بين 1 و 1000';
    } elseif (($end_number - $start_number + 1) < $count) {
        $message = 'النطاق المحدد لا يكفي لتوليد العدد المطلوب من الكروت';
    } else {
        try {
            $pdo = getDBConnection();
            
            // جلب أرقام الكروت الموجودة مسبقاً
            $stmt = $pdo->prepare("SELECT card_number FROM allowed_cards");
            $stmt->execute();
            $existing_cards = array_column($stmt->fetchAll(PDO::FETCH_ASSOC), 'card_number');
            
            // توليد أرقام عشوائية فريدة
            $available_numbers = range($start_number, $end_number);
            $generated_numbers = [];
            $attempts = 0;
            $max_attempts = $count * 10; // لتجنب اللوب اللانهائي
            
            while (count($generated_numbers) < $count && $attempts < $max_attempts) {
                $random_number = $available_numbers[array_rand($available_numbers)];
                $card_number = (string)$random_number;
                
                // التحقق من عدم وجود الكارت مسبقاً
                if (!in_array($card_number, $existing_cards) && !in_array($card_number, $generated_numbers)) {
                    $generated_numbers[] = $card_number;
                }
                $attempts++;
            }
            
            if (count($generated_numbers) < $count) {
                $message = 'تم توليد ' . count($generated_numbers) . ' كارت فقط من أصل ' . $count . ' بسبب التكرار';
            }
            
            // إدراج الكروت في قاعدة البيانات
            if (!empty($generated_numbers)) {
                $pdo->beginTransaction();
                $inserted = 0;
                
                $stmt = $pdo->prepare("INSERT INTO allowed_cards (card_number, created_at) VALUES (?, NOW())");
                
                foreach ($generated_numbers as $card_number) {
                    if ($stmt->execute([$card_number])) {
                        $generated_cards[] = [
                            'card_number' => $card_number
                        ];
                        $inserted++;
                    }
                }
                
                $pdo->commit();
                
                if ($inserted > 0) {
                    $message = "تم توليد وإدراج $inserted كارت بنجاح!";
                    // حفظ الكروت المولدة في الجلسة للتصدير
                    $_SESSION['generated_cards'] = $generated_cards;
                } else {
                    $message = 'فشل في إدراج الكروت';
                }
            }
            
        } catch(Exception $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollback();
            }
            $message = 'خطأ في توليد الكروت: ' . $e->getMessage();
        }
    }
}

// تصدير الكروت المولدة
if (isset($_GET['export_generated']) && isset($_SESSION['generated_cards'])) {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=generated_cards_' . date('Y-m-d_H-i-s') . '.csv');
    
    $output = fopen('php://output', 'w');
    fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
    
    fputcsv($output, array('رقم الكارت', 'تاريخ التوليد'));
    
    foreach ($_SESSION['generated_cards'] as $card) {
        fputcsv($output, array(
            $card['card_number'],
            date('Y-m-d H:i:s')
        ));
    }
    
    fclose($output);
    unset($_SESSION['generated_cards']);
    exit;
}

// إحصائيات
try {
    $pdo = getDBConnection();
    $stmt = $pdo->prepare("SELECT COUNT(*) as total_cards FROM allowed_cards WHERE is_active = 1");
    $stmt->execute();
    $active_cards = $stmt->fetch(PDO::FETCH_ASSOC)['total_cards'];
    
    $stmt = $pdo->prepare("SELECT COUNT(*) as total_cards FROM allowed_cards");
    $stmt->execute();
    $total_cards = $stmt->fetch(PDO::FETCH_ASSOC)['total_cards'];
} catch(Exception $e) {
    $stats = [];
    $total_cards = 0;
}
?>

<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>مولد أرقام الكروت العشوائية</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/admin.css">
    <style>
        .generator-form {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            border-radius: var(--border-radius);
            margin-bottom: 2rem;
            box-shadow: var(--shadow-hover);
        }
        
        .generator-form h2 {
            color: white;
            margin-top: 0;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .stat-card {
            background: white;
            padding: 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            text-align: center;
            border-left: 4px solid var(--secondary-color);
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: var(--primary-color);
        }
        
        .stat-label {
            color: var(--text-color);
            margin-top: 0.5rem;
        }
        
        .generated-cards {
            max-height: 400px;
            overflow-y: auto;
            background: white;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
        }
        
        .card-item {
            padding: 0.75rem 1rem;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .card-item:last-child {
            border-bottom: none;
        }
        
        .card-number {
            font-weight: bold;
            color: var(--primary-color);
        }
    </style>
</head>
<body>
    <div class="admin-layout">
        <?php include 'includes/sidebar.php'; ?>

        <main class="main-content">
            <div class="content-header">
                <h1>🎲 مولد أرقام الكروت العشوائية</h1>
                <div class="user-info">
                    <span>مرحباً <?php echo $_SESSION['admin_username']; ?></span>
                </div>
            </div>
        
        <!-- إحصائيات -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number"><?php echo $total_cards; ?></div>
                <div class="stat-label">إجمالي الكروت</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $active_cards; ?></div>
                <div class="stat-label">الكروت النشطة</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $total_cards - $active_cards; ?></div>
                <div class="stat-label">الكروت المعطلة</div>
            </div>
        </div>
        
        <?php if ($message): ?>
            <div class="<?php echo strpos($message, 'بنجاح') !== false ? 'success-message' : 'error-message'; ?>">
                <?php echo $message; ?>
            </div>
        <?php endif; ?>
        
        <!-- نموذج التوليد -->
        <div class="generator-form">
            <h2>⚙️ إعدادات توليد الكروت</h2>
            <form method="POST">
                <div class="form-row">
                    <div class="form-group">
                        <label for="start_number">رقم البداية:</label>
                        <input type="number" id="start_number" name="start_number" 
                               value="<?php echo isset($_POST['start_number']) ? $_POST['start_number'] : '1000'; ?>" 
                               min="1" max="999999" required style="color: #333;">
                    </div>
                    
                    <div class="form-group">
                        <label for="end_number">رقم النهاية:</label>
                        <input type="number" id="end_number" name="end_number" 
                               value="<?php echo isset($_POST['end_number']) ? $_POST['end_number'] : '9999'; ?>" 
                               min="2" max="999999" required style="color: #333;">
                    </div>
                
                    <div class="form-group">
                        <label for="count">عدد الكروت المطلوب:</label>
                        <input type="number" id="count" name="count" 
                               value="<?php echo isset($_POST['count']) ? $_POST['count'] : '100'; ?>" 
                               min="1" max="1000" required style="color: #333;">
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 1.5rem;">
                    <input type="submit" name="generate_cards" value="🎲 توليد الكروت" 
                           style="background: white; color: var(--primary-color); padding: 0.75rem 2rem; font-weight: bold;">
                </div>
            </form>
        </div>
        
        <!-- عرض الكروت المولدة -->
        <?php if (!empty($generated_cards)): ?>
            <div class="section">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h2 style="color: var(--success-color); margin: 0;">🎯 الكروت المولدة (<?php echo count($generated_cards); ?> كارت)</h2>
                    <a href="?export_generated=1" class="btn btn-primary">📥 تصدير إلى Excel</a>
                </div>
                
                <div class="generated-cards">
                    <?php foreach ($generated_cards as $card): ?>
                        <div class="card-item">
                            <div>
                                <span class="card-number"><?php echo $card['card_number']; ?></span>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php endif; ?>
        </main>
    </div>

    </div>

    <script src="assets/js/admin.js"></script>
    <script src="assets/js/card-generator.js"></script>
</body>
</html>
