// وظائف نظام السحب - إصدار مُصحح
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎰 نظام السحب: تم تحميل النظام بنجاح');
    
    // متغيرات عامة لإدارة حالة السحب
    let isDrawInProgress = false;
    let currentAnimation = null;
    let currentTimeout = null;
    
    // تعيين تواريخ افتراضية
    initializeDateInputs();
    
    // إعداد نموذج السحب مع التأثيرات المحسنة
    setupLotteryForm();
    
    // إعداد إعادة تعيين الحالة عند تحميل الصفحة
    setupPageResetHandlers();
    
    /**
     * تهيئة حقول التاريخ
     */
    function initializeDateInputs() {
        const dateFromInput = document.getElementById('date_from');
        const dateToInput = document.getElementById('date_to');
        
        if (dateFromInput && !dateFromInput.value) {
            const today = new Date();
            const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            dateFromInput.value = oneWeekAgo.toISOString().split('T')[0];
        }
        
        if (dateToInput && !dateToInput.value) {
            dateToInput.value = new Date().toISOString().split('T')[0];
        }
        
        // تحديث الحد الأقصى للتاريخ
        if (dateToInput) {
            dateToInput.max = new Date().toISOString().split('T')[0];
        }
        
        // التحقق من صحة التواريخ
        if (dateFromInput) {
            dateFromInput.addEventListener('change', function() {
                if (dateToInput) {
                    dateToInput.min = this.value;
                }
            });
        }
        
        if (dateToInput) {
            dateToInput.addEventListener('change', function() {
                if (dateFromInput) {
                    dateFromInput.max = this.value;
                }
            });
        }
    }
    
    /**
     * إعداد نموذج السحب
     */
    function setupLotteryForm() {
        const lotteryForm = document.getElementById('lotteryForm');
        if (!lotteryForm) {
            console.log('⚠️ نموذج السحب غير موجود');
            return;
        }
        
        lotteryForm.addEventListener('submit', function(e) {
            console.log('📝 تم إرسال نموذج السحب');
            
            // التحقق من وجود زر السحب في النموذج
            const drawButton = this.querySelector('button[name="draw_winner"]') || 
                              this.querySelector('input[name="draw_winner"]') ||
                              this.querySelector('#drawButton');
            
            if (!drawButton) {
                console.log('⚠️ زر السحب غير موجود، إرسال النموذج عادي');
                return; // السماح بالإرسال العادي
            }
            
            // منع السحب المتعدد
            if (isDrawInProgress) {
                console.log('⚠️ السحب قيد التنفيذ بالفعل');
                e.preventDefault();
                return;
            }
            
            // جلب بيانات المشاركين
            const participantData = getParticipantData();
            
            if (!participantData || participantData.length === 0) {
                console.log('⚠️ لا يوجد مشاركين، السماح بالإرسال العادي');
                return; // السماح بالإرسال العادي للحصول على رسالة الخطأ
            }
            
            console.log(`✅ تم العثور على ${participantData.length} مشارك`);
            
            // إيقاف الإرسال العادي وبدء التأثير
            e.preventDefault();
            startEnhancedLotteryAnimation.call(this, participantData);
        });
    }
    
    /**
     * جلب بيانات المشاركين من مصادر متعددة
     */
    function getParticipantData() {
        let participantData = [];
        
        // المصدر الأول: متغير global
        if (typeof participants !== 'undefined' && Array.isArray(participants)) {
            participantData = participants;
            console.log('📊 تم جلب البيانات من المتغير العام');
        }
        // المصدر الثاني: window object
        else if (typeof window.participants !== 'undefined' && Array.isArray(window.participants)) {
            participantData = window.participants;
            console.log('📊 تم جلب البيانات من window object');
        }
        // المصدر الثالث: البحث في script tags
        else {
            participantData = extractParticipantsFromScripts();
        }
        
        return participantData && participantData.length > 0 ? participantData : null;
    }
    
    /**
     * استخراج المشاركين من script tags
     */
    function extractParticipantsFromScripts() {
        const scripts = document.querySelectorAll('script');
        for (let script of scripts) {
            if (script.textContent && script.textContent.includes('participants')) {
                const match = script.textContent.match(/participants\s*=\s*(\[.*?\]);/);
                if (match) {
                    try {
                        const data = JSON.parse(match[1]);
                        console.log('📊 تم جلب البيانات من script tag');
                        return data;
                    } catch (e) {
                        console.error('❌ خطأ في تحليل بيانات المشاركين:', e);
                    }
                }
            }
        }
        return [];
    }
    
    /**
     * بدء تأثير السحب المحسن
     */
    function startEnhancedLotteryAnimation(participantData) {
        console.log('🎰 بدء تأثير السحب المحسن');
        
        const lotteryForm = this;
        isDrawInProgress = true;
        
        // جلب العناصر المطلوبة
        const elements = getLotteryElements();
        if (!elements.isValid) {
            console.log('❌ العناصر المطلوبة غير موجودة، إرسال النموذج بالطريقة العادية');
            submitFormDirectly(lotteryForm);
            return;
        }
        
        // إعداد واجهة السحب
        setupLotteryInterface(elements, participantData.length);
        
        // بدء تسلسل التأثيرات
        startAnimationSequence(elements, participantData, lotteryForm);
    }
    
    /**
     * جلب العناصر المطلوبة للسحب
     */
    function getLotteryElements() {
        const slotMachine = document.getElementById('slotMachine');
        const slotDisplay = document.getElementById('slotDisplay');
        const participantCount = document.getElementById('participantCount');
        const drawButton = document.getElementById('drawButton');
        
        return {
            slotMachine,
            slotDisplay,
            participantCount,
            drawButton,
            isValid: slotMachine && slotDisplay
        };
    }
    
    /**
     * إعداد واجهة السحب
     */
    function setupLotteryInterface(elements, participantLength) {
        const { slotMachine, slotDisplay, participantCount, drawButton } = elements;
        
        // إظهار ماكينة السحب مع تأثير سلس
        slotMachine.style.display = 'block';
        slotMachine.style.opacity = '0';
        slotMachine.style.transform = 'translateY(20px)';
        
        // تأثير ظهور سلس
        setTimeout(() => {
            slotMachine.style.transition = 'all 0.5s ease';
            slotMachine.style.opacity = '1';
            slotMachine.style.transform = 'translateY(0)';
        }, 50);
        
        // التمرير إلى ماكينة السحب
        setTimeout(() => {
            slotMachine.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
        
        // تحديث عداد المشاركين
        if (participantCount) {
            participantCount.innerHTML = `
                <span style="color: var(--primary-color); font-weight: bold;">
                    👥 عدد المشاركين: ${participantLength}
                </span>
            `;
        }
        
        // تحديث زر السحب
        if (drawButton) {
            drawButton.disabled = true;
            drawButton.innerHTML = '🎰 جاري السحب...';
            drawButton.style.background = 'var(--warning-color)';
        }
        
        // إعداد منطقة العرض
        slotDisplay.classList.remove('spinning');
        slotDisplay.innerHTML = `
            <div style="font-size: 1.5rem; color: var(--primary-color); animation: pulse 1s infinite;">
                🎰 جاري التحضير للسحب...
            </div>
        `;
    }
    
    /**
     * بدء تسلسل التأثيرات
     */
    function startAnimationSequence(elements, participantData, lotteryForm) {
        console.log('🎬 بدء تسلسل التأثيرات');
        
        // مرحلة 1: التحضير (1 ثانية)
        currentTimeout = setTimeout(() => {
            startPreparationPhase(elements);
            
            // مرحلة 2: التقليب السريع (3 ثواني)
            currentTimeout = setTimeout(() => {
                startFlippingPhase(elements, participantData);
                
                // مرحلة 3: التقليب البطيء (2 ثانية)
                currentTimeout = setTimeout(() => {
                    startSlowPhase(elements, participantData);
                    
                    // مرحلة 4: النتيجة النهائية (1.5 ثانية)
                    currentTimeout = setTimeout(() => {
                        finalizeDraw(elements, lotteryForm);
                    }, 2000);
                }, 3000);
            }, 1000);
        }, 500);
    }
    
    /**
     * مرحلة التحضير
     */
    function startPreparationPhase(elements) {
        console.log('⚡ مرحلة التحضير');
        const { slotDisplay } = elements;
        
        slotDisplay.innerHTML = `
            <div style="font-size: 1.8rem; color: var(--success-color); animation: bounce 0.8s infinite;">
                🎯 جاري بدء السحب...
            </div>
        `;
    }
    
    /**
     * مرحلة التقليب السريع
     */
    function startFlippingPhase(elements, participantData) {
        console.log('🔄 مرحلة التقليب السريع');
        const { slotDisplay } = elements;
        
        slotDisplay.classList.add('spinning');
        
        let step = 0;
        const maxSteps = 30; // 3 ثواني بفترات 100ms
        
        currentAnimation = setInterval(() => {
            const randomParticipant = getRandomParticipant(participantData);
            
            slotDisplay.innerHTML = `
                <div style="font-size: 1.6rem; font-weight: bold; color: var(--primary-color); text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">
                    ${randomParticipant.customer_name || 'غير محدد'}
                </div>
                <div style="font-size: 1.1rem; color: var(--text-color); margin-top: 0.5rem; opacity: 0.8;">
                    💳 كارت رقم: ${randomParticipant.card_number || 'غير محدد'}
                </div>
            `;
            
            step++;
            if (step >= maxSteps) {
                clearInterval(currentAnimation);
                currentAnimation = null;
            }
        }, 100);
    }
    
    /**
     * مرحلة التقليب البطيء
     */
    function startSlowPhase(elements, participantData) {
        console.log('⏳ مرحلة التقليب البطيء');
        const { slotDisplay } = elements;
        
        let step = 0;
        const maxSteps = 8; // 2 ثانية بفترات 250ms
        
        currentAnimation = setInterval(() => {
            const randomParticipant = getRandomParticipant(participantData);
            
            slotDisplay.innerHTML = `
                <div style="font-size: 1.8rem; font-weight: bold; color: var(--primary-color); text-shadow: 2px 2px 4px rgba(0,0,0,0.2); transition: all 0.3s ease;">
                    ${randomParticipant.customer_name || 'غير محدد'}
                </div>
                <div style="font-size: 1.2rem; color: var(--text-color); margin-top: 0.7rem; opacity: 0.9;">
                    💳 كارت رقم: ${randomParticipant.card_number || 'غير محدد'}
                </div>
            `;
            
            step++;
            if (step >= maxSteps) {
                clearInterval(currentAnimation);
                currentAnimation = null;
                slotDisplay.classList.remove('spinning');
            }
        }, 250);
    }
    
    /**
     * إنهاء السحب
     */
    function finalizeDraw(elements, lotteryForm) {
        console.log('🏆 إنهاء السحب');
        const { slotDisplay } = elements;
        
        // عرض رسالة تحديد الفائز
        slotDisplay.innerHTML = `
            <div style="font-size: 2rem; color: var(--success-color); animation: winner-glow 1s ease-in-out infinite;">
                🏆 تم تحديد الفائز!
            </div>
            <div style="font-size: 1rem; color: var(--text-color); margin-top: 0.5rem; opacity: 0.8;">
                جاري عرض النتيجة...
            </div>
        `;
        
        // إرسال النموذج مع آلية احتياطية
        currentTimeout = setTimeout(() => {
            submitFormDirectly(lotteryForm);
        }, 1500);
    }
    
    /**
     * إرسال النموذج مباشرة (بدون تعديل أسماء الحقول)
     */
    function submitFormDirectly(lotteryForm) {
        try {
            console.log('📤 إرسال النموذج');
            lotteryForm.submit();
            
        } catch (error) {
            console.error('❌ خطأ في إرسال النموذج:', error);
            
            // الآلية الاحتياطية: إعادة تحميل الصفحة مع المعاملات
            const formData = new FormData(lotteryForm);
            const params = new URLSearchParams();
            for (let [key, value] of formData.entries()) {
                params.append(key, value);
            }
            
            window.location.href = window.location.pathname + '?' + params.toString();
        }
    }
    
    /**
     * الحصول على مشارك عشوائي
     */
    function getRandomParticipant(participantData) {
        const randomIndex = Math.floor(Math.random() * participantData.length);
        return participantData[randomIndex];
    }
    
    /**
     * إعداد معالجات إعادة تعيين الصفحة
     */
    function setupPageResetHandlers() {
        // عند تحميل الصفحة
        window.addEventListener('load', function() {
            console.log('🔄 إعادة تعيين حالة الصفحة');
            resetLotteryState();
        });
        
        // عند مغادرة الصفحة
        window.addEventListener('beforeunload', function() {
            cleanup();
        });
        
        // عند الضغط على زر الرجوع
        window.addEventListener('popstate', function() {
            cleanup();
            resetLotteryState();
        });
    }
    
    /**
     * تنظيف الموارد
     */
    function cleanup() {
        console.log('🧹 تنظيف الموارد');
        
        if (currentAnimation) {
            clearInterval(currentAnimation);
            currentAnimation = null;
        }
        
        if (currentTimeout) {
            clearTimeout(currentTimeout);
            currentTimeout = null;
        }
        
        isDrawInProgress = false;
    }
    
    /**
     * إعادة تعيين حالة السحب
     */
    function resetLotteryState() {
        cleanup();
        
        const slotMachine = document.getElementById('slotMachine');
        const drawButton = document.getElementById('drawButton');
        const slotDisplay = document.getElementById('slotDisplay');
        
        if (slotMachine) {
            slotMachine.style.display = 'none';
            slotMachine.style.opacity = '';
            slotMachine.style.transform = '';
            slotMachine.style.transition = '';
        }
        
        if (drawButton) {
            drawButton.disabled = false;
            drawButton.innerHTML = '🎲 بدء السحب';
            drawButton.style.background = '';
        }
        
        if (slotDisplay) {
            slotDisplay.classList.remove('spinning');
            slotDisplay.innerHTML = `
                <div style="font-size: 1.2rem; color: var(--text-color); opacity: 0.7;">
                    جاري التحميل...
                </div>
            `;
        }
        
        console.log('✅ تم إعادة تعيين حالة السحب بنجاح');
    }
    
    // تصدير الوظائف للاستخدام الخارجي
    window.resetLotteryState = resetLotteryState;
    window.cleanup = cleanup;
});

// إضافة CSS للتأثيرات الجديدة
const style = document.createElement('style');
style.textContent = `
    @keyframes winner-glow {
        0%, 100% { 
            transform: scale(1);
            text-shadow: 0 0 10px rgba(245, 87, 108, 0.5);
        }
        50% { 
            transform: scale(1.05);
            text-shadow: 0 0 20px rgba(245, 87, 108, 0.8);
        }
    }
    
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
    
    .spinning {
        animation: spin 0.2s ease-in-out infinite;
    }
    
    @keyframes spin {
        0% { transform: rotateY(0deg) scale(1); }
        50% { transform: rotateY(10deg) scale(1.02); }
        100% { transform: rotateY(0deg) scale(1); }
    }
`;
document.head.appendChild(style);

console.log('🎰 نظام السحب المُصحح: تم التحميل بنجاح');