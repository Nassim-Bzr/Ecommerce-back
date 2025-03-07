const express = require('express');
const router = express.Router();
const SousCategorieController = require('../controllers/sousCategorieController');

router.get('/', SousCategorieController.getAllSousCategories);
router.get('/:id', SousCategorieController.getSousCategorieById);
router.post('/', SousCategorieController.createSousCategorie);
router.put('/:id', SousCategorieController.updateSousCategorie);
router.delete('/:id', SousCategorieController.deleteSousCategorie);

module.exports = router;
