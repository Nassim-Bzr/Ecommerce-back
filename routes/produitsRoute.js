const express = require('express');
const router = express.Router();
const ProduitController = require('../controllers/produitsController');
const upload = require('../middlewares/multerConfig');

router.get('/', ProduitController.getAllProduits);
router.get('/:id', ProduitController.getProduitById);
router.post('/', upload.single('image'), ProduitController.createProduit);
router.put('/:id', ProduitController.updateProduit);
router.delete('/:id', ProduitController.deleteProduit);

module.exports = router;
