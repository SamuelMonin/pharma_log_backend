const mongoose = require("mongoose");

const deliveryManSchema = new mongoose.Schema({
    name: String,
    lastname: String
})

const DeliveryManModel = mongoose.model("deliveryMen", deliveryManSchema);
module.exports = DeliveryManModel;