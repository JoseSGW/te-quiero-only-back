const { Router } = require("express");
const router = Router();
const {
  getCart,
  getSold,

 
} = require("../controllers/statistics.controller");

router.get("/totalCart", getCart);
router.get("/totalSold", getSold);

module.exports = router;
