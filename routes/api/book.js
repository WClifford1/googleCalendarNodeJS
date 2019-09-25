// Routes to post and view enquiries from the enquiry form
const {google} = require('googleapis');
const fs = require('fs');
const TOKEN_PATH = 'token.json';
const express = require('express')
const router = express.Router()
const getTimeslots = require('../../services/getTimeslots')
const validateBookAppointment = require('../../utils/validateBookAppointment')
const bookAppointment = require('../../utils/bookAppointment')
const credentials = require('../../credentials.json')

function authorize(credentials) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);
    fs.readFile(TOKEN_PATH, (err, token) => {
        try {
            oAuth2Client.setCredentials(JSON.parse(token));
        }
        catch(e) {
            return;
        }
    });
}
authorize(credentials)


// Book and appointment
// /book?year=yyyy&month=MM&day=dd&hour=hh&minute=mm
router.post('/', async (req, res) => {
    const { year, month, day, hour, minute } = req.query
    // Validate the params
    if (await validateBookAppointment(year, month, day, hour, minute)) {
        res.status(400).send(validateBookAppointment(year, month, day, hour, minute))
        return
    }
    
    // Check if the timeslot is free
    const date = new Date(Date.UTC(year, month - 1, day, hour, minute))
    let bookingAlreadyExists = true
    await getTimeslots(oAuth2Client, year, month, day)
    .then(function(timeslots) {
        for(let i = 0; i < timeslots.timeslots.length; i++){
            if (timeslots.timeslots[i].startTime === date.toISOString()){
            bookingAlreadyExists = false
            }
        }
    })
    // Sends an error if the appointment time has already been booked
    // if (bookingAlreadyExists === true){
    //     res.status(400).send(
    //         {
    //             "success": false,
    //             "message": "Invalid time slot"
    //         }
    //     )
    //     return
    // } else {
        bookAppointment(oAuth2Client, year, month, day, hour, minute)
        .then(function(message) {
            res.status(200).send(message)
        })
    // }
})


module.exports = router
