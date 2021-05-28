const { Router } = require("express");
const productRouter = require("./product.js");
const categoryRouter = require("./category.js");
const ingredientRouter = require("./ingredient.js");
const storeRouter = require("./store.js");
const imageRouter = require("./image.js");
const authRouter = require("./auth.js");
const userRouter = require("./user.js");
const reviewRouter = require("./reviews.js");
const orderRouter = require("./order.js");
const mercadopago = require("./mercadopago.js");
const wishRoutes = require("./wish.js");
const googleLoginRouter = require("./googlelogin.js");

const statisticsRouter = require("./statistics.js");

const router = Router();

router.use("/products", productRouter);
router.use("/categories", categoryRouter);
router.use("/ingredients", ingredientRouter);
router.use("/stores", storeRouter);
router.use("/images", imageRouter);
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/reviews", reviewRouter);
router.use("/orders", orderRouter);

router.use("/mercadopago", mercadopago);
router.use("/wishlist", wishRoutes);
router.use("/statistics", statisticsRouter);
router.use("/google", googleLoginRouter);

module.exports = router;
