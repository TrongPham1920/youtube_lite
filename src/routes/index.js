const express = require("express");
const { register, login } = require("../controllers/user.controller");
const router = express.Router();

// Route chính
router.get("/", (req, res) => {

  res.json({ message: "Welcome to Booking API" });
});
router.post("/api/v1/register", register);
router.post("/api/v1/login", login);
// Thêm các routes khác ở đây
// router.use('/api/bookings', require('./booking.routes'));
// router.use('/api/users', require('./user.routes'));

module.exports = router;
