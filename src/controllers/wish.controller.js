const server = require("express").Router();
const Sequelize = require("sequelize");
const op = Sequelize.Op;
const { Product, User, wishlist, conn, Image } = require("../db.js");


addWish = async (req, res, next) => {
    try {
        const wish = await wishlist.create({
            product_id: req.body.productId,
            user_id: req.body.userId
        })

        return res.status(200).json({ msg: "Su producto se agregó correctamente" });
    }
    catch (error) {
        console.error(error)
    }
}

deleteWish = async (req, res, next) => {

    try {
        var userId = req.body.userId;
        var productId = req.body.productId;
        const wish = await wishlist.findOne({ where: { user_id: userId, product_id: productId } })
        wish.destroy();
        return res.status(200).json({ msg: "Su producto se eliminó correctamente" })
    } catch (error) {
        console.error(error)
    }
}

allWishes = async (req, res, next) => {

    try {
        var userId = Number(req.params.user)
        // const wishes = await Product.findAll({
        //     where: {
        //         user_id: userId
        //     },
        //     include: [Image],
        // })


        const wishes = await conn.query(
            // `SELECT * FROM wishlist join products on wishlist.product_id= products.id WHERE wishlist.user_id=${userId} join image on image.product_id = product.id;`
            `SELECT *, images.name as imageurl, products.name as name FROM wishlist join products on wishlist.product_id= products.id join images on images."productId" = products.id where wishlist.user_id=${userId};`
        );
        //SELECT * FROM wishlist WHERE user_id= join products on wishlist.product_id= products.id;  


        return res.status(200).json(wishes)
    } catch (error) {
        console.error(error)
    }
}


module.exports = {
    addWish,
    deleteWish,
    allWishes
};
