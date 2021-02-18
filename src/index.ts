
import { LOG_TYPES, Navigator } from "./Navigator";
import {startSchedule} from "./Scheduler";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require("../config.json") as Config;

(async () => {
    const navi = new Navigator(config);
    navi.log("Attempting to login with provided credentials", LOG_TYPES.INFO);
    await navi.launch();
    startSchedule(navi);
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
    logs?: boolean
}

export interface Class {
    name: string,
    start: Array<number>,
    end: Array<number>
}