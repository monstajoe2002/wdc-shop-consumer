const mongoose = require('mongoose');

async function connectToMongo() {
    await mongoose.connect(`${process.env.MONGO_URI}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}
module.exports = connectToMongo;