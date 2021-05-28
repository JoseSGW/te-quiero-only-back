const { Router } = require("express");
const router = Router();
require('dotenv').config();

const mercadopago = require("mercadopago");

const { MP_TOKEN } = process.env;

console.log("soy el token", MP_TOKEN)

mercadopago.configure({
  access_token: MP_TOKEN,
});

router.post("/create_preference", async (req, res, next) => {
  const { orderId } = req.query;

  let preference = {
    items: [
      {
        //id: NOS DEBERIA LLEGAR UN ORDERID
        title: "Compra en Té Quiero",
        quantity: 1,
        currency_id: "ARS",
        unit_price: req.body.totalprice,
      },
    ],
    back_urls: {
      success: "http://localhost:3000/?status=approved",
      failure: "http://localhost:3000/?status=rejected",
      pending: "http://localhost:3000/?status=in_process",
    },
    auto_return: "approved",
  };

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      // Este valor reemplaza el string "<%= global.id %>" en el HTML
      globalurl = response.body.init_point;
      console.log("asdasdsdadas", globalurl);
      res.send(globalurl);
    })
    .catch(function (error) {
      console.log(error);
    });
});

module.exports = router;
