# classroom-joiner

A node.js script which uses `puppeteer` to automatically join your google classroom classes.

## Warning

This code was all created in one day as a challenge. Expect to find some bugs and missing features! 

## Configuration example

The config should be placed in the root directory of the project, and should be named `config.json`.

```js

{
    "schedule": {
        "monday": [
            {
                "name": "Classroom name",
                "start": [7, 30], // [hours, minutes], so 7:30 am
                "end": [8, 10] // 8:10 am
            }
        ],
        "thursday": [
            {
                "name": "Classroom name",
                "start": [20, 8], // 20:08 or 08:08 pm
                "end": [20, 11] // 20:11 or 08:11 pm
            }
        ],
        // Other days of the week as well...
    },
    "settings": {
        "hereMessage": "I am here!", // Sends a message in the chat a few seconds after you join (NOT IMPLEMENTED)
        "headless": false, // If puppeteer should be headless
        "email": "your school email",
        "password": "school password",
        "toggleMic": false, // Toggle the mic setting before joining
        "toggleCam": false, // Toggle the cam setting after joining
        "checkInterval": 5000, // How frequently should the script check if the classroom has a valid google meet link that can be joined
        "logs": true, // If warnings, info and errors should be printed to the console
        "specificMeet": "..." // A link to a specific google meet room. If provided the script will ignore the "schedule" and instantly attempt to join this room.
    }
}
```