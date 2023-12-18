const mongoose = require('mongoose');
require('dotenv/config');

const connectionDB = () => {
    try {
        mongoose.connect(process.env.DB_CONNECTION, console.log(`Mongo DB Connected`));
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = connectionDB;