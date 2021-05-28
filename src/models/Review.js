const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define(
        "review", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            rating: {
                type: DataTypes.ENUM("1", "2", "3", "4", "5"),
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
            },
            // prodId: {
            //     type: DataTypes.INTEGER,
            //     allowNull: false,
            // },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        }, {
            timestamps: false,
        }
    );
};