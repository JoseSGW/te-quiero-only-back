const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "image",
    {
      name: {
        type: DataTypes.STRING, //cada imagen va a tener una url unica
      }
    },
    {
      timestamps: false,
    }
  );
};
