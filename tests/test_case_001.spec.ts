import { test, expect } from '@playwright/test';
import { POManager } from '../pageObject/POManager';
import { FormPage } from "../pageObject/FormPage";
import testData from '../utils/test_data.json';
import practiceData from '../utils/practice_form.json';
import type { WebTableData } from '../pageObject/WebTablesPage';
import type { PracticeFormData } from "../pageObject/FormPage";

/**
 * Utility function to block unnecessary network requests
 * This improves test speed and avoids loading ads, analytics, and images.
 */
async function blockUnwantedRequests(page: any) {
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
      route.abort(); // prevent request
    } else { 
      route.continue(); // allow request
    }
  });
}

test.describe('APEX EXAM', () => {

  /**
   * Scenario 1:
   * Edit each row in the Web Tables page using test data
   * then verify that the table values were updated correctly.
   */
  test('Scenario 1: Edit rows using data and verify updated values', async ({ page }) => {

    await blockUnwantedRequests(page);

    // Initialize Page Object Manager
    const poManager = new POManager(page);
    const webTables = poManager.getwebTablePages();
    const dashPage = poManager.getdashBoardPage();

    // Open the Practice Form page first (entry point)
    await page.goto('https://demoqa.com/automation-practice-form', {
      waitUntil: 'domcontentloaded',
    });

    // Navigate to Web Tables via dashboard
    await dashPage.verifyPracticeFormTitle();
    await dashPage.clickNavBarElements();
    await dashPage.clickWebTables();

    const tableData = testData as WebTableData[];

    // Loop through each dataset and update corresponding table row
    for (let index = 0; index < tableData.length; index++) {

      const data = tableData[index];

      // Row index is 1-based in the UI
      const rowNumber = index + 1;

      // Click edit button for the specific row
      await webTables.editRow(rowNumber);

      // Update form fields with JSON data
      await webTables.updateForm(data);

      // Submit changes
      await webTables.submit();

      // Verify updated values in table
      await expect(webTables.getCell(rowNumber, 0)).toHaveText(data.firstName);
      await expect(webTables.getCell(rowNumber, 1)).toHaveText(data.lastName);
      await expect(webTables.getCell(rowNumber, 2)).toHaveText(data.age);
      await expect(webTables.getCell(rowNumber, 3)).toHaveText(data.email);
      await expect(webTables.getCell(rowNumber, 4)).toHaveText(data.salary);
      await expect(webTables.getCell(rowNumber, 5)).toHaveText(data.department);
    }
  });

  /**
   * Scenario 2:
   * Fill and submit the Practice Form multiple times using different datasets.
   */
  test('Scenario 2: Fill and submit multiple data sets', async ({ page }) => {

    await blockUnwantedRequests(page);

    const practiceForm = new FormPage(page);

    // Navigate directly to the form page
    await page.goto('https://demoqa.com/automation-practice-form', {
      waitUntil: 'domcontentloaded',
    });

    const formData = practiceData as PracticeFormData[];

    // Iterate through each dataset and submit the form
    for (const data of formData) {

      await practiceForm.fillName(data.firstName, data.lastName);
      await practiceForm.fillEmail(data.email);
      await practiceForm.selectGender(data.gender);
      await practiceForm.fillMobile(data.mobile);
      await practiceForm.fillDateOfBirth(data.dateOfBirth);
      await practiceForm.selectSubjects(data.subjects);
      await practiceForm.selectHobbies(data.hobbies);
      await practiceForm.uploadPicture(data.picture);
      await practiceForm.fillAddress(data.currentAddress);
      await practiceForm.selectStateCity(data.state, data.city);

      // Submit the form
      await practiceForm.submitForm();

      // Verify confirmation modal values
      await practiceForm.verifySubmission(data);

      // Remove modal overlay so next iteration can continue
      await practiceForm.forceCloseModal();

      // Reload page to reset form for next dataset
      await page.reload();
    }
  });

  /**
   * Scenario 3:
   * Navigate to Widgets → Select Menu
   * and select values from different dropdown types.
   */
  test('Scenario 3: Widgets (Select Menu) — Select dropdown values', async ({ page }) => {

    await blockUnwantedRequests(page);

    const poManager = new POManager(page);
    const selectPage = poManager.getSelectPage();

    // Open Select Menu page directly
    await page.goto('https://demoqa.com/select-menu', {
      waitUntil: 'domcontentloaded',
    });

    // Perform dropdown selections
    await selectPage.selectValue();
    await selectPage.selectTitle();
    await selectPage.oldStyleDrp();
    await selectPage.multiSelectDrp();
  });

});