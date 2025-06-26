import { test, expect } from '../fixtures/login-fixture';
import envData from '../../test-data/stage-env-test-data';
import messages from '../../test-data/messages';
import { BookPage } from '../../page-objects/book-page';
import { MyBooksPage } from '../../page-objects/my-books/my-books-page';

test.describe.configure({ mode: 'serial' });

const book = envData.testData.bookForE2eTest[0];

test('Add a book to "Want to Read" shelf and verify it appears there', async ({ homePage }) => {

    await test.step('Search for a book and open its page', async () => {
        await homePage.searchForBook(book.title);
        await new BookPage(homePage.page).expectBookTitleVisible(book.title);
    });

    await test.step('Add book to "Want to Read" shelf', async () => {
        const bookPage = new BookPage(homePage.page);
        await bookPage.wantToReadClick();
        await bookPage.validateSuccessMessageIsDisplayed(messages.bookPageMessages.bookAddedToWantToRead);
    });

    await test.step(`Validate that the book is on the 'Want To read' self `, async () => {
        await homePage.openMyBooksPage();
        const myBooksPage = new MyBooksPage(homePage.page);
        await myBooksPage.goToWantToReadShelf();
        await myBooksPage.validateBookIsInTheList(book.title, book.author, true);
    });
});

test('Add a book to "Currently Reading" shelf and verify it appears there', async ({ homePage }) => {

    await test.step('Search for a book and open its page', async () => {
        await homePage.searchForBook(book.title);
        await new BookPage(homePage.page).expectBookTitleVisible(book.title);
    });

    await test.step('Add book to "Currently Reading" shelf', async () => {
        const bookPage = new BookPage(homePage.page);
        await bookPage.wantToReadClick();
        await bookPage.chooseCurrentlyReadingShelf();
    });

    await test.step(`Validate that the book is on the 'Currently Reading' self `, async () => {
        await homePage.openMyBooksPage();
        const myBooksPage = new MyBooksPage(homePage.page);
        await myBooksPage.goToCurrentlyReadingShelf();
        await myBooksPage.validateBookIsInTheList(book.title, book.author, true);
    });
});

test('Add a book to "Read" shelf and verify it appears there', async ({ homePage }) => {

    await test.step('Search for a book and open its page', async () => {
        await homePage.searchForBook(book.title);
        await new BookPage(homePage.page).expectBookTitleVisible(book.title);
    });

    await test.step('Add book to "Read" shelf', async () => {
        const bookPage = new BookPage(homePage.page);
        await bookPage.currentlyReadingClick();
        await bookPage.chooseReadShelf();
    });

    await test.step(`Validate that the book is on the 'Read' self `, async () => {
        await homePage.openMyBooksPage();
        const myBooksPage = new MyBooksPage(homePage.page);
        await myBooksPage.goToReadShelf();
        await myBooksPage.validateBookIsInTheList(book.title, book.author, true);
    });
});

test('Rate the book and validate confirmation and shelf', async ({ homePage }) => {

    await test.step('Search for a book and open its page', async () => {
        await homePage.searchForBook(book.title);
        await new BookPage(homePage.page).expectBookTitleVisible(book.title);
    });

    await test.step('Rate the book', async () => {
        const bookPage = new BookPage(homePage.page);
        await bookPage.rateBook(book.rating);
        await bookPage.validateSuccessMessageIsDisplayed(`${book.rating} ${messages.bookPageMessages.ratingSaved}`);
    });

    await test.step(`Validate that the book is on the 'Read' self and is correctly rated `, async () => {
        await homePage.openMyBooksPage();
        const myBooksPage = new MyBooksPage(homePage.page);
        await myBooksPage.goToReadShelf();
        await myBooksPage.validateBookRating(book.title, book.rating);
    });
});

test('Remove rating and validate', async ({ homePage }) => {

    await test.step('Search for a book and open its page', async () => {
        await homePage.searchForBook(book.title);
        await new BookPage(homePage.page).expectBookTitleVisible(book.title);
    });

    await test.step('Unrate the book', async () => {
        const bookPage = new BookPage(homePage.page);
        await bookPage.rateBook(book.rating);
        await bookPage.validateSuccessMessageIsDisplayed(messages.bookPageMessages.ratingRemoved);
    });

    await test.step(`Validate that the book is on the 'Read' self and doesn't have any stars `, async () => {
        await homePage.openMyBooksPage();
        const myBooksPage = new MyBooksPage(homePage.page);
        await myBooksPage.goToReadShelf();
        await myBooksPage.validateBookRating(book.title, 0);
    });
});

test('Remove book from shelf and validate removal', async ({ homePage }) => {

    await test.step(`Delete Book `, async () => {
        await homePage.openMyBooksPage();
        await new MyBooksPage(homePage.page).deleteBookFromShelf(book.title);        
    });

    await test.step(`Validate if book was deleted `, async () => {
        await homePage.openMyBooksPage();
        const myBooksPage = new MyBooksPage(homePage.page);
        await myBooksPage.goToReadShelf();
        await myBooksPage.validateBookIsInTheList(book.title, book.author, false);      
    });
});

