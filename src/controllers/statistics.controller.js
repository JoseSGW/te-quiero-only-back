const server = require("express").Router();
const Sequelize = require("sequelize");
const op = Sequelize.Op;
const { Order, order_detail, conn } = require("../db.js");

//Trae la cantidad de productos que se encuentran en algun carrito
const getCart = async (req, res) => {
  try {

    const orders = await conn.query(
      // `SELECT * FROM wishlist join products on wishlist.product_id= products.id WHERE wishlist.user_id=${userId} join image on image.product_id = product.id;`
      `SELECT * FROM order_details`
    );

    const ordersQ = await orders[0].reduce((acc, current) => acc + current.quantity, 0)




    //cada uno de estos del arreglo es una orden, debo traerme los datavalues de cada una


    res.status(200).json({ cantidad: ordersQ });
  } catch (err) {
    console.error("ERROR: No se pudo realizar la búsqueda", err);
    res.status(400).json({ msg: "No existen ordenes" })
  }
};


//trae  las ordenes completas
const getSold = async (req, res) => {

  try {
    const orders = await Order.findAll({
      where: {
        status: "Complete"

      },
      include: [{
        all: true,
      },],
    })
    res.send(orders);
  } catch (error) {
    console.error(error)
  }
};






module.exports = {
  getCart,
  getSold,

};
