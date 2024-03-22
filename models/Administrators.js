const mongoose = require("mongoose");

const administratorSchema = new mongoose.Schema({
    login: String,
    password: String,
    profil: String
})

const AdministratorModel = mongoose.model("administrators", administratorSchema);
module.exports = AdministratorModel;