import { test as base } from '@playwright/test';
import { HomePage } from '../../page-objects/home-page';
import { MyBooksPage } from '../../page-objects/my-books/my-books-page';
import envData from '../../test-data/stage-env-test-data';

type MyFixtures = {
    myBooksPage: MyBooksPage;
    homePage: HomePage;
};

export const test = base.extend<MyFixtures>({
    myBooksPage: async ({ browser }, use) => {
        // Load the storage state
        const context = await browser.newContext({
            storageState: '.auth/user.json', 
        });

        const page = await context.newPage();
        await page.goto(envData.testData.baseURL, { waitUntil: 'domcontentloaded' });
        const signedInHomePage = await new HomePage(page);
        await signedInHomePage.openMyBooksPage();
        const myBooksPage = await new MyBooksPage(signedInHomePage.page);

        await use(myBooksPage);

        await context.close(); 
    },
    homePage: async ({ browser }, use) => {
        // Load the storage state
        const context = await browser.newContext({
            storageState: '.auth/user.json', 
        });

        const page = await context.newPage();
        await page.goto(envData.testData.baseURL, { waitUntil: 'domcontentloaded' });
        const homePage = await new HomePage(page);        

        await use(homePage);

        await context.close(); 
    },
});

export { expect } from '@playwright/test';