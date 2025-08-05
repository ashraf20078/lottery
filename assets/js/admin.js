// وظائف القائمة الجانبية
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

// إغلاق القائمة عند النقر خارجها على الهواتف
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    if (window.innerWidth <= 768 && 
        !sidebar.contains(event.target) && 
        !menuBtn.contains(event.target) && 
        sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
});

// وظائف عامة للنظام
function confirmDelete(message = 'هل أنت متأكد من الحذف؟') {
    return confirm(message);
}

// تحسين تجربة المستخدم مع ملفات CSV
function setupCsvFileInput(elementId) {
    const csvFile = document.getElementById(elementId);
    if (csvFile) {
        csvFile.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (!file.name.endsWith('.csv')) {
                    alert('يرجى اختيار ملف CSV فقط');
                    this.value = '';
                    return;
                }
                
                if (file.size > 5 * 1024 * 1024) { // 5MB
                    alert('حجم الملف كبير جداً. يرجى اختيار ملف أصغر من 5 ميجابايت');
                    this.value = '';
                    return;
                }
                
                console.log('تم اختيار الملف:', file.name, 'الحجم:', (file.size / 1024).toFixed(2) + ' KB');
            }
        });
    }
}

// تشغيل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تعيين ملفات CSV إذا كانت موجودة
    setupCsvFileInput('csv_file');
    
    // إعداد تأكيد الحذف للروابط
    const deleteLinks = document.querySelectorAll('a[href*="delete"]');
    deleteLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (!confirmDelete('هل أنت متأكد من حذف هذا العنصر؟')) {
                e.preventDefault();
            }
        });
    });
});
