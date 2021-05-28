const { Router } = require("express");
const router = Router();
const {
  addProduct,
  getProduct,
  productByCategory,
  searchByKeyword,
  searchById,
  modifyProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const isAdmin = require("../Middlewares/isAdmin")

router.get("/", getProduct);
router.post("/addProduct", addProduct);
router.get("/categories", productByCategory); //PARECE QUE SOBRA EL PRIMER PRODUCTS
router.get("/search", searchByKeyword); //busca lo que llega por query en name y description
router.get("/:Id", searchById); //busca producto por su id
router.put("/modifyProduct", modifyProduct); //Modifica producto.
router.delete("/deleteProduct/:id", deleteProduct);
module.exports = router;
