require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;

//const credentials = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/development`

const sequelize = new Sequelize(process.env.DATABASE_URL,
  {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // <<<<<<< YOU NEED THIS for heroku
      }
    },
  }
);
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const {
  Product,
  Category,
  Order,
  Review,
  Store,
  User,
  Ingredient,
  Products_Stores,
  Image,
} = sequelize.models;

// Aca vendrian las relaciones
User.hasMany(Review);
User.hasMany(Order);
// Order.belongsTo(Store);
Order.belongsTo(User);
Order.belongsToMany(Product, {
  through: "order_details",
  foreignKey: "order_id",
});
// Store.hasMany(Order);
// Product.belongsToMany(Store, { through: "products_stores" });
Product.belongsToMany(Category, { through: "product_categories" });
Category.belongsToMany(Product, { through: "product_categories" });
Product.belongsToMany(Ingredient, { through: "ingredients_products" });
Product.hasMany(Review);
Product.belongsToMany(Order, {
  through: "order_details",
  foreignKey: "product_id",
});
Review.belongsTo(Product);
Review.belongsTo(User);
Product.hasMany(Image);
Product.belongsToMany(User, { through: "review" });
Image.belongsTo(Product);
User.belongsToMany(Product, { through: "review" });
Product.belongsToMany(User, { through: "wishlist", foreignKey: "product_id" });
User.belongsToMany(Product, { through: "wishlist", foreignKey: "user_id" });

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
