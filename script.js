/**
 * TG Reach - 产品展示页面交互脚本
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavbar();
    initSmoothScroll();
    initScrollAnimations();
    initDownloadButton();
    initAOS();
    initCountdown();
});

/**
 * 导航栏功能
 * - 滚动时添加背景
 * - 移动端菜单切换
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // 滚动时添加背景效果
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // 移动端菜单切换
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // 点击导航链接后关闭菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // 点击外部关闭菜单
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * 平滑滚动
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 滚动动画
 * 使用 Intersection Observer 实现元素进入视口时的动画
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 观察所有带有 data-aos 属性的元素
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

/**
 * AOS (Animate On Scroll) 初始化
 * 自定义实现，不依赖外部库
 */
function initAOS() {
    // 为不同延迟的元素设置 transition-delay
    document.querySelectorAll('[data-aos-delay]').forEach(el => {
        const delay = el.getAttribute('data-aos-delay');
        el.style.transitionDelay = `${delay}ms`;
    });
}

/**
 * 下载按钮功能
 * 点击显示"暂未发布"提示
 */
function initDownloadButton() {
    const downloadBtn = document.getElementById('downloadBtn');
    const toast = document.getElementById('toast');
    let toastTimeout;

    if (downloadBtn && toast) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showToast('正在努力上线中，敬请等待');
        });
    }

    function showToast(message) {
        const toastMessage = toast.querySelector('.toast-message');
        if (toastMessage) {
            toastMessage.textContent = message;
        }

        toast.classList.add('show');

        // 清除之前的定时器
        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }

        // 3秒后自动隐藏
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

/**
 * 视差滚动效果
 * 为英雄区域的背景元素添加视差效果
 */
function initParallax() {
    const orbs = document.querySelectorAll('.gradient-orb');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        orbs.forEach((orb, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = -(scrolled * speed);
            orb.style.transform = `translateY(${yPos}px)`;
        });
    });
}

/**
 * 数字计数动画
 * 用于统计数字的动态显示
 */
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

/**
 * 打字机效果
 * 用于标题或重要文字的动态显示
 */
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

/**
 * 鼠标跟随效果
 * 为特定元素添加鼠标跟随的光效
 */
function initMouseFollow() {
    const cards = document.querySelectorAll('.feature-card, .showcase-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.setProperty('--mouse-x', `${x}px`);
            this.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/**
 * 页面加载动画
 */
function initPageLoadAnimation() {
    document.body.classList.add('page-loaded');
    
    // 为英雄区域元素添加渐入动画
    const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-cta, .hero-stats');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100 * (index + 1));
    });
}

// 页面加载完成后执行加载动画
window.addEventListener('load', initPageLoadAnimation);

/**
 * 性能优化：节流函数
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 性能优化：防抖函数
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// 使用节流的滚动事件处理
const throttledScrollHandler = throttle(function() {
    // 可以在这里添加需要节流的滚动相关逻辑
}, 16); // 约60fps

window.addEventListener('scroll', throttledScrollHandler);

/**
 * 键盘导航支持
 */
document.addEventListener('keydown', function(e) {
    // ESC 键关闭移动端菜单
    if (e.key === 'Escape') {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

/**
 *  prefers-reduced-motion 支持
 *  尊重用户的动画偏好设置
 */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-fast', '0s');
    document.documentElement.style.setProperty('--transition-normal', '0s');
    document.documentElement.style.setProperty('--transition-slow', '0s');
}

/**
 * 倒计时功能
 * 7天倒计时，精确到秒
 */
function initCountdown() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const countdownTimer = document.getElementById('countdownTimer');
    
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
    
    // 设置目标时间：当前时间 + 7天
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    targetDate.setHours(0, 0, 0, 0);
    
    let previousValues = {
        days: '07',
        hours: '00',
        minutes: '00',
        seconds: '00'
    };
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance < 0) {
            // 倒计时结束
            clearInterval(countdownInterval);
            showCompleteMessage();
            return;
        }
        
        // 计算时间
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // 格式化数字
        const formattedDays = String(days).padStart(2, '0');
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        
        // 更新显示，添加翻转动画
        updateNumberWithAnimation(daysEl, formattedDays, previousValues.days);
        updateNumberWithAnimation(hoursEl, formattedHours, previousValues.hours);
        updateNumberWithAnimation(minutesEl, formattedMinutes, previousValues.minutes);
        updateNumberWithAnimation(secondsEl, formattedSeconds, previousValues.seconds);
        
        // 保存当前值
        previousValues = {
            days: formattedDays,
            hours: formattedHours,
            minutes: formattedMinutes,
            seconds: formattedSeconds
        };
    }
    
    function updateNumberWithAnimation(element, newValue, oldValue) {
        if (newValue !== oldValue) {
            element.classList.add('flip');
            element.textContent = newValue;
            
            setTimeout(() => {
                element.classList.remove('flip');
            }, 600);
        }
    }
    
    function showCompleteMessage() {
        if (countdownTimer) {
            countdownTimer.innerHTML = `
                <div class="countdown-complete show">
                    <h3>🎉 产品已上线！</h3>
                    <p>感谢您的耐心等待，TG Reach 现已正式发布</p>
                </div>
            `;
        }
    }
    
    // 立即执行一次
    updateCountdown();
    
    // 每秒更新
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    // 页面可见性变化时优化性能
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // 页面不可见时，降低更新频率（可选）
        } else {
            // 页面可见时，立即更新
            updateCountdown();
        }
    });
}
