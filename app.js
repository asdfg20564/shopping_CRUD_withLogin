const express = require("express");
const app = express();
const port = 3000;
const cookieParser = require("cookie-parser");
const productRouter = require("./routes/products.router");
const authRouter = require("./routes/auth.router");

app.use(express.json());
app.use(cookieParser());

//header authorization
app.use((req, res, next) => {
  if (req.cookies.token) {
    req.headers.authorization = `Bearer ${req.cookies.token}`;
  }
  next();
});

app.use("/api", [productRouter]);
app.use("/auth", [authRouter]);

app.get("/", (req, res) => {
  res.send("Hello World! This is my shopping mall.");
});

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
