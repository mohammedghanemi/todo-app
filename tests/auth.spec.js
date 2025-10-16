import { test, expect } from '@playwright/test';

test.describe('نظام المصادقة', () => {
  test('يجب أن يسمح بتسجيل الدخول', async ({ page }) => {
    await page.goto('/');
    
    // ملء نموذج تسجيل الدخول
    await page.fill('input[type="text"]', 'testuser');
    await page.fill('input[type="password"]', 'testpass');
    
    // النقر على زر تسجيل الدخول
    await page.click('button[type="submit"]');
    
    // التحقق من الانتقال إلى صفحة المهام
    await expect(page.locator('.todo-list-container')).toBeVisible();
    await expect(page.locator('.user-info')).toContainText('testuser');
  });

  test('يجب أن يمنع تسجيل الدخول بحقول فارغة', async ({ page }) => {
    await page.goto('/');
    
    // محاولة تسجيل الدخول بحقول فارغة
    await page.click('button[type="submit"]');
    
    // يجب أن يبقى في صفحة تسجيل الدخول
    await expect(page.locator('.login-form')).toBeVisible();
  });

  test('يجب أن يسمح بتسجيل الخروج', async ({ page }) => {
    await page.goto('/');
    
    // تسجيل الدخول أولاً
    await page.fill('input[type="text"]', 'testuser');
    await page.fill('input[type="password"]', 'testpass');
    await page.click('button[type="submit"]');
    
    // الانتظار للتحميل ثم تسجيل الخروج
    await page.waitForSelector('.todo-list-container');
    await page.click('.logout-btn');
    
    // التحقق من العودة إلى صفحة تسجيل الدخول
    await expect(page.locator('.login-form')).toBeVisible();
    await expect(page.locator('.todo-list-container')).not.toBeVisible();
  });

  test('يجب أن يحفظ حالة تسجيل الدخول بعد التحديث', async ({ page }) => {
    await page.goto('/');
    
    // تسجيل الدخول
    await page.fill('input[type="text"]', 'testuser');
    await page.fill('input[type="password"]', 'testpass');
    await page.click('button[type="submit"]');
    
    // إعادة تحميل الصفحة
    await page.reload();
    
    // التحقق من بقاء تسجيل الدخول
    await expect(page.locator('.todo-list-container')).toBeVisible();
    await expect(page.locator('.user-info')).toContainText('testuser');
  });
});