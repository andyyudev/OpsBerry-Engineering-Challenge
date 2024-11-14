// Load env file
require("dotenv").config();

// Load node modules
// =============================================================
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Define routes
// =============================================================
app.use("/", require("./routes/")());

// Start server
// =============================================================
app.listen(port, () => {
  console.log(`OpsBerry API server listening on port ${port}`);
});
