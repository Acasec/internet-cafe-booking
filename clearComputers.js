// clearComputers.js
require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const ComputerSchema = new mongoose.Schema({
  pcNumber: { type: String, required: true, unique: true },
  status: { type: String, enum: ["available", "occupied"], default: "available" },
});

const Computer = mongoose.models.Computer || mongoose.model("Computer", ComputerSchema);

async function clearComputers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");

    const result = await Computer.deleteMany({});
    console.log(`Deleted ${result.deletedCount} computers`);

    await mongoose.disconnect();
    console.log("Disconnected from DB");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

clearComputers();
