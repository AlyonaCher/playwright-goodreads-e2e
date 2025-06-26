import { type Locator, type Page, expect } from '@playwright/test';
import { AlertMessage } from './my-books/page-section/alert-message';

export class BookPage {

    readonly page: Page;
    private readonly rightColumn;
    private readonly leftColumn;
    private readonly moveToShelf;
    private readonly leftColumnLocator: Locator;
    private readonly rightColumnLocator: Locator;
    private readonly bookShelvesAlert: Locator;

    constructor(page: Page) {
        this.page = page;
        this.leftColumnLocator = page.locator(`//div[@class='BookPage__leftColumn']`);
        this.rightColumnLocator = page.locator(`//div[@class='BookPage__rightColumn']`);
        this.bookShelvesAlert = page.locator(`//div[contains(@class,'Overlay--floating') and descendant::h3[contains(text(),'Choose a shelf for this book')]]`);

        this.rightColumn = {
            bookTitle: this.rightColumnLocator.locator(`//div[@class='BookPageTitleSection']`),
            signIn: this.rightColumnLocator.locator(`//a[ancestor::div[@id='signIn']]`),
        }

        this.leftColumn = {
            moveToShelfButton: this.leftColumnLocator.locator(`//button[@aria-label="Tap to choose a shelf for this book" and ancestor::div[contains(@class,'BookActions')]]`),
            wantToReadButton: this.leftColumnLocator.getByRole('button', { name: 'Want to read' }),
            currentlyReading: this.leftColumnLocator.getByRole('button', { name: 'Currently Reading', exact: false }),
            allRatingStars: this.leftColumnLocator.getByRole('button', { name: /Rate \d out of 5/ }),
        }

        this.moveToShelf = {
            wantToRead: this.bookShelvesAlert.getByRole('button', { name: 'Want to read' }),
            currentlyReading: this.bookShelvesAlert.getByRole('button', { name: 'Currently Reading', exact: false }),
            read: this.bookShelvesAlert.getByRole('button', { name: 'Read', exact: true }),
            doneButton: page.getByRole('button', { name: 'Done' })
        }
    }

    async expectBookTitleVisible(expectedTitle: string) {
        await expect(this.rightColumn.bookTitle).toBeVisible();
        const actualTitle = await this.rightColumn.bookTitle.textContent();
        expect(actualTitle).toContain(expectedTitle);
        console.log(`Book title is visible and contains: ${expectedTitle}`);
    }

    async chooseCurrentlyReadingShelf() {
        await this.bookShelvesAlert.waitFor({ state: 'visible' });
        await this.moveToShelf.currentlyReading.click();
        await this.moveToShelf.doneButton.click();
        console.log(`Book moved to "Currently Reading" shelf`);
    }

    async chooseReadShelf() {
        await this.bookShelvesAlert.waitFor({ state: 'visible' });
        await this.moveToShelf.read.click();
        await this.moveToShelf.doneButton.click();
        console.log(`Book moved to "Read" shelf`);
    }

    async wantToReadClick() {
        await this.page.waitForLoadState('load');
        await this.leftColumn.wantToReadButton.scrollIntoViewIfNeeded();
        await this.leftColumn.wantToReadButton.evaluate(button => {
            button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        });
        console.log(`Clicked on "Want to Read" button`);
    }

    async currentlyReadingClick() {
        await this.page.waitForLoadState('load');
        await this.leftColumn.currentlyReading.scrollIntoViewIfNeeded();
        await this.leftColumn.currentlyReading.evaluate(button => {
            button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        });
        console.log(`Clicked on "Currently reading" button`);
    }

    async validateSuccessMessageIsDisplayed(message: string) {
        await new AlertMessage(this.page).validateSuccessMessageIsDisplayed(message);
    }

    async rateBook(rating: number) {
        await this.page.waitForLoadState('load');
        const stars = this.leftColumn.allRatingStars.nth(rating - 1);
        await stars.scrollIntoViewIfNeeded();
        await stars.evaluate(button => {
            button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        });
        console.log(`Rated the book with ${rating} stars`);
    }

}