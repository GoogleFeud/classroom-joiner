import Puppeteer from "puppeteer";



export class MeetRoom {
    page: Puppeteer.Page
    constructor(page: Puppeteer.Page) {
        this.page = page;
    }
}