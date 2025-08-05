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
$winners = [];
$participants = [];
$total_winners = 0;

// معالجة طلب السحب المتعدد
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['draw_winners'])) {
    $date_from = $_POST['date_from'];
    $date_to = $_POST['date_to'];
    $winners_count = intval($_POST['winners_count']);
    
    if (empty($date_from) || empty($date_to)) {
        $message = 'يرجى تحديد فترة التاريخ';
    } elseif ($date_from > $date_to) {
        $message = 'تاريخ البداية يجب أن يكون قبل تاريخ النهاية';
    } elseif ($winners_count < 1 || $winners_count > 50) {
        $message = 'عدد الفائزين يجب أن يكون بين 1 و 50';
    } else {
        try {
            $pdo = getDBConnection();
            
            // جلب العملاء المسجلين في الفترة المحددة
            $stmt = $pdo->prepare("
                SELECT c.*, ac.is_active 
                FROM customers c 
                LEFT JOIN allowed_cards ac ON c.card_number = ac.card_number 
                WHERE DATE(c.created_at) BETWEEN ? AND ? 
                ORDER BY c.created_at ASC
            ");
            $stmt->execute([$date_from, $date_to]);
            $participants = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if (empty($participants)) {
                $message = 'لا توجد عملاء مسجلين في الفترة المحددة';
            } elseif (count($participants) < $winners_count) {
                $message = 'عدد المشاركين (' . count($participants) . ') أقل من عدد الفائزين المطلوب (' . $winners_count . ')';
            } else {
                // خلط المشاركين واختيار الفائزين
                shuffle($participants);
                $winners = array_slice($participants, 0, $winners_count);
                $total_winners = count($winners);
                
                // حفظ نتائج السحب في قاعدة البيانات
                try {
                    foreach ($winners as $index => $winner) {
                        $stmt = $pdo->prepare("
                            INSERT INTO lottery_draws 
                            (winner_customer_id, draw_date_from, draw_date_to, total_participants, admin_username, draw_timestamp, winner_position) 
                            VALUES (?, ?, ?, ?, ?, NOW(), ?)
                        ");
                        $stmt->execute([
                            $winner['id'], 
                            $date_from, 
                            $date_to, 
                            count($participants), 
                            $_SESSION['admin_username'],
                            $index + 1
                        ]);
                    }
                } catch(Exception $e) {
                    error_log("خطأ في حفظ نتائج السحب: " . $e->getMessage());
                }
                
                $message = 'تم اختيار ' . $total_winners . ' فائز بنجاح! من بين ' . count($participants) . ' مشارك';
            }
            
        } catch(Exception $e) {
            $message = 'خطأ في السحب: ' . $e->getMessage();
        }
    }
}

// جلب إحصائيات
try {
    $pdo = getDBConnection();
    
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM customers");
    $stmt->execute();
    $total_customers = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    $stmt = $pdo->prepare("SELECT COUNT(*) as today FROM customers WHERE DATE(created_at) = CURDATE()");
    $stmt->execute();
    $today_customers = $stmt->fetch(PDO::FETCH_ASSOC)['today'];
    
    $stmt = $pdo->prepare("SELECT COUNT(*) as week FROM customers WHERE WEEK(created_at) = WEEK(NOW()) AND YEAR(created_at) = YEAR(NOW())");
    $stmt->execute();
    $week_customers = $stmt->fetch(PDO::FETCH_ASSOC)['week'];
    
} catch(Exception $e) {
    $total_customers = $today_customers = $week_customers = 0;
}
?>

<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نظام السحب المتقدم - اختيار فائزين متعددين</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/admin.css">
    <style>
        :root {
            --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --gradient-success: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            --gradient-winner: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
            --gradient-gold: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
            --gradient-silver: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
            --gradient-bronze: linear-gradient(135deg, #cd7f32 0%, #deb887 100%);
        }

        .lottery-header {
            background: var(--gradient-primary);
            color: white;
            padding: 3rem 2rem;
            border-radius: 20px;
            margin-bottom: 2rem;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            position: relative;
            overflow: hidden;
        }

        .lottery-header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: rotate 20s linear infinite;
        }

        @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .lottery-header h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            position: relative;
            z-index: 1;
        }

        .lottery-config {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }

        .config-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .form-group-enhanced {
            position: relative;
        }

        .form-group-enhanced label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: bold;
            color: var(--primary-color);
        }

        .form-group-enhanced input, 
        .form-group-enhanced select {
            width: 100%;
            padding: 1rem;
            border: 2px solid #e1e5e9;
            border-radius: 10px;
            font-size: 1rem;
            transition: all 0.3s ease;
            background: #f8f9fa;
        }

        .form-group-enhanced input:focus,
        .form-group-enhanced select:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            background: white;
            outline: none;
        }

        .winners-selector {
            background: var(--gradient-success);
            color: white;
            padding: 1.5rem;
            border-radius: 15px;
            text-align: center;
        }

        .winners-count-display {
            font-size: 3rem;
            font-weight: bold;
            margin: 1rem 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .mega-draw-button {
            background: var(--gradient-winner);
            color: white;
            border: none;
            padding: 1.5rem 3rem;
            font-size: 1.3rem;
            font-weight: bold;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .mega-draw-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            transition: left 0.5s ease;
        }

        .mega-draw-button:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .mega-draw-button:hover::before {
            left: 100%;
        }

        .mega-draw-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .lottery-machine {
            background: white;
            padding: 2rem;
            border-radius: 20px;
            margin: 2rem 0;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            text-align: center;
            display: none;
        }

        .machine-display {
            background: #1a1a1a;
            color: #00ff00;
            padding: 2rem;
            border-radius: 15px;
            margin: 1rem 0;
            font-family: 'Courier New', monospace;
            font-size: 1.5rem;
            min-height: 150px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            border: 3px solid #333;
        }

        .machine-display::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: #00ff00;
            animation: scan 2s linear infinite;
        }

        @keyframes scan {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }

        .winners-showcase {
            margin: 3rem 0;
        }

        .winners-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }

        .winner-card {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .winner-card:nth-child(1) {
            background: var(--gradient-gold);
            color: white;
            transform: scale(1.05);
        }

        .winner-card:nth-child(2) {
            background: var(--gradient-silver);
            color: #333;
        }

        .winner-card:nth-child(3) {
            background: var(--gradient-bronze);
            color: white;
        }

        .winner-card:hover {
            transform: translateY(-10px) scale(1.02);
            box-shadow: 0 25px 50px rgba(0,0,0,0.2);
        }

        .winner-position {
            position: absolute;
            top: -10px;
            right: -10px;
            width: 60px;
            height: 60px;
            background: #ff6b6b;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 1.2rem;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        .winner-card:nth-child(1) .winner-position {
            background: #ffd700;
            animation: pulse-gold 2s infinite;
        }

        .winner-card:nth-child(2) .winner-position {
            background: #c0c0c0;
            animation: pulse-silver 2s infinite;
        }

        .winner-card:nth-child(3) .winner-position {
            background: #cd7f32;
            animation: pulse-bronze 2s infinite;
        }

        @keyframes pulse-gold {
            0%, 100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7); }
            50% { box-shadow: 0 0 0 10px rgba(255, 215, 0, 0); }
        }

        @keyframes pulse-silver {
            0%, 100% { box-shadow: 0 0 0 0 rgba(192, 192, 192, 0.7); }
            50% { box-shadow: 0 0 0 10px rgba(192, 192, 192, 0); }
        }

        @keyframes pulse-bronze {
            0%, 100% { box-shadow: 0 0 0 0 rgba(205, 127, 50, 0.7); }
            50% { box-shadow: 0 0 0 10px rgba(205, 127, 50, 0); }
        }

        .winner-info h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            text-align: center;
        }

        .winner-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-top: 1rem;
        }

        .winner-detail {
            text-align: center;
            padding: 0.5rem;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
        }

        .print-section {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            margin: 2rem 0;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .print-buttons {
            display: flex;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .print-btn {
            background: var(--gradient-primary);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: bold;
        }

        .print-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        .stats-overview {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .stat-card {
            background: white;
            padding: 1.5rem;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            border-left: 4px solid var(--primary-color);
        }

        .stat-number {
            font-size: 2.5rem;
            font-weight: bold;
            color: var(--primary-color);
        }

        .participants-preview {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            margin: 2rem 0;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .participants-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
            max-height: 400px;
            overflow-y: auto;
        }

        .participant-card {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 10px;
            border-left: 3px solid var(--secondary-color);
            transition: all 0.3s ease;
        }

        .participant-card:hover {
            background: #e9ecef;
            transform: translateX(5px);
        }

        @media print {
            .no-print { display: none !important; }
            .winner-card { break-inside: avoid; margin-bottom: 2rem; }
            .winners-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
            .lottery-header h1 { font-size: 2rem; }
            .config-grid { grid-template-columns: 1fr; }
            .winners-grid { grid-template-columns: 1fr; }
            .winner-details { grid-template-columns: 1fr; }
            .print-buttons { flex-direction: column; align-items: center; }
        }

        .celebration {
            animation: celebration 3s ease-in-out;
        }

        @keyframes celebration {
            0%, 100% { transform: scale(1); }
            25% { transform: scale(1.1) rotate(5deg); }
            75% { transform: scale(1.1) rotate(-5deg); }
        }
    </style>
</head>
<body>
    <div class="admin-layout">
        <?php include 'includes/sidebar.php'; ?>

        <main class="main-content">
            <!-- رأس النظام -->
            <div class="lottery-header">
                <h1>🎰 نظام السحب المتقدم</h1>
                <p style="font-size: 1.2rem; opacity: 0.9;">اختيار فائزين متعددين بتقنية متطورة</p>
                <div style="margin-top: 1rem;">
                    <span>المدير: <?php echo $_SESSION['admin_username']; ?></span>
                    <span style="margin: 0 1rem;">|</span>
                    <span><?php echo date('Y-m-d H:i:s'); ?></span>
                </div>
            </div>

            <!-- الإحصائيات -->
            <div class="stats-overview no-print">
                <div class="stat-card">
                    <div class="stat-number"><?php echo $total_customers; ?></div>
                    <div>إجمالي العملاء</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number"><?php echo $today_customers; ?></div>
                    <div>تسجيلات اليوم</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number"><?php echo $week_customers; ?></div>
                    <div>تسجيلات الأسبوع</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number"><?php echo $total_winners; ?></div>
                    <div>عدد الفائزين</div>
                </div>
            </div>

            <?php if ($message): ?>
                <div class="<?php echo strpos($message, 'بنجاح') !== false ? 'success-message' : 'error-message'; ?> no-print">
                    <?php echo $message; ?>
                </div>
            <?php endif; ?>

            <!-- إعدادات السحب -->
            <div class="lottery-config no-print">
                <h2 style="text-align: center; margin-bottom: 2rem; color: var(--primary-color);">⚙️ إعدادات السحب المتقدم</h2>
                <form method="POST" id="multiLotteryForm">
                    <div class="config-grid">
                        <div class="form-group-enhanced">
                            <label for="date_from">📅 من تاريخ:</label>
                            <input type="date" id="date_from" name="date_from" 
                                   value="<?php echo isset($_POST['date_from']) ? $_POST['date_from'] : date('Y-m-01'); ?>" 
                                   required>
                        </div>
                        
                        <div class="form-group-enhanced">
                            <label for="date_to">📅 إلى تاريخ:</label>
                            <input type="date" id="date_to" name="date_to" 
                                   value="<?php echo isset($_POST['date_to']) ? $_POST['date_to'] : date('Y-m-d'); ?>" 
                                   required>
                        </div>
                        
                        <div class="winners-selector">
                            <label for="winners_count" style="color: white;">🏆 عدد الفائزين:</label>
                            <input type="number" id="winners_count" name="winners_count" 
                                   value="<?php echo isset($_POST['winners_count']) ? $_POST['winners_count'] : 3; ?>" 
                                   min="1" max="50" required 
                                   style="background: rgba(255,255,255,0.2); color: white; border: 2px solid rgba(255,255,255,0.3);">
                            <div class="winners-count-display" id="winnersDisplay">3</div>
                            <small style="opacity: 0.8;">الحد الأقصى: 50 فائز</small>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 2rem;">
                        <button type="submit" name="draw_winners" class="mega-draw-button" id="megaDrawButton">
                            🎰 بدء السحب المتقدم
                        </button>
                    </div>
                </form>
            </div>

            <!-- ماكينة السحب -->
            <div class="lottery-machine" id="lotteryMachine">
                <h2>🔥 جاري السحب...</h2>
                <div class="machine-display" id="machineDisplay">
                    تحضير النظام...
                </div>
                <div style="margin-top: 1rem; color: var(--text-color);">
                    <span id="drawProgress"></span>
                </div>
            </div>

            <!-- عرض الفائزين -->
            <?php if (!empty($winners)): ?>
                <div class="winners-showcase celebration">
                    <div style="text-align: center; margin-bottom: 3rem;">
                        <h1 style="font-size: 3rem; background: var(--gradient-winner); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                            🏆 مبروك للفائزين! 🏆
                        </h1>
                        <p style="font-size: 1.3rem; color: var(--text-color);">
                            تم اختيار <?php echo count($winners); ?> فائز من بين <?php echo count($participants); ?> مشارك
                        </p>
                    </div>

                    <div class="winners-grid">
                        <?php foreach ($winners as $index => $winner): ?>
                            <div class="winner-card" style="animation-delay: <?php echo $index * 0.5; ?>s;">
                                <div class="winner-position"><?php echo $index + 1; ?></div>
                                
                                <div class="winner-info">
                                    <?php if ($index === 0): ?>
                                        <h3>🥇 الفائز الأول</h3>
                                    <?php elseif ($index === 1): ?>
                                        <h3>🥈 الفائز الثاني</h3>
                                    <?php elseif ($index === 2): ?>
                                        <h3>🥉 الفائز الثالث</h3>
                                    <?php else: ?>
                                        <h3>🏅 الفائز رقم <?php echo $index + 1; ?></h3>
                                    <?php endif; ?>
                                    
                                    <div style="text-align: center; margin: 1rem 0;">
                                        <div style="font-size: 1.8rem; font-weight: bold; margin-bottom: 0.5rem;">
                                            <?php echo htmlspecialchars($winner['customer_name']); ?>
                                        </div>
                                        <div style="background: rgba(255,255,255,0.2); padding: 0.5rem 1rem; border-radius: 25px; display: inline-block;">
                                            💳 <?php echo htmlspecialchars($winner['card_number']); ?>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="winner-details">
                                    <div class="winner-detail">
                                        <strong>📱 الهاتف</strong><br>
                                        <?php echo htmlspecialchars($winner['phone_number']); ?>
                                    </div>
                                    <div class="winner-detail">
                                        <strong>📅 التسجيل</strong><br>
                                        <?php echo date('Y-m-d', strtotime($winner['created_at'])); ?>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <!-- قسم الطباعة -->
                <div class="print-section no-print">
                    <h2 style="margin-bottom: 2rem;">🖨️ خيارات الطباعة</h2>
                    <div class="print-buttons">
                        <button onclick="printWinners()" class="print-btn">
                            🏆 طباعة قائمة الفائزين
                        </button>
                        <button onclick="printCertificates()" class="print-btn">
                            📜 طباعة شهادات الفوز
                        </button>
                        <button onclick="printFullReport()" class="print-btn">
                            📊 طباعة التقرير الكامل
                        </button>
                        <button onclick="location.reload()" class="print-btn" style="background: var(--gradient-success);">
                            🔄 سحب جديد
                        </button>
                    </div>
                </div>
            <?php endif; ?>

            <!-- معاينة المشاركين -->
            <?php if (!empty($participants) && empty($winners)): ?>
                <div class="participants-preview no-print">
                    <h2>👥 المشاركين في السحب (<?php echo count($participants); ?> مشارك)</h2>
                    <div class="participants-grid">
                        <?php foreach ($participants as $participant): ?>
                            <div class="participant-card">
                                <div style="font-weight: bold; color: var(--primary-color);">
                                    <?php echo htmlspecialchars($participant['card_number']); ?>
                                </div>
                                <div><?php echo htmlspecialchars($participant['customer_name']); ?></div>
                                <div style="font-size: 0.9rem; color: var(--text-color);">
                                    <?php echo htmlspecialchars($participant['phone_number']); ?>
                                </div>
                                <div style="font-size: 0.8rem; color: var(--text-color);">
                                    <?php echo date('Y-m-d', strtotime($participant['created_at'])); ?>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endif; ?>
        </main>
    </div>

    <script>
        // تمرير بيانات المشاركين إلى JavaScript
        window.participants = <?php echo json_encode($participants); ?>;
        window.winners = <?php echo json_encode($winners); ?>;
        
        console.log('System loaded - Participants:', window.participants?.length || 0, 'Winners:', window.winners?.length || 0);
    </script>
    <script src="assets/js/admin.js"></script>
    <script src="assets/js/multi-lottery.js"></script>
</body>
</html>