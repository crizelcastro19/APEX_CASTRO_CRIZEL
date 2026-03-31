import { DashboardPage } from "./DashboardPage";
import { WebTablesPage } from "./WebTablesPage";
import { SelectMenuPage } from "./SelectMenuPage";
import { Page } from "@playwright/test";

export class POManager{

    dashBoardPage: DashboardPage;
    webTablePages: WebTablesPage; 
    selectPage: SelectMenuPage;
    page: Page;

    constructor(page: Page)
    {
        this.page= page;
        this.dashBoardPage = new DashboardPage(this.page);
        this.webTablePages = new WebTablesPage(this.page);
        this.selectPage = new SelectMenuPage(this.page);
    }

    getdashBoardPage()
    {
        return this.dashBoardPage;
    }
    getwebTablePages()
    {
        return this.webTablePages;
    }
    getSelectPage()
    {
        return this.selectPage;
    }
}