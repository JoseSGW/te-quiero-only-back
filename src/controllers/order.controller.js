const server = require("express").Router();
const Sequelize = require("sequelize");
const moment = require("moment");
require("moment/locale/es");

const {
  Order,
  Product,
  Order_details,
  Image,
  User,
  Category,
} = require("../db.js");

const op = Sequelize.Op;

const getOrders = async (req, res, next) => {
  const status = req.query ? req.query.status : null;

  const userId = req.query ? req.query.userId : null;

  await Order.findAll({
    where: {
      status: status
        ? status
        : {
            [op.not]: null,
          },

      userId: userId
        ? userId
        : {
            [op.not]: null,
          },
    },
    include: [{ model: User }, { model: Product, include: [{ model: Image }] }],
  })
    .then((orders) => {
      res.send(orders);
    })
    .catch(next);
};

const getOrderById = async (req, res) => {
  try {
    const id = req.params.id;

    const order = await Order.findByPk(id, {
      include: [
        {
          all: true,
        },
      ],
    });

    res.status(200).send(order);
  } catch (error) {
    console.error(error);
  }
};

const getOrderByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    const orders = await Order.findAll({
      where: {
        userId,
      },
      include: [
        {
          all: true,
        },
      ],
    });

    res.status(200).send(orders);
  } catch (error) {}
};

function removeDuplicates(data, key) {
  return [...new Map(data.map((item) => [key(item), item])).values()];
}

const getUserCompleteOrdersRelatedProducts = (req, res) => {
  let user_id = req.params.userId;
  let categoriesArr = [];
  let wantedProducts = [];
  Order.findAll({
    where: {
      status: "Complete",
    },
    include: [
      {
        model: Product,
        include: [
          {
            model: Category,
          },
        ],
      },
    ],
  })
    .then((orders) => {
      orders.forEach((order) => {
        if (Number(order.dataValues.userId) === Number(user_id)) {
          order.products.forEach((product) => {
            product.categories.forEach((category) =>
              categoriesArr.push(category.name)
            );
          });
        }
      });
      categoriesArr = [...new Set(categoriesArr)]; // get rid of duplicate

      Product.findAll({
        include: [{ model: Category }, { model: Image }],
      }).then((products) => {
        products.forEach((product) => {
          let includeIt = false;

          categoriesArr.forEach((categoryName) => {
            if (
              product.categories.findIndex(
                (category) => category.name === categoryName
              ) !== -1
            ) {
              includeIt = true;
            }
          });
          if (includeIt) {
            wantedProducts.push(product);
          }
        });

        wantedProducts = removeDuplicates(wantedProducts, (item) => item.id);
        res.status(200).send(wantedProducts);
      });
    })
    .catch((err) =>
      console.log(
        `getUserCompleteOrdersRelatedProducts:: No hay ordenes, ${err}`
      )
    );
};

const addToOrder = async (req, res) => {
  moment.locale("es");
  var currentMonth = moment().format("MMMM");
  var monthDate = "";
  if (!req.body.monthDate) {
    monthDate = currentMonth;
  } else {
    monthDate = req.body.monthDate;
  }
  // Por body va a llegar el user y sus productos
  // {userId : 3, products : [{id : 1, price : 22, quantity: 2}, {id : 3, price : 12, cantidad: 4}]  }
  // deben ser las cantidades TOTALES, calculadas en FRONT.
  // busca una orden en estado OPEN. Si no existe, la crea
  try {
    const { products, userId } = req.body;
    const [openOrder] = await Order.findOrCreate({
      where: {
        status: "Open",
        userId,
        monthDate,
      },
    });

    //Agrega el producto a la orden
    if (products.length > 0) {
      const outOfStock = [];
      for await (const { id, quantity } of products) {
        const element = await Product.findByPk(id, {
          //busco que el producto exista
          raw: true,
          nest: true,
        });
        if (element.stock >= quantity) {
          //me aseguro que hay stock suficiente del producto encontrado
          await openOrder.addProduct(id, { through: { quantity } });
        } else {
          outOfStock.push(element.name);
        }
      }

      if (outOfStock.length > 0) {
        res
          .status(200)
          .json({
            msg: `Attention!!. Products: ${[
              ...outOfStock,
            ]} do not have enough stock. Reduce the amount or eliminate them`,
          });
      } else {
        res
          .status(200)
          .json({ msg: "Products added to your order", orderId: openOrder.id });
      }
    } else {
      res.status(200).json({ msg: "You did not save any item in the cart" });
    }
  } catch (err) {
    console.error(err);
  }
};

