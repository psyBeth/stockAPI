'use strict'

const { mongoose } = require('../configs/dbConnection');

const FirmSchema = new mongoose.Schema({
    //_id

    name: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },

    phone: String,

    adress: String,

    image: String

} , {
    collection: 'firms',
    timestamps: true
});

module.exports = mongoose.model('Firm', FirmSchema);