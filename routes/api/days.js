// Routes to post and view enquiries from the enquiry form
const {google} = require('googleapis');
const fs = require('fs');
const TOKEN_PATH = 'token.json';
const express = require('express')
const router = express.Router()
const getDays = require('../../services/getDays')
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

// Get the availble days for the month
// /days?year=yyyy&month=mm
router.get('/', async (req, res) => {
    const { year, month } = req.query
    const result = await getDays(oAuth2Client, year, month)
    res.status(200).send(result)
})

module.exports = router
