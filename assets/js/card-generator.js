// وظائف مولد الكروت
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من صحة البيانات
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            const startNumber = parseInt(document.getElementById('start_number').value);
            const endNumber = parseInt(document.getElementById('end_number').value);
            const count = parseInt(document.getElementById('count').value);
            
            if (startNumber >= endNumber) {
                e.preventDefault();
                alert('رقم البداية يجب أن يكون أصغر من رقم النهاية');
                return;
            }
            
            const maxCards = endNumber - startNumber + 1;
            if (count > maxCards) {
                e.preventDefault();
                alert('النطاق المحدد لا يكفي لتوليد العدد المطلوب من الكروت');
                return;
            }
            
            if (count > 1000) {
                e.preventDefault();
                alert('لا يمكن توليد أكثر من 1000 كارت في المرة الواحدة');
                return;
            }
        });
    }
    
    // تحديث النطاق المتاح
    function updateRange() {
        const startNumber = parseInt(document.getElementById('start_number').value) || 1;
        const endNumber = parseInt(document.getElementById('end_number').value) || 1000;
        const maxCards = endNumber - startNumber + 1;
        
        const countInput = document.getElementById('count');
        countInput.max = Math.min(maxCards, 1000);
        
        if (parseInt(countInput.value) > maxCards) {
            countInput.value = maxCards;
        }
    }
    
    const startNumberInput = document.getElementById('start_number');
    const endNumberInput = document.getElementById('end_number');
    
    if (startNumberInput) {
        startNumberInput.addEventListener('change', updateRange);
    }
    
    if (endNumberInput) {
        endNumberInput.addEventListener('change', updateRange);
    }
});
