const express = require("express");
const {
  createCar,
  getCars,
  updateCar,
  deleteCar,
} = require("../controllers/car.controller");
const router = express.Router();

// CREATE
router.post("/", createCar);

// READ
router.get("/", getCars);

// UPDATE
router.put("/:id", updateCar);

// // DELETE
router.delete("/:id", deleteCar);

module.exports = router;
