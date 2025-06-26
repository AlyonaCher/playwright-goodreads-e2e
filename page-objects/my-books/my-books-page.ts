import { type Locator, type Page, expect } from '@playwright/test';
import { BookTableRow } from './page-section/book-table-row';
import { env } from 'process';

export class MyBooksPage {

    readonly page: Page;
    private readonly bookshelves;
    private readonly tableRows;
    private readonly shelvesSection;

    constructor(page: Page) {
        this.page = page;
        this.shelvesSection = this.page.locator('#shelvesSection');
        this.bookshelves = {
            allShelf: this.shelvesSection.getByRole('link', { name: 'All' }),
            wantToReadShelf: this.shelvesSection.getByRole('link', { name: 'Want to Read' }),
            currentlyReadingShelf: this.shelvesSection.getByRole('link', { name: 'Currently Reading' }),
            readShelf: this.shelvesSection.getByRole('link', { name: /^Read/ }),
        };

        this.tableRows = this.page.locator(`//table[@id='books']/tbody/tr`);
    }

    async clickAllShelf() {
        await this.bookshelves.allShelf.click();
        console.log('All shelf clicked');
    }

    async goToWantToReadShelf() {
        await this.bookshelves.wantToReadShelf.click();
        console.log('Want to Read shelf clicked');
    }

    async goToCurrentlyReadingShelf() {
        await this.bookshelves.currentlyReadingShelf.click();
        console.log('Currently Reading shelf clicked');
    }

    async goToReadShelf() {
        await this.bookshelves.readShelf.click();
        console.log('Read shelf clicked');
    }

    async validateAllShelfVisible() {
        await expect(this.bookshelves.allShelf).toBeVisible();
        console.log('All shelf is visible');
    }

    async getTableRows(): Promise<BookTableRow[]> {
        const items = await this.tableRows;
        const books: BookTableRow[] = [];

        await this.page.waitForLoadState('load');
        const rowsCount = await items.count();
        for (let i = 0; i < rowsCount; i++) {
            const rowLocator = items.nth(i);
            books.push(new BookTableRow(rowLocator));
        }

        return books;
    }

    async validateBookIsInTheList(
        expectedTitle: string,
        expectedAuthor: { firstName: string, lastName: string },
        inTheList: boolean
    ): Promise<void> {
        const tableRows = await this.getTableRows();
        let isFound = false;
        const expectedAuthorName = `${expectedAuthor.lastName}, ${expectedAuthor.firstName}`;

        for (const tableRow of tableRows) {
            const actualTitle = await tableRow.getTitle();
            const actualAuthor = await tableRow.getAuthor();            

            console.log(`Checking row: Title="${actualTitle}", Author="${actualAuthor}"`);
            if (actualTitle === expectedTitle && actualAuthor === expectedAuthorName) {
                isFound = true;
                break;
            }
        }

        const message = `Row with title "${expectedTitle}" and author "${expectedAuthorName}"` +
            (inTheList ? 'was not found in the list.' : 'was unexpectedly found in the list.');

        await expect(isFound, message).toBe(inTheList);
    }

    async validateBookRating(bookTitle: string, expectedRating: number): Promise<void> {
        const tableRows = await this.getTableRows();
        let isFound = false;

        for (const tableRow of tableRows) {
            const actualTitle = await tableRow.getTitle();
            if (actualTitle === bookTitle) {
                const actualRating = await tableRow.getRating();
                console.log(`Found book: "${actualTitle}" with rating: ${actualRating}`);
                isFound = actualRating === expectedRating;
                break;
            }
        }

        const message = `Book with title "${bookTitle}"` +
            (isFound ? ` has the expected rating: ${expectedRating}` : ` does not have the expected rating: ${expectedRating}`);

        await expect(isFound, message).toBe(true);
    }

    async deleteBookFromShelf(bookTitle: string): Promise<void> {
        const tableRows = await this.getTableRows();
        let isDeleted = false;

        for (const tableRow of tableRows) {
            const actualTitle = await tableRow.getTitle();
            if (actualTitle === bookTitle) {
                await tableRow.clickDeleteLink();
                isDeleted = true;
                break;
            }
        }

        const message = `Book with title "${bookTitle}" was not deleted from the shelf.`;
        await expect(isDeleted, message).toBe(true);
    }

    async deleteBookFromShelfIfExists(bookTitle: string): Promise<void>{
        const tableRows = await this.getTableRows();
        let isDeleted = false;

        for (const tableRow of tableRows) {
            const actualTitle = await tableRow.getTitle();
            if (actualTitle === bookTitle) {
                await tableRow.clickDeleteLink();
                isDeleted = true;
                break;
            }
        }

        const message = `Book with title "${bookTitle}" was not deleted from the shelf, but it was not expected to be there.`;
    }

    async removeAllTestBooksFromMyShelves(bookNamesToDelete: string[]): Promise<void> {
        await this.clickAllShelf();
        for (const bookName of bookNamesToDelete) {
            await this.deleteBookFromShelfIfExists(bookName);
        }

        // Validate that all specified books are removed
        for (const bookName of bookNamesToDelete) {
            await this.validateBookIsInTheList(bookName, { firstName: '', lastName: '' }, false);
            console.log(`Book "${bookName}" is not in the list after deletion.`);
        }
    }

}