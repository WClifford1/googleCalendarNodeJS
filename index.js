const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const express = require("express")
const app = express();
const getTimeslotsForDay = require('./utils/getTimeslots')
const bookAppointment = require('./utils/bookAppointment')
const validateBookAppointment = require("./utils/validateBookAppointment")

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


// Get the timeslots for the day
// timeslots?year=yyyy&month=mm&day=dd
app.get('/timeslots', (req, res) => {
    const { year, month, day } = req.query
    getTimeslotsForDay(oAuth2Client, year, month, day)
    .then(function(timeslots) {
        res.status(200).send(timeslots)
    })
})


// Get the availble days for the month
// /days?year=yyyy&month=mm
app.get('/days', async (req, res) => {
    const { year, month } = req.query
    // date will be the highest date of the month, i.e. Janurary will be 31
    let date = new Date(year, month, 0).getDate();
    let message = {
        "success": true,
        "days": []
    }

    // For each day of the month get the avaible timeslots for the day
    // If the day does not have any avaible timeslots set hasTimeSlots to false
    for(let i = 0; i < date; i++){
        await getTimeslotsForDay(oAuth2Client, year, month, i + 1)
        .then(function(timeslots) {
            if (timeslots.timeslots.length < 1 ){
                message.days.push({"day": i + 1, "hasTimeSlots": false})
            } else {
                message.days.push({"day": i + 1, "hasTimeSlots": true})
            }
        })
    }
    res.status(200).send(message)
})


// Book and appointment
// /book?year=yyyy&month=MM&day=dd&hour=hh&minute=mm
app.post('/book', async (req, res) => {
    const { year, month, day, hour, minute } = req.query

    // Validate the params
    if (await validateBookAppointment(year, month, day, hour, minute)) {
        res.status(400).send(validateBookAppointment(year, month, day, hour, minute))
        return
    }
    
    // Check if the timeslot is free
    const date = new Date(Date.UTC(year, month - 1, day, hour, minute))
    let bookingAlreadyExists = true
    await getTimeslotsForDay(oAuth2Client, year, month, day)
    .then(function(timeslots) {
        for(let i = 0; i < timeslots.timeslots.length; i++){
            if (timeslots.timeslots[i].startTime === date.toISOString()){
            bookingAlreadyExists = false
            }
        }
    })
    // Sends an error if the appointment time has already been booked
    if (bookingAlreadyExists === true){
        res.status(400).send(
            {
                "success": false,
                "message": "Invalid time slot"
            }
        )
        return
    } else {
        bookAppointment(oAuth2Client, year, month, day, hour, minute)
        .then(function(message) {
            res.status(200).send(message)
        })
    }
})


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});