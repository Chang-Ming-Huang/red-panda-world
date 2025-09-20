const { test, expect } = require('@playwright/test');

test.describe('圖片載入測試', () => {
  test('比較頁面圖片應該正常載入', async ({ page }) => {
    // 開啟比較頁面
    await page.goto('/pages/compare.html');

    // 等待頁面載入
    await page.waitForSelector('#main-content', { timeout: 10000 });

    // 等待圖片載入
    await page.waitForSelector('#chinese-image', { timeout: 5000 });
    await page.waitForSelector('#himalayan-image', { timeout: 5000 });

    // 檢查圖片是否載入成功
    const chineseImage = page.locator('#chinese-image');
    const himalayanImage = page.locator('#himalayan-image');

    await expect(chineseImage).toBeVisible();
    await expect(himalayanImage).toBeVisible();

    // 檢查圖片 src 屬性
    const chineseSrc = await chineseImage.getAttribute('src');
    const himalayanSrc = await himalayanImage.getAttribute('src');

    expect(chineseSrc).toContain('../images/chinese-red-panda.webp');
    expect(himalayanSrc).toContain('../images/himalayan-red-panda.webp');

    console.log('✓ 中華小熊貓圖片載入成功:', chineseSrc);
    console.log('✓ 喜馬拉雅小熊貓圖片載入成功:', himalayanSrc);
  });

  test('物種比較頁面圖片應該正常載入', async ({ page }) => {
    // 開啟物種比較頁面
    await page.goto('/pages/species-comparison.html');

    // 等待頁面載入
    await page.waitForSelector('.comparison-container', { timeout: 10000 });

    // 等待動物卡片載入
    await page.waitForSelector('.animal-card img', { timeout: 5000 });

    // 檢查所有動物圖片
    const images = page.locator('.animal-card img');
    const imageCount = await images.count();

    expect(imageCount).toBeGreaterThan(0);

    // 檢查每張圖片
    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i);
      await expect(image).toBeVisible();

      const src = await image.getAttribute('src');
      expect(src).toContain('../images/');
      console.log(`✓ 動物圖片 ${i + 1} 載入成功:`, src);
    }
  });
});