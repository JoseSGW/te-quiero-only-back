const { Router } = require('express');
const router = Router();
const { addIngredient, modifyIngredient, deletedIngredient, filtIngredients, allIngredients } = require('../controllers/ingredient.controller')
const isAdmin = require("../Middlewares/isAdmin")

router.post('/addIngredient', addIngredient);
router.put('/modifyIngredient', modifyIngredient);
router.delete('/deletedIngredient/:name', deletedIngredient);
router.get('/filtIngredients', filtIngredients);
router.get('/allIngredients', allIngredients);

module.exports = router;