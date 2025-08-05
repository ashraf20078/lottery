// نظام السحب المتقدم للفائزين المتعددين - الإصدار الكامل
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎰 نظام السحب المتقدم: تم التحميل بنجاح');
    
    // متغيرات النظام العامة
    let isDrawInProgress = false;
    let currentAnimation = null;
    let currentStep = 0;
    let totalSteps = 0;
    let audioContext = null;
    let soundEnabled = true;
    
    // متغيرات التأثيرات البصرية
    let confettiCanvas = null;
    let confettiContext = null;
    let confettiParticles = [];
    let confettiAnimationId = null;
    
    // تهيئة النظام الكامل
    initializeAdvancedSystem();
    
    /**
     * تهيئة النظام المتقدم
     */
    function initializeAdvancedSystem() {
        console.log('🚀 تهيئة النظام المتقدم');
        
        // تهيئة الوظائف الأساسية
        setupDateValidation();
        setupWinnersCountControl();
        setupLotteryForm();
        setupPrintFunctions();
        setupSoundSystem();
        setupConfettiSystem();
        setupKeyboardShortcuts();
        setupResponsiveHandlers();
        
        // تهيئة CSS الديناميكي
        injectDynamicStyles();
        
        // تحضير الواجهة
        prepareInterface();
        
        console.log('✅ تم تهيئة النظام بنجاح');
    }
    
    /**
     * حقن الأنماط الديناميكية
     */
    function injectDynamicStyles() {
        const styles = `
            <style id="multi-lottery-styles">
                /* تأثيرات الحركة المتقدمة */
                @keyframes loading {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes winner-glow {
                    0%, 100% { 
                        box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
                        text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
                    }
                    50% { 
                        box-shadow: 0 0 40px rgba(255, 215, 0, 0.8);
                        text-shadow: 0 0 20px rgba(255, 215, 0, 1);
                    }
                }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                
                @keyframes fadeInUp {
                    0% { opacity: 0; transform: translateY(30px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes bounceIn {
                    0% { opacity: 0; transform: scale(0.3); }
                    50% { opacity: 1; transform: scale(1.1); }
                    100% { opacity: 1; transform: scale(1); }
                }
                
                @keyframes slideInRight {
                    0% { opacity: 0; transform: translateX(100px); }
                    100% { opacity: 1; transform: translateX(0); }
                }
                
                /* أنماط الرسائل */
                .message-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 2rem;
                    border-radius: 10px;
                    color: white;
                    font-weight: bold;
                    z-index: 10000;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    animation: slideInRight 0.5s ease;
                    max-width: 400px;
                    backdrop-filter: blur(10px);
                }
                
                .message-success {
                    background: linear-gradient(135deg, #4caf50, #45a049);
                    border-left: 5px solid #2e7d32;
                }
                
                .message-error {
                    background: linear-gradient(135deg, #f44336, #d32f2f);
                    border-left: 5px solid #c62828;
                }
                
                .message-warning {
                    background: linear-gradient(135deg, #ff9800, #f57c00);
                    border-left: 5px solid #ef6c00;
                }
                
                .message-info {
                    background: linear-gradient(135deg, #2196f3, #1976d2);
                    border-left: 5px solid #1565c0;
                }
                
                /* تأثيرات الكونفيتي */
                .confetti-canvas {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 9999;
                }
                
                /* تأثيرات الأزرار المحسنة */
                .btn-enhanced {
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                
                .btn-enhanced::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 0;
                    height: 0;
                    background: rgba(255,255,255,0.3);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    transition: width 0.3s ease, height 0.3s ease;
                }
                
                .btn-enhanced:hover::before {
                    width: 300px;
                    height: 300px;
                }
                
                /* تأثيرات الكروت */
                .winner-card-enhanced {
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                
                .winner-card-enhanced:hover {
                    transform: translateY(-10px) scale(1.02);
                    box-shadow: 0 25px 50px rgba(0,0,0,0.2);
                }
                
                /* تأثير التحميل */
                .loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10001;
                    backdrop-filter: blur(5px);
                }
                
                .loading-spinner {
                    width: 60px;
                    height: 60px;
                    border: 6px solid #f3f3f3;
                    border-top: 6px solid #3498db;
                    border-radius: 50%;
                    animation: spin 2s linear infinite;
                }
                
                /* تأثيرات الماكينة */
                .machine-display-enhanced {
                    background: linear-gradient(45deg, #1a1a1a, #2d2d2d);
                    border: 3px solid #444;
                    box-shadow: inset 0 0 20px rgba(0,255,0,0.2);
                }
                
                .machine-display-enhanced::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 100%;
                    background: linear-gradient(180deg, 
                        rgba(0,255,0,0.1) 0%, 
                        transparent 20%, 
                        transparent 80%, 
                        rgba(0,255,0,0.1) 100%);
                    pointer-events: none;
                }
                
                /* تجاوب الشاشات الصغيرة */
                @media (max-width: 768px) {
                    .message-notification {
                        right: 10px;
                        left: 10px;
                        max-width: none;
                    }
                    
                    .confetti-canvas {
                        display: none; /* تعطيل الكونفيتي على الموبايل لتحسين الأداء */
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    /**
     * إعداد التحقق من التواريخ المحسن
     */
    function setupDateValidation() {
        const dateFromInput = document.getElementById('date_from');
        const dateToInput = document.getElementById('date_to');
        
        if (dateFromInput && dateToInput) {
            // تحديد الحد الأقصى للتاريخ (اليوم)
            const today = new Date().toISOString().split('T')[0];
            dateToInput.max = today;
            
            // إضافة مستمعات الأحداث المحسنة
            dateFromInput.addEventListener('change', function() {
                validateDateRange(this, dateToInput);
                playSound('click');
            });
            
            dateToInput.addEventListener('change', function() {
                validateDateRange(dateFromInput, this);
                playSound('click');
            });
            
            // التحقق من التواريخ عند التحميل
            validateDateRange(dateFromInput, dateToInput);
        }
    }
    
    /**
     * التحقق من نطاق التواريخ
     */
    function validateDateRange(fromInput, toInput) {
        const fromDate = new Date(fromInput.value);
        const toDate = new Date(toInput.value);
        const today = new Date();
        
        // التحقق من صحة التواريخ
        if (fromDate > today) {
            showMessage('تاريخ البداية لا يمكن أن يكون في المستقبل', 'warning');
            fromInput.value = today.toISOString().split('T')[0];
            return false;
        }
        
        if (toDate > today) {
            showMessage('تاريخ النهاية لا يمكن أن يكون في المستقبل', 'warning');
            toInput.value = today.toISOString().split('T')[0];
            return false;
        }
        
        if (fromDate > toDate) {
            showMessage('تاريخ البداية يجب أن يكون قبل تاريخ النهاية', 'error');
            toInput.value = fromInput.value;
            return false;
        }
        
        return true;
    }
    
    /**
     * إعداد تحكم عدد الفائزين المحسن
     */
    function setupWinnersCountControl() {
        const winnersInput = document.getElementById('winners_count');
        const winnersDisplay = document.getElementById('winnersDisplay');
        
        if (winnersInput && winnersDisplay) {
            // إضافة تأثيرات بصرية
            winnersInput.addEventListener('input', function() {
                updateWinnersDisplay(this, winnersDisplay);
            });
            
            winnersInput.addEventListener('focus', function() {
                this.select();
                playSound('focus');
            });
            
            winnersInput.addEventListener('blur', function() {
                validateWinnersCount(this);
            });
            
            // تهيئة القيمة الابتدائية
            updateWinnersDisplay(winnersInput, winnersDisplay);
        }
    }
    
    /**
     * تحديث عرض عدد الفائزين
     */
    function updateWinnersDisplay(input, display) {
        let value = parseInt(input.value) || 1;
        value = Math.max(1, Math.min(50, value));
        
        if (input.value !== value.toString()) {
            input.value = value;
        }
        
        display.textContent = value;
        
        // تأثير بصري متقدم
        display.style.transform = 'scale(1.3) rotate(5deg)';
        display.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        
        setTimeout(() => {
            display.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
        
        // تغيير اللون حسب العدد
        if (value <= 3) {
            display.style.color = '#4caf50';
        } else if (value <= 10) {
            display.style.color = '#ff9800';
        } else {
            display.style.color = '#f44336';
        }
        
        playSound('tick');
    }
    
    /**
     * التحقق من صحة عدد الفائزين
     */
    function validateWinnersCount(input) {
        const value = parseInt(input.value);
        const participants = getParticipantData();
        
        if (isNaN(value) || value < 1) {
            showMessage('عدد الفائزين يجب أن يكون رقم صحيح أكبر من صفر', 'error');
            input.value = 1;
            return false;
        }
        
        if (value > 50) {
            showMessage('الحد الأقصى لعدد الفائزين هو 50', 'warning');
            input.value = 50;
            return false;
        }
        
        if (participants.length > 0 && value > participants.length) {
            showMessage(`عدد الفائزين (${value}) أكبر من عدد المشاركين (${participants.length})`, 'warning');
            input.value = Math.min(value, participants.length);
            return false;
        }
        
        return true;
    }
    
    /**
     * إعداد نموذج السحب المحسن
     */
    function setupLotteryForm() {
        const lotteryForm = document.getElementById('multiLotteryForm');
        if (!lotteryForm) return;
        
        lotteryForm.addEventListener('submit', function(e) {
            console.log('📝 تم إرسال نموذج السحب المتقدم');
            
            // منع السحب المتعدد
            if (isDrawInProgress) {
                e.preventDefault();
                showMessage('السحب قيد التنفيذ بالفعل، يرجى الانتظار...', 'warning');
                playSound('error');
                return;
            }
            
            // التحقق من صحة البيانات
            if (!validateFormData()) {
                e.preventDefault();
                return;
            }
            
            // جلب بيانات المشاركين
            const participantData = getParticipantData();
            const winnersCount = parseInt(document.getElementById('winners_count').value) || 1;
            
            if (!participantData || participantData.length === 0) {
                console.log('⚠️ لا يوجد مشاركين، إرسال النموذج العادي');
                return; // السماح بالإرسال العادي
            }
            
            if (participantData.length < winnersCount) {
                e.preventDefault();
                showMessage(`عدد المشاركين (${participantData.length}) أقل من عدد الفائزين المطلوب (${winnersCount})`, 'error');
                playSound('error');
                return;
            }
            
            console.log(`✅ بدء السحب: ${participantData.length} مشارك، ${winnersCount} فائز`);
            
            // بدء التأثيرات المتقدمة
            e.preventDefault();
            startAdvancedLotterySequence.call(this, participantData, winnersCount);
        });
        
        // إضافة مستمعات أحداث إضافية
        const formInputs = lotteryForm.querySelectorAll('input, select');
        formInputs.forEach(input => {
            input.addEventListener('change', () => {
                clearFormErrors();
                playSound('click');
            });
        });
    }
    
    /**
     * التحقق من صحة بيانات النموذج
     */
    function validateFormData() {
        const dateFrom = document.getElementById('date_from').value;
        const dateTo = document.getElementById('date_to').value;
        const winnersCount = document.getElementById('winners_count').value;
        
        if (!dateFrom || !dateTo) {
            showMessage('يرجى تحديد فترة التاريخ', 'error');
            playSound('error');
            return false;
        }
        
        if (new Date(dateFrom) > new Date(dateTo)) {
            showMessage('تاريخ البداية يجب أن يكون قبل تاريخ النهاية', 'error');
            playSound('error');
            return false;
        }
        
        if (!winnersCount || parseInt(winnersCount) < 1 || parseInt(winnersCount) > 50) {
            showMessage('عدد الفائزين يجب أن يكون بين 1 و 50', 'error');
            playSound('error');
            return false;
        }
        
        return true;
    }
    
    /**
     * مسح أخطاء النموذج
     */
    function clearFormErrors() {
        const errorMessages = document.querySelectorAll('.message-notification.message-error');
        errorMessages.forEach(msg => msg.remove());
    }
    
    /**
     * جلب بيانات المشاركين مع التحقق المحسن
     */
    function getParticipantData() {
        try {
            if (typeof window.participants !== 'undefined' && Array.isArray(window.participants)) {
                console.log(`📊 تم جلب ${window.participants.length} مشارك`);
                return window.participants;
            }
            console.log('⚠️ لا توجد بيانات مشاركين');
            return [];
        } catch (error) {
            console.error('❌ خطأ في جلب بيانات المشاركين:', error);
            return [];
        }
    }
    
    /**
     * بدء تسلسل السحب المتقدم
     */
    function startAdvancedLotterySequence(participantData, winnersCount) {
        console.log('🎰 بدء السحب المتقدم');
        
        const lotteryForm = this;
        isDrawInProgress = true;
        
        // إظهار تأثير التحميل
        showLoadingOverlay();
        
        // تشغيل صوت البداية
        playSound('start');
        
        // إعداد الماكينة
        const machine = setupAdvancedLotteryMachine(participantData, winnersCount);
        if (!machine) {
            hideLoadingOverlay();
            submitFormDirectly(lotteryForm);
            return;
        }
        
        // إخفاء تأثير التحميل
        setTimeout(() => {
            hideLoadingOverlay();
            
            // تسلسل التأثيرات المتقدم
            startEnhancedAnimationSequence(machine, participantData, winnersCount, lotteryForm);
        }, 1500);
    }
    
    /**
     * إظهار تأثير التحميل
     */
    function showLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.id = 'loadingOverlay';
        overlay.innerHTML = `
            <div style="text-align: center; color: white;">
                <div class="loading-spinner"></div>
                <div style="margin-top: 1rem; font-size: 1.2rem;">🎰 تحضير السحب المتقدم...</div>
                <div style="margin-top: 0.5rem; opacity: 0.8;">جاري تهيئة النظام</div>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    
    /**
     * إخفاء تأثير التحميل
     */
    function hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.transition = 'opacity 0.5s ease';
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 500);
        }
    }
    
    /**
     * إعداد ماكينة السحب المتقدمة
     */
    function setupAdvancedLotteryMachine(participantData, winnersCount) {
        const machine = document.getElementById('lotteryMachine');
        const display = document.getElementById('machineDisplay');
        const progress = document.getElementById('drawProgress');
        const button = document.getElementById('megaDrawButton');
        
        if (!machine || !display) {
            console.log('❌ عناصر الماكينة غير موجودة');
            return null;
        }
        
        // إعداد الماكينة بتأثيرات متقدمة
        machine.style.display = 'block';
        machine.style.opacity = '0';
        machine.style.transform = 'translateY(50px) scale(0.9)';
        
        // إضافة كلاسات التحسين
        display.classList.add('machine-display-enhanced');
        
        setTimeout(() => {
            machine.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            machine.style.opacity = '1';
            machine.style.transform = 'translateY(0) scale(1)';
        }, 100);
        
        // التمرير السلس
        setTimeout(() => {
            machine.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'nearest'
            });
        }, 800);
        
        // تحديث المحتوى
        if (progress) {
            progress.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; gap: 1rem;">
                    <span style="color: var(--primary-color); font-weight: bold; font-size: 1.1rem;">
                        🎯 جاري اختيار ${winnersCount} فائز من بين ${participantData.length} مشارك
                    </span>
                    <div style="width: 20px; height: 20px; border: 2px solid var(--primary-color); border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                </div>
            `;
        }
        
        if (button) {
            button.disabled = true;
            button.innerHTML = '🎰 جاري السحب المتقدم...';
            button.style.background = 'var(--gradient-success)';
            button.classList.add('btn-enhanced');
        }
        
        return { machine, display, progress, button };
    }
    
    /**
     * تسلسل التأثيرات المحسن
     */
    function startEnhancedAnimationSequence(machine, participantData, winnersCount, lotteryForm) {
        console.log('🎬 بدء تسلسل التأثيرات المحسن');
        
        totalSteps = 7;
        currentStep = 0;
        
        const sequence = [
            { phase: 'preparation', duration: 2000, sound: 'prepare' },
            { phase: 'scanning_fast', duration: 3000, sound: 'scan' },
            { phase: 'scanning_medium', duration: 4000, sound: 'processing' },
            { phase: 'scanning_slow', duration: 3000, sound: 'focus' },
            { phase: 'analysis', duration: 2500, sound: 'analyze' },
            { phase: 'selection', duration: 2000, sound: 'select' },
            { phase: 'results', duration: 2000, sound: 'success' }
        ];
        
        executeSequence(sequence, 0, machine, participantData, winnersCount, lotteryForm);
    }
    
    /**
     * تنفيذ التسلسل
     */
    function executeSequence(sequence, index, machine, participantData, winnersCount, lotteryForm) {
        if (index >= sequence.length) return;
        
        const phase = sequence[index];
        currentStep = index + 1;
        
        console.log(`🎭 المرحلة ${currentStep}/${totalSteps}: ${phase.phase}`);
        
        // تشغيل الصوت
        playSound(phase.sound);
        
        // تنفيذ المرحلة
        switch (phase.phase) {
            case 'preparation':
                showPreparationPhase(machine, winnersCount);
                break;
            case 'scanning_fast':
                showFastScanPhase(machine, participantData);
                break;
            case 'scanning_medium':
                showMediumScanPhase(machine, participantData);
                break;
            case 'scanning_slow':
                showSlowScanPhase(machine, participantData);
                break;
            case 'analysis':
                showAnalysisPhase(machine, winnersCount);
                break;
            case 'selection':
                showSelectionPhase(machine, winnersCount);
                break;
            case 'results':
                showResultsPhase(machine, lotteryForm);
                return; // النهاية
        }
        
        // الانتقال للمرحلة التالية
        setTimeout(() => {
            executeSequence(sequence, index + 1, machine, participantData, winnersCount, lotteryForm);
        }, phase.duration);
    }
    
    /**
     * مرحلة التحضير المحسنة
     */
    function showPreparationPhase(machine, winnersCount) {
        console.log('⚡ مرحلة التحضير المحسنة');
        const { display } = machine;
        
        display.innerHTML = `
            <div style="text-align: center; animation: fadeInUp 1s ease;">
                <div style="font-size: 2.2rem; margin-bottom: 1rem; animation: pulse 2s infinite;">
                    🔄 تحضير النظام المتقدم
                </div>
                <div style="font-size: 1.3rem; opacity: 0.9; margin-bottom: 1.5rem;">
                    جاري إعداد اختيار ${winnersCount} فائز...
                </div>
                <div style="margin-top: 1rem;">
                    <div style="width: 80%; margin: 0 auto; height: 6px; background: #333; border-radius: 3px; overflow: hidden; position: relative;">
                        <div style="width: 25%; height: 100%; background: linear-gradient(90deg, #00ff00, #32cd32); animation: loading 2s ease-in-out; border-radius: 3px;"></div>
                        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); animation: loading 2s ease-in-out infinite;"></div>
                    </div>
                </div>
                <div style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.7;">
                    🧮 تحليل الخوارزميات المتقدمة
                </div>
            </div>
        `;
    }
    
    /**
     * مرحلة المسح السريع المحسنة
     */
    function showFastScanPhase(machine, participantData) {
        console.log('🔄 مرحلة المسح السريع المحسنة');
        const { display } = machine;
        
        let step = 0;
        const maxSteps = 30;
        
        currentAnimation = setInterval(() => {
            const randomParticipant = getRandomParticipant(participantData);
            const progress = (step / maxSteps) * 100;
            
            display.innerHTML = `
                <div style="text-align: center; animation: bounceIn 0.1s ease;">
                    <div style="color: #ff6b6b; font-size: 1.6rem; margin-bottom: 1rem; text-shadow: 0 0 10px rgba(255, 107, 107, 0.5);">
                        ⚡ مسح سريع - جاري التحليل
                    </div>
                    <div style="font-size: 2rem; font-weight: bold; margin: 1rem 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); animation: shake 0.1s ease;">
                        ${randomParticipant.customer_name || 'جاري التحليل...'}
                    </div>
                    <div style="font-size: 1.3rem; opacity: 0.9; background: rgba(255,107,107,0.1); padding: 0.5rem 1rem; border-radius: 20px; display: inline-block;">
                        💳 ${randomParticipant.card_number || '***-***-***'}
                    </div>
                    <div style="margin-top: 1.5rem;">
                        <div style="width: 80%; margin: 0 auto; height: 6px; background: #333; border-radius: 3px; overflow: hidden;">
                            <div style="width: ${40 + progress * 0.3}%; height: 100%; background: linear-gradient(90deg, #ff6b6b, #ff8a80); transition: width 0.1s; border-radius: 3px;"></div>
                        </div>
                        <div style="margin-top: 0.5rem; font-size: 0.9rem; opacity: 0.8;">
                            ${Math.round(40 + progress * 0.3)}% مكتمل
                        </div>
                    </div>
                </div>
            `;
            
            step++;
            if (step >= maxSteps) {
                clearInterval(currentAnimation);
            }
        }, 100);
    }
    
    /**
     * مرحلة المسح المتوسط المحسنة
     */
    function showMediumScanPhase(machine, participantData) {
        console.log('🔄 مرحلة المسح المتوسط المحسنة');
        const { display } = machine;
        
        let step = 0;
        const maxSteps = 16;
        
        currentAnimation = setInterval(() => {
            const randomParticipant = getRandomParticipant(participantData);
            const progress = (step / maxSteps) * 100;
            
            display.innerHTML = `
                <div style="text-align: center; animation: fadeInUp 0.25s ease;">
                    <div style="color: #ffa500; font-size: 1.7rem; margin-bottom: 1rem; text-shadow: 0 0 15px rgba(255, 165, 0, 0.6);">
                        🎯 مسح متوسط - تركيز أعمق
                    </div>
                    <div style="font-size: 2.2rem; font-weight: bold; margin: 1rem 0; text-shadow: 3px 3px 6px rgba(0,0,0,0.4); animation: pulse 0.5s ease;">
                        ${randomParticipant.customer_name || 'تحليل متقدم...'}
                    </div>
                    <div style="font-size: 1.4rem; opacity: 0.9; background: rgba(255,165,0,0.15); padding: 0.7rem 1.2rem; border-radius: 25px; display: inline-block; border: 2px solid rgba(255,165,0,0.3);">
                        💳 ${randomParticipant.card_number || '***-***-***'}
                    </div>
                    <div style="margin-top: 1.5rem;">
                        <div style="width: 80%; margin: 0 auto; height: 8px; background: #333; border-radius: 4px; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);">
                            <div style="width: ${70 + progress * 0.2}%; height: 100%; background: linear-gradient(90deg, #ffa500, #ffb74d); transition: width 0.2s; border-radius: 4px; box-shadow: 0 0 10px rgba(255,165,0,0.5);"></div>
                        </div>
                        <div style="margin-top: 0.5rem; font-size: 1rem; opacity: 0.9;">
                            🔍 دقة التحليل: ${Math.round(70 + progress * 0.2)}%
                        </div>
                    </div>
                </div>
            `;
            
            step++;
            if (step >= maxSteps) {
                clearInterval(currentAnimation);
            }
        }, 250);
    }
    
    /**
     * مرحلة المسح البطيء المحسنة
     */
    function showSlowScanPhase(machine, participantData) {
        console.log('⏳ مرحلة المسح البطيء المحسنة');
        const { display } = machine;
        
        let step = 0;
        const maxSteps = 6;
        
        currentAnimation = setInterval(() => {
            const randomParticipant = getRandomParticipant(participantData);
            const progress = (step / maxSteps) * 100;
            
            display.innerHTML = `
                <div style="text-align: center; animation: bounceIn 0.5s ease;">
                    <div style="color: #00ff00; font-size: 1.8rem; margin-bottom: 1rem; text-shadow: 0 0 20px rgba(0, 255, 0, 0.7);">
                        🔍 مسح دقيق - تحديد نهائي
                    </div>
                    <div style="font-size: 2.5rem; font-weight: bold; margin: 1.5rem 0; text-shadow: 4px 4px 8px rgba(0,0,0,0.5); animation: winner-glow 1s ease-in-out; transition: all 0.5s ease;">
                        ${randomParticipant.customer_name || 'المرشح النهائي...'}
                    </div>
                    <div style="font-size: 1.5rem; opacity: 0.95; background: rgba(0,255,0,0.1); padding: 1rem 1.5rem; border-radius: 30px; display: inline-block; border: 3px solid rgba(0,255,0,0.4); box-shadow: 0 0 20px rgba(0,255,0,0.2);">
                        💳 ${randomParticipant.card_number || '***-***-***'}
                    </div>
                    <div style="margin-top: 2rem;">
                        <div style="width: 80%; margin: 0 auto; height: 10px; background: #333; border-radius: 5px; overflow: hidden; box-shadow: inset 0 2px 6px rgba(0,0,0,0.4);">
                            <div style="width: ${90 + progress * 0.08}%; height: 100%; background: linear-gradient(90deg, #00ff00, #32cd32, #7fff00); transition: width 0.5s; border-radius: 5px; box-shadow: 0 0 15px rgba(0,255,0,0.6);"></div>
                        </div>
                        <div style="margin-top: 0.7rem; font-size: 1.1rem; opacity: 0.9; color: #00ff00;">
                            🎯 دقة الاختيار: ${Math.round(90 + progress * 0.08)}%
                        </div>
                    </div>
                </div>
            `;
            
            step++;
            if (step >= maxSteps) {
                clearInterval(currentAnimation);
            }
        }, 500);
    }
    
    /**
     * مرحلة التحليل النهائي المحسنة
     */
    function showAnalysisPhase(machine, winnersCount) {
        console.log('🧮 مرحلة التحليل النهائي المحسنة');
        const { display } = machine;
        
        display.innerHTML = `
            <div style="text-align: center; animation: fadeInUp 1s ease;">
                <div style="color: #9c27b0; font-size: 2rem; margin-bottom: 1.5rem; animation: pulse 1.5s infinite; text-shadow: 0 0 25px rgba(156, 39, 176, 0.8);">
                    🧮 تحليل البيانات النهائي
                </div>
                <div style="font-size: 1.4rem; margin: 1.5rem 0; opacity: 0.9;">
                    جاري تحديد أفضل ${winnersCount} فائز...
                </div>
                <div style="margin: 2rem 0;">
                    <div style="display: flex; justify-content: center; align-items: center; gap: 1rem;">
                        <div style="width: 30px; height: 30px; border: 3px solid #9c27b0; border-top: 3px solid transparent; border-radius: 50%; animation: spin 1.5s linear infinite;"></div>
                        <span style="font-size: 1.1rem;">معالجة خوارزمية متقدمة...</span>
                    </div>
                </div>
                <div style="margin-top: 2rem;">
                    <div style="width: 90%; margin: 0 auto; height: 8px; background: #333; border-radius: 4px; overflow: hidden;">
                        <div style="width: 100%; height: 100%; background: linear-gradient(90deg, #9c27b0, #e1bee7); animation: loading 2.5s ease-in-out; border-radius: 4px; box-shadow: 0 0 15px rgba(156, 39, 176, 0.5);"></div>
                    </div>
                    <div style="margin-top: 1rem; font-size: 0.95rem; opacity: 0.8;">
                        🔬 تطبيق خوارزميات الذكاء الاصطناعي
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * مرحلة الاختيار المحسنة
     */
    function showSelectionPhase(machine, winnersCount) {
        console.log('🎯 مرحلة الاختيار المحسنة');
        const { display } = machine;
        
        display.innerHTML = `
            <div style="text-align: center; animation: bounceIn 1s ease;">
                <div style="color: #e91e63; font-size: 2.2rem; margin-bottom: 1.5rem; animation: winner-glow 1s ease-in-out infinite; text-shadow: 0 0 30px rgba(233, 30, 99, 0.9);">
                    🎯 لحظة الاختيار الحاسمة
                </div>
                <div style="font-size: 1.5rem; margin: 1.5rem 0; opacity: 0.95;">
                    جاري تحديد الفائزين النهائيين...
                </div>
                <div style="margin: 2rem 0;">
                    <div style="font-size: 3rem; animation: pulse 0.8s infinite; text-shadow: 0 0 20px rgba(233, 30, 99, 0.6);">
                        🏆
                    </div>
                </div>
                <div style="margin-top: 2rem;">
                    <div style="display: flex; justify-content: center; align-items: center; gap: 0.5rem;">
                        ${Array(winnersCount).fill(0).map((_, i) => `
                            <div style="width: 12px; height: 12px; background: #e91e63; border-radius: 50%; animation: pulse ${0.5 + i * 0.1}s infinite; box-shadow: 0 0 10px rgba(233, 30, 99, 0.5);"></div>
                        `).join('')}
                    </div>
                    <div style="margin-top: 1rem; font-size: 1rem; opacity: 0.9;">
                        ⭐ ${winnersCount} فائز سيتم الإعلان عنهم
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * مرحلة النتائج المحسنة
     */
    function showResultsPhase(machine, lotteryForm) {
        console.log('🏆 مرحلة النتائج المحسنة');
        const { display } = machine;
        
        display.innerHTML = `
            <div style="text-align: center; animation: bounceIn 1.5s ease;">
                <div style="color: #4caf50; font-size: 3rem; margin-bottom: 1.5rem; animation: winner-glow 1s ease-in-out infinite; text-shadow: 0 0 40px rgba(76, 175, 80, 1);">
                    🏆 تم تحديد الفائزين! 🏆
                </div>
                <div style="font-size: 1.6rem; margin: 1.5rem 0; opacity: 0.95;">
                    جاري عرض النتائج الرسمية...
                </div>
                <div style="margin: 2rem 0;">
                    <div style="font-size: 4rem; animation: bounceIn 2s ease; text-shadow: 0 0 30px rgba(76, 175, 80, 0.8);">
                        ✨🎉✨
                    </div>
                </div>
                <div style="margin-top: 2rem;">
                    <div style="color: #4caf50; font-size: 1.3rem; font-weight: bold;">
                        ✅ تم الانتهاء بنجاح التام
                    </div>
                    <div style="margin-top: 0.5rem; font-size: 1rem; opacity: 0.8;">
                        🎊 استعد لرؤية الفائزين المحظوظين
                    </div>
                </div>
            </div>
        `;
        
        // تشغيل تأثير الكونفيتي
        startConfetti();
        
        // تشغيل صوت النجاح
        playSound('victory');
        
        // إرسال النموذج
        setTimeout(() => {
            submitFormDirectly(lotteryForm);
        }, 2000);
    }
    
    /**
     * إرسال النموذج مباشرة مع التنظيف
     */
    function submitFormDirectly(lotteryForm) {
        try {
            console.log('📤 إرسال النموذج مع التنظيف');
            
            // تنظيف التأثيرات
            cleanup();
            
            // إرسال النموذج
            lotteryForm.submit();
        } catch (error) {
            console.error('❌ خطأ في إرسال النموذج:', error);
            showMessage('حدث خطأ في إرسال النموذج، جاري إعادة التحميل...', 'error');
            
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    }
    
    /**
     * الحصول على مشارك عشوائي مع تحسينات
     */
    function getRandomParticipant(participantData) {
        if (!participantData || participantData.length === 0) {
            return {
                customer_name: 'جاري التحليل...',
                card_number: '***-***-***',
                phone_number: '***-***-****'
            };
        }
        
        const randomIndex = Math.floor(Math.random() * participantData.length);
        return participantData[randomIndex] || {};
    }
    
    /**
     * إعداد نظام الصوت المتقدم
     */
    function setupSoundSystem() {
        try {
            // التحقق من دعم الصوت
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('🔊 تم تهيئة نظام الصوت');
        } catch (error) {
            console.warn('⚠️ نظام الصوت غير متوفر:', error);
            soundEnabled = false;
        }
        
        // إنشاء عناصر الصوت
        createAudioElements();
    }
    
    /**
     * إنشاء عناصر الصوت
     */
    function createAudioElements() {
        const sounds = {
            click: createBeepSound(800, 0.1, 0.1),
            tick: createBeepSound(600, 0.05, 0.1),
            focus: createBeepSound(1000, 0.1, 0.2),
            error: createBeepSound(300, 0.2, 0.3),
            start: createBeepSound(1200, 0.3, 0.5),
            scan: createBeepSound(900, 0.1, 0.1),
            processing: createBeepSound(700, 0.15, 0.2),
            analyze: createBeepSound(1100, 0.2, 0.3),
            select: createBeepSound(1400, 0.25, 0.4),
            success: createBeepSound(1600, 0.4, 0.6),
            victory: createVictorySound(),
            prepare: createBeepSound(500, 0.2, 0.3)
        };
        
        window.lotterySound = sounds;
    }
    
    /**
     * إنشاء صوت بيب
     */
    function createBeepSound(frequency, duration, volume = 0.1) {
        return () => {
            if (!soundEnabled || !audioContext) return;
            
            try {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
                gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration);
            } catch (error) {
                console.warn('⚠️ خطأ في تشغيل الصوت:', error);
            }
        };
    }
    
    /**
     * إنشاء صوت النصر
     */
    function createVictorySound() {
        return () => {
            if (!soundEnabled || !audioContext) return;
            
            try {
                const notes = [523, 659, 784, 1047]; // C, E, G, C
                notes.forEach((freq, index) => {
                    setTimeout(() => {
                        const oscillator = audioContext.createOscillator();
                        const gainNode = audioContext.createGain();
                        
                        oscillator.connect(gainNode);
                        gainNode.connect(audioContext.destination);
                        
                        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                        oscillator.type = 'triangle';
                        
                        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                        gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
                        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
                        
                        oscillator.start(audioContext.currentTime);
                        oscillator.stop(audioContext.currentTime + 0.3);
                    }, index * 150);
                });
            } catch (error) {
                console.warn('⚠️ خطأ في تشغيل صوت النصر:', error);
            }
        };
    }
    
    /**
     * تشغيل الصوت
     */
    function playSound(soundName) {
        if (!soundEnabled || !window.lotterySound || !window.lotterySound[soundName]) {
            return;
        }
        
        try {
            // استئناف السياق الصوتي إذا كان مُعلقاً
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume();
            }
            
            window.lotterySound[soundName]();
        } catch (error) {
            console.warn(`⚠️ خطأ في تشغيل الصوت ${soundName}:`, error);
        }
    }
    
    /**
     * إعداد نظام الكونفيتي
     */
    function setupConfettiSystem() {
        // إنشاء لوحة الكونفيتي
        confettiCanvas = document.createElement('canvas');
        confettiCanvas.className = 'confetti-canvas';
        confettiCanvas.style.display = 'none';
        document.body.appendChild(confettiCanvas);
        
        confettiContext = confettiCanvas.getContext('2d');
        
        // تحديث حجم اللوحة
        updateCanvasSize();
        
        // مستمع تغيير حجم النافذة
        window.addEventListener('resize', updateCanvasSize);
        
        console.log('🎊 تم تهيئة نظام الكونفيتي');
    }
    
    /**
     * تحديث حجم لوحة الكونفيتي
     */
    function updateCanvasSize() {
        if (!confettiCanvas) return;
        
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
    
    /**
     * بدء تأثير الكونفيتي
     */
    function startConfetti() {
        if (!confettiCanvas || !confettiContext) return;
        
        console.log('🎊 بدء تأثير الكونفيتي');
        
        // إظهار اللوحة
        confettiCanvas.style.display = 'block';
        
        // إنشاء جزيئات الكونفيتي
        createConfettiParticles();
        
        // بدء الحركة
        animateConfetti();
        
        // إيقاف التأثير بعد 5 ثواني
        setTimeout(stopConfetti, 5000);
    }
    
    /**
     * إنشاء جزيئات الكونفيتي
     */
    function createConfettiParticles() {
        confettiParticles = [];
        
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffd93d', '#ff9ff3', '#54a0ff'];
        const particleCount = window.innerWidth > 768 ? 100 : 50; // أقل للموبايل
        
        for (let i = 0; i < particleCount; i++) {
            confettiParticles.push({
                x: Math.random() * confettiCanvas.width,
                y: -10,
                velocityX: (Math.random() - 0.5) * 10,
                velocityY: Math.random() * 3 + 2,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                color: colors[Math.floor(Math.random() * colors.length)],
                shape: Math.random() > 0.5 ? 'rectangle' : 'circle',
                size: Math.random() * 8 + 4,
                gravity: 0.1
            });
        }
    }
    
    /**
     * تحريك الكونفيتي
     */
    function animateConfetti() {
        if (!confettiContext || !confettiParticles.length) return;
        
        // مسح اللوحة
        confettiContext.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        
        // تحديث وإرسال كل جزيء
        for (let i = confettiParticles.length - 1; i >= 0; i--) {
            const particle = confettiParticles[i];
            
            // تحديث الموقع
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.velocityY += particle.gravity;
            particle.rotation += particle.rotationSpeed;
            
            // إزالة الجزيئات التي خرجت من الشاشة
            if (particle.y > confettiCanvas.height + 10 || 
                particle.x < -10 || 
                particle.x > confettiCanvas.width + 10) {
                confettiParticles.splice(i, 1);
                continue;
            }
            
            // رسم الجزيء
            confettiContext.save();
            confettiContext.translate(particle.x, particle.y);
            confettiContext.rotate(particle.rotation * Math.PI / 180);
            confettiContext.fillStyle = particle.color;
            
            if (particle.shape === 'rectangle') {
                confettiContext.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
            } else {
                confettiContext.beginPath();
                confettiContext.arc(0, 0, particle.size/2, 0, Math.PI * 2);
                confettiContext.fill();
            }
            
            confettiContext.restore();
        }
        
        // استمرار التحريك
        if (confettiParticles.length > 0) {
            confettiAnimationId = requestAnimationFrame(animateConfetti);
        }
    }
    
    /**
     * إيقاف تأثير الكونفيتي
     */
    function stopConfetti() {
        console.log('🔲 إيقاف تأثير الكونفيتي');
        
        if (confettiAnimationId) {
            cancelAnimationFrame(confettiAnimationId);
            confettiAnimationId = null;
        }
        
        confettiParticles = [];
        
        if (confettiCanvas) {
            confettiCanvas.style.transition = 'opacity 1s ease';
            confettiCanvas.style.opacity = '0';
            
            setTimeout(() => {
                confettiCanvas.style.display = 'none';
                confettiCanvas.style.opacity = '1';
            }, 1000);
        }
    }
    
    /**
     * إعداد اختصارات لوحة المفاتيح
     */
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // تعطيل الاختصارات أثناء السحب
            if (isDrawInProgress) return;
            
            // Ctrl + Enter: بدء السحب
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                const drawButton = document.getElementById('megaDrawButton');
                if (drawButton && !drawButton.disabled) {
                    drawButton.click();
                }
            }
            
            // Ctrl + P: طباعة
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                if (window.winners && window.winners.length > 0) {
                    window.printWinners();
                }
            }
            
            // Escape: إيقاف الأصوات
            if (e.key === 'Escape') {
                soundEnabled = !soundEnabled;
                showMessage(`الأصوات ${soundEnabled ? 'مُفعلة' : 'مُعطلة'}`, 'info');
            }
        });
        
        console.log('⌨️ تم إعداد اختصارات لوحة المفاتيح');
    }
    
    /**
     * إعداد معالجات التجاوب
     */
    function setupResponsiveHandlers() {
        // معالج تغيير الاتجاه
        window.addEventListener('orientationchange', function() {
            setTimeout(() => {
                updateCanvasSize();
                if (confettiParticles.length > 0) {
                    // إعادة توزيع الجزيئات
                    confettiParticles.forEach(particle => {
                        if (particle.x > confettiCanvas.width) {
                            particle.x = confettiCanvas.width - 10;
                        }
                    });
                }
            }, 100);
        });
        
        // معالج تغيير حجم النافذة
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateCanvasSize();
            }, 250);
        });
        
        console.log('📱 تم إعداد معالجات التجاوب');
    }
    
    /**
     * تحضير الواجهة
     */
    function prepareInterface() {
        // إضافة كلاسات التحسين للأزرار
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.classList.add('btn-enhanced');
        });
        
        // إضافة تأثيرات للكروت
        const winnerCards = document.querySelectorAll('.winner-card');
        winnerCards.forEach(card => {
            card.classList.add('winner-card-enhanced');
        });
        
        console.log('🎨 تم تحضير الواجهة');
    }
    
    /**
     * إعداد وظائف الطباعة المتقدمة
     */
    function setupPrintFunctions() {
        // وظائف الطباعة ستكون متاحة عالمياً
        window.printWinners = function() {
            console.log('🖨️ طباعة قائمة الفائزين');
            const printContent = generateWinnersPrintContent();
            openPrintWindow(printContent, 'قائمة الفائزين');
            playSound('click');
        };
        
        window.printCertificates = function() {
            console.log('📜 طباعة شهادات الفوز');
            const printContent = generateCertificatesPrintContent();
            openPrintWindow(printContent, 'شهادات الفوز');
            playSound('click');
        };
        
        window.printFullReport = function() {
            console.log('📊 طباعة التقرير الكامل');
            const printContent = generateFullReportPrintContent();
            openPrintWindow(printContent, 'التقرير الكامل');
            playSound('click');
        };
        
        console.log('🖨️ تم إعداد وظائف الطباعة المتقدمة');
    }
    
    /**
     * توليد محتوى طباعة الفائزين المحسن
     */
    function generateWinnersPrintContent() {
        const winners = window.winners || [];
        const participants = window.participants || [];
        const currentDate = new Date().toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
        const currentTime = new Date().toLocaleTimeString('ar-SA');
        
        let content = `
            <div style="text-align: center; margin-bottom: 3rem; border-bottom: 3px solid #gold; padding-bottom: 2rem;">
                <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
                    <div style="font-size: 4rem;">🏆</div>
                    <h1 style="color: #d4af37; font-size: 2.8rem; margin: 0 1rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">قائمة الفائزين الرسمية</h1>
                    <div style="font-size: 4rem;">🏆</div>
                </div>
                <div style="background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 1.5rem; border-radius: 15px; margin: 1rem 0;">
                    <p style="font-size: 1.3rem; color: #495057; margin: 0.5rem 0;"><strong>📅 تاريخ السحب:</strong> ${currentDate}</p>
                    <p style="font-size: 1.1rem; color: #6c757d; margin: 0.5rem 0;"><strong>🕐 وقت السحب:</strong> ${currentTime}</p>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 1rem; text-align: center;">
                        <div style="background: #e3f2fd; padding: 1rem; border-radius: 10px;">
                            <div style="font-size: 2rem; font-weight: bold; color: #1976d2;">${participants.length}</div>
                            <div style="color: #424242;">إجمالي المشاركين</div>
                        </div>
                        <div style="background: #e8f5e8; padding: 1rem; border-radius: 10px;">
                            <div style="font-size: 2rem; font-weight: bold; color: #388e3c;">${winners.length}</div>
                            <div style="color: #424242;">عدد الفائزين</div>
                        </div>
                        <div style="background: #fff3e0; padding: 1rem; border-radius: 10px;">
                            <div style="font-size: 2rem; font-weight: bold; color: #f57c00;">${Math.round((winners.length / participants.length) * 100)}%</div>
                            <div style="color: #424242;">نسبة الفوز</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="display: grid; gap: 2.5rem;">
        `;
        
        winners.forEach((winner, index) => {
            const medalColors = {
                0: { bg: 'linear-gradient(135deg, #ffd700, #ffed4e)', border: '#ffc107', icon: '🥇' },
                1: { bg: 'linear-gradient(135deg, #c0c0c0, #e8e8e8)', border: '#9e9e9e', icon: '🥈' },
                2: { bg: 'linear-gradient(135deg, #cd7f32, #deb887)', border: '#8d5524', icon: '🥉' }
            };
            const style = medalColors[index] || { bg: 'linear-gradient(135deg, #667eea, #764ba2)', border: '#5a67d8', icon: '🏅' };
            
            content += `
                <div style="border: 3px solid ${style.border}; padding: 2rem; border-radius: 20px; position: relative; background: ${style.bg}; color: ${index < 3 ? '#333' : 'white'}; box-shadow: 0 10px 30px rgba(0,0,0,0.1); page-break-inside: avoid;">
                    <div style="position: absolute; top: -20px; right: 30px; background: ${style.border}; color: white; padding: 0.8rem 1.5rem; border-radius: 30px; font-weight: bold; font-size: 1.2rem; box-shadow: 0 5px 15px rgba(0,0,0,0.2);">
                        ${style.icon} المركز ${index + 1}
                    </div>
                    
                    <div style="margin-top: 1rem;">
                        <div style="text-align: center; margin-bottom: 2rem;">
                            <h2 style="font-size: 2.2rem; margin-bottom: 0.5rem; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">
                                ${winner.customer_name || 'غير محدد'}
                            </h2>
                            <div style="font-size: 1.3rem; opacity: 0.9; background: rgba(255,255,255,0.2); padding: 0.7rem 1.5rem; border-radius: 25px; display: inline-block;">
                                💳 ${winner.card_number || 'غير محدد'}
                            </div>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem;">
                            <div style="background: rgba(255,255,255,0.15); padding: 1.2rem; border-radius: 12px; text-align: center;">
                                <div style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 0.5rem;">📱 رقم الهاتف</div>
                                <div style="font-size: 1.2rem; font-weight: bold;">${winner.phone_number || 'غير محدد'}</div>
                            </div>
                            <div style="background: rgba(255,255,255,0.15); padding: 1.2rem; border-radius: 12px; text-align: center;">
                                <div style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 0.5rem;">📅 تاريخ التسجيل</div>
                                <div style="font-size: 1.2rem; font-weight: bold;">${new Date(winner.created_at).toLocaleDateString('ar-SA')}</div>
                            </div>
                        </div>
                        
                        ${winner.email ? `
                            <div style="background: rgba(255,255,255,0.15); padding: 1.2rem; border-radius: 12px; text-align: center; margin-top: 1.5rem;">
                                <div style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 0.5rem;">📧 البريد الإلكتروني</div>
                                <div style="font-size: 1.1rem; font-weight: bold;">${winner.email}</div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        
        content += `
            </div>
            
            <div style="margin-top: 4rem; padding-top: 2rem; border-top: 2px solid #dee2e6; text-align: center; color: #6c757d;">
                <p style="margin: 0.5rem 0;">🎰 تم إجراء السحب باستخدام نظام متقدم يضمن العدالة والشفافية</p>
                <p style="margin: 0.5rem 0;">📊 النظام يستخدم خوارزميات عشوائية معتمدة لضمان نزاهة النتائج</p>
                <p style="margin: 0.5rem 0; font-size: 0.9rem;">طُبع في: ${new Date().toLocaleString('ar-SA')}</p>
            </div>
        `;
        
        return content;
    }
    
    /**
     * توليد محتوى شهادات الفوز المحسنة
     */
    function generateCertificatesPrintContent() {
        const winners = window.winners || [];
        const currentDate = new Date().toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        let content = '';
        
        winners.forEach((winner, index) => {
            const medalInfo = {
                0: { title: 'الفائز الأول', color: '#ffd700', icon: '🥇', bg: 'linear-gradient(135deg, #ffd700, #ffed4e)' },
                1: { title: 'الفائز الثاني', color: '#c0c0c0', icon: '🥈', bg: 'linear-gradient(135deg, #c0c0c0, #e8e8e8)' },
                2: { title: 'الفائز الثالث', color: '#cd7f32', icon: '🥉', bg: 'linear-gradient(135deg, #cd7f32, #deb887)' }
            };
            const info = medalInfo[index] || { title: `الفائز رقم ${index + 1}`, color: '#667eea', icon: '🏅', bg: 'linear-gradient(135deg, #667eea, #764ba2)' };
            
            content += `
                <div style="page-break-after: always; padding: 3rem; min-height: 90vh; display: flex; flex-direction: column; justify-content: center; background: white; position: relative; overflow: hidden;">
                    
                    <!-- الخلفية الزخرفية -->
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.05; background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px); pointer-events: none;"></div>
                    
                    <!-- الإطار الذهبي -->
                    <div style="position: absolute; top: 2rem; left: 2rem; right: 2rem; bottom: 2rem; border: 8px solid ${info.color}; border-radius: 20px; background: ${info.bg}; opacity: 0.1;"></div>
                    <div style="position: absolute; top: 2.5rem; left: 2.5rem; right: 2.5rem; bottom: 2.5rem; border: 4px solid ${info.color}; border-radius: 15px;"></div>
                    
                    <!-- المحتوى -->
                    <div style="position: relative; z-index: 1; text-align: center;">
                        
                        <!-- العنوان -->
                        <div style="margin-bottom: 3rem;">
                            <div style="font-size: 6rem; margin-bottom: 1rem;">${info.icon}</div>
                            <h1 style="font-size: 3.5rem; color: ${info.color}; margin-bottom: 1rem; text-shadow: 3px 3px 6px rgba(0,0,0,0.2); font-family: 'Times New Roman', serif;">
                                شـهـادة فـوز
                            </h1>
                            <div style="width: 200px; height: 4px; background: ${info.bg}; margin: 0 auto; border-radius: 2px;"></div>
                        </div>
                        
                        <!-- النص الرئيسي -->
                        <div style="margin: 3rem 0; line-height: 2;">
                            <p style="font-size: 1.8rem; margin-bottom: 2rem; color: #333;">نشهد بأن المكرم / المكرمة</p>
                            
                            <div style="background: ${info.bg}; color: white; padding: 2rem 3rem; border-radius: 15px; margin: 2rem auto; display: inline-block; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                                <h2 style="font-size: 3rem; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); font-weight: bold;">
                                    ${winner.customer_name || 'غير محدد'}
                                </h2>
                            </div>
                            
                            <p style="font-size: 1.8rem; margin: 2rem 0; color: #333;">
                                قد حصل على <strong style="color: ${info.color};">${info.title}</strong><br>
                                في السحب الذي تم إجراؤه بتاريخ
                            </p>
                            
                            <div style="font-size: 1.5rem; color: #666; margin: 2rem 0;">
                                <strong>${currentDate}</strong>
                            </div>
                        </div>
                        
                        <!-- تفاصيل الفائز -->
                        <div style="background: #f8f9fa; padding: 2rem; border-radius: 15px; margin: 3rem auto; max-width: 500px; border-left: 5px solid ${info.color};">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; text-align: right;">
                                <div>
                                    <strong style="color: #333;">💳 رقم الكارت:</strong><br>
                                    <span style="font-size: 1.2rem; color: #666;">${winner.card_number || 'غير محدد'}</span>
                                </div>
                                <div>
                                    <strong style="color: #333;">📱 رقم الهاتف:</strong><br>
                                    <span style="font-size: 1.2rem; color: #666;">${winner.phone_number || 'غير محدد'}</span>
                                </div>
                            </div>
                            <div style="margin-top: 1rem; text-align: center;">
                                <strong style="color: #333;">📅 تاريخ التسجيل:</strong>
                                <span style="font-size: 1.1rem; color: #666;">${new Date(winner.created_at).toLocaleDateString('ar-SA')}</span>
                            </div>
                        </div>
                        
                        <!-- التوقيع والختم -->
                        <div style="margin-top: 4rem; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem;">
                            <div style="text-align: center;">
                                <div style="border-bottom: 2px solid #333; width: 200px; margin: 0 auto 1rem;"></div>
                                <p style="color: #666; margin: 0;">التوقيع</p>
                            </div>
                            <div style="text-align: center;">
                                <div style="width: 80px; height: 80px; border: 3px solid ${info.color}; border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; background: ${info.bg}; color: white; font-size: 2rem; font-weight: bold;">
                                    ${info.icon}
                                </div>
                                <p style="color: #666; margin: 0;">الختم الرسمي</p>
                            </div>
                        </div>
                        
                        <!-- تاريخ الإصدار -->
                        <div style="margin-top: 3rem; text-align: center; color: #999; font-size: 0.9rem;">
                            تاريخ إصدار الشهادة: ${new Date().toLocaleString('ar-SA')}
                        </div>
                    </div>
                </div>
            `;
        });
        
        return content;
    }
    
    /**
     * توليد التقرير الكامل المحسن
     */
    function generateFullReportPrintContent() {
        const winners = window.winners || [];
        const participants = window.participants || [];
        const currentDate = new Date().toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
        
        // تحليل البيانات
        const stats = analyzeParticipantData(participants, winners);
        
        return `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6;">
                
                <!-- صفحة الغلاف -->
                <div style="page-break-after: always; text-align: center; padding: 4rem 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; min-height: 80vh; display: flex; flex-direction: column; justify-content: center;">
                    <div style="font-size: 8rem; margin-bottom: 2rem;">📊</div>
                    <h1 style="font-size: 4rem; margin-bottom: 2rem; text-shadow: 3px 3px 6px rgba(0,0,0,0.3);">
                        التقرير الشامل للسحب
                    </h1>
                    <div style="font-size: 1.8rem; opacity: 0.9; margin-bottom: 3rem;">
                        تحليل مفصل ونتائج السحب الرسمية
                    </div>
                    <div style="background: rgba(255,255,255,0.2); padding: 2rem; border-radius: 15px; backdrop-filter: blur(10px);">
                        <p style="font-size: 1.3rem; margin: 0.5rem 0;">📅 تاريخ التقرير: ${currentDate}</p>
                        <p style="font-size: 1.1rem; margin: 0.5rem 0;">🕐 وقت الإنشاء: ${new Date().toLocaleTimeString('ar-SA')}</p>
                        <p style="font-size: 1.1rem; margin: 0.5rem 0;">👥 إجمالي المشاركين: ${participants.length}</p>
                        <p style="font-size: 1.1rem; margin: 0.5rem 0;">🏆 عدد الفائزين: ${winners.length}</p>
                    </div>
                </div>
                
                <!-- ملخص تنفيذي -->
                <div style="page-break-after: always; padding: 2rem;">
                    <h2 style="color: #333; border-bottom: 3px solid #667eea; padding-bottom: 1rem; margin-bottom: 2rem;">📋 الملخص التنفيذي</h2>
                    
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; margin-bottom: 3rem;">
                        <div style="background: #e3f2fd; padding: 2rem; border-radius: 15px; text-align: center;">
                            <div style="font-size: 3rem; color: #1976d2; margin-bottom: 1rem;">${participants.length}</div>
                            <h3 style="color: #333; margin: 0;">إجمالي المشاركين</h3>
                            <p style="color: #666; margin-top: 0.5rem;">العدد الكلي للمسجلين</p>
                        </div>
                        <div style="background: #e8f5e8; padding: 2rem; border-radius: 15px; text-align: center;">
                            <div style="font-size: 3rem; color: #388e3c; margin-bottom: 1rem;">${winners.length}</div>
                            <h3 style="color: #333; margin: 0;">عدد الفائزين</h3>
                            <p style="color: #666; margin-top: 0.5rem;">المختارين في السحب</p>
                        </div>
                    </div>
                    
                    <div style="background: #fff3e0; padding: 2rem; border-radius: 15px; margin-bottom: 2rem;">
                        <h3 style="color: #f57c00; margin-bottom: 1rem;">📈 إحصائيات السحب</h3>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                            <div style="text-align: center;">
                                <div style="font-size: 2rem; color: #f57c00;">${Math.round((winners.length / participants.length) * 100)}%</div>
                                <div style="color: #666;">نسبة الفوز</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 2rem; color: #f57c00;">${stats.averageRegistrationDays}</div>
                                <div style="color: #666;">متوسط أيام التسجيل</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 2rem; color: #f57c00;">${stats.totalRegistrationPeriod}</div>
                                <div style="color: #666;">فترة التسجيل (يوم)</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: #f3e5f5; padding: 2rem; border-radius: 15px;">
                        <h3 style="color: #8e24aa; margin-bottom: 1rem;">🔍 تفاصيل إضافية</h3>
                        <ul style="margin: 0; padding-right: 1.5rem; color: #666;">
                            <li>تم استخدام خوارزمية عشوائية متقدمة لضمان العدالة</li>
                            <li>جميع المشاركين لديهم فرصة متساوية في الفوز</li>
                            <li>تم التحقق من صحة جميع البيانات قبل السحب</li>
                            <li>النتائج نهائية وغير قابلة للطعن</li>
                        </ul>
                    </div>
                </div>
                
                <!-- قائمة الفائزين -->
                <div style="page-break-after: always; padding: 2rem;">
                    <h2 style="color: #333; border-bottom: 3px solid #4caf50; padding-bottom: 1rem; margin-bottom: 2rem;">🏆 قائمة الفائزين التفصيلية</h2>
                    ${generateWinnersPrintContent()}
                </div>
                
                <!-- قائمة جميع المشاركين -->
                <div style="padding: 2rem;">
                    <h2 style="color: #333; border-bottom: 3px solid #ff9800; padding-bottom: 1rem; margin-bottom: 2rem;">👥 قائمة جميع المشاركين</h2>
                    
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-top: 2rem;">
                        ${participants.map((participant, index) => `
                            <div style="border: 1px solid #ddd; padding: 1.2rem; border-radius: 8px; background: ${winners.some(w => w.id === participant.id) ? '#e8f5e8' : '#f8f9fa'}; position: relative;">
                                ${winners.some(w => w.id === participant.id) ? '<div style="position: absolute; top: 0.5rem; left: 0.5rem; background: #4caf50; color: white; padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem; font-weight: bold;">فائز</div>' : ''}
                                <div style="margin-top: ${winners.some(w => w.id === participant.id) ? '1.5rem' : '0'};"><strong style="color: #333;">${participant.customer_name}</strong></div>
                                <div style="color: #666; font-size: 0.9rem;">💳 ${participant.card_number}</div>
                                <div style="color: #666; font-size: 0.9rem;">📱 ${participant.phone_number}</div>
                                <div style="color: #999; font-size: 0.8rem;">📅 ${new Date(participant.created_at).toLocaleDateString('ar-SA')}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- الخاتمة -->
                <div style="margin-top: 4rem; padding: 2rem; background: #f8f9fa; border-radius: 15px; text-align: center; border-top: 4px solid #667eea;">
                    <h3 style="color: #333; margin-bottom: 1rem;">🛡️ ضمان النزاهة والشفافية</h3>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin: 2rem 0;">
                        <div>
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔒</div>
                            <h4 style="color: #333; margin: 0.5rem 0;">أمان البيانات</h4>
                            <p style="color: #666; font-size: 0.9rem;">حماية كاملة لجميع المعلومات</p>
                        </div>
                        <div>
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">⚖️</div>
                            <h4 style="color: #333; margin: 0.5rem 0;">العدالة</h4>
                            <p style="color: #666; font-size: 0.9rem;">فرص متساوية لجميع المشاركين</p>
                        </div>
                        <div>
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">📊</div>
                            <h4 style="color: #333; margin: 0.5rem 0;">الشفافية</h4>
                            <p style="color: #666; font-size: 0.9rem;">نتائج واضحة وقابلة للتحقق</p>
                        </div>
                    </div>
                    <p style="color: #666; margin-top: 2rem; font-size: 0.9rem;">
                        تم إنشاء هذا التقرير تلقائياً بواسطة نظام السحب المتقدم<br>
                        📄 طُبع في: ${new Date().toLocaleString('ar-SA')}
                    </p>
                </div>
            </div>
        `;
    }
    
    /**
     * تحليل بيانات المشاركين
     */
    function analyzeParticipantData(participants, winners) {
        if (!participants.length) {
            return {
                averageRegistrationDays: 0,
                totalRegistrationPeriod: 0,
                participantsByDay: {},
                winnersByDay: {}
            };
        }
        
        const dates = participants.map(p => new Date(p.created_at));
        const oldestDate = new Date(Math.min(...dates));
        const newestDate = new Date(Math.max(...dates));
        const totalDays = Math.ceil((newestDate - oldestDate) / (1000 * 60 * 60 * 24)) || 1;
        const averageDays = Math.round(totalDays / participants.length * 10) / 10;
        
        return {
            averageRegistrationDays: averageDays,
            totalRegistrationPeriod: totalDays,
            oldestRegistration: oldestDate.toLocaleDateString('ar-SA'),
            newestRegistration: newestDate.toLocaleDateString('ar-SA')
        };
    }
    
    /**
     * فتح نافذة الطباعة المحسنة
     */
    function openPrintWindow(content, title) {
        const printWindow = window.open('', '_blank', 'width=1000,height=700,scrollbars=yes');
        
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${title} - نظام السحب المتقدم</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body { 
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                        padding: 2rem; 
                        line-height: 1.6; 
                        background: white;
                        color: #333;
                    }
                    
                    @media print { 
                        body { 
                            margin: 0; 
                            padding: 1rem; 
                            font-size: 12pt;
                        }
                        .no-print { 
                            display: none !important; 
                        }
                        .page-break { 
                            page-break-before: always; 
                        }
                        .avoid-break { 
                            page-break-inside: avoid; 
                        }
                    }
                    
                    .print-header {
                        background: linear-gradient(135deg, #667eea, #764ba2);
                        color: white;
                        padding: 1rem;
                        border-radius: 10px;
                        margin-bottom: 2rem;
                        text-align: center;
                    }
                    
                    .print-controls {
                        position: fixed;
                        top: 20px;
                        left: 20px;
                        background: white;
                        padding: 1rem;
                        border-radius: 10px;
                        box-shadow: 0 5px 20px rgba(0,0,0,0.1);
                        z-index: 1000;
                        border: 2px solid #667eea;
                    }
                    
                    .print-btn {
                        background: #667eea;
                        color: white;
                        border: none;
                        padding: 0.8rem 1.5rem;
                        border-radius: 25px;
                        cursor: pointer;
                        margin: 0.25rem;
                        font-weight: bold;
                        transition: all 0.3s ease;
                        font-size: 0.9rem;
                    }
                    
                    .print-btn:hover {
                        background: #5a67d8;
                        transform: translateY(-2px);
                        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
                    }
                    
                    .print-btn.secondary {
                        background: #6c757d;
                    }
                    
                    .print-btn.secondary:hover {
                        background: #5a6268;
                    }
                    
                    h1, h2, h3 {
                        color: #333;
                        margin-bottom: 1rem;
                    }
                    
                    .loading-message {
                        text-align: center;
                        padding: 2rem;
                        color: #666;
                        font-style: italic;
                    }
                </style>
            </head>
            <body>
                <div class="print-controls no-print">
                    <div style="margin-bottom: 1rem; font-weight: bold; color: #333; text-align: center;">
                        🖨️ أدوات الطباعة
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <button onclick="window.print()" class="print-btn">
                            🖨️ طباعة
                        </button>
                        <button onclick="downloadPDF()" class="print-btn">
                            📄 حفظ PDF
                        </button>
                        <button onclick="window.close()" class="print-btn secondary">
                            ❌ إغلاق
                        </button>
                    </div>
                </div>
                
                <div class="print-header no-print">
                    <h1 style="margin: 0; font-size: 1.8rem;">🎰 ${title}</h1>
                    <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">نظام السحب المتقدم - إصدار احترافي</p>
                </div>
                
                <div id="printContent">
                    ${content}
                </div>
                
                <script>
                    // وظيفة حفظ PDF (تتطلب مكتبة خارجية في التطبيق الفعلي)
                    function downloadPDF() {
                        // في التطبيق الفعلي، يمكن استخدام مكتبة مثل jsPDF
                        alert('ميزة حفظ PDF ستكون متوفرة قريباً. يمكنك استخدام خيار الطباعة واختيار "حفظ كـ PDF" من متصفحك.');
                    }
                    
                    // تحسين الطباعة
                    window.addEventListener('beforeprint', function() {
                        console.log('جاري التحضير للطباعة...');
                    });
                    
                    window.addEventListener('afterprint', function() {
                        console.log('تم الانتهاء من الطباعة');
                    });
                    
                    // تركيز تلقائي على نافذة الطباعة
                    window.focus();
                    
                    console.log('✅ تم تحميل نافذة الطباعة بنجاح');
                </script>
            </body>
            </html>
        `;
        
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // انتظار تحميل المحتوى ثم التركيز
        setTimeout(() => {
            printWindow.focus();
        }, 500);
        
        console.log(`🖨️ تم فتح نافذة طباعة: ${title}`);
    }
    
    /**
     * عرض رسالة للمستخدم مع تحسينات
     */
    function showMessage(message, type = 'info', duration = 4000) {
        console.log(`💬 رسالة ${type}: ${message}`);
        
        // إزالة الرسائل القديمة من نفس النوع
        const existingMessages = document.querySelectorAll(`.message-notification.message-${type}`);
        existingMessages.forEach(msg => msg.remove());
        
        // إنشاء عنصر الرسالة
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-notification message-${type}`;
        
        // تحديد الأيقونة حسب النوع
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        messageDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div style="font-size: 1.5rem;">${icons[type] || icons.info}</div>
                <div style="flex: 1;">
                    <div style="font-weight: bold; margin-bottom: 0.25rem;">
                        ${type === 'success' ? 'نجح!' : type === 'error' ? 'خطأ!' : type === 'warning' ? 'تحذير!' : 'معلومة'}
                    </div>
                    <div style="opacity: 0.9; font-size: 0.95rem;">
                        ${message}
                    </div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; opacity: 0.7; padding: 0.25rem; border-radius: 3px; transition: opacity 0.3s ease;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">
                    ×
                </button>
            </div>
        `;
        
        // إضافة الرسالة للصفحة
        document.body.appendChild(messageDiv);
        
        // تأثير الدخول
        setTimeout(() => {
            messageDiv.style.transform = 'translateX(0)';
            messageDiv.style.opacity = '1';
        }, 100);
        
        // إزالة تلقائية
        if (duration > 0) {
            setTimeout(() => {
                removeMessage(messageDiv);
            }, duration);
        }
        
        // تشغيل صوت مناسب
        if (type === 'error') {
            playSound('error');
        } else if (type === 'success') {
            playSound('success');
        } else {
            playSound('click');
        }
        
        return messageDiv;
    }
    
    /**
     * إزالة الرسالة مع تأثير
     */
    function removeMessage(messageElement) {
        if (!messageElement || !messageElement.parentNode) return;
        
        messageElement.style.transition = 'all 0.5s ease';
        messageElement.style.transform = 'translateX(100px)';
        messageElement.style.opacity = '0';
        
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 500);
    }
    
    /**
     * تنظيف النظام وإعادة التعيين
     */
    function cleanup() {
        console.log('🧹 تنظيف النظام');
        
        // إيقاف التأثيرات النشطة
        if (currentAnimation) {
            clearInterval(currentAnimation);
            currentAnimation = null;
        }
        
        // إيقاف الكونفيتي
        stopConfetti();
        
        // إعادة تعيين المتغيرات
        isDrawInProgress = false;
        currentStep = 0;
        totalSteps = 0;
        
        // تنظيف عناصر التحميل
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.remove();
        }
        
        // تنظيف الرسائل القديمة
        const oldMessages = document.querySelectorAll('.message-notification');
        oldMessages.forEach(msg => {
            if (msg.style.opacity !== '0') {
                removeMessage(msg);
            }
        });
        
        // إعادة تفعيل زر السحب
        const drawButton = document.getElementById('megaDrawButton');
        if (drawButton) {
            drawButton.disabled = false;
            drawButton.innerHTML = '🎰 بدء السحب المتقدم';
            drawButton.style.background = '';
        }
        
        console.log('✅ تم تنظيف النظام بنجاح');
    }
    
    /**
     * معالج أخطاء عام
     */
    window.addEventListener('error', function(event) {
        console.error('❌ خطأ في النظام:', event.error);
        
        if (isDrawInProgress) {
            showMessage('حدث خطأ غير متوقع. جاري إعادة تعيين النظام...', 'error');
            setTimeout(() => {
                cleanup();
                window.location.reload();
            }, 3000);
        }
    });
    
    /**
     * معالج رفض الوعود غير المُعالجة
     */
    window.addEventListener('unhandledrejection', function(event) {
        console.error('❌ وعد مرفوض غير مُعالج:', event.reason);
        
        if (isDrawInProgress) {
            showMessage('حدث خطأ في معالجة البيانات. يرجى المحاولة مرة أخرى.', 'error');
            cleanup();
        }
    });
    
    /**
     * حفظ حالة النظام قبل مغادرة الصفحة
     */
    window.addEventListener('beforeunload', function(event) {
        if (isDrawInProgress) {
            event.preventDefault();
            event.returnValue = 'السحب قيد التنفيذ. هل أنت متأكد من أنك تريد مغادرة الصفحة؟';
            return event.returnValue;
        }
        
        // تنظيف سريع
        cleanup();
    });
    
    /**
     * إضافة دعم للمطورين
     */
    if (typeof window.console !== 'undefined') {
        console.log('%c🎰 نظام السحب المتقدم', 'color: #667eea; font-size: 20px; font-weight: bold;');
        console.log('%cتم تحميل جميع الوظائف بنجاح!', 'color: #4caf50; font-size: 14px;');
        console.log('%cللمطورين: استخدم window.lotterySystem للوصول للوظائف', 'color: #666; font-size: 12px;');
        
        // إتاحة وظائف النظام للمطورين
        window.lotterySystem = {
            playSound,
            showMessage,
            startConfetti,
            stopConfetti,
            cleanup,
            getParticipantData,
            validateFormData,
            version: '2.0.0',
            isDrawInProgress: () => isDrawInProgress
        };
    }
    
    console.log('🎉 تم تحميل نظام السحب المتقدم بنجاح - الإصدار 2.0.0');
});

// تصدير الوظائف للاستخدام الخارجي (إن لزم الأمر)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeAdvancedSystem,
        playSound,
        showMessage,
        startConfetti,
        stopConfetti,
        cleanup
    };
}