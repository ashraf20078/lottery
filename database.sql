-- استخدام قاعدة البيانات
-- USE customer_cards;

-- إنشاء جدول العملاء
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_number VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_card_number (card_number),
    INDEX idx_customer_name (customer_name),
    INDEX idx_phone_number (phone_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- إنشاء جدول الكروت المسموح بها
CREATE TABLE IF NOT EXISTS allowed_cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_number VARCHAR(50) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_card_number (card_number),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- إنشاء جدول السحوبات
CREATE TABLE IF NOT EXISTS lottery_draws (
    id INT AUTO_INCREMENT PRIMARY KEY,
    winner_customer_id INT NOT NULL,
    draw_date_from DATE NOT NULL,
    draw_date_to DATE NOT NULL,
    total_participants INT NOT NULL,
    draw_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    admin_username VARCHAR(50),
    notes TEXT,
    FOREIGN KEY (winner_customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_draw_timestamp (draw_timestamp),
    INDEX idx_winner (winner_customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- إنشاء جدول سجل الزيارات
CREATE TABLE IF NOT EXISTS visit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    page_visited VARCHAR(255),
    referer VARCHAR(500),
    country VARCHAR(100),
    city VARCHAR(100),
    browser VARCHAR(100),
    os VARCHAR(100),
    device_type VARCHAR(50),
    visit_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ip_address (ip_address),
    INDEX idx_visit_timestamp (visit_timestamp),
    INDEX idx_page_visited (page_visited)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- إدراج بعض الكروت المسموح بها كمثال
INSERT INTO allowed_cards (card_number) VALUES
('C001'),
('C002'),
('C003'),
('C004'),
('C005'),
('C006'),
('C007'),
('C008'),
('C009'),
('C010');

-- إدراج بعض البيانات التجريبية (اختياري)
INSERT INTO customers (card_number, customer_name, phone_number) VALUES
('C001', 'أحمد محمد علي', '01012345678'),
('C002', 'فاطمة حسن محمود', '01123456789'),
('C003', 'محمود أحمد إبراهيم', '01234567890'),
('C004', 'زينب علي حسن', '01098765432'),
('C005', 'عبدالله محمد صالح', '01187654321');
