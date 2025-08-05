// وظائف صفحة سجل السحوبات

document.addEventListener('DOMContentLoaded', function() {
    initializeLotteryHistory();
});

function initializeLotteryHistory() {
    // تحريك العناصر عند التحميل
    animateTimelineItems();
    
    // إضافة مؤثرات بصرية للإحصائيات
    animateStatCards();
    
    // إضافة وظائف إضافية
    setupTimelineInteractions();
}

// تحريك عناصر Timeline
function animateTimelineItems() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(50px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 100);
    });
}

// تحريك بطاقات الإحصائيات
function animateStatCards() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
        
        // إضافة تأثير hover مخصص
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// إعداد تفاعلات Timeline
function setupTimelineInteractions() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        // إضافة تأثير النقر
        item.addEventListener('click', function() {
            this.classList.toggle('expanded');
            
            // تحريك المعلومات التفصيلية
            const metaItems = this.querySelectorAll('.meta-item');
            metaItems.forEach((meta, index) => {
                setTimeout(() => {
                    meta.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        meta.style.transform = 'scale(1)';
                    }, 200);
                }, index * 50);
            });
        });
        
        // تأثير تمرير الماوس على badges
        const badges = item.querySelectorAll('.winner-badge, .admin-badge, .period-badge');
        badges.forEach(badge => {
            badge.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
            });
            
            badge.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    });
}

// وظيفة لتصفية السحوبات (يمكن إضافتها لاحقاً)
function filterDraws(criteria) {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        // منطق التصفية هنا
        const shouldShow = evaluateFilterCriteria(item, criteria);
        
        if (shouldShow) {
            item.style.display = 'block';
            item.style.animation = 'fadeIn 0.5s ease';
        } else {
            item.style.display = 'none';
        }
    });
}

// تقييم معايير التصفية
function evaluateFilterCriteria(item, criteria) {
    // يمكن تطوير هذه الوظيفة لاحقاً
    return true;
}

// وظيفة البحث في السحوبات
function searchDraws(searchTerm) {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const searchLower = searchTerm.toLowerCase();
    
    timelineItems.forEach(item => {
        const textContent = item.textContent.toLowerCase();
        const shouldShow = textContent.includes(searchLower);
        
        if (shouldShow) {
            item.style.display = 'block';
            // تمييز النص المطابق
            highlightSearchTerm(item, searchTerm);
        } else {
            item.style.display = 'none';
        }
    });
}

// تمييز النص المطابق للبحث
function highlightSearchTerm(element, term) {
    if (!term) return;
    
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const textNodes = [];
    let node;
    
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }
    
    textNodes.forEach(textNode => {
        if (textNode.textContent.toLowerCase().includes(term.toLowerCase())) {
            const parent = textNode.parentNode;
            const highlightedText = textNode.textContent.replace(
                new RegExp(term, 'gi'),
                match => `<mark style="background-color: #fff3cd; padding: 0 2px;">${match}</mark>`
            );
            parent.innerHTML = highlightedText;
        }
    });
}

// وظيفة لتصدير البيانات (يمكن إضافتها لاحقاً)
function exportLotteryHistory() {
    // منطق تصدير البيانات
    console.log('تصدير سجل السحوبات...');
}

// وظائف مساعدة
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
}

function formatNumber(number) {
    return new Intl.NumberFormat('ar-SA').format(number);
}

// معالجة الأخطاء
window.addEventListener('error', function(e) {
    console.error('خطأ في صفحة سجل السحوبات:', e.error);
});
