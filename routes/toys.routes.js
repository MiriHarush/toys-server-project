const express = require("express");
const { createToys, getAllToys, getSearch, getByCategory, deleteToy, updateToy, getById } = require("../controllers/toys.controllers");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.get('/all', getAllToys);
router.get('/search', getSearch);
router.get('/category/:catname', getByCategory);
router.get('/single/:id', getById);
router.post('/', auth(), createToys);
router.patch('/:editId', auth(), updateToy);
router.delete('/delete/:delId', auth(), deleteToy)
module.exports = router;