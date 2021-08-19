const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Conn } = require('./mongoConn');
const route = require('./routes');

Conn;   // mongoose  connection

app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send('Hello there.');
});

app.use('/photos', route);

app.listen(3000, () => {
    console.log("Server listening on port 3000..");
});
