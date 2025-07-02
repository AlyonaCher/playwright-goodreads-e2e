import { test, expect } from '../fixtures/login-fixture';
import envData from '../../test-data/stage-env-test-data';

test.describe.configure({ mode: 'parallel' });

test('displays all books across all shelves when "All" shelf is selected @Tbde6e07f', async ({ myBooksPage }) => {

  //ARRANGE
  const booksOnAllShelf = envData.testData.booksOnMyShelves;

  //ACT
  await myBooksPage.clickAllShelf();

  //ASSERT
  for (const book of booksOnAllShelf) {
    await myBooksPage.validateBookIsInTheList(book.title, book.author, true);
  }
});

test('shows only "Want To Read" books when that shelf is selected @Te3036f1b', async ({ myBooksPage }) => {
  //ARRANGE
  const booksOnWantToreadShelf = envData.testData.booksOnMyShelves.filter(book => book.shelf === 'Want To Read');
  const booksNotOnWantToreadShelf = envData.testData.booksOnMyShelves.filter(book => book.shelf !== 'Want To Read');

  //ACT
  await myBooksPage.goToWantToReadShelf();

  //ASSERT
  for (const book of booksOnWantToreadShelf) {
    await myBooksPage.validateBookIsInTheList(book.title, book.author, true);
  }

  for (const book of booksNotOnWantToreadShelf) {
    await myBooksPage.validateBookIsInTheList(book.title, book.author, false);
  }
});

test('shows only "Currently Reading" books when that shelf is selected @Te9c41daa', async ({ myBooksPage }) => {
  //ARRANGE
  const booksOnCurrentlyReadingShelf = envData.testData.booksOnMyShelves.filter(book => book.shelf === 'Currently Reading');
  const booksNotOnCurrentlyReadingShelf = envData.testData.booksOnMyShelves.filter(book => book.shelf !== 'Currently Reading');

  //ACT
  await myBooksPage.goToCurrentlyReadingShelf();

  //ASSERT
  for (const book of booksOnCurrentlyReadingShelf) {
    await myBooksPage.validateBookIsInTheList(book.title, book.author, true);
  }

  for (const book of booksNotOnCurrentlyReadingShelf) {
    await myBooksPage.validateBookIsInTheList(book.title, book.author, false);
  }
});

test('shows only "Read" books when that shelf is selected @T8df8fdd2', async ({ myBooksPage }) => {
  //ARRANGE
  const booksOnReadShelf = envData.testData.booksOnMyShelves.filter(book => book.shelf === 'Read');
  const booksNotOnReadShelf = envData.testData.booksOnMyShelves.filter(book => book.shelf !== 'Read');

  //ACT
  await myBooksPage.goToReadShelf();

  //ASSERT
  for (const book of booksOnReadShelf) {
    await myBooksPage.validateBookIsInTheList(book.title, book.author, true);
  }

  for (const book of booksNotOnReadShelf) {
    await myBooksPage.validateBookIsInTheList(book.title, book.author, false);
  }
});


