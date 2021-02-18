
import {Navigator} from "./Navigator";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require("../config.json") as Config;

const Navi = new Navigator(config);

(async () => {
    await Navi.launch();
    console.log(await Navi.getMeetLink("Свят и личност"));
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