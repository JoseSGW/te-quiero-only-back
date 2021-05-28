const { Router } = require('express');
const router = Router();
const { addCategory, modifyCategory, deletedCategory, filtCategories, allCategories } = require('../controllers/category.controller')
const isAdmin = require("../Middlewares/isAdmin")

router.post('/addCategory', addCategory);
router.put('/modifyCategory', modifyCategory);
router.delete('/deletedCategory/:name', deletedCategory);
router.get('/filtCategories', filtCategories);
router.get('/allCategories', allCategories);

module.exports = router;
