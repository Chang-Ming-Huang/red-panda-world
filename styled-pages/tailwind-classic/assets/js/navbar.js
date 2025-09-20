/**
 * 導覽列組件載入器
 * Navbar component loader with current page highlighting
 */

// 頁面映射表
const PAGE_MAP = {
    'index.html': 'home',
    '': 'home', // 根目錄也算主頁
    'compare.html': 'compare',
    'species-comparison.html': 'species',
    'quiz.html': 'quiz',
    'gallery.html': 'gallery',
};

/**
 * 載入導覽列
 */
async function loadNavbar() {
    try {
        // Tailwind Classic 風格使用自己的導覽列組件
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

            // 為導覽列添加固定樣式類別
            const navbar = navbarContainer.querySelector('nav');
            if (navbar) {
                navbar.classList.add('navbar-fixed');
            }

            // 修正導覽連結路徑
            fixNavigationLinks();

            // 高亮當前頁面
            highlightCurrentPage();
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
 * 修正導覽連結路徑
 * 所有頁面都在 pages/ 資料夾中，使用統一的相對路徑
 */
function fixNavigationLinks() {
    // 獲取所有導覽連結
    const navLinks = document.querySelectorAll('nav a[data-page]');

    navLinks.forEach(link => {
        const dataPage = link.getAttribute('data-page');

        // 頁面檔案映射
        const pageMap = {
            'home': 'index.html',
            'compare': 'compare.html',
            'species': 'species-comparison.html',
            'quiz': 'quiz.html',
            'gallery': 'gallery.html'
        };

        const fileName = pageMap[dataPage];
        if (fileName) {
            link.setAttribute('href', fileName);
        }
    });
}

/**
 * 高亮當前頁面
 */
function highlightCurrentPage() {
    // 獲取當前頁面路徑
    const currentPath = window.location.pathname;
    let pageKey = 'home'; // 預設為首頁

    // 所有頁面都在 pages/ 資料夾中，直接提取檔名
    const fileName = currentPath.split('/').pop() || 'index.html';
    pageKey = PAGE_MAP[fileName] || 'home';

    // 移除所有高亮並添加到當前頁面
    const navLinks = document.querySelectorAll('nav a[data-page]');
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('data-page');

        if (linkPage === pageKey) {
            // 高亮當前頁面
            link.classList.remove('text-background-dark/50', 'dark:text-background-light/50');
            link.classList.add('text-primary');
        } else {
            // 其他頁面保持默認樣式
            link.classList.remove('text-primary');
            link.classList.add('text-background-dark/50', 'dark:text-background-light/50');
        }
    });
}

/**
 * 備用導覽列（如果載入失敗時使用）
 */
function showFallbackNavbar() {
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        navbarContainer.innerHTML = `
            <nav class="sticky bottom-0 border-t border-background-dark/10 bg-background-light/80 pb-4 pt-2 backdrop-blur-sm dark:border-background-light/10 dark:bg-background-dark/80">
                <div class="flex justify-center">
                    <p class="text-sm text-background-dark/50 dark:text-background-light/50">導覽列載入失敗</p>
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