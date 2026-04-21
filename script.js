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
});

/**
 * 导航栏功能
 * - 滚动时添加背景
 * - 移动端菜单切换
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navbarLogo = navbar ? navbar.querySelector('.logo') : null;
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const sideNav = document.querySelector('.floating-side-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sideNavLinks = document.querySelectorAll('.floating-side-nav a[href^="#"]');
    const scrollNavLinks = [...navLinks, ...sideNavLinks];
    const navSections = Array.from(scrollNavLinks)
        .map(link => link.getAttribute('href'))
        .filter(href => href && href.startsWith('#') && href !== '#')
        .map(id => document.querySelector(id))
        .filter(Boolean);

    // 滚动时添加背景效果
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // 滚动后把品牌入口“吸附”到右侧菜单
        const shouldDockBrand = currentScroll > 140;
        if (shouldDockBrand) {
            navbar.classList.remove('scrolled');
            navbar.classList.add('docked');
        } else {
            navbar.classList.toggle('scrolled', currentScroll > 50);
            navbar.classList.remove('docked');
        }

        if (sideNav) sideNav.classList.toggle('show-brand', shouldDockBrand);
        if (navbarLogo) {
            navbarLogo.style.opacity = shouldDockBrand ? '0' : '1';
            navbarLogo.style.pointerEvents = shouldDockBrand ? 'none' : 'auto';
        }

        // 根据视口位置高亮当前导航项
        const offset = navbar.offsetHeight + 120;
        let activeId = '';
        navSections.forEach(section => {
            if (window.scrollY >= section.offsetTop - offset) {
                activeId = `#${section.id}`;
            }
        });
        scrollNavLinks.forEach(link => {
            const isActive = link.getAttribute('href') === activeId;
            link.classList.toggle('active', isActive);
            if (isActive && link.classList.contains('nav-link')) {
                link.setAttribute('aria-current', 'page');
            } else if (link.classList.contains('nav-link')) {
                link.removeAttribute('aria-current');
            }
        });
    });

    // 移动端菜单切换
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // 点击导航链接后关闭菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navToggle) navToggle.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // 点击外部关闭菜单
    document.addEventListener('click', function(e) {
        if (navMenu && !navbar.contains(e.target) && navMenu.classList.contains('active')) {
            if (navToggle) navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // 首屏时也同步一次激活状态
    window.dispatchEvent(new Event('scroll'));
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
 * 从API获取最新安装包信息并触发下载
 */
function initDownloadButton() {
    const downloadBtn = document.getElementById('downloadBtn');
    const toast = document.getElementById('toast');
    let toastTimeout;
    let isDownloading = false;

    if (downloadBtn && toast) {
        downloadBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            if (isDownloading) return;
            
            isDownloading = true;
            const originalText = downloadBtn.innerHTML;
            downloadBtn.innerHTML = `
                <svg class="btn-icon spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" fill="currentColor"/>
                </svg>
                获取下载链接...
            `;
            downloadBtn.disabled = true;

            try {
                let downloadUrl = null;
                let errorMsg = '';
                
                try {
                    const response = await fetch('http://115.159.117.241:9960/api/installer/latest', {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log('API返回数据:', data);
                        if (data.download_url) {
                            downloadUrl = data.download_url;
                        } else {
                            errorMsg = 'API返回数据中没有download_url';
                        }
                    } else {
                        errorMsg = `API请求失败: ${response.status}`;
                    }
                } catch (fetchError) {
                    console.error('Fetch错误:', fetchError);
                    errorMsg = `网络错误: ${fetchError.message}`;
                }
                
                if (downloadUrl) {
                    // 获取到下载链接，直接跳转下载
                    console.log('开始下载:', downloadUrl);
                    window.location.href = downloadUrl;
                    showToast('下载已开始，请稍候...');
                } else {
                    // 无法获取下载链接
                    console.error('获取下载链接失败:', errorMsg);
                    showToast('获取下载链接失败: ' + errorMsg + '，请检查控制台');
                }

            } catch (error) {
                console.error('下载失败:', error);
                showToast('下载失败: ' + error.message);
            } finally {
                isDownloading = false;
                downloadBtn.innerHTML = originalText;
                downloadBtn.disabled = false;
            }
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

