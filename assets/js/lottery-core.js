// النظام الأساسي للسحب المتقدم - الوحدة الرئيسية
class LotteryCore {
    constructor() {
        this.isDrawInProgress = false;
        this.currentAnimation = null;
        this.currentStep = 0;
        this.totalSteps = 0;
        this.participants = [];
        this.winners = [];
        
        console.log('🎰 تم تهيئة النظام الأساسي للسحب');
    }

    /**
     * تهيئة النظام الكامل
     */
    initialize() {
        console.log('🚀 تهيئة النظام المتقدم');
        
        // تهيئة الوظائف الأساسية
        this.setupDateValidation();
        this.setupWinnersCountControl();
        this.setupLotteryForm();
        this.setupKeyboardShortcuts();
        this.setupResponsiveHandlers();
        
        // تحضير الواجهة
        this.prepareInterface();
        
        console.log('✅ تم تهيئة النظام بنجاح');
    }

    /**
     * إعداد التحقق من التواريخ المحسن
     */
    setupDateValidation() {
        const dateFromInput = document.getElementById('date_from');
        const dateToInput = document.getElementById('date_to');
        
        if (dateFromInput && dateToInput) {
            // تحديد الحد الأقصى للتاريخ (اليوم)
            const today = new Date().toISOString().split('T')[0];
            dateToInput.max = today;
            
            // إضافة مستمعات الأحداث المحسنة
            dateFromInput.addEventListener('change', () => {
                this.validateDateRange(dateFromInput, dateToInput);
                window.lotteryAudio?.playSound('click');
            });
            
            dateToInput.addEventListener('change', () => {
                this.validateDateRange(dateFromInput, dateToInput);
                window.lotteryAudio?.playSound('click');
            });
            
            // التحقق من التواريخ عند التحميل
            this.validateDateRange(dateFromInput, dateToInput);
        }
    }

    /**
     * التحقق من نطاق التواريخ
     */
    validateDateRange(fromInput, toInput) {
        const fromDate = new Date(fromInput.value);
        const toDate = new Date(toInput.value);
        const today = new Date();
        
        // التحقق من صحة التواريخ
        if (fromDate > today) {
            window.lotteryUI?.showMessage('تاريخ البداية لا يمكن أن يكون في المستقبل', 'warning');
            fromInput.value = today.toISOString().split('T')[0];
            return false;
        }
        
        if (toDate > today) {
            window.lotteryUI?.showMessage('تاريخ النهاية لا يمكن أن يكون في المستقبل', 'warning');
            toInput.value = today.toISOString().split('T')[0];
            return false;
        }
        
        if (fromDate > toDate) {
            window.lotteryUI?.showMessage('تاريخ البداية يجب أن يكون قبل تاريخ النهاية', 'error');
            toInput.value = fromInput.value;
            return false;
        }
        
        return true;
    }

    /**
     * إعداد تحكم عدد الفائزين المحسن
     */
    setupWinnersCountControl() {
        const winnersInput = document.getElementById('winners_count');
        const winnersDisplay = document.getElementById('winnersDisplay');
        
        if (winnersInput && winnersDisplay) {
            // إضافة تأثيرات بصرية
            winnersInput.addEventListener('input', () => {
                this.updateWinnersDisplay(winnersInput, winnersDisplay);
            });
            
            winnersInput.addEventListener('focus', function() {
                this.select();
                window.lotteryAudio?.playSound('focus');
            });
            
            winnersInput.addEventListener('blur', () => {
                this.validateWinnersCount(winnersInput);
            });
            
            // تهيئة القيمة الابتدائية
            this.updateWinnersDisplay(winnersInput, winnersDisplay);
        }
    }

    /**
     * تحديث عرض عدد الفائزين
     */
    updateWinnersDisplay(input, display) {
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
        
        window.lotteryAudio?.playSound('tick');
    }

    /**
     * التحقق من صحة عدد الفائزين
     */
    validateWinnersCount(input) {
        const value = parseInt(input.value);
        const participants = this.getParticipantData();
        
        if (isNaN(value) || value < 1) {
            window.lotteryUI?.showMessage('عدد الفائزين يجب أن يكون رقم صحيح أكبر من صفر', 'error');
            input.value = 1;
            return false;
        }
        
        if (value > 50) {
            window.lotteryUI?.showMessage('الحد الأقصى لعدد الفائزين هو 50', 'warning');
            input.value = 50;
            return false;
        }
        
        if (participants.length > 0 && value > participants.length) {
            window.lotteryUI?.showMessage(`عدد الفائزين (${value}) أكبر من عدد المشاركين (${participants.length})`, 'warning');
            input.value = Math.min(value, participants.length);
            return false;
        }
        
        return true;
    }

