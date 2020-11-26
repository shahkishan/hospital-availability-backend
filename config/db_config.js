const mongoose = require('mongoose');

const connect = () => {
    mongoose.connect("mongodb+srv://admin:covidwelfare2020@hospital-availability.d6cwy.mongodb.net/hospital-availability?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
}

module.exports = {connect};