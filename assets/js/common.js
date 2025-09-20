/**
 * 小熊貓網站通用 JavaScript 功能
 */

// 全域變數
window.RedPandaApp = {
    config: {
        animationDuration: 300,
        apiEndpoints: {
            subspecies: './data/subspecies.json',
            quiz: './data/quiz.json',
            animals: './data/animals.json'
        }
    },
    cache: new Map(),
    utils: {}
};

/**
 * 工具函數
 */
RedPandaApp.utils = {
    /**
     * 延遲函數
     */
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    /**
     * 防抖函數
     */
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * 節流函數
     */
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },

    /**
     * 載入 JSON 資料 (帶緩存)
     */
    async loadJSON(url) {
        if (RedPandaApp.cache.has(url)) {
            return RedPandaApp.cache.get(url);
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            RedPandaApp.cache.set(url, data);
            return data;
        } catch (error) {
            console.error(`載入 ${url} 失敗:`, error);
            throw error;
        }
    },

    /**
     * 顯示載入狀態
     */
    showLoading(element, text = '載入中...') {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        if (element) {
            element.innerHTML = `
                <div class="text-center py-8">
                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p class="mt-2 text-sm">${text}</p>
                </div>
            `;
        }
    },

    /**
     * 顯示錯誤訊息
     */
    showError(element, message = '載入失敗，請重新整理頁面') {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        if (element) {
            element.innerHTML = `
                <div class="text-center py-8">
                    <div class="text-red-500 mb-2">
                        <svg class="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                        </svg>
                    </div>
                    <p class="text-red-500">${message}</p>
                </div>
            `;
        }
    },

    /**
     * 元素淡入動畫
     */
    fadeIn(element, duration = 300) {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        if (element) {
            element.style.opacity = '0';
            element.style.display = 'block';
            element.style.transition = `opacity ${duration}ms ease`;

            setTimeout(() => {
                element.style.opacity = '1';
            }, 10);
        }
    },

    /**
     * 元素淡出動畫
     */
    fadeOut(element, duration = 300) {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        if (element) {
            element.style.transition = `opacity ${duration}ms ease`;
            element.style.opacity = '0';

            setTimeout(() => {
                element.style.display = 'none';
            }, duration);
        }
    },

    /**
     * 滑動到元素
     */
    scrollToElement(element, offset = 0) {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        if (element) {
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    },

    /**
     * 檢查元素是否在視窗中
     */
    isInViewport(element) {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        if (!element) return false;

        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    /**
     * 格式化數字
     */
    formatNumber(num) {
        return new Intl.NumberFormat('zh-TW').format(num);
    },

    /**
     * 隨機選擇陣列元素
     */
    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * 打亂陣列順序
     */
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
};

/**
 * 通用組件
 */
RedPandaApp.components = {
    /**
     * 創建載入骨架
     */
    createSkeleton(width = '100%', height = '20px', className = '') {
        return `<div class="loading-skeleton ${className}" style="width: ${width}; height: ${height};"></div>`;
    },

    /**
     * 創建進度條
     */
    createProgressBar(progress, className = '') {
        return `
            <div class="progress-bar ${className}">
                <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
        `;
    },

    /**
     * 創建徽章
     */
    createBadge(text, className = '') {
        return `<span class="badge ${className}">${text}</span>`;
    },

    /**
     * 創建按鈕
     */
    createButton(text, onClick, className = 'btn-primary') {
        const button = document.createElement('button');
        button.className = className;
        button.textContent = text;
        button.addEventListener('click', onClick);
        return button;
    }
};

/**
 * 導航相關功能
 */
RedPandaApp.navigation = {
    /**
     * 更新導航狀態
     */
    updateNavigation(currentPage) {
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (href === 'index.html' && currentPage === '/')) {
                link.classList.add('text-primary');
                link.classList.remove('text-background-dark/50', 'dark:text-background-light/50');
            } else {
                link.classList.remove('text-primary');
                link.classList.add('text-background-dark/50', 'dark:text-background-light/50');
            }
        });
    },

    /**
     * 安全返回
     */
    goBack() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = 'index.html';
        }
    }
};

/**
 * 表單驗證
 */
RedPandaApp.validation = {
    /**
     * 驗證電子郵件
     */
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    /**
     * 驗證手機號碼
     */
    isValidPhone(phone) {
        const re = /^[0-9]{10}$/;
        return re.test(phone.replace(/\D/g, ''));
    }
};

/**
 * 本地儲存功能
 */
RedPandaApp.storage = {
    /**
     * 設置項目
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('儲存失敗:', error);
        }
    },

    /**
     * 獲取項目
     */
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('讀取失敗:', error);
            return null;
        }
    },

    /**
     * 移除項目
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('移除失敗:', error);
        }
    },

    /**
     * 清除所有項目
     */
    clear() {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('清除失敗:', error);
        }
    }
};

/**
 * 分析功能 (可選)
 */
RedPandaApp.analytics = {
    /**
     * 追蹤頁面瀏覽
     */
    trackPageView(pageName) {
        // 可以在這裡添加 Google Analytics 或其他分析工具
        console.log(`頁面瀏覽: ${pageName}`);
    },

    /**
     * 追蹤事件
     */
    trackEvent(eventName, eventData = {}) {
        // 可以在這裡添加事件追蹤
        console.log(`事件: ${eventName}`, eventData);
    }
};

/**
 * 初始化應用程式
 */
RedPandaApp.init = function() {
    // 更新導航狀態
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    this.navigation.updateNavigation(currentPage);

    // 追蹤頁面瀏覽
    this.analytics.trackPageView(currentPage);

    // 添加全域錯誤處理
    window.addEventListener('error', (event) => {
        console.error('全域錯誤:', event.error);
    });

    // 添加未處理的 Promise 拒絕處理
    window.addEventListener('unhandledrejection', (event) => {
        console.error('未處理的 Promise 拒絕:', event.reason);
    });

    console.log('小熊貓應用程式初始化完成');
};

// 當 DOM 載入完成時初始化
document.addEventListener('DOMContentLoaded', () => {
    RedPandaApp.init();
});

// 導出到全域作用域
window.RedPandaApp = RedPandaApp;