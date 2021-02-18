import Puppeteer from "puppeteer";
import { sleep } from "./Navigator";

export interface JoinSettings {
    toggleMic?: boolean
    toggleCam?: boolean
}

export class MeetRoom {
    page: Puppeteer.Page
    constructor(page: Puppeteer.Page) {
        this.page = page;
    }

    async canJoin(sleepMs = 300) : Promise<boolean> {
        await sleep(sleepMs);
        if (this.page.url().includes("lookup")) return false;
        await sleep(3000);
        const audioTags = await this.page.evaluate(() => document.getElementsByTagName("audio").length);
        return audioTags > 0;
    }

    async join(settings: JoinSettings = {}) : Promise<void> {
        await pressBtns(this.page, settings);
        await sleep(1000);
        await this.page.keyboard.press("Escape");
        await sleep(1000);
        await pressBtns(this.page, settings);
    }

    async leave() : Promise<void> {
        return this.page.close();
    }

}

function pressBtns(page: Puppeteer.Page, settings: JoinSettings = {}) : Promise<boolean> {
    return page.evaluate((toggleMic: boolean, toggleCam: boolean) => {
        const buttons = document.querySelectorAll("div[role='button']");
        if (!buttons.length) return false;
        for (let i=0; i < buttons.length; i++) {
            switch(i) {
            case 0:
                if (toggleMic) (buttons[i] as HTMLDivElement).click();
                break;
            case 1:
                if (toggleCam) (buttons[i] as HTMLDivElement).click();
                break;
            case 3:
                (buttons[i] as HTMLDivElement).click();
                return true;
            }
        }
        return false;
    }, settings.toggleMic || false, settings.toggleCam || false);
}