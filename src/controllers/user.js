'use strict'

const User = require('../models/user');
const Token = require('../models/token');
const passwordEncrypt = require('../helpers/passwordEncrypt');

module.exports = {

    list: async (req, res) => {
        /*
            #swagger.tags = ["Users"]
            #swagger.summary = "List Users"
            #swagger.description = `
                You can use <u>filter[] & search[] & sort[] & page & limit</u> queries with endpoint.
                <ul> Examples:
                    <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=asc&sort[field2]=desc</b></li>
                    <li>URL/?<b>limit=10&page=1</b></li>
                </ul>
            `
        */
        // non admin users can only see their own records:
        const customFilters = req.user?.isAdmin ? {} : { _id: req.user._id };

        const data = await res.getModelList(User, customFilters);
        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(User),
            data
        });
    },

    create: async (req, res) => {
        /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Create User"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "username": "test",
                    "password": "1234",
                    "email": "test@site.com",
                    "firstName": "test",
                    "lastName": "test",
                }
            }
        */
        // admin/staff = false (in new records)
        req.body.isStaff = false;
        req.body.isAdmin = false;

        const data = await User.create(req.body);

        /* AUTO LOGIN */
        const tokenData = await Token.create({
            userId: data._id,
            token: passwordEncrypt(data._id + Date.now())
        });
        /* AUTO LOGIN */

        res.status(201).send({
            error: false,
            token: tokenData.token,
            data
        });

    },

    read: async (req, res) => {
        /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Get Single User"
        */
        //can only see their own record:
        const customFilters = req.user?.isAdmin ? { _id: req.params.id } : { _id: req.user._id };

        const data = await User.findOne(customFilters);
        res.status(200).send({
            error: false,
            data
        });
    },

    update: async (req, res) => {
        /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Update User"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "username": "test",
                    "password": "1234",
                    "email": "test@site.com",
                    "firstName": "test",
                    "lastName": "test",
                }
            }
        */
        //can only see their own record:
        const customFilters = req.user?.isAdmin ? { _id: req.params.id } : { _id: req.user._id };

        // admin/staff = false (in new records)
        req.body.isStaff = false;
        req.body.isAdmin = false;



    },

    delete: async (req, res) => {

    }

};