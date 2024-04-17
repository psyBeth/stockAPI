'use strict'

const { mongoose } = require('../configs/dbConnection');

const PurchaseSchema = new mongoose.Schema({
    //_id

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, 

    firmId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Firm',
        required: true       
    },

    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true       
    },

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true       
    },

    price: {
        type: Number,
        required: true
    },

    quantity: {
        type: Number,
        default: 1   // or required: true
    },

    amount: {
        type: Number,
        set: function() { return this.quantity * this.price},
        default: function() { return this.quantity * this.price},
        transform: function() { return this.quantity * this.price }
    }

} , {
    collection: 'purchases',
    timestamps: true
});

module.exports = mongoose.model('Purchase', PurchaseSchema);