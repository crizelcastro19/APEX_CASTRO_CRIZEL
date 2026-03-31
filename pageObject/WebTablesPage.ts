// Import Playwright types and assertion library
import { Page, Locator, expect } from '@playwright/test';

// Interface describing the structure of data used in the web table form
// This ensures type safety when updating or verifying table rows 
export interface WebTableData {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  salary: string;
  department: string;
}

// Page Object Model for the DemoQA Web Tables page
export class WebTablesPage {

  // Page instance used to perform browser actions
  private page: Page;

  // Constructor receives the Playwright page and stores it
  constructor(page: Page) {
    this.page = page;
  }

  // ==========================
  // TABLE ACTIONS
  // ==========================

  // Click the edit icon for a specific row
  // The index is 1-based because the website IDs start from 1
  async editRow(index: number): Promise<void> {

    // Example: index = 1 → #edit-record-1
    await this.page.locator(`#edit-record-${index}`).click();
  }

  // ==========================
  // FORM ACTIONS
  // ==========================

  // Update the edit form with new values
  async updateForm(data: WebTableData): Promise<void> {

    // Fill each form field using the values provided in the data object
    await this.page.fill('#firstName',  data.firstName);
    await this.page.fill('#lastName',   data.lastName);
    await this.page.fill('#userEmail',  data.email);
    await this.page.fill('#age',        data.age);
    await this.page.fill('#salary',     data.salary);
    await this.page.fill('#department', data.department);
  }

  // Click the Submit button to save changes
  async submit(): Promise<void> {

    // Using role-based locator for better readability and stability
    await this.page
      .getByRole('button', { name: 'Submit' })
      .click();

    // No explicit wait here because Playwright auto-waits
    // The test should verify results after submission
  }

  // ==========================
  // TABLE DATA ACCESS HELPERS
  // ==========================

  // Get a specific row from the table
  // Uses nth(index - 1) because Playwright is zero-based
  getRow(index: number): Locator {
    return this.page
      .locator('table tbody tr')
      .nth(index - 1);
  }

  // Get a specific cell from a row
  // columnIndex is zero-based (0 = first column)
  getCell(rowIndex: number, columnIndex: number): Locator {
    return this
      .getRow(rowIndex)
      .locator('td')
      .nth(columnIndex);
  }
}