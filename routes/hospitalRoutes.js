const express = require("express"); 
const router = express.Router();
const controller = require("../controllers/hospitalController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

router.post("/", auth, controller.createHospital);
router.get("/", auth, controller.getHospitals);
router.get("/:id", auth, controller.getHospitalById);
router.put("/:id", auth, controller.updateHospital);
router.delete("/:id", auth, controller.deleteHospital);

module.exports = router;