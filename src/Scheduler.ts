
import { Class } from ".";
import { MeetRoom } from "./MeetRoom";
import {LOG_TYPES, Navigator} from "./Navigator";

let currentMeeting: MeetRoom|undefined;
let currentClass: Class|undefined;
let currentDayNum: number|undefined;

const daysWithNoSchedule: Set<number> = new Set();

export function startSchedule(nav: Navigator) : void {
    setInterval(async () => {
        const currentTime = new Date();
        if (currentTime.getDay() !== currentDayNum) {
            currentDayNum = currentTime.getDay();
            nav.log(`Getting schedule for ${NUMBER_TO_DAYS[currentDayNum]}`, LOG_TYPES.INFO);
        }
        const schedule = nav.config.schedule[NUMBER_TO_DAYS[currentDayNum] as string];
        if (daysWithNoSchedule.has(currentTime.getDay())) return;
        if (!schedule) {
            daysWithNoSchedule.add(currentTime.getDay());
            return nav.log(`No schedule provided for ${NUMBER_TO_DAYS[currentTime.getDay()]}`, LOG_TYPES.EXCEPTION);
        }
        // The current class is over
        if (currentMeeting && currentClass && currentClass.end[0] === currentTime.getHours() && currentClass.end[1] === currentTime.getMinutes()) {
            await currentMeeting.leave();
            nav.log(`Class ${currentClass.name} (${currentClass.start[0]}:${currentClass.start[1]} - ${currentClass.end[0]}:${currentClass.end[1]}) is over`, LOG_TYPES.INFO);
            currentMeeting = undefined;
            currentClass = undefined;
            return;
        }
        // If there isn't a current class 
        else if (!currentClass) {
            const startClass = schedule.find(c => c.start[0] === currentTime.getHours() && c.start[1] === currentTime.getMinutes());
            if (!startClass) return;
            nav.log(`Class ${startClass.name} (${startClass.start[0]}:${startClass.start[1]} - ${startClass.end[0]}:${startClass.end[1]}) started`, LOG_TYPES.INFO);
            currentClass = startClass;
            const classMeetId = await nav.getMeetLink(currentClass.name);
            if (!classMeetId) return nav.log(`Couldn't get meet link for class ${currentClass.name}`);
            currentMeeting = await nav.enterMeet(classMeetId);

        }
        // If the person is supposed to be in a class, but they haven't connected, try connecting
        if (currentClass && currentMeeting && !currentMeeting.joined) {
            nav.log(`Attempting to join meet for class ${currentClass.name}`, LOG_TYPES.INFO);
            if ((await currentMeeting.canJoin())) {
                await currentMeeting.join({toggleCam: nav.config.settings.toggleCam, toggleMic: nav.config.settings.toggleMic});
                nav.log(`Successfully joined meet for class ${currentClass.name}`, LOG_TYPES.INFO);
            } else nav.log(`Couldn't join meet for class ${currentClass.name}, retrying in ${(nav.config.settings.checkInterval || 5000) / 1000} seconds.`, LOG_TYPES.EXCEPTION);
        }
    }, nav.config.settings.checkInterval || 5000);
}

export const NUMBER_TO_DAYS: Record<number, string> = {
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
    7: "sunday"
};