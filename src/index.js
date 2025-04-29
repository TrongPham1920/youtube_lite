const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/database");
const configureExpress = require("./config/express");
const routes = require("./routes");
const helmet = require("helmet");

dotenv.config();

connectDB();

const app = configureExpress();
app.use(helmet());

app.use("/", routes);

// Tạo các thư mục tạm nếu chưa có
const fs = require("fs");
const dirs = ["uploads", "temp/merged"];
dirs.forEach((dir) => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
