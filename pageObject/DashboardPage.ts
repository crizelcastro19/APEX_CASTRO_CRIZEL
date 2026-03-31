// Import Playwright test utilities and types
import {expect, Locator, Page } from '@playwright/test';

// Page Object Model class for the DemoQA Dashboard page
export class DashboardPage {

  // Playwright page instance used to interact with the browser 
  page: Page;

  // Locators for important dashboard elements
  navBarElements: Locator;
  dashBoardPracticeFormTitle: Locator;
  dashBoardWebTables: Locator;

  // Constructor runs when a new DashboardPage object is created
  // It initializes the page and all element locators
  constructor(page: Page) {
    this.page = page;

    // Main navigation card: "Elements"
    // Uses XPath because the card is identified by visible text
    this.navBarElements = page.locator('//div[text()="Elements"]');

    // Page title used to verify we are on the Practice Form page
    this.dashBoardPracticeFormTitle =
      page.locator("//h1[text()='Practice Form']");

    // Sidebar link for "Web Tables"
    // Using role-based locator for better stability and readability
    this.dashBoardWebTables =
      page.getByRole('link', { name: "Web Tables" });
  }

  // ==========================
  // VERIFICATION METHODS
  // ==========================

  // Verify that the Practice Form page is displayed
  async verifyPracticeFormTitle() {
    await expect(this.dashBoardPracticeFormTitle).toBeVisible();
  }

  // ==========================
  // NAVIGATION METHODS
  // ==========================

  // Click the "Elements" card from the dashboard
  async clickNavBarElements() {
    await this.navBarElements.click();
  }

  // Click the "Web Tables" link from the sidebar menu
  async clickWebTables() {
    await this.dashBoardWebTables.click();
  }

  // Generic method to click any main navigation card by its name
  // Example: clickNavBar("Forms")
  async clickNavBar(navName: string): Promise<void> {
    await this.page
      .locator(`//div[text()="${navName}"]`)
      .click();
  }

  // Generic method to click any sub-navigation item in the sidebar
  // Example: clickSubNavBar("Practice Form")
  async clickSubNavBar(navSubName: string): Promise<void> {
    await this.page
      .locator(`//span[text()="${navSubName}"]`)
      .click();
  }
}