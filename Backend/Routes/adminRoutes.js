const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

// GET pending appointments
router.get("/appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find({ status: "PENDING" });
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
});

// APPROVE / REJECT
router.patch("/appointments/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update appointment" });
  }
});


module.exports = router;
