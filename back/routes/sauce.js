const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceController = require('../controllers/sauce');



router.get('/sauces', auth, sauceController.allSauces);
router.get('/sauces/:id', auth, sauceController.oneSauce);
router.post('/sauces', auth, multer, sauceController.createOneSauce);
router.put('/sauces/:id', auth, multer, sauceController.modifySauce);
router.delete('/sauces/:id', auth, sauceController.deleteSauce);
router.post('/sauces/:id/like', auth, sauceController.likeOrDislike);

module.exports = router;