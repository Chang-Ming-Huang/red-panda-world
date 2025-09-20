/**
 * Premium Charcoal Style 導覽列組件載入器
 * Navbar component loader with current page highlighting for Premium Charcoal theme
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
        // Premium Charcoal 風格使用自己的導覽列組件
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

            // 添加 Premium Charcoal 特殊效果
            initTechEffects();
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
    const navLinks = document.querySelectorAll('.tech-nav-item[data-page]');
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
 * 初始化科技特效
 */
function initTechEffects() {
    const navItems = document.querySelectorAll('.tech-nav-item');

    navItems.forEach(item => {
        // 添加點擊時的掃描效果
        item.addEventListener('click', (e) => {
            createScanEffect(item);
        });

        // 添加 hover 時的能量條效果
        item.addEventListener('mouseenter', () => {
            if (!item.classList.contains('active')) {
                addEnergyEffect(item);
            }
        });

        item.addEventListener('mouseleave', () => {
            removeEnergyEffect(item);
        });
    });

    // 添加狀態監控效果
    initStatusMonitoring();
}

/**
 * 創建掃描效果
 */
function createScanEffect(element) {
    const scanLine = document.createElement('div');
    scanLine.className = 'tech-scan-line';

    scanLine.style.cssText = `
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(236, 109, 19, 0.6), transparent);
        pointer-events: none;
        animation: techScanLine 0.8s ease-out;
        z-index: 10;
        border-radius: 8px;
    `;

    element.style.position = 'relative';
    element.appendChild(scanLine);

    // 添加 CSS 動畫
    if (!document.getElementById('tech-scan-style')) {
        const style = document.createElement('style');
        style.id = 'tech-scan-style';
        style.textContent = `
            @keyframes techScanLine {
                0% {
                    left: -100%;
                    opacity: 0;
                }
                50% {
                    opacity: 1;
                }
                100% {
                    left: 100%;
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => {
        scanLine.remove();
    }, 800);
}

/**
 * 添加能量條效果
 */
function addEnergyEffect(element) {
    const energyBar = document.createElement('div');
    energyBar.className = 'tech-energy-bar';

    energyBar.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0%;
        height: 2px;
        background: linear-gradient(90deg, var(--tech-blue), var(--tech-accent));
        animation: techEnergyFill 0.3s ease-out forwards;
        z-index: 5;
        border-radius: 0 0 8px 8px;
    `;

    element.appendChild(energyBar);

    // 添加 CSS 動畫
    if (!document.getElementById('tech-energy-style')) {
        const style = document.createElement('style');
        style.id = 'tech-energy-style';
        style.textContent = `
            @keyframes techEnergyFill {
                0% {
                    width: 0%;
                    opacity: 0;
                }
                100% {
                    width: 100%;
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * 移除能量條效果
 */
function removeEnergyEffect(element) {
    const energyBar = element.querySelector('.tech-energy-bar');
    if (energyBar) {
        energyBar.style.animation = 'techEnergyFill 0.2s ease-out reverse';
        setTimeout(() => {
            energyBar.remove();
        }, 200);
    }
}

/**
 * 初始化狀態監控
 */
function initStatusMonitoring() {
    // 每隔一段時間隨機閃爍指示器
    setInterval(() => {
        const indicators = document.querySelectorAll('.tech-nav-indicator');
        const randomIndicator = indicators[Math.floor(Math.random() * indicators.length)];

        if (randomIndicator && !randomIndicator.closest('.tech-nav-item').classList.contains('active')) {
            randomIndicator.style.opacity = '0.3';
            randomIndicator.style.background = 'linear-gradient(135deg, var(--tech-blue), var(--tech-green))';

            setTimeout(() => {
                randomIndicator.style.opacity = '';
                randomIndicator.style.background = '';
            }, 500);
        }
    }, 3000);
}

/**
 * 備用導覽列（如果載入失敗時使用）
 */
function showFallbackNavbar() {
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        navbarContainer.innerHTML = `
            <nav style="position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000; background: rgba(26, 26, 26, 0.95); border-top: 1px solid #2a2a2a; padding: 1rem; backdrop-filter: blur(20px);">
                <div style="display: flex; justify-center;">
                    <p style="color: #ec6d13; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">SYSTEM OFFLINE</p>
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