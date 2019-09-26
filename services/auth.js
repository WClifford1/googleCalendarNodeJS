const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const credentials = require('../credentials.json')
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = './token.json';

module.exports = async function returnAccessToken(){
    // Load client secrets from a local file.
    // Authorize a client with credentials
    const {client_secret, client_id, redirect_uris} = credentials.installed
    let oAuth2Client = await new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
        );

    const token = await checkTokenExists(oAuth2Client);
    return token
}

function checkTokenExists(oAuth2Client){
    // Check if we have previously stored a token.
        if (fs.existsSync('./token.json')) {
        // Token exists
        const tokenn = require('../token.json')
        oAuth2Client.credentials = tokenn
        return oAuth2Client
        } else {
            getAccessToken(oAuth2Client);
        }
}

// Token does not currently exist
function getAccessToken(oAuth2Client) {
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
        return oAuth2Client;
        });
    });
}