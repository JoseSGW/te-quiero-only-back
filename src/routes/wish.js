const { Router } = require("express");
const router = Router();
const {
addWish,
allWishes,
deleteWish
} = require("../controllers/wish.controller");

router.post("/addWish", addWish);
router.get("/:user", allWishes);
router.delete("/deleteWish", deleteWish)



module.exports = router;
