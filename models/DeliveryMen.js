const mongoose = require("mongoose");

const deliveryManSchema = new mongoose.Schema({
    login: String,
    password: String
})

const DeliveryManModel = mongoose.model("deliveryMen", deliveryManSchema);
module.exports = DeliveryManModel;