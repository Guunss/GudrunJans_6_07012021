const express = require("express");
const saucesCtrl = require("../controllers/sauces");
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, saucesCtrl.listerSauces);
router.get("/:id", auth, saucesCtrl.sauceUnique);
router.post("/", auth, multer, saucesCtrl.creerSauce);
router.post("/:id/like", auth, saucesCtrl.likerSauce);
router.put("/:id", auth, multer, saucesCtrl.modifierSauce);
router.delete("/:id", auth, saucesCtrl.supprimerSauce);

module.exports = router;
