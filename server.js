const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

// serve frontend files
app.use(express.static(__dirname));

let parkingSlots = new Array(20).fill(false);

// ✅ GET ALL SLOTS
app.get("/status", (req, res) => {
  res.json(parkingSlots);
});

// ✅ BOOK SLOT
app.post("/book", (req, res) => {
  for (let i = 0; i < parkingSlots.length; i++) {
    if (!parkingSlots[i]) {
      parkingSlots[i] = true;

      return res.json({
        success: true,
        message: `Slot ${i + 1} booked successfully`
      });
    }
  }

  res.json({
    success: false,
    message: "Parking Full"
  });
});

// ✅ RELEASE SLOT
app.post("/release/:slot", (req, res) => {
  const slotIndex = parseInt(req.params.slot) - 1;

  if (parkingSlots[slotIndex]) {
    parkingSlots[slotIndex] = false;

    return res.json({
      success: true,
      message: `Slot ${slotIndex + 1} released`
    });
  }

  res.json({
    success: false,
    message: "Slot already free"
  });
});

// ✅ RESET ALL SLOTS
app.post("/reset", (req, res) => {
  parkingSlots.fill(false);

  res.json({
    success: true,
    message: "All slots reset"
  });
});

// ✅ HOME PAGE
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(3000, () => console.log("Server running"));
