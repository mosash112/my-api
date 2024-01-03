const express = require('express')
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')
const ProductsController = require('../controllers/products')

const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = '/uploads/';
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toDateString() + file.originalname);
    },
})

const fileFilter = (req, file, cb) => {
    // if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true)
    // } else {
    //     cb(null, false);
    // }
}

const upload = multer({
    storage: storage,
    limits: {
        // fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

router.get('/', ProductsController.products_get_all)

router.post('/', checkAuth, upload.single('image'), ProductsController.products_create_product)

router.get('/categories', ProductsController.products_get_categories)

router.post('/categories', checkAuth, ProductsController.products_create_category)

router.get('/categories/:categoryId', ProductsController.products_get_category)

router.patch('/categories/:categoryId', checkAuth, ProductsController.products_update_category)

router.delete('/categories/:categoryId', checkAuth, ProductsController.products_delete_category)

router.get('/:productId', ProductsController.products_get_product)

router.patch('/:productId', checkAuth, ProductsController.products_update_product)

router.delete('/:productId', checkAuth, ProductsController.products_delete_product)

module.exports = router