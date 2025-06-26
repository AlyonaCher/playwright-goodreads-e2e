import { type Locator, type Page, expect } from '@playwright/test';

export class SignInPage {

    private readonly page: Page;
    private readonly signInWithEmail: Locator;

    constructor(page: Page) {
        this.page = page;
        this.signInWithEmail = page.locator(`//button[contains(@class,'authPortalSignInButton')]`);
    }

    async signInWithEmailClick() {
        this.signInWithEmail.click({delay: 100});
        console.log('Sign in with email button clicked');
    }

}