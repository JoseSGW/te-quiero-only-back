const { Router } = require("express");
const router = Router();
const { getOrders, addToOrder, deleteItem, getProductsByUserId, getUserCompleteOrdersRelatedProducts, clearCart, modifyOrder, checkoutOrder, getOrderById, getOrderByUserId } = require("../controllers/order.controller");


router.get("/", getOrders); // recibe un query opcional con el status y solo devulve con este status o retorna todo si no le pasan nada
router.get("/getUserOrders/:userId", getOrderByUserId)
router.get("/getUserCompleteOrdersRelatedProducts/:userId", getUserCompleteOrdersRelatedProducts)
router.post("/addToOrder", addToOrder);
router.post("/deleteItem", deleteItem);
router.get("/:userId", getProductsByUserId) // Retorna los productos del usuario con id pasado por params
router.put("/update/:orderId", modifyOrder) // actualiza la orden con un id por params y un body con las propiedades a cambiar
router.delete("/:userId", clearCart) //limpiar carrito
router.get("/order/:id", getOrderById) // retorna la orden por el id de la orden que le llega por params
router.post("/checkout", checkoutOrder)

module.exports = router;