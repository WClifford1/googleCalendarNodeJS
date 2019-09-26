const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const credentials = require('./credentials.json')
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';
// const token = require('./token.json')


module.exports = async function returnAccessToken(){
    // Load client secrets from a local file.
    // Authorize a client with credentials
    const {client_secret, client_id, redirect_uris} = credentials.installed
    let oAuth2Client = await new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
    );
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err){
            return getAccessToken(oAuth2Client);
        }
        console.log(oAuth2Client)
        oAuth2Client.setCredentials(JSON.parse(token));
    });
    oAuth2Client.credentials = token
    console.log(oAuth2Client)
    return oAuth2Client;
}


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