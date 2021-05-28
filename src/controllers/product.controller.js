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

const getProduct = (req, res, next) => {
  if (req.body.idList) {
    var idList = req.body.idList;
  }
  Product.findAll({
    where: {
      id: idList ? { [op.in]: idList } : { [op.not]: null },
    },
    include: [
      {
        all: true,
      },
    ],
  })
    .then((products) => {
      res.json(products);
    })
    .catch(next);
};

const addProduct = async (req, res) => {
  //crea producto y lo asigna a una categoria y un ingrediente

  try {
    const nameProduct = req.body.name;
    if (!nameProduct) {
      res.status(404).send("No ingreso el nombre del producto");
    } else {
      const newProduct = await Product.create({
        name: nameProduct,
        price: req.body.price,
        description: req.body.description,
        color: req.body.color,
        stock: req.body.stock,
      });

      const cat = req.body.category ? req.body.category : []; // cat es un array de categorias
      const ing = req.body.ingredients ? req.body.ingredients : []; // ing array de string con ingredientes
      const img = req.body.images ? req.body.images : []; // img es array de strings con url's de imagenes
      const str = req.body.stores ? req.body.stores : []; // array con tienda y stock en formato [{id: 1, stock: 24}, {id: 2, stock: 45}, {id: 3, stock: 65}]
      //las tiendas tienen que existir sino explota!!!

      if (cat.length > 0) {
        for (let c of cat) {
          if (c !== "") {
            const [{ dataValues }] = await Category.findOrCreate({
              // busca si existe la categoria y si no la crea
              where: {
                name: c,
              },
            });
            await newProduct.addCategory(dataValues.id);
          }
        }
      }

      //Agrega los ingredientes
      if (ing.length > 0) {
        for (let i of ing) {
          if (i !== "") {
            const [{ dataValues }] = await Ingredient.findOrCreate({
              where: {
                name: i,
              },
            });
            await newProduct.addIngredient(dataValues.id);
          }
        }
      }

      //Agrega imagenes al producto
      if (img.length > 0) {
        for (let i of img) {
          if (i !== "") {
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

      //agrega el producto a las tiendas con su respectivo stock
      // const idNotExist = [];
      // if (str.length > 0) {
      //   for (const { id, stock } of str) {
      //     const dataValues = await Store.findByPk(id, {
      //       //esto podria explotar si llega el id de una tienda que no existe
      //       raw: true,
      //     });
      //     if (!dataValues) {
      //       idNotExist.push(id);
      //       continue;
      //     }
      //     await newProduct.addStore(dataValues.id, { through: { stock } });
      //   }
      // }

      res.status(200).json({ msg: "Producto agregado" });

      //   if (idNotExist.length < 1) {
      //     res.status(200).json({ msg: "Producto agregado" });
      //   } else {
      //     res.status(200).send({
      //       msg: `Producto creado. Sin embargo, no pudo ser agregado a las tiendas con id ${[
      //         ...idNotExist,
      //       ]}. ya que no existen `,
      //     });
      //   }
    }
  } catch (err) {
    const status = err.status || 400;
    console.error(
      "ERROR: Faltan datos o datos erróneos dentro de la consulta que no se han podido iterar",
      err
    );
    res.status(status).json({
      msg: "No se agrego el producto: ¿Datos incorrectos o ausentes?",
    });
  }
};

const productByCategory = async (req, res) => {
  // Envia todos los productos que posean las categoria recibida en un array de string

  try {
    const data = await JSON.parse(req.query.data);

    let categories = data.categories.map((cat) => cat.name); //array de string con categorias
    let ingredients = data.ingredients.map((ing) => ing.name); //array de string con ingredientes
    let color = data.colors.map((col) => col.name); //string con el color

    let products = [];

    if (categories.length > 0 && ingredients.length < 1) {
      products = await Product.findAll({
        raw: true,
        nest: true,
        include: [
          {
            model: Category,
            required: true,
            where: {
              name: {
                [op.in]: categories,
              },
            },
          },
        ],
      });
    } else if (categories.length < 1 && ingredients.length > 0) {
      products = await Product.findAll({
        raw: true,
        nest: true,
        include: [
          {
            model: Ingredient,
            required: true,
            where: {
              name: {
                [op.in]: ingredients,
              },
            },
          },
        ],
      });
    } else if (categories.length > 0 && ingredients.length > 0) {
      products = await Product.findAll({
        raw: true,
        nest: true,
        include: [
          {
            model: Ingredient,
            required: true,
            where: {
              name: { [op.in]: ingredients },
            },
          },
          {
            model: Category,
            required: true,
            where: {
              name: { [op.in]: categories },
            },
          },
        ],
      });
    } else {
      products = await Product.findAll({
        raw: true,
        nest: true,
      });
    }

    await Promise.all(products);

    if (color.length > 0) {
      // filtro el color si me lo mandan
      var colorProducts = products.filter((c) => color.includes(c.color));
      products = colorProducts;
    }

    //esto solo arregla el problema de los resultados con categorias faltantes
    let allProducts = [];

    for (let { id } of products) {
      const fixedProducts = await Product.findByPk(id, {
        include: [
          {
            all: true,
          },
        ],
      });
      allProducts.push(fixedProducts);
    }
    res.status(200).send(allProducts);
  } catch (err) {
    console.log("ERROR: Dentro de la funcion productByCategory ", err); //esto saldra en la consola
    res.status(400).json({
      msj: "No se pudo realizar el filtro. ¿Tipos de datos incorrectos?",
    });
  }
};

const searchByKeyword = async (req, res) => {
  //buscar producto por name o descripcion con la palabra que llega por query
  try {
    console.log("req user de search", req.user);
    const keyword = req.query.keyword;

    const products = await Product.findAll({
      where: {
        [op.or]: [
          {
            name: {
              [op.iLike]: `%${keyword}%`,
            },
          },
          {
            description: {
              [op.iLike]: `%${keyword}%`,
            },
          },
        ],
      },
      include: [
        {
          all: true,
        },
      ],
    });
    res.status(200).send(products);
  } catch (err) {
    console.error("ERROR: ", err);
    res.status(400).json({ msg: "ERROR: ¿Tipo de dato ingresado incorrecto?" });
  }
};

const searchById = async (req, res) => {
  try {
    const id = Number(req.params.Id);
    if (typeof id != "number")
      throw new Error(`Id debe ser un número. Se recibió un ${typeof id}`);

    const product = await Product.findAll({
      where: {
        id: id,
      },
      include: [
        {
          all: true,
        },
      ],
    });
    res.status(200).send(product);
  } catch (err) {
    console.error("ERROR: ", err);
    res.status(400).json({ msg: "ERROR: ¿Tipo de dato ingresado incorrecto?" });
  }
};

// Ruta para eliminar un producto

const deleteProduct = async (req, res) => {
  const idProduct = Number(req.params.id);
  // const idProduct = req.body.id;
  if (!idProduct) {
    res.status(404).json({ msg: "Debe ingresar un producto valido" });
  } else {
    const product = await Product.findOne({
      where: { id: idProduct },
    });
    if (!product) {
      res.status(404).json({ msg: "El producto no existe" });
    } else {
      await product.destroy();
      res.status(200).json({ msg: "Producto eliminado correctamente" });
    }
  }
};

const modifyProduct = async (req, res) => {
  try {
    const id = req.body.id; //Obligatorio! id del producto a modificar
    const elementos = req.body.cambios ? req.body.cambios : {}; //es un objeto que llega con solo las propiedades a modificar
    const newCategories = req.body.newCategories ? req.body.newCategories : [];
    const newIngredients = req.body.newIngredients
      ? req.body.newIngredients
      : [];
    const newImages = req.body.newImages ? req.body.newImages : [];
    const newStores = req.body.newStores ? req.body.newStores : [];

    await Product.update(elementos, {
      where: { id: id },
      returning: true,
      raw: true,
    });

    const updatedProduct = await Product.findByPk(id);

    //bloque categorias
    if (newCategories.length > 0) {
      const categories = []; //los que seran seteados. Llegan desde la funcion findOrCreate

      for (let c of newCategories) {
        if (c !== "") {
          const [{ dataValues }] = await Category.findOrCreate({
            // busca si existe la categoria y si no la crea
            where: {
              name: c,
            },
          });
          categories.push(dataValues.id);
        }
      }
      await updatedProduct.setCategories(categories);
    }

    //bloque ingredientes
    if (newIngredients.length > 0) {
      const ingredients = [];

      for (let i of newIngredients) {
        if (i !== "") {
          const [{ dataValues }] = await Ingredient.findOrCreate({
            where: {
              name: i,
            },
          });
          ingredients.push(dataValues.id);
        }
      }
      await updatedProduct.setIngredients(ingredients);
    }

    //bloque images
    if (newImages.length > 0) {
      const images = [];

      for (let i of newImages) {
        if (i !== "") {
          const [{ dataValues }] = await Image.findOrCreate({
            where: {
              name: i,
            },
          });
          images.push(dataValues.id);
        }
      }
      await updatedProduct.setImages(images);
    }

    //bloque Tiendas (algo distinto a los anteriores)
    const idNotExist = [];
    if (newStores.length > 0) {
      updatedProduct.setStores([]); //resetea todas las tiendas asociadas a este producto

      for (const { id, stock } of newStores) {
        const dataValues = await Store.findByPk(id, {
          //esto podria explotar si llega el id de una tienda que no existe
          raw: true,
        });
        if (!dataValues) {
          //si la tienda no existe no la agrega, pero el producto se crea igual
          idNotExist.push(id);
          continue;
        }
        await updatedProduct.addStores(dataValues.id, { through: { stock } });
      }
    }
    if (idNotExist.length < 1) {
      res.status(200).json({ msg: "Producto actualizado" });
    } else {
      res.status(200).json({
        msg: `Producto actualizado. Sin embargo, no fue agregado a las tiendas con id ${[
          ...idNotExist,
        ]} ya que no existen`,
      });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({
      msg:
        "ERROR: ¿Datos incorrectos o ausentes?. Verifique la existencia del id de producto antes de actualizar",
    });
  }
};

module.exports = {
  server,
  getProduct,
  addProduct,
  productByCategory,
  searchByKeyword,
  searchById,
  modifyProduct,
  deleteProduct,
};
