const express = require('express')
const router = express.Router()
const UsersController = require('../controllers/users')
const checkAuth = require('../middleware/check-auth')

router.get('/', UsersController.users_get_all)

router.post('/signup', UsersController.users_signup)

router.post('/login', UsersController.users_login)

router.delete('/:userId', checkAuth, UsersController.users_delete_user)

module.exports = router