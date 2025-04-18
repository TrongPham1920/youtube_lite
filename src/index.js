const dotenv = require("dotenv");
const connectDB = require("./config/database");
const configureExpress = require("./config/express");
const routes = require("./routes");
const helmet = require("helmet");

dotenv.config();

connectDB();

const app = configureExpress();
app.use(helmet());

app.use("/", routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