const deleteItem = async (req, res) => {
  try {
    // si orderId viene por body
    if (req.body.orderId) {
      var { orderId } = req.body;
    } else {
      // si no viene por body, buscamos la order Open del usuario y guardamos el id.
      const order = await Order.findOne({
        where: {
          userId: req.body.userId,
          status: "Open",
        },
      });
      var orderId = order.id;
    }
    // borramos la linea de la tabla que contiene esa orden y ese producto.
    await Order_details.destroy({
      where: { order_id: orderId, product_id: req.body.productId },
    });
    res.status(200).json({ msg: "Product deleted", orderId });
  } catch (err) {
    console.log(err);
  }
};

const checkoutOrder = async (req, res) => {
  try {
    if (!req.body.userId) {
      //si no hay userId, se pide email y address
      if (!(req.body.email && req.body.address)) {
        res.status(400).json({ msg: "You must send e-mail and address" });
      } else {
        // crear orden en status InProcess con datos de Guest y el email en observaciones.
        const orderGuest = await Order.findOrCreate({
          userId: 0,
          status: "Open",
          observations: req.body.email,
        });
        // copy addToOrder()

        const { products } = req.body;
        //Agrega el producto a la orden
        if (products.length > 0) {
          const outOfStock = [];
          for await (const { id, quantity } of products) {
            const element = await Product.findByPk(id, {
              //busco que el producto exista
              raw: true,
              nest: true,
            });
            if (element.stock >= quantity) {
              //me aseguro que hay stock suficiente del producto encontrado
              await orderGuest.addProduct(id, { through: { quantity } });
            } else {
              outOfStock.push(element.name);
            }
          }

          if (outOfStock.length > 0) {
            res
              .status(200)
              .json({
                msg: `Attention!!. Products: ${[
                  ...outOfStock,
                ]} do not have enough stock. Reduce the amount or eliminate them`,
              });
          } else {
            await Order.update(
              { satus: "Complete" },
              {
                where: {
                  id: orderGuest.id,
                },
              }
            );
            for await (const { id, quantity } of products) {
              const prod = await Product.findOne({
                where:{id:id}
              })
              await Product.update({stock: (prod.stock-quantity)}, {
                where:{id:id},
                //busco que el producto exista
                raw: true,
                nest: true,
              });
            }
            res
              .status(200)
              .json({
                msg: "Products added to your order",
                orderId: orderGuest.id,
              });
          }
        } else {
          res
            .status(200)
            .json({ msg: "You did not save any item in the cart" });
        }
      }
    } else {
      // si hay userId
      const order = await Orders.findOne({
        where: { userId: req.body.userId, status: "Open" },
      });
      await Order.update(
        { status: "InProcess" },
        {
          where: {
            id: order.id,
          },
        }
      );
    }
  } catch (err) {
    res.status(400).json({ msg: err });
  }
};

const getProductsByUserId = async (req, res) => {
  const userId = req.params ? req.params.userId : null;
  const status = req.params.status ? req.params.status : "Open";
  try {
    const products = await Order.findAll({
      where: {
        [op.and]: [
          {
            userId,
            status: Sequelize.literal(
              `"order"."status"::TEXT LIKE '%${status}%'`
            ),
          },
        ],
      },
      include: {
        all: true,
      },
    });

    res.status(200).send(products);
  } catch (err) {
    console.error("ERROR: ", err);
  }
};

const clearCart = async (req, res) => {
  //Limpiar carrito

  try {
    const userId = req.params ? req.params.userId : null;
    const status = "Open";

    const order = await Order.findOne({
      raw: true,
      nest: true,
      where: {
        [op.and]: [
          {
            userId,
            status: Sequelize.literal(
              `"order"."status"::TEXT LIKE '%${status}%'`
            ),
          },
        ],
      },
    });


    const order_details = await Order_details.destroy({
      where: {
        order_id: order.id,
      },
    });

    res.status(200).json({ msg: "Products deleted" });
  } catch (err) {
    console.error(err);
  }
};

const modifyOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const update = req.body; // el objeto debe venir con los elementos a actualizar
    if (update.status && update.status==="Complete"){
      const order = await Order.findOne({
        where: {id:orderId},
        include: {model:Product}
      })
      
      for await (const { id} of order.products) {
        const quantity = order.products.find(e=>e.id===id).order_details.quantity
        const prod = await Product.findOne({
          where:{id:id}
        })
        await Product.update({stock: (prod.stock-quantity)}, {
          where:{id:id},
          //busco que el producto exista
          raw: true,
          nest: true,
        });
      }
    }
    await Order.update(update, {
      where: {
        id: orderId,
      },
    });

    res.status(200).json({ msg: "Order updated" });
  } catch (err) {
    console.error("ERROR: Status not allowed ", err);
    res.status(400).json({ msg: "Status not allowed" });
  }
};

module.exports = {
  getOrders,
  addToOrder,
  deleteItem,
  checkoutOrder,
  getProductsByUserId,
  getUserCompleteOrdersRelatedProducts,
  clearCart,
  modifyOrder,
  getOrderById,
  getOrderByUserId,
};
