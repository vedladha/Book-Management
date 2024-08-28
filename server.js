const express = require("express");
const connectDB = require("./dbconnections");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const routes = require("./routes/route");
const app = express();

connectDB();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", "./views/");
app.use(express.static("public"));
app.use(express.json());

app.use("/", routes);
app.use("/ping", (req, res) => {
  res.send({ status: 200, statusText: "success" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
