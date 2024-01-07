const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const errorLog = (err, res) => {
    console.log(err);
    res.status(500).json({
        error: err
    })
}

exports.users_get_all = (req, res, next) => {
    User.find()
        .select('email password _id name type admin')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                users: docs.map(doc => {
                    return {
                        _id: doc._id,
                        email: doc.email,
                        name: doc.name,
                        type: doc.type,
                        admin: doc.admin,
                        password: doc.password,
                        request: {
                            type: 'GET',
                            description: 'Get user',
                            url: 'http://localhost:9000/users/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response)
        })
        .catch(err => errorLog(err, res))
}

exports.users_signup = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length > 0) {
                return res.status(409).json({
                    message: 'Email already exists'
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        errorLog(err, res)
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            name: req.body.name,
                            admin: req.body.admin,
                            type: req.body.type
                        })
                        user.save()
                            .then(result => {
                                // console.log(result);
                                res.status(201).json({
                                    message: 'User created',
                                    user: {
                                        _id: result._id,
                                        email: result.email,
                                        name: result.name,
                                        type: req.body.type
                                    }
                                })
                            })
                            .catch(err => errorLog(err, res))
                    }
                })
            }
        })
}

exports.users_login = (req, res, next) => {
    User.find({ email: req.body.email, type: req.body.type })
        .exec()
        .then(user => {
            console.log(req.body);
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    })
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    },
                        process.env.JWT_KEY,
                        { expiresIn: "1h" })

                    return res.status(200).json({
                        user: {
                            _id: user[0]._id,
                            name: user[0].name,
                            admin: user[0].admin,
                            type:user[0].type
                        },
                        message: 'Auth successful',
                        token: token
                    })
                }
                return res.status(401).json({
                    message: 'Auth failed'
                })
            })
        })
}

exports.users_delete_user = (req, res, next) => {
    const id = req.params.userId
    User.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted'
            })
        })
        .catch(err => errorLog(err, res))
}