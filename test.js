const fs = require('fs');

fs.exists('./hi.json', (exists) => {
    console.log(exists ? 'it\'s there' : 'no passwd!');
});

