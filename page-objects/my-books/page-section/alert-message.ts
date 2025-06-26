import { type Locator, type Page, expect } from '@playwright/test';

export class AlertMessage {

    readonly page: Page;
    private successMessageLocator: Locator;

    constructor(page: Page) {
        this.page = page;
        this.successMessageLocator = this.page.locator("//div[contains(@class,'Toastify__toast--success')]");
    }

    async validateSuccessMessageIsDisplayed(text: string): Promise<void> {
        await this.successMessageLocator.waitFor({ state: 'visible' });
        const messages = await this.successMessageLocator.allInnerTexts();
        const messageFound = messages.some(message => message.includes(text));
        expect(messageFound, `Success message containing "${text}" was not found.`).toBeTruthy();
        console.log(`Success message containing "${text}" is displayed.`);
    }

};