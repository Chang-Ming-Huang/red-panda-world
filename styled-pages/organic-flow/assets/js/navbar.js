/**
 * Organic Flow Style 導覽列組件載入器
 * Navbar component loader with current page highlighting for Organic Flow theme
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
        // Organic Flow 風格使用自己的導覽列組件
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

            // 添加 Organic Flow 特殊效果
            initFlowEffects();
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
    const navLinks = document.querySelectorAll('.flow-nav-item[data-page]');
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
 * 初始化有機流動特效
 */
function initFlowEffects() {
    const navItems = document.querySelectorAll('.flow-nav-item');

    navItems.forEach(item => {
        // 添加點擊時的波浪效果
        item.addEventListener('click', (e) => {
            createWaveEffect(e, item);
        });

        // 添加 hover 時的呼吸效果
        item.addEventListener('mouseenter', () => {
            if (!item.classList.contains('active')) {
                addBreathingEffect(item);
            }
        });

        item.addEventListener('mouseleave', () => {
            removeBreathingEffect(item);
        });
    });

    // 添加自然脈動效果
    initNaturalPulsing();
}

/**
 * 創建波浪效果
 */
function createWaveEffect(event, element) {
    const wave = document.createElement('div');
    wave.className = 'flow-wave';

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.5;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    wave.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(236, 109, 19, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        animation: flowWave 0.8s ease-out;
        z-index: 10;
    `;

    element.style.position = 'relative';
    element.appendChild(wave);

    // 添加 CSS 動畫
    if (!document.getElementById('flow-wave-style')) {
        const style = document.createElement('style');
        style.id = 'flow-wave-style';
        style.textContent = `
            @keyframes flowWave {
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
        wave.remove();
    }, 800);
}

/**
 * 添加呼吸效果
 */
function addBreathingEffect(element) {
    element.style.animation = 'flowBreathe 2s ease-in-out infinite';

    // 添加 CSS 動畫
    if (!document.getElementById('flow-breathe-style')) {
        const style = document.createElement('style');
        style.id = 'flow-breathe-style';
        style.textContent = `
            @keyframes flowBreathe {
                0%, 100% {
                    transform: translateY(-3px) scale(1.05);
                    box-shadow: 0 8px 25px rgba(236, 109, 19, 0.3);
                }
                50% {
                    transform: translateY(-5px) scale(1.08);
                    box-shadow: 0 12px 35px rgba(236, 109, 19, 0.4);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * 移除呼吸效果
 */
function removeBreathingEffect(element) {
    element.style.animation = '';
}

/**
 * 初始化自然脈動
 */
function initNaturalPulsing() {
    const navItems = document.querySelectorAll('.flow-nav-item');

    // 為非活動項目添加隨機的輕微脈動
    setInterval(() => {
        navItems.forEach(item => {
            if (!item.classList.contains('active') && Math.random() > 0.7) {
                addSubtlePulse(item);
            }
        });
    }, 4000);

    // 為背景形狀添加微妙的變化
    const shapes = document.querySelectorAll('.flow-shape');
    shapes.forEach((shape, index) => {
        setTimeout(() => {
            addShapeVariation(shape);
        }, index * 500);
    });
}

/**
 * 添加微妙脈動
 */
function addSubtlePulse(element) {
    const originalTransform = element.style.transform;
    element.style.transition = 'transform 0.6s ease-in-out';
    element.style.transform = 'translateY(-1px) scale(1.02)';

    setTimeout(() => {
        element.style.transform = originalTransform;
        element.style.transition = '';
    }, 600);
}

/**
 * 添加形狀變化
 */
function addShapeVariation(shape) {
    const variations = [
        'border-radius: 60% 40% 50% 70%',
        'border-radius: 40% 60% 70% 30%',
        'border-radius: 70% 30% 40% 60%',
        'border-radius: 50% 70% 30% 60%'
    ];

    setInterval(() => {
        const randomVariation = variations[Math.floor(Math.random() * variations.length)];
        shape.style.borderRadius = randomVariation.split(': ')[1];
    }, 8000 + Math.random() * 4000);
}

/**
 * 備用導覽列（如果載入失敗時使用）
 */
function showFallbackNavbar() {
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        navbarContainer.innerHTML = `
            <nav style="position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000; background: rgba(247, 245, 241, 0.95); border-top: 2px solid #9caf88; padding: 1rem; backdrop-filter: blur(20px);">
                <div style="display: flex; justify-center;">
                    <p style="color: #7a8b6c; font-size: 0.9rem;">導覽列載入失敗</p>
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