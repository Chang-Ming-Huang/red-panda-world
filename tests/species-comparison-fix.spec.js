const { test, expect } = require('@playwright/test');

test.describe('物種比較頁面修正測試', () => {
  test('物種比較頁面應該正確載入資料而沒有 JavaScript 錯誤', async ({ page }) => {
    // 監聽 JavaScript 錯誤
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      errors.push(error.message);
    });

    // 開啟物種比較頁面
    await page.goto('/pages/species-comparison.html');

    // 等待頁面載入完成
    await page.waitForSelector('.comparison-container', { timeout: 10000 });

    // 等待資料載入
    await page.waitForTimeout(2000);

    // 檢查是否有 JavaScript 錯誤
    if (errors.length > 0) {
      console.log('發現 JavaScript 錯誤:', errors);
    }
    expect(errors).toHaveLength(0);

    // 檢查有趣事實區域是否載入
    const funFacts = page.locator('#fun-facts');
    await expect(funFacts).toBeVisible();

    // 檢查是否有內容
    const funFactsContent = await funFacts.textContent();
    expect(funFactsContent).toBeTruthy();
    expect(funFactsContent.length).toBeGreaterThan(0);

    console.log('✓ 物種比較頁面載入成功，無 JavaScript 錯誤');
    console.log('✓ 有趣事實區域正常顯示');
  });
});