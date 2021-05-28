const { Router } = require("express");
const router = Router();
const {
  loginGoogle,
  authentication,
  deleteLogin,
  me,
} = require("../controllers/googlelogin.controller");

router.post("/login", loginGoogle);
router.post("/authentication", authentication);
router.delete("/deleteLogin", deleteLogin);
router.get("/me", me);

module.exports = router;
