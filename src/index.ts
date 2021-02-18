
import {Navigator} from "./Navigator";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require("../config.json") as Config;

const Navi = new Navigator(config);

(async () => {
    await Navi.launch();
    /**   const link = await Navi.getMeetLink("Свят и личност");
    if (!link) return console.log("Couldn't find the meet link to that room!");
    const room = await Navi.enterMeet(link);
    if (!room) return console.log("Couldn't find the meet link to that room!");
    const canJoin = await room.canJoin();
    if (!canJoin) return console.log("I cannot join that room!");
    console.log("I can join the room!"); */
    
    const meetLink = await Navi.enterMeet("https://meet.google.com/tuq-oeec-zcn");
    if (!meetLink) return console.log("Couldn't get meet link!");
    console.log(await meetLink.canJoin());
})();

export interface Config {
    schedule: Record<string, Class>
    settings: ConfigSettings
}

export interface ConfigSettings {
    hereMessage?: string,
    headless: boolean,
    email: string,
    password: string
}

export interface Class {
    name: string,
    start: number,
    end: number
}