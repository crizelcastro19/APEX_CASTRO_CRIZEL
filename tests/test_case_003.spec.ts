import { test, expect } from '@playwright/test';
import { POManager } from '../pageObject/POManager';

test.describe('Widgets (Select Menu) — Select a value from each type of dropdown.', () => {
  test('Widgets (Select Menu) — Select a value from each type of dropdown.', async ({ page }) => {
  // Block unnecessary requests (ads, analytics, etc.)
    await page.route('**/*', route => {
        const url = route.request().url();
        if (
        url.includes('ads') ||
        url.includes('doubleclick') ||
        url.includes('analytics') ||
        url.endsWith('.png') ||
        url.endsWith('.jpg') ||
        url.endsWith('.gif') ||
        url.endsWith('.woff2')
        ) {
        route.abort();
        } else {
        route.continue();
        }
    });
    
    const poManager = new POManager(page);
    const selectPage = poManager.getSelectPage();
    const dashPage = poManager.getdashBoardPage();

    // Open the practice form then navigate to web tables
    await page.goto('https://demoqa.com/select-menu', {
        waitUntil: 'domcontentloaded', 
      });

    // await dashPage.verifyPracticeFormTitle();
    // await dashPage.clickNavBar('Widgets');
    // await dashPage.clickSubNavBar('Select Menu');
    await selectPage.selectValue();
    await selectPage.selectTitle();
    await selectPage.oldStyleDrp();
    await selectPage.multiSelectDrp();
  });
});