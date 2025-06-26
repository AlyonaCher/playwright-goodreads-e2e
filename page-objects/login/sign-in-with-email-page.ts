import { type Locator, type Page, expect } from '@playwright/test';

export class SignInWithEmailPage {

    private readonly page: Page;
    private readonly email: Locator;
    private readonly password: Locator;
    private readonly signInWithEmail: Locator;

    constructor(page: Page) {
        this.page = page;
        this.email = page.locator(`//input[@id='ap_email']`);
        this.password = page.locator(`//input[@id='ap_password']`);
        this.signInWithEmail = page.locator(`//input[@id='signInSubmit']`);
    }

    async signInWithEmailClick(email: string, password: string) {
        await this.email.type(email, {delay: 100});
        console.log(`Email filled with: ${email}`);
        await this.password.type(password, {delay: 100});
        console.log(`Password filled with: ${password}`);
        await this.signInWithEmail.click({delay: 100});
        console.log('Sign in with email button clicked');
    }

}