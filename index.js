const express = require("express")
const app = express();
require('./src/api/index')(app)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});