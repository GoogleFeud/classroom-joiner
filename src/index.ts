
import chalk from "chalk";
import { LOG_TYPES, Navigator } from "./Navigator";
import {startSchedule} from "./Scheduler";

let config!: Config;
try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    config = require("../config.json") as Config;
} catch {
    console.log(chalk.red("Could not find configuration file."));
}


(async () => {
    const navi = new Navigator(config);
    navi.log("Attempting to login with provided credentials", LOG_TYPES.INFO);
    await navi.launch();
    if (config.settings.specificMeet) {
        const meet = await navi.enterMeet(config.settings.specificMeet);
        if (!meet) return navi.log(`Invalid room ${config.settings.specificMeet}`);
        const X = setInterval(async () => {
            if ((await meet.canJoin())) {
                clearInterval(X);
                await meet.join(config.settings);
                navi.log(`Joined room ${config.settings.specificMeet}`, LOG_TYPES.INFO);
            }
        }, config.settings.checkInterval || 5000);
    }
    else startSchedule(navi);
})();

export interface Config {
    schedule: Record<string, Array<Class>>
    settings: ConfigSettings
}

export interface ConfigSettings {
    hereMessage?: string,
    headless: boolean,
    email: string,
    password: string,
    toggleMic?: boolean,
    toggleCam?: boolean,
    checkInterval?: number,
    logs?: boolean,
    specificMeet?: string
}

export interface Class {
    name: string,
    start: Array<number>,
    end: Array<number>
}