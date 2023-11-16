const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

//login suceess -> token authorization
module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  //context : Bearer jswtoken
  const [authType, authToken] = (authorization || "").split(" ");

  if (!authToken || authType !== "Bearer") {
    return res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }

  try {
    const { userId } = jwt.verify(authToken, process.env.TOKEN_KEY);
    User.findByPk(userId, { attributes: ["userId", "nickname", "email"] }).then(
      (user) => {
        res.locals.user = user;
        next(); //middleware
      }
    );
  } catch (err) {
    //valify failed
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }
};
