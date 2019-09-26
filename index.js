const express = require("express")
const app = express();
const auth = require('./auth')
require('./src/api/index')(app)

// Get the token immediately if it does not already exist
auth()

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});