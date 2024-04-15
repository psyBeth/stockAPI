'use strict'

const { mongoose } = require('../configs/dbConnection');

/*   
    EXAMPLE 
{
    "username": "admin",
    "password": "aA*123456",
    "email": "admin@site.com",
    "firstName": "admin",
    "lastName": "admin",
    "isActive": true,
    "isStaff": true,
    "isAdmin": true
}
{
    "username": "staff",
    "password": "aA*123456",
    "email": "staff@site.com",
    "firstName": "staff",
    "lastName": "staff",
    "isActive": true,
    "isStaff": true,
    "isAdmin": false
}
{
    "username": "test",
    "password": "aA*123456",
    "email": "test@site.com",
    "firstName": "test",
    "lastName": "test",
    "isActive": true,
    "isStaff": false,
    "isAdmin": false
}
*/

const UserSchema = new mongoose.Schema({
    // _id

    username: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        index: true
    },

    password: {
        type: String,
        trim: true,
        require: true
    },

    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        index: true        
    },

    firstName: {
        type: String,
        trim: true,
        required: true
    },

    lastName: {
        type: String,
        trim: true,
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    },

    isStaff: {
        type: Boolean,
        default: false
    },

    isAdmin:{
        type: Boolean,
        default: false
    }

} , {
    collection: 'users',
    timestamps: true
});

/* ----------------------------------------------- */
// https://mongoosejs.com/docs/middleware.html#pre
// regex code: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

UserSchema.pre('save', function(next) {
    // console.log('pre(save) run.')
    // console.log(this)

    // get data from "this"
    const data = this;

    // email@domain.com
    const isEmailValidated = data.email ? /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email) : true;

    if (isEmailValidated) {

        console.log('Email OK');

        next();

    } else {

        next(new Error('Email is not validated.'));

    };

});

/* ----------------------------------------------- */

module.exports = mongoose.model('User', UserSchema);