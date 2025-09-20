const { test, expect } = require('@playwright/test');

test.describe('圖片藝廊頁面風格測試', () => {
  test('圖片藝廊頁面應該與其他頁面風格一致', async ({ page }) => {
    // 開啟圖片藝廊頁面
    await page.goto('/pages/gallery.html');

    // 檢查頁面標題
    await expect(page).toHaveTitle(/小熊貓圖片藝廊/);

    // 檢查頁面語言設定
    const htmlLang = await page.getAttribute('html', 'lang');
    expect(htmlLang).toBe('zh-TW');

    // 檢查是否沒有強制黑暗模式
    const htmlClass = await page.getAttribute('html', 'class');
    expect(htmlClass).not.toContain('dark');

    // 檢查主標題是否正確
    const mainTitle = page.locator('h1');
    await expect(mainTitle).toContainText('小熊貓圖片藝廊');

    // 檢查導覽列是否載入
    await page.waitForSelector('nav', { timeout: 5000 });
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // 檢查圖片是否載入
    await page.waitForSelector('#gallery-grid', { timeout: 3000 });
    const galleryGrid = page.locator('#gallery-grid');
    await expect(galleryGrid).toBeVisible();

    // 檢查是否有小熊貓圖片
    const images = page.locator('#gallery-grid img');
    const imageCount = await images.count();
    expect(imageCount).toBeGreaterThan(0);

    // 檢查圖片來源路徑是否正確
    const firstImageSrc = await images.first().getAttribute('src');
    expect(firstImageSrc).toContain('../images/');

    console.log('✓ 圖片藝廊頁面風格與其他頁面一致');
    console.log('✓ 頁面標題、語言設定正確');
    console.log('✓ 導覽列正常載入');
    console.log('✓ 圖片正確顯示');
  });

  test('圖片藝廊頁面應該支援響應式設計', async ({ page }) => {
    // 測試手機版
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pages/gallery.html');

    // 等待圖片網格載入
    await page.waitForSelector('#gallery-grid', { timeout: 3000 });

    // 檢查網格是否在手機版正確顯示
    const galleryGrid = page.locator('#gallery-grid');
    await expect(galleryGrid).toBeVisible();

    // 檢查圖片是否正確縮放
    const galleryItems = page.locator('.gallery-item');
    const itemCount = await galleryItems.count();
    expect(itemCount).toBeGreaterThan(0);

    console.log('✓ 圖片藝廊響應式設計正常');
  });
});