/**
 * Tokyo Neon Style 導覽列組件載入器
 * Navbar component loader with current page highlighting for Tokyo Neon theme
 */

// 頁面映射表
const PAGE_MAP = {
    'index.html': 'home',
    '': 'home', // 根目錄也算主頁
    'compare.html': 'compare',
    'species-comparison.html': 'species',
    'quiz.html': 'quiz',
    'gallery.html': 'gallery'
};

/**
 * 載入導覽列
 */
async function loadNavbar() {
    try {
        // Tokyo Neon 風格使用自己的導覽列組件
        const navbarPath = 'components/navbar.html';

        const response = await fetch(navbarPath);
        if (!response.ok) {
            throw new Error(`載入導覽列失敗: ${response.status}`);
        }

        const navbarHTML = await response.text();

        // 插入導覽列
        const navbarContainer = document.getElementById('navbar-container');
        if (navbarContainer) {
            navbarContainer.innerHTML = navbarHTML;

            // 高亮當前頁面
            highlightCurrentPage();

            // 添加 Tokyo Neon 特殊效果
            initNeonEffects();
        } else {
            console.warn('找不到 navbar-container 元素');
        }
    } catch (error) {
        console.error('載入導覽列失敗:', error);
        // 如果載入失敗，顯示備用的簡化導覽列
        showFallbackNavbar();
    }
}

/**
 * 高亮當前頁面
 */
function highlightCurrentPage() {
    // 獲取當前頁面路徑
    const currentPath = window.location.pathname;
    let pageKey = 'home'; // 預設為首頁

    // 提取檔名
    const fileName = currentPath.split('/').pop() || 'index.html';
    pageKey = PAGE_MAP[fileName] || 'home';

    // 移除所有高亮並添加到當前頁面
    const navLinks = document.querySelectorAll('.neon-nav-item[data-page]');
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('data-page');

        if (linkPage === pageKey) {
            // 高亮當前頁面
            link.classList.add('active');
        } else {
            // 其他頁面保持默認樣式
            link.classList.remove('active');
        }
    });
}

/**
 * 初始化 Tokyo Neon 特效
 */
function initNeonEffects() {
    const navItems = document.querySelectorAll('.neon-nav-item');

    navItems.forEach(item => {
        // 添加點擊波紋效果
        item.addEventListener('click', (e) => {
            createRippleEffect(e, item);
        });

        // 添加 hover 故障效果
        item.addEventListener('mouseenter', () => {
            if (!item.classList.contains('active')) {
                addGlitchEffect(item);
            }
        });

        item.addEventListener('mouseleave', () => {
            removeGlitchEffect(item);
        });
    });

    // 添加隨機閃爍效果
    setInterval(() => {
        const randomItem = navItems[Math.floor(Math.random() * navItems.length)];
        if (!randomItem.classList.contains('active')) {
            addTemporaryGlow(randomItem);
        }
    }, 5000);
}

/**
 * 創建波紋效果
 */
function createRippleEffect(event, element) {
    const ripple = document.createElement('div');
    ripple.className = 'neon-ripple';

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(0, 229, 255, 0.5) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        animation: neonRipple 0.6s ease-out;
        z-index: 10;
    `;

    element.style.position = 'relative';
    element.appendChild(ripple);

    // 添加 CSS 動畫
    if (!document.getElementById('neon-ripple-style')) {
        const style = document.createElement('style');
        style.id = 'neon-ripple-style';
        style.textContent = `
            @keyframes neonRipple {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

/**
 * 添加故障效果
 */
function addGlitchEffect(element) {
    element.style.animation = 'neonGlitch 0.3s infinite';
}

/**
 * 移除故障效果
 */
function removeGlitchEffect(element) {
    element.style.animation = '';
}

/**
 * 添加臨時發光效果
 */
function addTemporaryGlow(element) {
    element.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.8)';
    element.style.transform = 'scale(1.05)';

    setTimeout(() => {
        element.style.boxShadow = '';
        element.style.transform = '';
    }, 1000);
}

/**
 * 備用導覽列（如果載入失敗時使用）
 */
function showFallbackNavbar() {
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        navbarContainer.innerHTML = `
            <nav style="position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000; background: rgba(10, 10, 10, 0.95); border-top: 1px solid #00e5ff; padding: 1rem; backdrop-filter: blur(20px);">
                <div style="display: flex; justify-center;">
                    <p style="color: #00e5ff; font-size: 0.9rem;">NAVIGATION OFFLINE</p>
                </div>
            </nav>
        `;
    }
}

/**
 * 初始化導覽列
 */
function initNavbar() {
    // 確保 DOM 已載入
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadNavbar);
    } else {
        loadNavbar();
    }
}

// 自動初始化
initNavbar();

// 導出函數供外部使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadNavbar, highlightCurrentPage };
}