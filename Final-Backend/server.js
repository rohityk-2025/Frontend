require("dotenv").config();

const app = require("./app"); // IMPORT app.js (THIS IS THE FIX)

const PORT = 8080;

// process.env.PORT ||
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
