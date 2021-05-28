//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const bcrypt = require("bcryptjs");

const server = require("./src/app.js");
const {
  conn,
  Product,
  User,
  Category,
  Ingredient,
  Image,
  Order,
} = require("./src/db.js");

// Syncing all the models at once.
conn.sync({ force: true }).then(() => {
  server.listen(3001, () => {
    console.log("%s listening at 3001"); // eslint-disable-line no-console

    const productopruba = [
      {
        name: "Black Tea - Cinnamon",
        stock: 7,
        price: 15,
        description: "Strong black tea with a touch of cinnamon",
        images: [
          "https://cdn.shopify.com/s/files/1/0156/5877/8688/products/71_Canela_1024x1024@2x.png",
        ],
        color: "black",
        category: ["energizing"],
        ingredients: ["cinnamon"],
      },
      {
        name: "Black Tea - Earl Grey",
        price: 20,
        description:
          "Unique aroma and a intense flavor, with orange peel, natural essence of bergamot and blue cornflower",
        images: [
          "https://cdn.shopify.com/s/files/1/0156/5877/8688/products/51_Earl_Grey_Bravo_1024x1024@2x.png",
        ],
        color: "black",
        category: ["antioxidant", "energizing"],
        ingredients: ["orange", "bergamot", "blue cornflower"],
        stock: 15,
      },
      {
        name: "Green Tea - Gunpowder",
        price: 10,
        description:
          "Natural leaves of green tea delicately rolled like balls. This kind of tea comes from the province of Zhejian, China.",
        images: [
          "https://cdn.shopify.com/s/files/1/0156/5877/8688/products/125_Gunpowder_1024x1024@2x.png",
        ],
        color: "green",
        category: ["antioxidant"],
        ingredients: [], //Green Tea - Gunpowder solamente es té verde
        stock: 10,
      },
      {
        name: "Green Tea - Raspberry",
        price: 15.5,
        description:
          "A perfect balance between the acid and the sweetness of raspberries, with the fresh touch of Green Tea.",
        images: [
          "https://cdn.shopify.com/s/files/1/0156/5877/8688/products/166_Verde_Frambuesa_d3151c08-d563-458a-98db-ee556c55327b_1024x1024@2x.png",
        ],
        color: "green",
        category: ["green tea", "antioxidant", "digestion"],
        ingredients: ["raspberries", "rose petals"],
        stock: 0,
      },
      {
        name: "Green Tea - Detox",
        price: 8,
        description:
          "We create a detox combination to help you eliminate toxins and regulate your digestive system. It also has  anti-inflammatory properties thanks to mint and chamomile.",
        images: [
          "https://cdn.shopify.com/s/files/1/0156/5877/8688/products/Chacha_725435e9-77e9-485d-9a37-aaa3854ba0c6_1024x1024@2x.jpg",
          "https://images.loox.io/uploads/2020/10/17/E1Aa7_4PK_mid.jpg",
        ],
        color: "green",
        category: ["antioxidant", "digestion"],
        ingredients: [
          "Green rooibos",
          "chamomile",
          "ginger",
          "peppermint",
          "lemon verbena",
          "lemon peel",
        ],
        stock: 18,
      },
      {
        name: "Blue Tea - Oolong Grapefruit",
        price: 11,
        description:
          "A delicious blue tea mixed with grapefruit, a perfect option to prepare both hot and cold. ",
        images: [
          "https://cdn.shopify.com/s/files/1/0156/5877/8688/products/217_Oolong_Pomelo_1024x1024@2x.png",
        ],
        color: "blue",
        category: ["antioxidant", "digestion"],
        ingredients: ["orange peel", "calendula flower", "grapefruit essence"],
        stock: 1,
      },
      {
        name: "Blue Tea - Oolong Coco Pouchong",
        price: 10,
        description:
          "This is a milder variety than traditional Oolong and has a slight resemblance to Green Tea due to its low oxidation.",
        images: [
          "https://cdn.shopify.com/s/files/1/0156/5877/8688/products/208_Oolong_Coco_Pouchong_1024x1024@2x.png",
          "https://images.loox.io/uploads/2020/7/10/EJJX8_ZJF_mid.jpg",
        ],
        color: "blue",
        category: ["antioxidant"],
        ingredients: ["dehydrated coconut", "coconut essence"],
        stock: 17,
      },
      {
        name: "Red Tea - Pu Erh Hazelnut Strawberry",
        price: 13,
        description:
          "Intense flavor and aroma, with earthy notes that are perfectly balanced with the sweetness of the strawberry and the warmth of the hazelnut.",
        images: [
          "https://cdn.shopify.com/s/files/1/0156/5877/8688/products/187_Pu_Erh_Avellana_Frutilla_1024x1024@2x.png",
        ],
        color: "red",
        category: ["digestion"],
        ingredients: ["strawberries", "cocoa beans", "hazelnut"],
        stock: 12,
      },
      {
        name: "Red Tea - Pu Erh Pearls",
        price: 15,
        description:
          "These balls are Shou (accelerated fermentation) style pu erh leaves, compressed, fermented and aged for five years.",
        images: [
          "https://cdn.shopify.com/s/files/1/0156/5877/8688/products/Pu-Erh-Pearls_1024x1024@2x.jpg",
        ],
        color: "red",
        category: ["antioxidant", "digestion"],
        ingredients: [], //Es sólo pelotitas de te rojo, no tiene otro ingrediente
        stock: 12,
      },
      {
        name: "White Tea - Chai",
        price: 16,
        description:
          "With an intense, warm and spicy flavor, perfectly balanced with citrus touches of lemongrass, a cup of Blanco Chai is comforting and ideal for those who enjoy novel flavors.",
        images: [
          "https://cdn.shopify.com/s/files/1/0156/5877/8688/products/1130_Blanco_Chai_b0288919-ae30-4545-8652-a05d2a7d046d_1024x1024@2x.png",
          "https://images.loox.io/uploads/2020/8/8/Nklj14owWF_mid.jpg",
        ],
        color: "white",
        category: ["antioxidant"],
        ingredients: [
          "ginger",
          "lemongrass",
          "cinnamon",
          "dehydrated coconut",
          "cardamom",
          "red pepper",
          "apple chunks",
        ],
        stock: 16,
      },
      {
        name: "White Tea - Strawberry",
        price: 7,
        description:
          "This infusion with White Tea from China, rooibos and strawberry essence, is a unique combination with a special flavor.",
        images: [
          "https://cdn.shopify.com/s/files/1/0156/5877/8688/products/113_Blanco_Frutilla_1024x1024@2x.png",
        ],
        color: "white",
        category: ["antioxidant", "digestion"],
        ingredients: [
          "rooibos",
          "pieces of apple",
          "hibiscus",
          "blueberries",
          "calendula flower",
          "rose petals",
        ],
        stock: 8,
      },
      {
        name: "White Tea - Orange",
        price: 7,
        description:
          "With a summery, fruity and fresh flavor, this mixture is perfect to enjoy during the summer in its 'iced tea' version.",
        images: [
          "https://cdn.shopify.com/s/files/1/0156/5877/8688/products/Blanco-Naranja_56f7af77-0dfb-4138-a021-63897182fd44_1024x1024@2x.jpg",
        ],
        color: "white",
        category: ["antioxidant"],
        ingredients: [
          "rooibos",
          "apple chunks",
          "hibiscus",
          "oranges",
          "natural peach flavor",
          "mango chunks",
        ],
        stock: 2,
      },
      {
        name: "Yellow Tea - Imperial Gold",
        price: 11,
        description:
          "The large, coiled leaves of Yellow Tea are infused to form a beautiful golden yellow color.",
        images: [
          "https://cdn.shopify.com/s/files/1/0156/5877/8688/products/Dorado-Imperial_1024x1024@2x.png",
        ],
        color: "yellow",
        category: ["antioxidant"],
        ingredients: [], //Sólo son hebras de té amarillo
        stock: 10,
      },
      {
        name: "Teapot 750 ml Black",
        price: 24,
        description:
          "Coming with a handle infuser and snap-on lid, this elegant bell-shaped borosilicate teapot allows you to remove the infuser at the right time.",
        images: [
          "https://cdn.shopify.com/s/files/1/0156/5877/8688/products/1793_Tetera_20Bhoro_20750_20ml_20Negra_201_d7402bf9-5918-44a1-91b2-552ab6fe4374_1024x1024@2x.jpg",
          "https://cdn.shopify.com/s/files/1/0156/5877/8688/products/1793_Tetera_20Bhoro_20750_20ml_20Negra_202_ab42c02e-5d65-4b95-8da0-1ad8a8a72f1e_1024x1024@2x.jpg",
        ],
        color: "",
        category: ["bazaar"],
        ingredients: [],
        stock: 6,
      },
      {
        name: "Teapot 750 ml Turquoise",
        price: 20,
        description:
          "Coming with a handle infuser and snap-on lid, this elegant bell-shaped borosilicate teapot allows you to remove the infuser at the right time.",
        images: [
          "https://cdn.shopify.com/s/files/1/0156/5877/8688/products/1796_Tetera_20Bhoro_20750_20ml_20Turquesa_201_1024x1024@2x.jpg",
          "https://cdn.shopify.com/s/files/1/0156/5877/8688/products/1796_Tetera_20Bhoro_20750_20ml_20Turquesa_202_1024x1024@2x.jpg",
        ],
        color: "",
        category: ["bazaar"],
        ingredients: [],
        stock: 6,
      },
      {
        name: "Purple Gum Infuser",
        price: 7,
        description:
          "Rubber infuser with stainless steel grid. Easy and comfortable to prepare your favorite teas.",
        images: [
          "https://cdn.shopify.com/s/files/1/0156/5877/8688/products/Capturasintitulo3115_11ee44df-7015-4293-83d2-5df54b5d2fd5_1024x1024@2x.jpg",
          "https://cdn.shopify.com/s/files/1/0156/5877/8688/products/Capturasintitulo3122_f38f0306-df8e-4b45-859a-099b0d60de10_1024x1024@2x.jpg",
        ],
        color: "",
        category: ["bazaar"],
        ingredients: [],
        stock: 12,
      },
      {
        name: "Turquoise Gum Infuser",
        price: 7,
        description:
          "Rubber infuser with stainless steel grid. Easy and comfortable to prepare your favorite teas.",
        images: [
          "https://cdn.shopify.com/s/files/1/0156/5877/8688/products/Capturasintitulo3112_1024x1024@2x.jpg",
          "https://cdn.shopify.com/s/files/1/0156/5877/8688/products/Capturasintitulo3121_1024x1024@2x.jpg",
        ],
        color: "",
        category: ["bazaar"],
        ingredients: [],
        stock: 12,
      },
      {
        name: "Graphite Gum Infuser",
        price: 7,
        description:
          "Rubber infuser with stainless steel grid. Easy and comfortable to prepare your favorite teas.",
        images: [
          "https://cdn.shopify.com/s/files/1/0156/5877/8688/products/Capturasintitulo3118_71001b62-08e0-4520-a23c-4b6eb8a399a5_1024x1024@2x.jpg",
          "https://cdn.shopify.com/s/files/1/0156/5877/8688/products/Capturasintitulo3120_57b12e4d-2e94-41f8-90df-4ccf018eff33_1024x1024@2x.jpg",
        ],
        color: "",
        category: ["bazaar"],
        ingredients: [],
        stock: 12,
      },
    ];

    precarga = async function (p) {
      try {
        const nameProduct = p.name;
        if (!nameProduct) {
          res.status(404).send("No ingreso el nombre del producto");
        } else {
          const newProduct = await Product.create({
            name: nameProduct,
            price: p.price,
            description: p.description,
            color: p.color,
            stock: p.stock,
          });

          const cat = p.category ? p.category : []; // cat es un array de categorias
          const ing = p.ingredients ? p.ingredients : []; // ing array de string con ingredientes
          const img = p.images ? p.images : []; // img es array de strings con url's de imagenes
          const str = p.stores ? p.stores : []; // array con tienda y stock en formato [{id: 1, stock: 24}, {id: 2, stock: 45}, {id: 3, stock: 65}]
          //las tiendas tienen que existir sino explota!!!

          if (cat.length > 0) {
            for (let c of cat) {
              const [{ dataValues }] = await Category.findOrCreate({
                // busca si existe la categoria y si no la crea
                where: {
                  name: c,
                },
              });
              await newProduct.addCategory(dataValues.id);
            }
          }

          //Agrega los ingredientes
          if (ing.length > 0) {
            for (let i of ing) {
              const [{ dataValues }] = await Ingredient.findOrCreate({
                where: {
                  name: i,
                },
              });
              await newProduct.addIngredient(dataValues.id);
            }
          }

          //Agrega imagenes al producto
          if (img.length > 0) {
            for (let i of img) {
              const [{ dataValues }] = await Image.findOrCreate({
                // busca si existe la categoria y si no la crea
                where: {
                  name: i,
                },
              });
              await newProduct.addImage(dataValues.id);
            }
          }

        }
      } catch (err) {
        const status = err.status || 400;
        console.error(
          "ERROR: Faltan datos o datos erróneos dentro de la consulta que no se han podido iterar",
          err
        );
      }
    };
    precProd = async function (array) {
      for (let i = 0; i < array.length; i++) {
        await precarga(array[i]);
      }
      const order1 = await Order.create({
        userId: 1,
        status: "Complete",
        yearDate: 2021,
        monthDate: "abril",
      })
      await order1.addProduct(1,{through: {quantity: 3}})
      await order1.addProduct(2,{through: {quantity: 2}})

      const order2 = await Order.create({
        userId: 2,
        status: "Complete",
        yearDate: 2021,
        monthDate: "abril",
      })
      await order2.addProduct(5,{through: {quantity: 1}})
      await order2.addProduct(8,{through: {quantity: 3}})

      const order3 = await Order.create({
        userId: 1,
        status: "Open",
        yearDate: 2021,
        monthDate: "abril",
      })
      await order3.addProduct(9,{through: {quantity: 2}})
      await order3.addProduct(12,{through: {quantity: 1}})


    };
    precProd(productopruba);

    User.create({
      name: "Toni",
      surname: "Tralice",
      admin: true,
      email: "toni@soyhenry.com",
      country: "other",
      username: "atralice",
      password: bcrypt.hashSync("soyhenry", 10),
    });

    User.create({
      name: "Joseph",
      surname: "Hidalgo",
      admin: true,
      country: "argentina",
      email: "josehidalgo990@gmail.com",
      username: "imjosehidalgo",
      password: bcrypt.hashSync("soyhenry", 10),
    });
  });
});
