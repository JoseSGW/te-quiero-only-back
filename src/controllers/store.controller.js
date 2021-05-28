const server = require("express").Router();
const Sequelize = require("sequelize");
const op = Sequelize.Op;
const { Product, Category, Ingredient, Store, Order } = require("../db.js");

const getStores = async (req, res) => {
    try {
        const stores = await Store.findAll({
            include: [
                {
                    all: true,
                },
            ],
        });
        res.status(200).send(stores);
    } catch (err) {
        console.error("ERROR: No se pudo realizar la búsqueda", err);
        res.status(400).json({ msg: "ERROR: No se pudo realizar la búsqueda" });
    }
};

const signup = async (req, res) => {
    console.log(req.body);
};

const addStore = async (req, res) => {
    try {
        const name = req.body.name;
        const location = req.body.location;

        await Store.create({
            name,
            location,
        });

        res.status(200).json({ msg: "Successfully created store" });
    } catch (e) {
        console.error("faltan datos", err);
        res.status(400).json({
            msg: "No se ha creado la tienda: ¿Faltan datos?",
        });
    }
};

const deleteStore = async (req, res) => {
    try {
        const id = req.params.id; // id de la store pasada por params que desea eliminar

        const store = await Store.findOne({
            where: { id },
        });
        await store.destroy();

        res.status(200).json({ msg: "store removed successfully" });
    } catch (err) {
        console.error("ERROR: El id no existe", err);
        res.status(400).json({ msg: "El id de la tienda no existe" });
    }
};

module.exports = {
    getStores,
    addStore,
    deleteStore,
};
