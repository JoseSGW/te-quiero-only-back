const server = require("express").Router();
const Sequelize = require("sequelize");
const op = Sequelize.Op;
const { Review, Order, Product } = require("../db.js");

const getReviews = (req, res, next) => {
  Review.findAll({
    where: {
      productId: req.params.id,
    },
    include: [
      {
        all: true,
      },
    ],
  })
    .then((reviews) => {
      res.send(reviews);
    })
    .catch(next);
};

const checkRevs = async (req, res) => {
  try {
    //convertir a número los datos del params
    const userId = Number(req.params.userId);
    const productId = Number(req.params.productId);
    const revList = await Review.findAll({
      where: {
        userId: userId,
        productId: productId,
      },
    });

    // Si encuentra, revDisp=0;
    if (revList.length > 0) {
      res.status(200).json(true); // disabled=true => deshabilita el botón
    } else {
      //buscar ordenes cerradas que incluyan ese producto
      const orders2see = await Order.findAll({
        where: { userId: userId, status: "Complete" },
        include: [{ model: Product, where: { id: productId } }],
      });
      // si encuentra, revDisp = 1
      if (orders2see.length > 0) {
        res.status(200).json(false); // disabled=false => habilita el botón
      }
    }
  } catch (err) {
    console.log(err);
  }
};
//esto puede ir en reviews.controllers, en una ruta de las Reviews.

const addReview = async (req, res, next) => {
  console.log(req.body);
  try {
    const { rating, description, userId } = req.body;
    const productId = req.params.id;
    const oldReview = await Review.findOne({
      where: {
        userId,
        productId,
      },
    });
    await Review.create({
      rating,
      description,
      userId,
      productId,
    });
    if (oldReview) {
      throw new Error();
    } else {
      res.status(200).json({ msg: "Review created succesfully" });
    }
  } catch (err) {
    const status = err.status || 400;
    res.status(status).json({
      msg: "Can not create review because you have already created it",
    });
  }
};

const deleteReview = async (req, res, next) => {
  const idReview = Number(req.params.id);
  if (!idReview) {
    res.status(404).json({ msg: "Debe ingresar id de review válido" });
  } else {
    const review = await Review.findOne({
      where: { id: idReview },
    });
    if (!review) {
      res.status(404).json({ msg: "La review no existe" });
    } else {
      await review.destroy();
      res.status(200).json({ msg: "Review eliminada correctamente" });
    }
  }
};

const updateReview = async (req, res) => {
  try {
    const name = req.params.name;
    const fieldsToModify = req.body; // es un objeto que llega del front solo con los parametros a modificar
    await Review.update(
      {
        rating: fieldsToModify.rating,
        description: fieldsToModify.description,
      },
      {
        where: {
          productId: fieldsToModify.prodId,
          userId: fieldsToModify.userId,
        },
      }
    );

    res.status(200).json({ msg: "Review modified" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: "ERROR: Review can't be modified" });
  }
};

module.exports = {
  getReviews,
  addReview,
  deleteReview,
  updateReview,
  checkRevs,
};
