// Import Playwright types and assertion library
import { test, expect, Locator, Page } from '@playwright/test';

// Page Object Model for DemoQA Select Menu page
export class SelectMenuPage {

  // Playwright page instance used for browser actions
  page: Page;

  // Locators for all dropdown elements on the page
  drpSelectValue: Locator;
  drpSelectTitle: Locator;
  drpOldStyle: Locator;
  drpMultiSelect: Locator;

  // Constructor initializes page and locators
  constructor(page: Page) {
    this.page = page;

    // React dropdown: "Select Value"
    this.drpSelectValue = page.locator('#react-select-2-input');

    // React dropdown: "Select Title"
    this.drpSelectTitle = page.locator('#react-select-3-input');

    // Standard HTML dropdown (old style select)
    this.drpOldStyle = page.locator('#oldSelectMenu');

    // React multi-select dropdown
    this.drpMultiSelect = page.locator('#react-select-4-input');
  }

  // ==========================
  // DROPDOWN ACTION METHODS
  // ==========================

  // Select a value from the "Select Value" dropdown
  async selectValue() {

    // Scroll to top because the dropdown is sometimes hidden off-screen
    await this.page.evaluate(() => window.scrollTo(0, 0));

    // Type into the React dropdown input
    await this.drpSelectValue.fill('Group 1');

    // Press Enter to select the highlighted option
    await this.drpSelectValue.press('Enter');
  }

  // Select a title from the "Select Title" dropdown
  async selectTitle() {
    await this.drpSelectTitle.fill('Dr');
    await this.drpSelectTitle.press('Enter');
  }

  // Select a color from the standard HTML dropdown
  async oldStyleDrp() {

    // selectOption is used for <select> elements 
    await this.drpOldStyle.selectOption('Aqua');
  }

  // Select multiple values from React multi-select dropdown
  async multiSelectDrp() {

    // Array of values we want to select
    const values = ['Green', 'Blue', 'Black'];

    // Loop through each value and select it
    for (const value of values) {
      await this.drpMultiSelect.fill(value);
      await this.drpMultiSelect.press('Enter');
    }
  }
}