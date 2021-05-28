const { Router } = require("express");
const router = Router();
const {
  getReviews,
  addReview,
  deleteReview,
  updateReview,
  checkRevs,
} = require("../controllers/reviews.controller");

router.get("/getReview/:id", getReviews);
router.post("/addReview/:id", addReview);
router.delete("/deleteReview/:id", deleteReview);
router.put("/updateReview/", updateReview);
router.get("/checkRevs/:userId/:productId", checkRevs);

module.exports = router;
