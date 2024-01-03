const Product = require('../models/product')
const Category = require('../models/category')
const mongoose = require('mongoose')

const errorLog = (err, res) => {
    console.log(err);
    res.status(500).json({
        error: err
    })
}

exports.products_get_all = (req, res, next) => {
    Product.find()
        .select('title price description _id category image rate count')
        .populate('category', 'name')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        _id: doc._id,
                        title: doc.title,
                        price: doc.price,
                        description: doc.description,
                        category: doc.category,
                        stock: doc.stock,
                        image: doc.image,
                        rate: doc.rate,
                        count: doc.count,
                        request: {
                            type: 'GET',
                            description: 'Get product',
                            url: 'http://localhost:9000/products/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response)
        })
        .catch(err => errorLog(err, res))
}

exports.products_create_product = (req, res, next) => {
    console.log(req.file)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        category: req.body.selectedCategory,
        stock:req.body.stock,
        // image: req.file.path,
        rate: req.body.rate,
        count: req.body.count
    })

    product.save().then(result => {
        // console.log(result);
        res.status(201).json({
            message: 'Created product successfully',
            createdProduct: {
                _id: result._id,
                title: result.title,
                price: result.price,
                description: result.description,
                category: result.categoryId,
                stock:result.stock,
                // image: result.image,
                rate: result.rate,
                count: result.count,
                request: {
                    type: 'GET',
                    description: 'Get product',
                    url: 'http://localhost:9000/products/' + result._id
                }
            }
        })
    }).catch(err => errorLog(err, res))
}

exports.products_get_product = (req, res, next) => {
    const id = req.params.productId
    Product.findById(id)
        .select('title price description _id category image rate count stock')
        .exec()
        .then(doc => {
            console.log("from database ", doc)
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        description: 'Get all products',
                        type: 'GET',
                        url: 'http://localhost:9000/products/'
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

exports.products_update_product = (req, res, next) => {
    const id = req.params.productId
    const updateOps = {}
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Product.findOneAndUpdate({ _id: id }, { $set: updateOps }, { new: true })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Prodcut updated',
                request: {
                    type: 'GET',
                    description: 'Get product',
                    url: 'http://localhost:9000/products/' + result._id
                }
            })
        })
        .catch(err => errorLog(err, res))
}

exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId
    Product.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Prodcut deleted',
                request: {
                    type: 'POST',
                    description: 'Create new product',
                    body: { name: 'String', price: 'Number' },
                    url: 'http://localhost:9000/products/'
                }
            })
        })
        .catch(err => errorLog(err, res))
}

exports.products_get_categories = (req, res, next) => {
    Category.find()
    .exec()
    .then(docs => {
        res.status(200).json(docs)
    })
    .catch(err => errorLog(err, res))
}

exports.products_create_category = (req, res, next) => {
    const category = new Category({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    })

    category.save().then(result => {
        res.status(201).json({
            message: 'Created category successfully',
            createdCategory: {
                _id: result._id,
                name: result.name,
                request: {
                    type: 'GET',
                    description: 'Get category',
                    url: 'http://localhost:9000/products/categories/' + result._id
                }
            }
        })
    }).catch(err => errorLog(err, res))
}

exports.products_get_category = (req, res, next) => {
    const id = req.params.categoryId
    Category.findById(id)
        .select('name _id')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    _id: doc._id,
                    name: doc.name,
                    request: {
                        description: 'Get all categories',
                        type: 'GET',
                        url: 'http://localhost:9000/products/categories'
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

exports.products_update_category = (req, res, next) => {
    const id = req.params.categoryId
    const updateOps = {}
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Category.findOneAndUpdate({ _id: id }, { $set: updateOps }, { new: true })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Category updated',
                request: {
                    type: 'GET',
                    description: 'Get category',
                    url: 'http://localhost:9000/products/categories' + result._id
                }
            })
        })
        .catch(err => errorLog(err, res))
}

exports.products_delete_category = (req, res, next) => {
    const id = req.params.categoryId
    Category.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Category deleted',
                request: {
                    type: 'POST',
                    description: 'Create new category',
                    body: { name: 'String'},
                    url: 'http://localhost:9000/products/categories'
                }
            })
        })
        .catch(err => errorLog(err, res))
}