    /**
     * إعداد نموذج السحب المحسن
     */
    setupLotteryForm() {
        const lotteryForm = document.getElementById('multiLotteryForm');
        if (!lotteryForm) return;
        
        lotteryForm.addEventListener('submit', (e) => {
            console.log('📝 تم إرسال نموذج السحب المتقدم');
            
            // منع السحب المتعدد
            if (this.isDrawInProgress) {
                e.preventDefault();
                window.lotteryUI?.showMessage('السحب قيد التنفيذ بالفعل، يرجى الانتظار...', 'warning');
                window.lotteryAudio?.playSound('error');
                return;
            }
            
            // التحقق من صحة البيانات
            if (!this.validateFormData()) {
                e.preventDefault();
                return;
            }
            
            // جلب بيانات المشاركين
            const participantData = this.getParticipantData();
            const winnersCount = parseInt(document.getElementById('winners_count').value) || 1;
            
            if (!participantData || participantData.length === 0) {
                console.log('⚠️ لا يوجد مشاركين، إرسال النموذج العادي');
                return; // السماح بالإرسال العادي
            }
            
            if (participantData.length < winnersCount) {
                e.preventDefault();
                window.lotteryUI?.showMessage(`عدد المشاركين (${participantData.length}) أقل من عدد الفائزين المطلوب (${winnersCount})`, 'error');
                window.lotteryAudio?.playSound('error');
                return;
            }
            
            console.log(`✅ بدء السحب: ${participantData.length} مشارك، ${winnersCount} فائز`);
            
            // بدء التأثيرات المتقدمة
            e.preventDefault();
            this.startAdvancedLotterySequence(lotteryForm, participantData, winnersCount);
        });
        
        // إضافة مستمعات أحداث إضافية
        const formInputs = lotteryForm.querySelectorAll('input, select');
        formInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.clearFormErrors();
                window.lotteryAudio?.playSound('click');
            });
        });
    }

    /**
     * التحقق من صحة بيانات النموذج
     */
    validateFormData() {
        const dateFrom = document.getElementById('date_from').value;
        const dateTo = document.getElementById('date_to').value;
        const winnersCount = document.getElementById('winners_count').value;
        
        if (!dateFrom || !dateTo) {
            window.lotteryUI?.showMessage('يرجى تحديد فترة التاريخ', 'error');
            window.lotteryAudio?.playSound('error');
            return false;
        }
        
        if (new Date(dateFrom) > new Date(dateTo)) {
            window.lotteryUI?.showMessage('تاريخ البداية يجب أن يكون قبل تاريخ النهاية', 'error');
            window.lotteryAudio?.playSound('error');
            return false;
        }
        
        if (!winnersCount || parseInt(winnersCount) < 1 || parseInt(winnersCount) > 50) {
            window.lotteryUI?.showMessage('عدد الفائزين يجب أن يكون بين 1 و 50', 'error');
            window.lotteryAudio?.playSound('error');
            return false;
        }
        
        return true;
    }

    /**
     * مسح أخطاء النموذج
     */
    clearFormErrors() {
        const errorMessages = document.querySelectorAll('.message-notification.message-error');
        errorMessages.forEach(msg => msg.remove());
    }

    /**
     * جلب بيانات المشاركين مع التحقق المحسن
     */
    getParticipantData() {
        try {
            if (typeof window.participants !== 'undefined' && Array.isArray(window.participants)) {
                console.log(`📊 تم جلب ${window.participants.length} مشارك`);
                this.participants = window.participants;
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
    startAdvancedLotterySequence(lotteryForm, participantData, winnersCount) {
        console.log('🎰 بدء السحب المتقدم');
        
        this.isDrawInProgress = true;
        
        // إظهار تأثير التحميل
        window.lotteryUI?.showLoadingOverlay();
        
        // تشغيل صوت البداية
        window.lotteryAudio?.playSound('start');
        
        // إعداد الماكينة
        const machine = this.setupAdvancedLotteryMachine(participantData, winnersCount);
        if (!machine) {
            window.lotteryUI?.hideLoadingOverlay();
            this.submitFormDirectly(lotteryForm);
            return;
        }
        
        // إخفاء تأثير التحميل
        setTimeout(() => {
            window.lotteryUI?.hideLoadingOverlay();
            
            // تسلسل التأثيرات المتقدم
            window.lotteryAnimations?.startEnhancedAnimationSequence(
                machine, 
                participantData, 
                winnersCount, 
                (winners) => this.onDrawComplete(lotteryForm, winners)
            );
        }, 1500);
    }

    /**
     * إعداد ماكينة السحب المتقدمة
     */
    setupAdvancedLotteryMachine(participantData, winnersCount) {
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
     * معالج انتهاء السحب
     */
    onDrawComplete(lotteryForm, winners) {
        console.log('🏆 تم انتهاء السحب، النتائج:', winners);
        
        this.winners = winners || [];
        window.winners = this.winners; // حفظ النتائج للاستخدام العام
        
        // تأخير قصير لضمان عرض التأثيرات
        setTimeout(() => {
            this.submitFormDirectly(lotteryForm);
        }, 2000);
    }

    /**
     * إرسال النموذج مباشرة مع التنظيف
     */
    submitFormDirectly(lotteryForm) {
        try {
            console.log('📤 إرسال النموذج مع التنظيف');
            
            // تنظيف التأثيرات
            this.cleanup();
            
            // إضافة معلومات الفائزين إلى النموذج إذا وجدت
            if (this.winners && this.winners.length > 0) {
                const winnersInput = document.createElement('input');
                winnersInput.type = 'hidden';
                winnersInput.name = 'winners_data';
                winnersInput.value = JSON.stringify(this.winners);
                lotteryForm.appendChild(winnersInput);
            }
            
            // إرسال النموذج
            lotteryForm.submit();
        } catch (error) {
            console.error('❌ خطأ في إرسال النموذج:', error);
            window.lotteryUI?.showMessage('حدث خطأ في إرسال النموذج، جاري إعادة التحميل...', 'error');
            
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    }

    /**
     * إعداد اختصارات لوحة المفاتيح
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // تعطيل الاختصارات أثناء السحب
            if (this.isDrawInProgress) return;
            
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
                    window.lotteryPrint?.printWinners();
                }
            }
            
            // Escape: إيقاف الأصوات
            if (e.key === 'Escape') {
                window.lotteryAudio?.toggleSound();
            }
        });
        
        console.log('⌨️ تم إعداد اختصارات لوحة المفاتيح');
    }

    /**
     * إعداد معالجات التجاوب
     */
    setupResponsiveHandlers() {
        // معالج تغيير الاتجاه
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                window.lotteryAnimations?.updateCanvasSize();
            }, 100);
        });
        
        // معالج تغيير حجم النافذة
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                window.lotteryAnimations?.updateCanvasSize();
            }, 250);
        });
        
        console.log('📱 تم إعداد معالجات التجاوب');
    }

    /**
     * تحضير الواجهة
     */
    prepareInterface() {
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
     * تنظيف النظام وإعادة التعيين
     */
    cleanup() {
        console.log('🧹 تنظيف النظام الأساسي');
        
        // إيقاف التأثيرات النشطة
        if (this.currentAnimation) {
            clearInterval(this.currentAnimation);
            this.currentAnimation = null;
        }
        
        // إعادة تعيين المتغيرات
        this.isDrawInProgress = false;
        this.currentStep = 0;
        this.totalSteps = 0;
        
        // تنظيف عناصر التحميل
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.remove();
        }
        
        // إعادة تفعيل زر السحب
        const drawButton = document.getElementById('megaDrawButton');
        if (drawButton) {
            drawButton.disabled = false;
            drawButton.innerHTML = '🎰 بدء السحب المتقدم';
            drawButton.style.background = '';
        }
        
        console.log('✅ تم تنظيف النظام الأساسي بنجاح');
    }

    /**
     * الحصول على حالة النظام
     */
    getSystemStatus() {
        return {
            isDrawInProgress: this.isDrawInProgress,
            currentStep: this.currentStep,
            totalSteps: this.totalSteps,
            participantsCount: this.participants.length,
            winnersCount: this.winners.length
        };
    }
}

// تصدير الفئة
window.LotteryCore = LotteryCore;
