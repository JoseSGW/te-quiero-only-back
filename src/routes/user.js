const { Router } = require("express");
const router = Router();
const {
    addUser,
    allUser,
    findUsername,
    passwordReset,
    forgot,
    deleteUser,
    modifyUser,
    userPromote,
    adminToUser,
    signup,
    verify,
    twoFactorAuth,
} = require("../controllers/user.controller");
const isAdmin = require("../Middlewares/isAdmin")

router.post("/addUser", addUser);
router.get("/allUser", allUser);
router.get("/find", findUsername);
router.put("/passwordReset/:token", passwordReset);
router.post("/forgot", forgot);
router.delete("/deleteUser", deleteUser);
router.put("/modifyUser", modifyUser);
router.put("/userPromote", userPromote);
router.put("/adminToUser", adminToUser);
router.post("/signup", signup);
router.post("/verify", verify);
router.get("/twoFactorAuth", twoFactorAuth);

module.exports = router;
