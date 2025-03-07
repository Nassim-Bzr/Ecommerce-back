const express = require('express');
const router = express.Router();
const CategorieController = require('../controllers/categorieController');

router.get('/', CategorieController.getAllCategories);
router.get('/:id', CategorieController.getCategorieById);
router.post('/', CategorieController.createCategorie);
router.put('/:id', CategorieController.updateCategorie);
router.delete('/:id', CategorieController.deleteCategorie);

module.exports = router;
