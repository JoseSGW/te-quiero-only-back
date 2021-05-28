const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define(
        "user",
        {
            resetPasswordForce: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            surname: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            admin: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
               
            },
            gender: {
                type: DataTypes.STRING,
                // allowNull: false,
            },
            country: {
                type: DataTypes.STRING,
                // allowNull: false,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            resetPasswordToken: {
                type: DataTypes.STRING,
            },

            resetPasswordExpires: {
                type: DataTypes.DATE,
            },
            
            yearDate: {
                type: DataTypes.STRING,
            },
            monthDate: {
                type: DataTypes.STRING,
            },
        },
        {
            timestamps: false,
        }
    );
};
