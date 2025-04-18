const express = require("express");
const router = express.Router();

// Route chính
router.get("/", (req, res) => {
  res.json({ message: "Welcome to Booking API" });
});

// Thêm các routes khác ở đây
// router.use('/api/bookings', require('./booking.routes'));
// router.use('/api/users', require('./user.routes'));

module.exports = router;
