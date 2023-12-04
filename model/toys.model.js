const { types } = require("joi");
const mongoose = require("mongoose")

const toySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'the name is required']
    },
    info: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    img_url: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    created_date: {
        type: Date,
        required: true,
        default: new Date()
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }

})

const Toys = mongoose.model("Toys", toySchema);
module.exports.Toys = Toys;

