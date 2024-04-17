'use strict'

const Sale = require('../models/sale');
const Product = require('../models/product');

module.exports = {

    list: async (req, res) => {
        /*
            #swagger.tags = ["Sales"]
            #swagger.summary = "List Sales"
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

        const data = await res.getModelList(Sale, {}, [
            { path: 'userId', select: 'username email' },
            'brandId',
            { path: 'productId', select: 'name', populate: { path: 'categoryId' } }
        ]);

        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Sale),
            data
        });
    },

    create: async (req, res) => {
        /*
            #swagger.tags = ["Sales"]
            #swagger.summary = "Create Sale"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "name": "Sale 1"
                }
            }
        */
        req.body.userId = req.user._id;

        //updates product info:
        const currentProduct = await Product.findOne({ _id: req.body.productId });

        if (currentProduct.quantity >= req.body.quantity) {
            // create
            const data = await Sale.create(req.body);

            // decrease the product quantity after purchase
            const updateProduct = await Product.updateOne({ _id: data.productId }, { $inc: { quantity: -data.quantity } });

            res.status(201).send({
                error: false,
                data
            });
        } else {
            res.errorStatusCode = 422
            throw new Error('There is not enough product-quantity for this sale.', { cause: { currentProduct } });
        };
    },

    read: async (req, res) => {
        /*
            #swagger.tags = ["Sales"]
            #swagger.summary = "Get Single Sale"
        */

        if (req.params?.id) {

            //* READ SINGLE:
            const data = await Sale.findOne({ _id: req.params.id }).populate([
                { path: 'userId', select: 'username email' },
                'brandId',
                { path: 'productId', select: 'name', populate: { path: 'categoryId' } }
            ]);

            res.status(200).send({
                error: false,
                data
            });

        } else {
            //* READ ALL:
            const data = await res.getModelList(Sale, {}, [
                { path: 'userId', select: 'username email' },
                'brandId',
                { path: 'productId', select: 'name', populate: { path: 'categoryId' } }
            ]);

            res.status(200).send({
                error: false,
                details: await res.getModelListDetails(Sale),
                data
            });
        };
    },

    update: async (req, res) => {
        /*
            #swagger.tags = ["Sales"]
            #swagger.summary = "Update Sale"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "name": "Sale 1"
                }
            }
        */
        if (req.body?.quantity) {
            // previous 
            const currentSale = await Sale.findOne({ _id: req.params.id });
            // difference
            const different = req.body.quantity - currentSale.quantity;
            // save the difference
            const updateProduct = await Product.updateOne({ _id: currentSale.productId, quantity: { $gte: different } }, { $inc: { quantity: -different } });
            // console.log(updateProduct);

            // if update fails, stop the system
            if (updateProduct.modifiedCount == 0) {
                res.errorStatusCode = 422;
                throw new Error('There is not enough product-quantity for this sale.');
            };
        };

        const data = await Sale.updateOne({ _id: req.params.id }, req.body, { runValidators: true });

        res.status(202).send({
            error: false,
            data,
            new: await Sale.findOne({ _id: req.params.id })
        });
    },

    delete: async (req, res) => {
        /*
            #swagger.tags = ["Sales"]
            #swagger.summary = "Delete Sale"
        */
        // previous 
        const currentSale = await Sale.findOne({ _id: req.params.id });
        //delete
        const data = await Sale.deleteOne({ _id: req.params.id });

        const updateProduct = await Product.updateOne({ _id: currentSale.productId }, { $inc: { quantity: +currentSale.quantity } });

        res.status(data.deletedCount ? 204 : 404).send({
            error: !data.deletedCount,
            data
        });
    },
};