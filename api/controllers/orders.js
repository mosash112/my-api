const Order = require('../models/order')
const Product = require('../models/product')
const User = require('../models/user')
const mongoose = require('mongoose')

const errorLog = (err, res) => {
    console.log(err);
    res.status(500).json({
        error: err
    })
}

exports.orders_get_all = (req, res, next) => {
    Order.find()
        .select('products totalPrice _id userId done date')
        // .populate('product', 'name')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        userId: doc.userId,
                        products: doc.products,
                        totalPrice: doc.totalPrice,
                        done: doc.done,
                        date: doc.date,
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
    User.findById(req.body.userId)
        .then(user => {
            console.log(user);
            if (!user) {
                return res.status(404).json({
                    message: 'user not found'
                })
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                userId: req.body.userId,
                products: req.body.products,
                totalPrice: req.body.totalPrice,
                done: doc.done,
                date: doc.date
            })
            return order.save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created order successfully',
                createdOrder: {
                    _id: result._id,
                    userId: result.userId,
                    products: result.products,
                    totalPrice: result.totalPrice,
                    done: doc.done,
                    date: doc.date,
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

exports.orders_get_user_orders = (req, res, next) => {
    const id = req.params.userId
    Order.find({ userId: id })
        .select('products totalPrice _id userId done date')
        // .populate('product', 'name')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        userId: doc.userId,
                        products: doc.products,
                        totalPrice: doc.totalPrice,
                        done: doc.done,
                        date: doc.date,
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

exports.orders_get_order = (req, res, next) => {
    const id = req.params.orderId
    Order.findById(id)
        .select('products totalPrice _id userId done date')
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