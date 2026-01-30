const pool = require("./config/db");

async function testDB() {
  try {
    const [rows] = await pool.query("SELECT 1");
    console.log("✅ Database Connected Successfully:", rows);
    process.exit();
  } catch (err) {
    console.error("❌ Database Connection Failed:");
    console.error(err.message);
    process.exit(1);
  }
}

testDB();
