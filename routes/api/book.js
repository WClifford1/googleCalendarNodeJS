// Routes to post and view enquiries from the enquiry form
const {google} = require('googleapis');
const fs = require('fs');
const TOKEN_PATH = 'token.json';
const express = require('express')
const router = express.Router()
const bookAppointment = require('../../services/bookAppointment')
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
    try {
    const result = await bookAppointment(oAuth2Client, year, month, day, hour, minute)
    res.status(200).send(result)
    } catch(e) {
        res.status(400).send({
            "success": false,
            "message": e
        })
    }
})

module.exports = router