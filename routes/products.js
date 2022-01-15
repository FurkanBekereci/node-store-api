const express = require('express');
const { getProducts, insertProduct, getProductById, updateProduct, deleteProduct, editProduct, getProductStatic } = require('../controllers/products');
const router = express.Router();


router.route('/').get(getProducts).post(insertProduct)
router.route('/static').get(getProductStatic);
router.route('/:id').get(getProductById).patch(updateProduct).delete(deleteProduct).put(editProduct);

module.exports = router;