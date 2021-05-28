const server = require("express").Router();
const Sequelize = require("sequelize");
const op = Sequelize.Op;
const {
  Product,
  Category,
  Ingredient,
  Store,
  Order,
  Image,
} = require("../db.js");

const allImages = async (req, res) => {
  const images = await Image.findAll();
  res.status(200).send(images);
};


const deleteImage = async (req, res) => {
  try {
    const id = req.body.id; // id de la image pasada por body que desea eliminar

    const image = await Image.findOne({
      where: { id },
    });
    await image.destroy();

    res.status(200).json({ msg: "Image removed successfully" });
  } catch (err) {
    console.error("ERROR: id doesn't exist", err);
    res.status(400).json({ msg: "ERROR: id doesn't exist" });
  }
};

module.exports = {
  allImages,
  deleteImage,
};
