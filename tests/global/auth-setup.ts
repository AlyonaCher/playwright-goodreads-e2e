import { test as setup, type Page } from '@playwright/test';
import path from 'path';
import { HomePage } from '../../page-objects/home-page';
import envData from '../../test-data/stage-env-test-data';
import { SignInPage } from '../../page-objects/login/sign-in-page';
import { SignInWithEmailPage } from '../../page-objects/login/sign-in-with-email-page';
import fs from 'fs';

setup('authenticate', async ({ page }) => {
    const authFile = path.resolve(__dirname, '../../.auth/user.json');
    fs.mkdirSync(path.dirname(authFile), { recursive: true });

    console.log('Starting authentication setup...');
    console.log(`Navigating to base URL: ${envData.testData.baseURL}`);
    await page.goto(envData.testData.baseURL, { waitUntil: 'domcontentloaded'});
    const signedInHomePage = new HomePage(page);
    await signedInHomePage.signInClick();
    await new SignInPage(page).signInWithEmailClick();
    await new SignInWithEmailPage(page).signInWithEmailClick(envData.testData.user.email, envData.testData.user.pass);
    await signedInHomePage.validateProfileIconVisible();

    // End of authentication steps.
    await page.context().storageState({ path: authFile });
});