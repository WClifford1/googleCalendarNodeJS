// Routes to post and view enquiries from the enquiry form
const {google} = require('googleapis');
const fs = require('fs');
const TOKEN_PATH = 'token.json';
const express = require('express')
const router = express.Router()
const getTimeslots = require('../../services/getTimeslots')
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

// Get the timeslots for the day
// timeslots?year=yyyy&month=mm&day=dd
router.get('/', async (req, res) => {
    const { year, month, day } = req.query
    const result = await getTimeslots(oAuth2Client, year, month, day)
    res.status(200).send(result)
})

module.exports = router
