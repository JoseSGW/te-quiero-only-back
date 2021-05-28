const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define("products_stores", {
        stock: { 
            type: DataTypes.INTEGER
        }
    }, { timestamps: false });
}