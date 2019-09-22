const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const express = require("express")
const app = express();
const getTimeslotsForDay = require('./getTimeslots')
const bookAppointment = require('./bookAppointment')
// const getBookableDays = require('./getBookableDays')

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


// timeslots?year=yyyy&month=mm&day=dd
app.get('/timeslots', (req, res) => {
    const { year, month, day } = req.query
    getTimeslotsForDay(oAuth2Client, year, month, day)
    .then(function(timeslots) {
        res.send(timeslots)
    })
})



// /days?year=yyyy&month=mm
app.get('/days', async (req, res) => {
    const { year, month } = req.query
    let date = new Date(year, month, 0).getDate();
    let message = {
        "success": true,
        "days": []
      }
    for(let i = 0; i < date; i++){
        await getTimeslotsForDay(oAuth2Client, year, month, i + 1)
        .then(function(timeslots) {
            if (timeslots.length < 12 ){
                message.days.push({"day": i + 1, "hasTimeSlots": true})
            } else {
                message.days.push({"day": i + 1, "hasTimeSlots": true})
            }
        })
    }
    res.send(message)
})


// /book?year=yyyy&month=MM&day=dd&hour=hh&minute=mm
app.post('/book', (req, res) => {
    const { year, month, day, hour, minute } = req.query
    bookAppointment(oAuth2Client, year, month, day, hour, minute)
    .then(function(result) {
        res.send(result)
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
