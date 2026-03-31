import { test } from '@playwright/test';
import { FormPage, PracticeFormData } from '../pageObject/FormPage';
import testData from '../utils/practice_form.json';

test.describe('Automation Practice Form - Submit Multiple Sets', () => {
  test('fill and submit multiple data sets', async ({ page }) => {
    const practiceForm = new FormPage(page);

    await page.goto('https://demoqa.com/automation-practice-form', {
      waitUntil: 'domcontentloaded',
    }); 

    // Fill the form for each dataset
    for (const data of testData as PracticeFormData[]) {

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

      await practiceForm.submitForm();

      await practiceForm.verifySubmission(data);

      await practiceForm.forceCloseModal(); // force removal

      // Clear form for next dataset
      await page.reload();
    }
  });
});