const express = require("express");
const router = express.Router();
const { Product, User } = require("../models");
const { Sequelize } = require("sequelize");
const authMiddleware = require("../middlewares/auth-middleware.js");

//product detail
router.get("/product/:productId", async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findAll({
    where: { productId: productId },
    include: User,
    required: true, //inner join
  });

  if (product) {
    const [resData] = product.map((products) => ({
      productId: products.productId,
      title: products.title,
      content: products.content,
      author: products.User.nickname,
      status: products.status,
      createdAt: products.createdAt,
    }));
    res.json({ data: resData });
  } else {
    return res
      .status(404)
      .json({ success: false, errorMessage: "상품 조회에 실패하였습니다." });
  }
});

//product update
router.put("/product/:productId", authMiddleware, async (req, res) => {
  if (Object.keys(req.body).length !== 3 || typeof req.body !== "object") {
    return res.status(400).json({
      success: false,
      errorMessage: "데이터 형식이 올바르지 않습니다.",
    });
  }

  if (!(req.body.status === "FOR_SALE") && !(req.body.status === "SOLD_OUT")) {
    return res.status(400).json({
      success: false,
      errorMessage: "status는 FOR_SALE과 SOLD_OUT 중에서 선택해주세요.",
    });
  }

  try {
    const { productId } = req.params;
    const { title, content, status } = req.body;

    //find product
    const product = await Product.findOne({
      where: { productId: productId },
    });

    if (product) {
      //login author === post author
      if (product.author === res.locals.user.userId) {
        await Product.update(
          {
            title: title,
            content: content,
            status: status,
          },
          { where: { productId: productId } }
        );

        return res.json({
          success: true,
          message: "상품 정보를 수정하였습니다.",
        });
      } else {
        return res.status(401).json({
          success: false,
          errorMessage: "해당 권한이 존재하지 않습니다.",
        });
      }
    } else {
      //product id not found
      return res.status(404).json({
        success: false,
        errorMessage: "해당하는 상품 조회에 실패하였습니다.",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      errorMessage: "데이터 형식이 올바르지 않습니다.",
    });
  }
});

//product delete
router.delete("/product/:productId", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findOne({
      where: { productId: productId },
    });

    if (product) {
      //delete
      if (product.author === res.locals.user.userId) {
        await Product.destroy({
          where: { productId: productId },
        });
        return res.json({ success: true, message: "상품을 삭제하였습니다" });
      } else {
        return res.status(401).json({
          success: false,
          errorMessage: "해당 권한이 존재하지 않습니다.",
        });
      }
    } else {
      return res
        .status(404)
        .json({ success: false, errorMessage: "상품 조회에 실패하였습니다." });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      errorMessage: "데이터 형식이 올바르지 않습니다.",
    });
  }
});

//post
router.post("/products/", authMiddleware, async (req, res) => {
  if (Object.keys(req.body).length !== 2 || typeof req.body !== "object") {
    return res.status(400).json({
      success: false,
      errorMessage: "데이터 형식이 올바르지 않습니다.",
    });
  }

  try {
    const { title, content } = req.body;
    const author = res.locals.user.userId;
    const createdAt = new Date();
    const updatedAt = new Date();
    await Product.create({
      title,
      author,
      content,
      createdAt,
      updatedAt,
    });
    res.json({ success: true, message: "판매 상품을 등록하였습니다." });
  } catch (error) {
    return res.status(400).json({
      success: false,
      errorMessage: "데이터 형식이 올바르지 않습니다.",
    });
  }
});

router.get("/products", async (req, res) => {
  const products = await Product.findAll({
    include: User,
    required: true, //inner join
  });
  const resData = products.map((products) => ({
    productId: products.productId,
    title: products.title,
    content: products.content,
    author: products.User.nickname,
    status: products.status,
    createdAt: products.createdAt,
  }));

  //sort - query sort
  let sortOrder = "DESC";
  if (req.query.sort) {
    const [field, order] = req.query.sort.split(":");
    sortOrder = order.toUpperCase() === "ASC" ? "ASC" : "DESC";
  }

  sortedData = resData.sort((a, b) => {
    if (sortOrder === "ASC") {
      return a.createdAt > b.createdAt ? 1 : -1;
    } else {
      return a.createdAt < b.createdAt ? 1 : -1;
    }
  });
  res.json({ data: sortedData });
});

router.get("/mypage", authMiddleware, async (req, res) => {
  res.send({ user: res.locals.user });
});

router.get("/", async (req, res) => {
  res.json("hello api");
});

module.exports = router;
