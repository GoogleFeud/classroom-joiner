
import Puppeteer from "puppeteer";
import { Config } from ".";

export const LOGIN_LINK = "https://accounts.google.com/signin/v2/identifier?service=classroom&passive=1209600&continue=https%3A%2F%2Fclassroom.google.com%2F%3Femr%3D0&followup=https%3A%2F%2Fclassroom.google.com%2F%3Femr%3D0&flowName=GlifWebSignIn&flowEntry=ServiceLogin";
export const EMAIL_SELECTOR = "#identifierId";
export const NEXT_SELECTOR = "#identifierNext";

export async function sleep(ms: number) : Promise<void> {
    return new Promise(resolve => setTimeout(resolve ,ms));
}

export class Navigator {
    config: Config
    browser?: Puppeteer.Browser
    page?: Puppeteer.Page
    constructor(config: Config) {
        this.config = config;
    }

    async launch() : Promise<void> {
        this.browser = await Puppeteer.launch({headless: this.config.settings.headless});
        this.page = await this.browser.newPage();
        try {
            await this.page.goto(LOGIN_LINK);
            await this.page.waitForSelector(EMAIL_SELECTOR);
            await this.page.type(EMAIL_SELECTOR, this.config.settings.email);
            await sleep(1000); 
            await this.page.click(NEXT_SELECTOR);
            await sleep(2000);
            await this.page.evaluate((pass: string) => [...document.getElementsByTagName("input")].filter(e => e.type === "password")[0].value = pass, this.config.settings.password);
            await sleep(1000);
            await this.page.evaluate(() => document.getElementsByTagName("button")[1].click());
            await sleep(5000);
        }catch(err) {
            console.log(err);
        }
    }

    async getMeetLink(className: string) : Promise<string|undefined> {
        if (!this.page || !this.browser) return;
        const isSuccessful = await this.page.evaluate((className_: string) => {
            const elementOfInterest = [...document.getElementsByTagName("div")].filter(el => el.innerText === className_)[0];
            if (!elementOfInterest) return;
            elementOfInterest.click();
            return true;
        }, className);
        if (!isSuccessful) return;
        await sleep(5000);
        const link: string|undefined = await this.page.evaluate(() => {
            const elementOfInterest = [...document.getElementsByTagName("a")].filter(el => el.href.includes("meet.google.com"))[0];
            if (!elementOfInterest) return;
            return elementOfInterest.href;
        });
        await sleep(300);
        return link;
    }

    async enterMeet(link: string) : Promise<void> {
        if (!this.browser) return;
        const meetPage = await this.browser.newPage();
        await meetPage.goto(link);

    }

}