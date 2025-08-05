// النظام الأساسي للسحب المتقدم - الوحدة الرئيسية
class LotteryCore {
    constructor() {
        this.isDrawInProgress = false;
        this.currentAnimation = null;
        this.currentStep = 0;
        this.totalSteps = 0;
        this.participants = [];
        this.winners = [];
        this.settings = {
            maxWinners: 50,
            minWinners: 1,
            animationDuration: 3000,
            enableSounds: true,
            enableEffects: true
        };
        
        console.log('🎰 تم تهيئة النظام الأساسي للسحب');
    }

    /**
     * تهيئة النظام الكامل
     */
    initialize() {
        console.log('🚀 تهيئة النظام المتقدم');
        
        try {
            // تهيئة الوظائف الأساسية
            this.setupDateValidation();
            this.setupWinnersCountControl();
            this.setupLotteryForm();
            this.setupKeyboardShortcuts();
            this.setupResponsiveHandlers();
            
            // تحضير الواجهة
            this.prepareInterface();
            
            // إضافة مراقب للأخطاء
            this.setupErrorHandling();
            
            console.log('✅ تم تهيئة النظام بنجاح');
            
            // إظهار رسالة ترحيب
            this.showWelcomeMessage();
            
        } catch (error) {
            console.error('❌ خطأ في تهيئة النظام:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * إظهار رسالة ترحيب
     */
    showWelcomeMessage() {
        const notification = document.createElement('div');
        notification.className = 'welcome-notification';
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                z-index: 10000;
                animation: slideInRight 0.5s ease-out;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            ">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 1.2em;">🎰</span>
                    <span>النظام المتقدم للسحب جاهز!</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // إزالة الرسالة بعد 3 ثوان
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-in';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    /**
     * معالجة أخطاء التهيئة
     */
    handleInitializationError(error) {
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #ff4757;
                color: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                z-index: 10001;
                box-shadow: 0 4px 20px rgba(255, 71, 87, 0.3);
            ">
                <h3>⚠️ خطأ في تهيئة النظام</h3>
                <p>حدث خطأ أثناء تحميل النظام المتقدم</p>
                <button onclick="window.location.reload()" style="
                    background: white;
                    color: #ff4757;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                    margin-top: 10px;
                ">إعادة تحميل الصفحة</button>
            </div>
        `;
        document.body.appendChild(errorDiv);
    }

    /**
     * إعداد معالجة الأخطاء العامة
     */
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('❌ خطأ JavaScript:', event.error);
            this.handleGlobalError(event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('❌ وعد مرفوض:', event.reason);
            this.handleGlobalError(event.reason);
        });
    }

    /**
     * معالجة الأخطاء العامة
     */
    handleGlobalError(error) {
        // منع إظهار أخطاء متعددة
        if (this.errorShown) return;
        this.errorShown = true;

        setTimeout(() => {
            this.errorShown = false;
        }, 5000);

        // إظهار رسالة خطأ مفيدة للمستخدم
        if (window.lotteryUI && typeof window.lotteryUI.showMessage === 'function') {
            window.lotteryUI.showMessage('حدث خطأ تقني، يرجى المحاولة مرة أخرى', 'error');
        }
    }

    /**
     * إعداد التحقق من التواريخ المحسن
     */
    setupDateValidation() {
        const dateFromInput = document.getElementById('date_from');
        const dateToInput = document.getElementById('date_to');
        
        if (!dateFromInput || !dateToInput) {
            console.warn('⚠️ عناصر التاريخ غير موجودة');
            return;
        }

        try {
            // تحديد الحد الأقصى للتاريخ (اليوم)
            const today = new Date().toISOString().split('T')[0];
            dateToInput.max = today;
            dateFromInput.max = today;
            
            // تعيين تاريخ افتراضي إذا لم يكن محدد
            if (!dateFromInput.value) {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                dateFromInput.value = weekAgo.toISOString().split('T')[0];
            }
            
            if (!dateToInput.value) {
                dateToInput.value = today;
            }
            
            // إضافة مستمعات الأحداث المحسنة
            dateFromInput.addEventListener('change', (e) => {
                this.validateDateRange(dateFromInput, dateToInput);
                this.playFeedbackSound('click');
                this.addInputAnimation(e.target);
            });
            
            dateToInput.addEventListener('change', (e) => {
                this.validateDateRange(dateFromInput, dateToInput);
                this.playFeedbackSound('click');
                this.addInputAnimation(e.target);
            });

            // إضافة تأثيرات بصرية للتركيز
            [dateFromInput, dateToInput].forEach(input => {
                input.addEventListener('focus', (e) => {
                    e.target.style.boxShadow = '0 0 0 3px rgba(74, 144, 226, 0.3)';
                    e.target.style.borderColor = '#4a90e2';
                    this.playFeedbackSound('focus');
                });

                input.addEventListener('blur', (e) => {
                    e.target.style.boxShadow = '';
                    e.target.style.borderColor = '';
                });
            });
            
            // التحقق من التواريخ عند التحميل
            this.validateDateRange(dateFromInput, dateToInput);
            
            console.log('📅 تم إعداد التحقق من التواريخ');
            
        } catch (error) {
            console.error('❌ خطأ في إعداد التحقق من التواريخ:', error);
        }
    }

    /**
     * إضافة تأثير بصري للإدخال
     */
    addInputAnimation(input) {
        input.style.transform = 'scale(1.02)';
        input.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            input.style.transform = 'scale(1)';
        }, 200);
    }

    /**
     * تشغيل أصوات الإفادة
     */
    playFeedbackSound(type) {
        if (!this.settings.enableSounds) return;
        
        if (window.lotteryAudio && typeof window.lotteryAudio.playSound === 'function') {
            window.lotteryAudio.playSound(type);
        }
    }

    /**
     * التحقق من نطاق التواريخ مع رسائل محسنة
     */
    validateDateRange(fromInput, toInput) {
        try {
            const fromDate = new Date(fromInput.value);
            const toDate = new Date(toInput.value);
            const today = new Date();
            today.setHours(23, 59, 59, 999); // نهاية اليوم
            
            let isValid = true;
            let message = '';
            let messageType = 'warning';
            
            // التحقق من صحة التواريخ
            if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
                message = 'يرجى إدخال تواريخ صحيحة';
                messageType = 'error';
                isValid = false;
            } else if (fromDate > today) {
                message = 'تاريخ البداية لا يمكن أن يكون في المستقبل';
                fromInput.value = today.toISOString().split('T')[0];
                isValid = false;
            } else if (toDate > today) {
                message = 'تاريخ النهاية لا يمكن أن يكون في المستقبل';
                toInput.value = today.toISOString().split('T')[0];
                isValid = false;
            } else if (fromDate > toDate) {
                message = 'تاريخ البداية يجب أن يكون قبل تاريخ النهاية';
                toInput.value = fromInput.value;
                isValid = false;
            } else {
                // حساب عدد الأيام
                const diffTime = Math.abs(toDate - fromDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays > 365) {
                    message = `الفترة المحددة طويلة جداً (${diffDays} يوم). يُنصح بفترة أقل من سنة`;
                    messageType = 'info';
                } else if (diffDays === 0) {
                    message = 'تم اختيار يوم واحد فقط';
                    messageType = 'info';
                } else {
                    message = `تم اختيار فترة ${diffDays} يوم`;
                    messageType = 'success';
                }
            }
            
            // إظهار الرسالة إذا توفرت واجهة المستخدم
            if (message && window.lotteryUI && typeof window.lotteryUI.showMessage === 'function') {
                window.lotteryUI.showMessage(message, messageType);
            }
            
            // تحديث مؤشر صحة التواريخ
            this.updateDateValidationIndicator(isValid);
            
            return isValid;
            
        } catch (error) {
            console.error('❌ خطأ في التحقق من التواريخ:', error);
            return false;
        }
    }

    /**
     * تحديث مؤشر صحة التواريخ
     */
    updateDateValidationIndicator(isValid) {
        const indicator = document.getElementById('dateValidationIndicator') || this.createDateValidationIndicator();
        
        if (isValid) {
            indicator.innerHTML = '✅ التواريخ صحيحة';
            indicator.className = 'date-indicator valid';
        } else {
            indicator.innerHTML = '❌ يرجى مراجعة التواريخ';
            indicator.className = 'date-indicator invalid';
        }
    }

    /**
     * إنشاء مؤشر صحة التواريخ
     */
    createDateValidationIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'dateValidationIndicator';
        indicator.style.cssText = `
            margin-top: 10px;
            padding: 8px 12px;
            border-radius: 5px;
            font-size: 0.9em;
            font-weight: bold;
            text-align: center;
            transition: all 0.3s ease;
        `;
        
        // إضافة الستايلات
        const style = document.createElement('style');
        style.textContent = `
            .date-indicator.valid {
                background: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }
            .date-indicator.invalid {
                background: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }
        `;
        document.head.appendChild(style);
        
        // البحث عن مكان مناسب لإدراج المؤشر
        const dateContainer = document.querySelector('.date-range-container') || 
                            document.querySelector('#date_to').parentElement ||
                            document.querySelector('#date_to').parentNode;
        
        if (dateContainer) {
            dateContainer.appendChild(indicator);
        }
        
        return indicator;
    }

    /**
     * إعداد تحكم عدد الفائزين المحسن
     */
    setupWinnersCountControl() {
        const winnersInput = document.getElementById('winners_count');
        const winnersDisplay = document.getElementById('winnersDisplay');
        
        if (!winnersInput) {
            console.warn('⚠️ عنصر عدد الفائزين غير موجود');
            return;
        }

        try {
            // إنشاء عرض العدد إذا لم يكن موجود
            if (!winnersDisplay) {
                this.createWinnersDisplay(winnersInput);
            }
            
            // تعيين قيمة افتراضية
            if (!winnersInput.value || winnersInput.value < 1) {
                winnersInput.value = 1;
            }
            
            // إضافة قيود الإدخال
            winnersInput.min = this.settings.minWinners;
            winnersInput.max = this.settings.maxWinners;
            winnersInput.step = 1;
            
            // إضافة مستمعات الأحداث
            winnersInput.addEventListener('input', (e) => {
                this.updateWinnersDisplay(e.target);
                this.validateWinnersCount(e.target);
            });
            
            winnersInput.addEventListener('focus', (e) => {
                e.target.select();
                this.playFeedbackSound('focus');
                this.addInputAnimation(e.target);
            });
            
            winnersInput.addEventListener('blur', (e) => {
                this.validateWinnersCount(e.target);
            });

            // إضافة أزرار زيادة ونقصان
            this.addWinnersCountButtons(winnersInput);
            
            // تهيئة العرض الابتدائي
            this.updateWinnersDisplay(winnersInput);
            
            console.log('🏆 تم إعداد تحكم عدد الفائزين');
            
        } catch (error) {
            console.error('❌ خطأ في إعداد تحكم عدد الفائزين:', error);
        }
    }

    /**
     * إنشاء عرض عدد الفائزين
     */
    createWinnersDisplay(winnersInput) {
        const display = document.createElement('span');
        display.id = 'winnersDisplay';
        display.style.cssText = `
            margin-left: 10px;
            padding: 5px 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 20px;
            font-weight: bold;
            font-size: 1.1em;
            display: inline-block;
            min-width: 30px;
            text-align: center;
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        `;
        
        winnersInput.parentNode.insertBefore(display, winnersInput.nextSibling);
        return display;
    }

    /**
     * إضافة أزرار التحكم في عدد الفائزين
     */
    addWinnersCountButtons(winnersInput) {
        const container = document.createElement('div');
        container.style.cssText = `
            display: inline-flex;
            align-items: center;
            gap: 5px;
            margin-left: 10px;
        `;
        
        const decreaseBtn = this.createCountButton('-', () => {
            const newValue = Math.max(this.settings.minWinners, parseInt(winnersInput.value) - 1);
            winnersInput.value = newValue;
            this.updateWinnersDisplay(winnersInput);
            this.playFeedbackSound('click');
        });
        
        const increaseBtn = this.createCountButton('+', () => {
            const newValue = Math.min(this.settings.maxWinners, parseInt(winnersInput.value) + 1);
            winnersInput.value = newValue;
            this.updateWinnersDisplay(winnersInput);
            this.playFeedbackSound('click');
        });
        
        container.appendChild(decreaseBtn);
        container.appendChild(increaseBtn);
        
        winnersInput.parentNode.insertBefore(container, winnersInput.nextSibling);
    }

    /**
     * إنشاء زر التحكم
     */
    createCountButton(text, onClick) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = text;
        button.style.cssText = `
            width: 30px;
            height: 30px;
            border: 2px solid #667eea;
            background: white;
            color: #667eea;
            border-radius: 50%;
            cursor: pointer;
            font-weight: bold;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        `;
        
        button.addEventListener('mouseenter', () => {
            button.style.background = '#667eea';
            button.style.color = 'white';
            button.style.transform = 'scale(1.1)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.background = 'white';
            button.style.color = '#667eea';
            button.style.transform = 'scale(1)';
        });
        
        button.addEventListener('click', onClick);
        
        return button;
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