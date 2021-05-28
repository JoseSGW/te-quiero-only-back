const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "category", {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            details: {
                type: DataTypes.TEXT,
            },
        }, {
            timestamps: false,
        }
    );
};