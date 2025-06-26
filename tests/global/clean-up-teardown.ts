import { test as teardown } from '@playwright/test';
import envData from '../../test-data/stage-env-test-data';
import { HomePage } from '../../page-objects/home-page';
import { MyBooksPage } from '../../page-objects/my-books/my-books-page';

import { chromium } from '@playwright/test';


teardown('Clean up', async () => {
    const browser = await chromium.launch({ headless: false });
    console.log('All tests are done! Performing cleanup...');
    const context = await browser.newContext({
        storageState: '.auth/user.json',
    });

    const page = await context.newPage();
    await page.goto(envData.testData.baseURL, { waitUntil: 'domcontentloaded' });
    await new HomePage(page).openMyBooksPage();
    await new MyBooksPage(page).removeAllTestBooksFromMyShelves(envData.testData.bookForE2eTest.map(book => book.title));


    await context.close();
    await browser.close();

});