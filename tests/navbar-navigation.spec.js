const { test, expect } = require('@playwright/test');

test.describe('導覽列點選測試', () => {
  test('從首頁點選導覽列按鈕導覽到各頁面', async ({ page }) => {
    // 開啟首頁
    await page.goto('/');
    await expect(page).toHaveTitle(/小熊貓世界/);

    // 等待導覽列載入
    await page.waitForSelector('nav', { timeout: 5000 });

    // 測試點選「亞種比較」
    await page.click('[data-page="compare"]');
    await page.waitForURL(/pages\/compare\.html/, { timeout: 5000 });
    await expect(page).toHaveURL(/pages\/compare\.html/);
    console.log('✓ 亞種比較頁面導覽成功');

    // 回到首頁
    await page.goto('/');
    await page.waitForSelector('nav');

    // 測試點選「物種比較」
    await page.click('[data-page="species"]');
    await page.waitForURL(/pages\/species-comparison\.html/, { timeout: 5000 });
    await expect(page).toHaveURL(/pages\/species-comparison\.html/);
    console.log('✓ 物種比較頁面導覽成功');

    // 回到首頁
    await page.goto('/');
    await page.waitForSelector('nav');

    // 測試點選「測驗」
    await page.click('[data-page="quiz"]');
    await page.waitForURL(/pages\/quiz\.html/, { timeout: 5000 });
    await expect(page).toHaveURL(/pages\/quiz\.html/);
    console.log('✓ 測驗頁面導覽成功');

    // 回到首頁
    await page.goto('/');
    await page.waitForSelector('nav');

    // 測試點選「藝廊」
    await page.click('[data-page="gallery"]');
    await page.waitForURL(/pages\/gallery\.html/, { timeout: 5000 });
    await expect(page).toHaveURL(/pages\/gallery\.html/);
    console.log('✓ 藝廊頁面導覽成功');
  });

  test('從各頁面點選主頁按鈕回到首頁', async ({ page }) => {
    const testPages = [
      '/pages/compare.html',
      '/pages/species-comparison.html',
      '/pages/quiz.html',
      '/pages/gallery.html'
    ];

    for (const pagePath of testPages) {
      // 開啟測試頁面
      await page.goto(pagePath);
      await page.waitForSelector('nav', { timeout: 5000 });

      // 點選主頁按鈕
      await page.click('[data-page="home"]');
      await page.waitForURL(/index\.html|^\/$/, { timeout: 5000 });
      await expect(page).toHaveURL(/index\.html|^\/$/);
      console.log(`✓ 從 ${pagePath} 回到首頁成功`);
    }
  });

  test('導覽列高亮顯示當前頁面', async ({ page }) => {
    // 測試首頁高亮
    await page.goto('/');
    await page.waitForSelector('nav');

    const homeLink = page.locator('[data-page="home"]');
    await expect(homeLink).toHaveClass(/text-primary/);
    console.log('✓ 首頁高亮顯示正確');

    // 測試亞種比較頁面高亮
    await page.goto('/pages/compare.html');
    await page.waitForSelector('nav');

    const compareLink = page.locator('[data-page="compare"]');
    await expect(compareLink).toHaveClass(/text-primary/);
    console.log('✓ 亞種比較頁面高亮顯示正確');

    // 測試測驗頁面高亮
    await page.goto('/pages/quiz.html');
    await page.waitForSelector('nav');

    const quizLink = page.locator('[data-page="quiz"]');
    await expect(quizLink).toHaveClass(/text-primary/);
    console.log('✓ 測驗頁面高亮顯示正確');
  });

  test('導覽列在所有頁面都能正常載入', async ({ page }) => {
    const allPages = [
      '/',
      '/pages/compare.html',
      '/pages/species-comparison.html',
      '/pages/quiz.html',
      '/pages/gallery.html'
    ];

    for (const pagePath of allPages) {
      await page.goto(pagePath);

      // 檢查導覽列是否載入
      await page.waitForSelector('nav', { timeout: 5000 });
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();

      // 檢查所有導覽按鈕是否存在
      await expect(page.locator('[data-page="home"]')).toBeVisible();
      await expect(page.locator('[data-page="compare"]')).toBeVisible();
      await expect(page.locator('[data-page="species"]')).toBeVisible();
      await expect(page.locator('[data-page="quiz"]')).toBeVisible();
      await expect(page.locator('[data-page="gallery"]')).toBeVisible();

      console.log(`✓ ${pagePath} 導覽列載入成功`);
    }
  });
});