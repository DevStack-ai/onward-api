const fs = require('firebase-admin');

const serviceAccount = require('./key.json');

fs.initializeApp({
    credential: fs.credential.cert(serviceAccount)
});

module.exports = fs