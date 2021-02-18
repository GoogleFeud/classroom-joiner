import Puppeteer from "puppeteer";
import { sleep } from "./Navigator";



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

}