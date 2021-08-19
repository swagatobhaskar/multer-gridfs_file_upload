const mongoose = require('mongoose');
require('dotenv').config()

const uri = process.env.mongoURI;

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
};

const Conn = mongoose.connect(uri, options)
    .then(() => { console.log("Conn to MongoDB successful.")})
    .catch(err => { console.log(err) });

    // iAY9dq6kxulAx7CY   swagato

module.exports = Conn;