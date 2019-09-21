const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const express = require("express")
const app = express();

// If modifying these scopes, delete token.json.
const SCOPES = [
    "https://www.googleapis.com/auth/calendar.events"
    ];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';
var oAuth2Client;
// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Calendar API.
    authorize(JSON.parse(content));
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client);
        oAuth2Client.setCredentials(JSON.parse(token));
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}


// Gets all future events
function getBookings(auth) {
    return new Promise(function(resolve, reject){
    const calendar = google.calendar({ version: "v3", auth });
    calendar.events.list(
    {
        calendarId: "primary",
        singleEvents: true,
        orderBy: "startTime",
        // timeMin: "2019-09-26T10:30:00.000Z",
        // timeMax: "2019-09-26T11:10:00.000Z",
        timeZone: "UTC"
    },
    (err, res) => {
        if (err) {
            console.log("ERROR:", err)
            reject(err)
        }
        const events = res.data.items;
        console.log("EVENTS", events);
        }
        );
    });
};


// Gets all future events
function getTimeslotsForDay(auth, year, month, day) {
    return new Promise(function(resolve, reject) {
    const calendar = google.calendar({ version: "v3", auth });
    calendar.events.list(
    {
        calendarId: "primary",
        singleEvents: true,
        orderBy: "startTime",
        timeMin: `${year}-${month}-${day}T00:00:00.000Z`,
        timeMax: `${year}-${month}-${day}T23:59:00.000Z`,
        timeZone: "UTC"
    },
    (err, res) => {
        if (err) {
            reject(err);
        } else {
            const events = res.data.items;
            if (events.length >= 11) {
                console.log("no timeslots")
            }
            resolve(events)
        }
    });
})
};








const appointments = [
    {start: "09:00", finsh: "09:40"},
    {start: "09:45", finsh: "10:25"},
    {start: "10:30", finish: "11:10"},
    {start: "11:15", finish: "11:55"},
    {start: "12:00", finish: "12:40"},
    {start: "12:45", finish: "13:25"},
    {start: "13:30", finish: "14:10"},
    {start: "14:15", finish: "14:55"},
    {start: "15:00", finish: "15:40"},
    {start: "15:45", finish: "16:25"},
    {start: "16:30", finish: "17:10"}
]

const newapps = []

appointments.map(x => {
    newapps.push({
                "startTime": `2019-09-04T${x.start}:00.000Z`,
                "endTime": `2019-09-04T${x.finish}:00.000Z`
    })
})

// console.log(newapps)









function bookEvent(auth, startDateTime, endDateTime) {
    const calendar = google.calendar({ version: "v3", auth });
    return new Promise(function(resolve, reject) {
        var event = {
            start: {
                dateTime: "2019-09-26T11:15:00.000Z"
            },
            end: {
                dateTime: "2019-09-26T11:55:00.000Z"
            }
        };
    calendar.events.insert(
        {
            auth: auth,
            calendarId: "primary",
            resource: event
        },
        function(err, event) {
            if (err) {
                reject("There was an error contacting the Calendar service: " + err);
            }
                resolve("Event created");
            }
        );
    });
}






// timeslots?year=yyyy&month=mm&day=dd
app.get('/timeslots', (req, res) => {
    getTimeslotsForDay(oAuth2Client, 2019, "09", 26)
    .then(function(events) {
        res.send(events)
    })
})





const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});






// /**
//  * Lists the next 10 events on the user's primary calendar.
//  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
//  */
// function listEvents(auth) {
//   const calendar = google.calendar({version: 'v3', auth});
//   calendar.events.list({
//     calendarId: 'primary',
//     timeMin: (new Date()).toISOString(),
//     maxResults: 10,
//     singleEvents: true,
//     orderBy: 'startTime',
//   }, (err, res) => {
//     if (err) return console.log('The API returned an error: ' + err);
//     const events = res.data.items;
//     if (events.length) {
//       console.log('Upcoming 10 events:');
//       events.map((event, i) => {
//         const start = event.start.dateTime || event.start.date;
//         console.log(`${start} - ${event.summary}`);
//       });
//     } else {
//       console.log('No upcoming events found.');
//     }
//   });
// }
