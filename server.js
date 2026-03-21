const express = require("express");
const app = express();

app.use(express.json());

let parkingSlots = new Array(20).fill(false);

// GET all slots
app.get("/status", (req, res) => {
  res.json(parkingSlots);
});

// BOOK NEXT SLOT (FAST)
app.post("/book", (req, res) => {
  for (let i = 0; i < parkingSlots.length; i++) {
    if (!parkingSlots[i]) {
      parkingSlots[i] = true;
      return res.json({ slot: i + 1 });
    }
  }
  res.json({ slot: -1 });
});

app.listen(3000, () => console.log("Server running"));
