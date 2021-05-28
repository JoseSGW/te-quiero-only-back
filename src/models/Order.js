const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "order",
    {
      status: {
        type: DataTypes.ENUM("Complete", "InProcess", "Cancelled", "Open"), //POR PAGAR, EN TRANSITO, COMPLETADO, ETC // va enum o string??
        defaultValue: "Open",
      },
      observations: {
        type: DataTypes.STRING,
      },
      yearDate: {
        type: DataTypes.STRING,
    },
    monthDate: {
        type: DataTypes.STRING,
    },
    },
  );
};
