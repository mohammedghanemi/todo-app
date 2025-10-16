import { test, expect } from '@playwright/test';

test.describe('إدارة قائمة المهام', () => {
  test.beforeEach(async ({ page }) => {
    // الانتقال إلى الصفحة الرئيسية
    await page.goto('/');
    
    // تسجيل الدخول أولاً
    await page.fill('input[type="text"]', 'testuser');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    // الانتظار حتى يتم تحميل واجهة قائمة المهام
    await page.waitForSelector('.todo-list-container');
  });

  test('يجب أن يسمح بإضافة مهمة جديدة', async ({ page }) => {
    // إضافة مهمة جديدة
    const todoText = 'مهمة اختبار جديدة';
    await page.fill('.todo-input', todoText);
    await page.click('.add-btn');

    // التحقق من ظهور المهمة في القائمة
    const todoItem = page.locator('.todo-item').last();
    await expect(todoItem).toContainText(todoText);
    await expect(todoItem).not.toHaveClass('completed');
  });

  test('يجب أن يسمح بتعديل المهمة', async ({ page }) => {
    // إضافة مهمة أولاً
    await page.fill('.todo-input', 'مهمة للتعديل');
    await page.click('.add-btn');

    // النقر على زر التعديل
    const todoItem = page.locator('.todo-item').last();
    await todoItem.locator('.edit-btn').click();

    // تعديل النص
    const newText = 'مهمة معدلة';
    await page.fill('.edit-input', newText);
    await page.click('.save-btn');

    // التحقق من التعديل
    await expect(todoItem).toContainText(newText);
  });

  test('يجب أن يسمح بحذف المهمة', async ({ page }) => {
    // إضافة مهمة أولاً
    await page.fill('.todo-input', 'مهمة للحذف');
    await page.click('.add-btn');

    // التحقق من وجود المهمة
    const initialCount = await page.locator('.todo-item').count();
    expect(initialCount).toBeGreaterThan(0);

    // حذف المهمة
    const todoItem = page.locator('.todo-item').last();
    await todoItem.locator('.delete-btn').click();

    // التحقق من الحذف
    const finalCount = await page.locator('.todo-item').count();
    expect(finalCount).toBe(initialCount - 1);
  });

  test('يجب أن يسمح بتحديد المهمة كمكتملة', async ({ page }) => {
    // إضافة مهمة أولاً
    await page.fill('.todo-input', 'مهمة للإكمال');
    await page.click('.add-btn');

    // تحديد المهمة كمكتملة
    const todoItem = page.locator('.todo-item').last();
    const checkbox = todoItem.locator('.todo-checkbox');
    await checkbox.click();

    // التحقق من التحديد
    await expect(todoItem).toHaveClass(/completed/);
    await expect(checkbox).toBeChecked();
  });

  test('يجب أن يعرض الإحصائيات بشكل صحيح', async ({ page }) => {
    // إضافة عدة مهام
    const todos = ['مهمة 1', 'مهمة 2', 'مهمة 3'];
    for (const todo of todos) {
      await page.fill('.todo-input', todo);
      await page.click('.add-btn');
      await page.waitForTimeout(100);
    }

    // تحديد بعض المهام كمكتملة
    const todoItems = page.locator('.todo-item');
    await todoItems.nth(0).locator('.todo-checkbox').click();
    await todoItems.nth(1).locator('.todo-checkbox').click();

    // التحقق من الإحصائيات
    const stats = page.locator('.todo-stats');
    await expect(stats).toContainText('2/3');
  });

  test('يجب أن يحفظ البيانات بعد إعادة التحميل', async ({ page }) => {
    // إضافة مهمة
    const todoText = 'مهمة للاختبار بعد التحميل';
    await page.fill('.todo-input', todoText);
    await page.click('.add-btn');

    // إعادة تحميل الصفحة
    await page.reload();

    // التحقق من استمرار وجود المهمة
    await expect(page.locator('.todo-item')).toContainText(todoText);
  });
});