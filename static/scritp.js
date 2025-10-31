document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('routeForm');
    const loader = document.getElementById('loader');
    const submitBtn = document.getElementById('submitBtn');
    if (form) {
        form.addEventListener('submit', function(e) {
            if (loader) {
                loader.style.display = 'block';
                setTimeout(() => {
                    loader.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';
                submitBtn.style.cursor = 'not-allowed';
                const btnText = submitBtn.querySelector('.btn-text');
                if (btnText) {
                    btnText.textContent = 'Создаю маршрут...';
                }
            }
        });
    }
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
            addInputGlow(this);
        });
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
            removeInputGlow(this);
        });
        input.addEventListener('input', function() {
            if (this.validity.valid) {
                this.style.borderColor = 'var(--success-color)';
                addSuccessCheckmark(this);
            } else {
                this.style.borderColor = 'var(--border-color)';
                removeSuccessCheckmark(this);
            }
        });
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
    function addInputGlow(input) {
        input.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
    }
    function removeInputGlow(input) {
        if (!input.matches(':focus')) {
            input.style.boxShadow = 'none';
        }
    }
    function addSuccessCheckmark(input) {
        let checkmark = input.parentElement.querySelector('.success-checkmark');
        if (!checkmark && input.value) {
            checkmark = document.createElement('span');
            checkmark.className = 'success-checkmark';
            checkmark.textContent = '✓';
            checkmark.style.cssText = `
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
                color: var(--success-color);
                font-weight: bold;
                font-size: 1.2rem;
                animation: scaleIn 0.3s ease-out;
            `;
            input.parentElement.style.position = 'relative';
            input.parentElement.appendChild(checkmark);
        }
    }
    function removeSuccessCheckmark(input) {
        const checkmark = input.parentElement.querySelector('.success-checkmark');
        if (checkmark) {
            checkmark.remove();
        }
    }
    const timeInput = document.getElementById('time');
    if (timeInput) {
        timeInput.addEventListener('input', function() {
            if (this.value < 1) this.value = 1;
            if (this.value > 12) this.value = 12;
            updateTimeVisual(this.value);
        });
    }
    function updateTimeVisual(hours) {
        const hint = timeInput.parentElement.querySelector('.input-hint');
        if (hint && hours) {
            hint.textContent = `Выбрано: ${hours} ${getHourWord(hours)}`;
            hint.style.color = 'var(--primary-color)';
            hint.style.fontWeight = '600';
        }
    }
    function getHourWord(num) {
        const cases = [2, 0, 1, 1, 1, 2];
        const words = ['час', 'часа', 'часов'];
        return words[(num % 100 > 4 && num % 100 < 20) ? 2 : cases[Math.min(num % 10, 5)]];
    }
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    const animatedElements = document.querySelectorAll('.plan-card, .map-card, .form-card');
    animatedElements.forEach(el => observer.observe(el));
    const results = document.getElementById('results');
    if (results) {
        setTimeout(() => {
            results.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
        const resultCards = results.querySelectorAll('.plan-card, .map-card');
        resultCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                setTimeout(() => {
                    card.style.transition = 'all 0.6s ease-out';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100 * index);
            }, 0);
        });
    }
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', function(e) {
        mouseX = (e.clientX - window.innerWidth / 2) / window.innerWidth;
        mouseY = (e.clientY - window.innerHeight / 2) / window.innerHeight;
    });
    function animateBackground() {
        const orbs = document.querySelectorAll('.gradient-orb');
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 10;
            const x = mouseX * speed;
            const y = mouseY * speed;
            orb.style.transform = `translate(${x}px, ${y}px)`;
        });
        requestAnimationFrame(animateBackground);
    }
    animateBackground();
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple-animation 0.6s ease-out;
                pointer-events: none;
            `;
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    }
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && document.activeElement.tagName === 'INPUT') {
            e.preventDefault();
            const currentInput = document.activeElement;
            const allInputs = Array.from(document.querySelectorAll('input'));
            const currentIndex = allInputs.indexOf(currentInput);
            if (currentIndex < allInputs.length - 1) {
                allInputs[currentIndex + 1].focus();
            } else if (form && form.checkValidity()) {
                form.submit();
            }
        }
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
    });
    const formInputs = form ? form.querySelectorAll('input') : [];
    formInputs.forEach(input => {
        const savedValue = localStorage.getItem('form_' + input.id);
        if (savedValue && !input.value) {
            input.value = savedValue;
            input.parentElement.classList.add('focused');
        }
        input.addEventListener('input', function() {
            localStorage.setItem('form_' + this.id, this.value);
        });
    });
    if (results) {
        formInputs.forEach(input => {
            localStorage.removeItem('form_' + input.id);
        });
    }
    const tooltips = {
        'interests': 'Например: музеи, парки, рестораны, архитектура, история',
        'time': 'Укажите, сколько часов вы готовы потратить на прогулку',
        'location': 'Укажите вашу текущую локацию или точку старта'
    };
    Object.keys(tooltips).forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('focus', function() {
                showTooltip(this, tooltips[inputId]);
            });
            input.addEventListener('blur', function() {
                hideTooltip();
            });
        }
    });
    let activeTooltip = null;
    function showTooltip(element, text) {
        hideTooltip(); 
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: var(--text-dark);
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 0.85rem;
            z-index: 1000;
            max-width: 250px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: tooltipFadeIn 0.2s ease-out;
        `;
        document.body.appendChild(tooltip);
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.bottom + 8) + 'px';
        activeTooltip = tooltip;
    }
    function hideTooltip() {
        if (activeTooltip) {
            activeTooltip.remove();
            activeTooltip = null;
        }
    }
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        @keyframes scaleIn {
            from {
                transform: translateY(-50%) scale(0);
                opacity: 0;
            }
            to {
                transform: translateY(-50%) scale(1);
                opacity: 1;
            }
        }
        @keyframes tooltipFadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        body.keyboard-nav *:focus {
            outline: 3px solid var(--primary-color) !important;
            outline-offset: 2px;
        }
        .submit-btn {
            position: relative;
            overflow: hidden;
        }
        /* Smooth scrollbar styling */
        ::-webkit-scrollbar {
            width: 12px;
        }
        ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 6px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
        }
    `;
    document.head.appendChild(style);
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://api-maps.yandex.ru';
    document.head.appendChild(preconnect);
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            activateEasterEgg();
        }
    });
    function activateEasterEgg() {
        showNotification('🎉 Вы нашли секретный код! Держите супер-режим! 🚀');
        document.body.style.animation = 'rainbow 2s linear infinite';
        const rainbowStyle = document.createElement('style');
        rainbowStyle.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(rainbowStyle);
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
    if (loader) {
        let progress = 0;
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            width: 100%;
            height: 4px;
            background: rgba(99, 102, 241, 0.2);
            border-radius: 2px;
            margin-top: 20px;
            overflow: hidden;
        `;
        const progressFill = document.createElement('div');
        progressFill.style.cssText = `
            width: 0%;
            height: 100%;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            transition: width 0.3s ease;
            border-radius: 2px;
        `;
        progressBar.appendChild(progressFill);
        loader.appendChild(progressBar);
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 90) progress = 90; 
            progressFill.style.width = progress + '%';
        }, 500);
    }
    const loadingTips = [
        '💡 Совет: Нижний Новгород - третья столица России!',
        '🏰 Знаете ли вы? Нижегородский кремль никогда не был взят врагами!',
        '🎭 В городе более 600 памятников истории и культуры',
        '🌉 Канатная дорога через Волгу - одна из самых длинных в Европе',
        '⚓ Нижний Новгород основан в 1221 году'
    ];
    if (loader) {
        const tipElement = document.createElement('p');
        tipElement.style.cssText = `
            margin-top: 20px;
            font-size: 0.95rem;
            color: var(--text-medium);
            font-style: italic;
        `;
        tipElement.textContent = loadingTips[Math.floor(Math.random() * loadingTips.length)];
        loader.appendChild(tipElement);
    }
});
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    const hero = document.querySelector('.hero-section');
    if (hero) {
        hero.style.animation = 'fadeInDown 0.8s ease-out';
    }
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('✅ Page loaded in:', pageLoadTime + 'ms');
    }
});
window.showNotification = function(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
    notification.innerHTML = `<span style="margin-right: 8px;">${icon}</span>${message}`;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
};
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.message);
});
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}
