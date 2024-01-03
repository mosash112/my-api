const Order = require('../models/order')
const Product = require('../models/product')
const mongoose = require('mongoose')

const errorLog = (err, res) => {
    console.log(err);
    res.status(500).json({
        error: err
    })
}

exports.orders_get_all = (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product', 'name')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            description: 'Get order',
                            url: 'http://localhost:9000/orders/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response)
        })
        .catch(err => errorLog(err, res))
}

exports.orders_create_order = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            console.log(product);
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                })
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity
            })
            return order.save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created order successfully',
                createdOrder: {
                    _id: result._id,
                    quantity: result.quantity,
                    product: result.product,
                    request: {
                        type: 'GET',
                        description: 'Get order',
                        url: 'http://localhost:9000/orders/' + result._id
                    }
                }
            })
        })
        .catch(err => errorLog(err, res))
}

exports.orders_get_order = (req, res, next) => {
    const id = req.params.orderId
    Order.findById(id)
        .select('product quantity _id')
        .populate('product', 'name price')
        .exec()
        .then(doc => {
            // console.log(doc)
            if (doc) {
                res.status(200).json({
                    order: doc,
                    request: {
                        description: 'Get all orders',
                        type: 'GET',
                        url: 'http://localhost:9000/orders/'
                    }
                })
            } else {
                res.status(404).json({
                    message: "No valid entry found for provided ID"
                })

            }
        })
        .catch(err => errorLog(err, res))
}

exports.orders_delete_order = (req, res, next) => {
    const id = req.params.orderId
    Order.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted',
                request: {
                    type: 'POST',
                    description: 'Create new order',
                    body: { ProductId: 'ID', quantity: 'Number' },
                    url: 'http://localhost:9000/orders/'
                }
            })
        })
        .catch(err => errorLog(err, res))
}