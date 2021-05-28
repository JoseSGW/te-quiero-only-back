const { DataTypes } = require("sequelize");
// Acá definimos la tabla de tiendas.

module.exports = (sequelize) => {
  sequelize.define(
    "store",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
