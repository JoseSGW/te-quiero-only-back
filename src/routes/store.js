const { Router } = require("express");
const router = Router();
const { getStores, addStore, deleteStore } = require("../controllers/store.controller");


router.get("/getStores", getStores);
router.post("/addStore", addStore);
router.delete("/deleteStore/:id", deleteStore)

module.exports = router;