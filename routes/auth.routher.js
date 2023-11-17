const express = require("express");
const router = express.Router();
const { User } = require("../models");
const { Op } = require("sequelize");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

router.post("/signup", async (req, res) => {
  if (Object.keys(req.body).length !== 4 || typeof req.body !== "object") {
    return res.status(400).json({
      success: false,
      errorMessage: "데이터 형식이 올바르지 않습니다.",
    });
  }
  const { email, nickname, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send({
      success: false,
      errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
    });
  }

  //validation password length
  if (password.length < 6) {
    return res.status(400).send({
      success: false,
      errorMessage: "패스워드는 6자리 이상이어야 합니다.",
    });
  }

  //email form
  if (!validator.isEmail(email)) {
    return res.status(400).send({
      success: false,
      errorMessage: "이메일 형식이 올바르지 않습니다.",
    });
  }
  // email or nickname이 동일한게 이미 있는지 확인하기 위해 가져온다.
  const existsUsers = await User.findAll({
    where: {
      [Op.or]: [{ email }, { nickname }],
    },
  });

  if (existsUsers.length) {
    return res.status(401).send({
      success: false,
      errorMessage: "이메일 또는 닉네임이 이미 사용중입니다.",
    });
  }

  const newUser = await User.create({ email, nickname, passwd: password });

  res.status(201).send({
    success: true,
    message: "회원가입을 축하드립니다. 로그인 : /auth/login",
    user: {
      userId: newUser.dataValues.userId,
      email: newUser.dataValues.email,
      nickname: newUser.dataValues.nickname,
    },
  });

  //window.location.href = "/";
});

router.post("/login", async (req, res) => {
  if (Object.keys(req.body).length !== 2 || typeof req.body !== "object") {
    return res.status(400).json({
      success: false,
      errorMessage: "데이터 형식이 올바르지 않습니다.",
    });
  }

  if (req.cookies.token) {
    return res.status(400).send({
      success: false,
      errorMessage: "이미 로그인된 상태입니다.",
    });
  }

  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email: email,
    },
  });

  try {
    const isPasswordValid = await bcrypt.compare(password, user.passwd);
    if (!user || !isPasswordValid) {
      return res.status(400).send({
        success: false,
        errorMessage: "이메일 또는 패스워드가 틀렸습니다.",
      });
    }
  } catch (error) {
    return res.status(400).send({
      success: false,
      errorMessage: "이메일 또는 패스워드가 틀렸습니다.",
    });
  }

  //login success
  token = jwt.sign({ userId: user.userId }, process.env.TOKEN_KEY);
  let expires = new Date();
  expires.setHours(expires.getHours() + 12);
  res.cookie("token", token, {
    expires: expires,
    path: "/",
  });

  res.status(200).send({ success: true, message: "로그인 성공!", token });
});

router.get("/", async (req, res) => {
  res.json("hello auth");
});

module.exports = router;
