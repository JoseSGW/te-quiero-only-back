const server = require("express").Router();
const { Ingredient } = require("../db.js");

// Ruta para filtrar cateogiras
const filtIngredients = async(req, res) => {
    const nameIngredient = req.body.nameIngredient;
    if (!nameIngredient) {
        res.status(404).json({ msg: "No ingreso un ingrediente" });
    } else {
        const ingrediente = await Ingredient.findOne({
            where: { name: nameIngredient },
        });
        if (!ingrediente) {
            res.status(404).json({ msg: "No se encontro el ingrediente ingresado" });
        } else {
            res.status(200).json(ingrediente);
        }
    }
};

// Ruta para filtrar cateogiras
const allIngredients = async(req, res) => {
    const ingredientes = await Ingredient.findAll();
    if (!ingredientes) {
        res.status(404).json({ msg: "No hay ingredientes" });
    } else {
        res.status(200).json(ingredientes);
    }
};

// Ruta para agregar una categoria
const addIngredient = async(req, res) => {
    const ingredient = {
        name: req.body.name,
        details: req.body.description
    };
    if (ingredient.name === '' || ingredient.details === '') {
        res.status(404).json({ msg: "No ingresó el ingredient" });
    } else {
        await Ingredient.create({
            name: ingredient.name,
            details: ingredient.details
        });
        res.status(200).json({ msg: "Ingrediente agregado" });
    }
};

// Ruta para modificar una categoria
const modifyIngredient = async(req, res) => {
    const oldName = req.body.oldName; // newName es el nuevo nombre que se va a modificar
    const ingredient = req.body.ingredient; // category es la categoria que va a ser modificada
    await Ingredient.update({
        name: ingredient.name,
        details: ingredient.description
    }, {
        where: {
            name: oldName,
        },
    });
    res
        .status(200)
        .json({ msg: "Nombre del ingrediente modificado correctamente" });
};

// Ruta para eliminar una categoria
const deletedIngredient = async(req, res) => {
    // Categoria pasada por body que desea eliminar
    // const nameCategory = req.body.name;
    const nameIngredient = req.params.name;
    if (!nameIngredient) {
        res.status(404).json({ msg: "Debe ingresar un ingredient correcto" });
    } else {
        const ingredient = await Ingredient.findOne({
            where: { name: nameIngredient },
        });
        if (!ingredient) {
            res.status(404).json({ msg: "El ingrediente no existe" });
        } else {
            await ingredient.destroy();
            res.status(200).json({ msg: "Ingrediente eliminado correctamente" });
        }
    }
};



module.exports = {
    server,
    addIngredient,
    modifyIngredient,
    deletedIngredient,
    filtIngredients,
    allIngredients,
};