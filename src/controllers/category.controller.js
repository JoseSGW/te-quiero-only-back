const server = require("express").Router();
const { Category } = require("../db.js");

// Ruta para filtrar cateogiras
const filtCategories = async(req, res) => {
    const nameCategory = req.body.nameCategory;
    if (!nameCategory) {
        res.status(404).json({ msg: "No ingreso una categoria" });
    } else {
        const category = await Category.findOne({
            where: { name: nameCategory },
        });
        if (!category) {
            res.status(404).json({ msg: "No se encontro la categoria ingresada" });
        } else {
            res.status(200).json(category);
        }
    }
};

// Ruta para filtrar cateogiras
const allCategories = async(req, res) => {
    const categories = await Category.findAll();
    if (!categories) {
        res.status(404).json({ msg: "No hay categorias" });
    } else {
        res.status(200).json(categories);
    }
};

// Ruta para agregar una categoria
const addCategory = async(req, res) => {
    const category = {
        name: req.body.name,
        details: req.body.description
    };
    if (category.name === '' || category.details === '') {
        res.status(404).json({ msg: "No ingresó la categoria" });
    } else {
        await Category.create({
            name: category.name,
            details: category.details
        });
        res.status(200).json({ msg: "Categoria agregada" });
    }
};

// Ruta para modificar una categoria
const modifyCategory = async(req, res) => {
    const oldName = req.body.oldName; // newName es el nuevo nombre que se va a modificar
    const category = req.body.category; // category es la categoria que va a ser modificada
    await Category.update({
        name: category.name,
        details: category.description
    }, {
        where: {
            name: oldName,
        },
    });
    res
        .status(200)
        .json({ msg: "Nombre de la categoria modificado correctamente" });
};

// Ruta para eliminar una categoria
const deletedCategory = async(req, res) => {
    // Categoria pasada por body que desea eliminar
    // const nameCategory = req.body.name;
    const nameCategory = req.params.name;
    if (!nameCategory) {
        res.status(404).json({ msg: "Debe ingresar una categoria correcta" });
    } else {
        const category = await Category.findOne({
            where: { name: nameCategory },
        });
        if (!category) {
            res.status(404).json({ msg: "La categoria no existe" });
        } else {
            await category.destroy();
            res.status(200).json({ msg: "Categoria eliminada correctamente" });
        }
    }
};



module.exports = {
    server,
    addCategory,
    modifyCategory,
    deletedCategory,
    filtCategories,
    allCategories,
};