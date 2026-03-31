// Import required Playwright types and assertion library
import { Locator, Page, expect } from '@playwright/test';

// Interface that defines the structure of test data
// This helps ensure we pass the correct fields when filling the form 
export interface PracticeFormData {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  mobile: string;
  dateOfBirth: string;
  subjects: string[];
  hobbies: string[];
  picture: string;
  currentAddress: string;
  state: string;
  city: string;
}

// Page Object Model class for the DemoQA Practice Form page
export class FormPage {

  // Playwright page instance
  readonly page: Page;

  // Locators for all important form fields
  readonly inputFirstName: Locator;
  readonly inputLastName: Locator;
  readonly inputEmail: Locator;
  readonly inputMobile: Locator;
  readonly dob: Locator;
  readonly inputSubjects: Locator;
  readonly inputAddress: Locator;
  readonly inputState: Locator;
  readonly inputCity: Locator;
  readonly btnSubmit: Locator;
  readonly modalHeader: Locator;

  // Constructor runs when the page object is created
  // It initializes the page and all locators
  constructor(page: Page) {
    this.page = page;

    // Text input fields
    this.inputFirstName = page.locator('#firstName');
    this.inputLastName  = page.locator('#lastName');
    this.inputEmail     = page.locator('#userEmail');
    this.inputMobile    = page.locator('#userNumber');

    // Date of Birth input field
    this.dob = page.locator('#dateOfBirthInput');

    // Subjects autocomplete input
    this.inputSubjects = page.locator('#subjectsInput');

    // Address textarea
    this.inputAddress = page.locator('#currentAddress');

    // Dropdown fields
    this.inputState = page.locator('#state');
    this.inputCity  = page.locator('#city');

    // Submit button
    this.btnSubmit = page.locator('#submit');

    // Modal header shown after submission
    this.modalHeader = page.locator('.modal-header');
  }

  // ==========================
  // FORM FIELD METHODS
  // ==========================

  // Fill first name and last name fields
  async fillName(firstName: string, lastName: string) {
    await this.inputFirstName.fill(firstName);
    await this.inputLastName.fill(lastName);
  }

  // Fill email field
  async fillEmail(email: string) {
    await this.inputEmail.fill(email);
  }

  // Select gender radio button based on visible label
  async selectGender(gender: string) {

    // Map visible gender text to radio button IDs in DOM
    const genderIdMap: Record<string, string> = {
      Male:   'gender-radio-1',
      Female: 'gender-radio-2',
      Other:  'gender-radio-3'
    };

    // Get radio button id from map
    const id = genderIdMap[gender];

    // Throw error if invalid gender value is passed
    if (!id) throw new Error(`Unknown gender value: ${gender}`);

    // Clicking the label instead of radio input because inputs are hidden
    await this.page.locator(`label[for="${id}"]`).click();
  }

  // Fill mobile number field
  async fillMobile(mobile: string) {
    await this.inputMobile.fill(mobile);
  }

  // Fill date of birth and press Enter to close calendar popup
  async fillDateOfBirth(dob: string) {
    await this.dob.fill(dob);
    await this.page.keyboard.press('Enter');
  }

  // Select multiple subjects using autocomplete field
  async selectSubjects(subjects: string[]) {
    for (const subject of subjects) {
      await this.inputSubjects.fill(subject); // type subject
      await this.page.keyboard.press('Enter'); // select suggestion
    }
  }

  // Select hobbies by clicking their labels
  async selectHobbies(hobbies: string[]) {
    for (const hobby of hobbies) {
      await this.page.locator(`label:has-text("${hobby}")`).click();
    }
  }

  // Upload a picture file from utils folder
  async uploadPicture(fileName: string) {
    await this.page.setInputFiles('#uploadPicture', `utils/${fileName}`);
  }

  // Fill address field
  async fillAddress(address: string) {
    await this.inputAddress.fill(address);
  }

  // Select state and city from dropdowns
  async selectStateCity(state: string, city: string) {

    // Open state dropdown and choose value
    await this.inputState.click();
    await this.page.getByText(state).click();

    // Open city dropdown and choose value
    await this.inputCity.click();
    await this.page.getByText(city).click();
  }

  // ==========================
  // FORM SUBMISSION
  // ==========================

  // Click submit button
  async submitForm() {
    await this.btnSubmit.click();
  }

  // ==========================
  // VERIFICATION METHODS
  // ==========================

  // Verify that submitted data appears in confirmation modal
  async verifySubmission(data: PracticeFormData) {

    // Check modal title
    await expect(this.modalHeader)
      .toHaveText('Thanks for submitting the form');

    // Locate "Student Name" row and check value column
    const studentNameCell = this.page.locator('td', {
      hasText: 'Student Name'
    });

    await expect(
      studentNameCell.locator('xpath=following-sibling::td')
    ).toHaveText(`${data.firstName} ${data.lastName}`);

    // Locate "Student Email" row and verify value
    const studentEmailCell = this.page.locator('td', {
      hasText: 'Student Email'
    });

    await expect(
      studentEmailCell.locator('xpath=following-sibling::td')
    ).toHaveText(data.email);
  }

  // ==========================
  // UTILITY: FORCE CLOSE MODAL
  // ==========================

  // Sometimes the DemoQA modal blocks the page and prevents further actions.
  // This method removes the modal and backdrop using JavaScript.
  async forceCloseModal(): Promise<void> {

    await this.page.evaluate(() => {

      // Select modal and overlay backdrop elements
      const modal = document.querySelector('.modal.show');
      const backdrop = document.querySelector('.modal-backdrop');

      // Hide modal if present
      if (modal) {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
      }

      // Remove dark overlay if present
      if (backdrop) {
        backdrop.remove();
      }
    });

    // Small wait to allow DOM to update
    await this.page.waitForTimeout(500);
  }
}