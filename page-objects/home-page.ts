import { type Locator, type Page, expect } from '@playwright/test';

export class HomePage {

    readonly page: Page;
    private readonly newAccountSection;
    private readonly topMenuSection;
    private readonly siteHeader: Locator;

    constructor(page: Page) {
        this.page = page;
        this.newAccountSection = {
            newAccountBox: page.locator(`//div[@id='newAccountBox']`),
            signIn: page.locator(`//a[ancestor::div[@id='signIn']]`),
        }
        this.siteHeader = this.page.locator(`//header`);
        this.topMenuSection = {
            myBooks: this.siteHeader.getByRole('link', { name: 'My Books' }),
            profileIcon: this.siteHeader.locator(`//div[contains(@class,'dropdown--profileMenu')]`),
            searchInput: this.page.locator(`//input[@placeholder="Search books"]`),
            booksList: this.page.locator(`//div[contains(@class,"gr-bookSearchResults")]`),
            bookTitleListElement: this.page.locator(`//div[contains(@class,"gr-bookSearchResults__item")]`),
        };
    }

    async searchForBook(bookTitle: string) {
        await this.topMenuSection.searchInput.fill(bookTitle);
        console.log(`Search input filled with: ${bookTitle}`);
        const bookListElement = await this.topMenuSection.bookTitleListElement.filter({ hasText: bookTitle });
        await bookListElement.first().click();
        console.log(`Book with title "${bookTitle}" clicked in search results`);
    }

    async signInClick() {
        await Promise.all([
            await this.newAccountSection.signIn.click({delay: 100}),
            await this.page.waitForLoadState('load')
        ]);

        console.log('Sign in link clicked');
    }

    async openMyBooksPage() {
        await this.topMenuSection.myBooks.click();
        console.log('My Books link clicked');
    }

    async validateProfileIconVisible() {
        await expect(this.topMenuSection.profileIcon).toBeVisible();
        console.log('Profile icon is visible');
    }

}