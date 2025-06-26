import { type Locator, type Page, expect } from '@playwright/test';

export class BookTableRow {
    private row: Locator;
    private titleLocator: Locator;
    private authorLocator: Locator;
    private rating: Locator;
    private deleteLink: Locator;


    constructor(row: Locator) {
        this.row = row;
        this.titleLocator = this.row.locator(`//td[contains(@class, 'title')]/descendant::a`);
        this.authorLocator = this.row.locator(`//td[contains(@class, 'author')]/descendant::a`);
        this.rating = this.row.locator(`//td[contains(@class, 'rating')]/descendant::a[contains(@class,'on')]`);
        this.deleteLink = this.row.locator(`//td[contains(@class, 'actions')]/descendant::a[contains(@class,'deleteLink')]`);
    }

    async getTitle(): Promise<string> {
        return await this.titleLocator.innerText() || '';
    }

    async getAuthor(): Promise<string> {
        return await this.authorLocator.innerText() || '';
    }

    async getRating(): Promise<number> {
        return await this.rating.count();
    }

    async clickDeleteLink() {
        this.row.page().on('dialog', async dialog => {
            console.log(dialog.message());
            await dialog.accept();
        });
        await this.deleteLink.click();
        console.log(`Delete link clicked for book: ${await this.getTitle()}`);
    }
}