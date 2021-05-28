const { Product, Category, Ingredient, Store, User } = require("../db.js");
const request = require("request");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
// const { transporter } = require('../config/mailer');

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars');
const crypto = require("crypto");

// Controller para agregar un usuario
const addUser = async (req, res) => {
    try {
        const name = req.body.name;
        const surname = req.body.surname;
        const username = req.body.username;
        const email = req.body.email;
        const gender = req.body.gender.toLowerCase();
        const country = req.body.country.toLowerCase();
        const yearDate = req.body.yearDate;
        const monthDate = req.body.monthDate.toLowerCase();
        const password = req.body.password;
        const validation = validationEmail(email);
        const hashedPassword = bcrypt.hash(password, 10);
        if (!name || !surname || !username || !email || !password) {
            res.status(404).json({
                msg: "No ingreso correctamente los datos solicitados",
            });
        } else {
            const usernameExist = await User.findOne({
                where: { username: username },
            });
            const emailExist = await User.findOne({ where: { email: email } });
            if (usernameExist) {
                res.status(404).json({
                    msg: "El username ingresado ya esta en uso",
                });
            }
            if (emailExist) {
                res.status(404).json({
                    msg: "El email ingresado ya esta en uso",
                });
            } else {
                if (validation) {
                    // await transporter.sendMail({
                    //     from: '"Té Quiero" <foo@example.com>', // sender address
                    //     to: email, // list of receivers
                    //     subject: "Validación de Email ✔", // Subject line
                    //     text: "Hello world?", // plain text body
                    //     html: "<b>Hello world?</b>", // html body
                    //   });
                    const user = await User.create({
                        name: name,
                        surname: surname,
                        username: username,
                        gender: gender,
                        country: country,
                        yearDate: yearDate,
                        monthDate: monthDate,
                        email: email,
                        password: (await hashedPassword).toString(),
                        admin: false,
                    });
                    res.status(200).json({
                        msg: "Usuario creado correctamente",
                        id: user.id,
                    });
                } else {
                    res.status(404).json({
                        msg: "No ingreso correctamente su email",
                    });
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
};

// Funcion para validar el email
function validationEmail(valor) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(valor)) {
        return true;
    } else {
        return false;
    }
}

// Controller para retornar todos los usuarios
const allUser = async (req, res) => {
    try {
        const users = await User.findAll();
        if (!users) {
            res.status(200).json({ msg: "No hay usuarios" });
        } else {
            res.status(200).json(users);
        }
    } catch (error) {
        console.error(error);
    }
};

const verify = async (req, res) => {
    try {
        const token = req.body.token;
        const secretURL = req.body.secretURL;

        const verified = speakeasy.totp.verify({
            secret: secretURL,
            encoding: "base32",
            token: token,
        });
        if (verified) {
            console.log("Token validado");
        } else {
            console.log("token invalido o expirado");
        }
        console.log(token);
        console.log(secretURL);
        console.log(verified);
    } catch (error) {
        console.error(error);
    }
};

const twoFactorAuth = async (req, res) => {
    const secret = speakeasy.generateSecret();

    qrcode.toDataURL(secret.otpauth_url, function (err, data) {
        res.json({ secret: secret, imgURL: data });
    });
};

const findUsername = async (req, res) => {
    const username = req.query.user;
    const disponible = "false";
    const available = await User.findOne({ where: { username: username } });
    if (available) {
        res.status(400).json({ msg: "El username no está disponible" });
    } else {
        var data = { msg: "Usuario disponible" };
        res.status(200).json(data);
    }
};
const signup = async (req, res) => {
    const { firstName, lastName, email } = req.body;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: 'user',
                    LNAME: 'userL',
                },
            },
        ],
    };

    const postData = JSON.stringify(data);
    const options = {
        // url: "https://us1.api.mailchimp.com/3.0/lists/73e76446a9",
        url: "https://us1.api.mailchimp.com/3.0/lists/79f8a44890",
        method: "POST",
        headers: {
            // Authorization: "auth 31855f14e575e98a6c2fd29c048d62ab-us1",
            Authorization: "auth 63fe8adc93656da6f1ed8dd1d30be200-us1",
        },
        body: postData,
    };
    request(options, (err, response, body) => {
        if (response.statusCode === 200) {
            console.log("se agrego correctamente al newsletter");
            var smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "tequieroecommerce@gmail.com",
                    pass: "ecommerce123123",
                },
            });
            var mailOptions = {
                to: email,
                from: "tequieroecommerce@gmail.com",
                subject: "Confirmación de suscripción al newsletter",
                html:
                    `<h1>Hola!</h1>
                    <h3>Confirmación de suscripción al newsletter</h3>
                    `,
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                if (err) {
                    console.log("Ocurrio un error", err);
                } else {
                    req.flash(
                        "passwordReset",
                        "Te has suscrito al newsletter."
                    );
                }
            });
        } else {
            console.log("hubo un error", err);
        }
    });

    res.send("llegaste");
};

const forgot = async (req, res, next) => {
    const userData = await User.findOne({
        where: { email: req.body.email },
    });

    let token = crypto.randomBytes(20);
    token = token.toString("hex");
    console.log(token);

    if (!userData) {
        return res.redirect("/forgot");
    } else {
        var smtpTransport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "tequieroecommerce@gmail.com",
                pass: "ecommerce123123",
            },
        });
        var mailOptions = {
            to: userData.email,
            from: "tequieroecommerce@gmail.com",
            subject: "Reseteo de contraseña",
            html:
                `<h1>Hola ${userData.name}!</h1>
                <h3>Entra en este link para cambiar la contraseña:</h3>
                <h3>http:/localhost:3000/password/${token}/${userData.id}</h3>`
                ,
        };
        userData.resetPasswordExpires = Date.now() + 3600000;
        userData.resetPasswordToken = token;
        userData.save();

        smtpTransport.sendMail(mailOptions, function (err) {
            if (err) {
                console.log("Ocurrio un error", err);
            } else {
                req.flash(
                    "passwordReset",
                    "Tu contraseña ha sido reestablecida satisfactoriamente."
                );
            }
        });
    }
};

// Controller para eliminar un usuario

const deleteUser = async (req, res) => {
    try {
        const id = req.query.id;

        const user = await User.findByPk(id);

        user.destroy();

        res.status(200).json({ msg: "User deleted" });
    } catch (err) {
        console.error(err);
        res.status(400).json({ msg: "ERROR: User not deleted" });
    }
};

// Controller para resetear la password
const passwordReset = async (req, res) => {
    const userData = await User.findOne({
        where: { resetPasswordToken: req.params.token },
    });
    if (userData) {
        if (userData.resetPasswordExpires > Date.now()) {
            userData.resetPasswordExpires = Date.now();
            userData.password = bcrypt.hashSync(req.body.password, 10);
            await userData.save();
            var confirmTransport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "tequieroecommerce@gmail.com",
                    pass: "ecommerce123123",
                },
            });
            var mailOptions = {
                to: userData.email,
                from: "tequieroecommerce@gmail.com",
                subject: "Tu contraseña ha sido cambiada correctamente",
                // text:
                //     "Hola,\n\n" +
                //     "este correo es para confirmar que la contraseña de " +
                //     userData.email +
                //     " ha sido cambiada correctamente.\n",
                html:`
                    <h1>Hola ${userData.name}!</h1>
                    <h2>este correo es para confirmar que la contraseña de ${userData.email}</h2>
                    <h2>fue cambiada correcatemente.</h2><br/>
                    <p>Lamentamos las molestias causadas.</p>
                `,
            };
            confirmTransport.sendMail(mailOptions, function (err) {
                if (err) {
                    console.log("ocurrio un error", err);
                } else {
                    console.log("confirmacion de cambio de contraseña enviado");
                }
            });

            return res.status(201).json({ message: "se cambio la contraseña" });
        } else {
            return res
                .status(204)
                .json({ message: "Token invalido o ya expiro" });
        }
    }

    return res.status(204).json({ message: "Ocurrio un error" });
};

// Controller para modificar un usuario, Ejemplo para modificar un user:
// {
//     "id": "",
//     "campo": "username",
//     "update": "toni10"
// }
const modifyUser = async (req, res) => {
    const id = req.body.id;
    const campo = req.body.campo; // Constante para saber que se va a modificar
    const update = req.body.update; // Constante para el valor nuevo
    switch (campo) {
        case "name":
            await User.update(
                {
                    name: update,
                },
                {
                    where: { id: id },
                    returning: true,
                    raw: true,
                }
            );
            res.status(200).json({ msg: "Name modificado correctamente" });
            break;
        case "surname":
            await User.update(
                {
                    surname: update,
                },
                {
                    where: { id: id },
                    returning: true,
                    raw: true,
                }
            );
            res.status(200).json({ msg: "Surname modificado correctamente" });
            break;
        case "gender":
            await User.update(
                {
                    gender: update,
                },
                {
                    where: { id: id },
                    returning: true,
                    raw: true,
                }
            );
            res.status(200).json({ msg: "Gender modificado correctamente" });
            break;
        case "country":
            await User.update(
                {
                    country: update,
                },
                {
                    where: { id: id },
                    returning: true,
                    raw: true,
                }
            );
            res.status(200).json({ msg: "country modificado correctamente" });
            break;
        case "yearDate":
            await User.update(
                {
                    yearDate: update,
                },
                {
                    where: { id: id },
                    returning: true,
                    raw: true,
                }
            );
            res.status(200).json({ msg: "YearDate modificado correctamente" });
            break;
        case "monthDate":
            await User.update(
                {
                    monthDate: update,
                },
                {
                    where: { id: id },
                    returning: true,
                    raw: true,
                }
            );
            res.status(200).json({ msg: "MonthDate modificado correctamente" });
            break;
        case "email":
            const userEmail = await User.findOne({ where: { email: update } });
            if (!userEmail) {
                if (validationEmail(update)) {
                    await User.update(
                        {
                            email: update,
                        },
                        {
                            where: { id: id },
                            returning: true,
                            raw: true,
                        }
                    );
                } else {
                    res.status(404).json({ msg: "Email invalido" });
                }
            } else {
                res.status(404).json({ msg: "Email en uso" });
            }
            break;
        case "password":
            const hashedPassword = bcrypt.hash(update, 10);
            await User.update(
                {
                    password: (await hashedPassword).toString(),
                },
                {
                    where: { id: id },
                    returning: true,
                    raw: true,
                }
            );
            res.status(200).json({ msg: "Password modificada correctamente" });
            break;
        case "username":
            const userUsername = await User.findOne({
                where: { username: update },
            });
            if (!userUsername) {
                await User.update(
                    {
                        username: update,
                    },
                    {
                        where: { id: id },
                        returning: true,
                        raw: true,
                    }
                );
                res.status(200).json({
                    msg: "Username modificado correctamente",
                });
            } else {
                res.status(400).json({ msg: "Username en uso" });
            }
            break;
        case "resetPasswordForce":
            await User.update(
                {
                    resetPasswordForce: update,
                },
                {
                    where: { id: id },
                    returning: true,
                    raw: true,
                }
            );
            const userData = await User.findOne({
                where: { id: id },
            });
            var smtpTransportReset = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "tequieroecommerce@gmail.com",
                    pass: "ecommerce123123",
                },
            });
            smtpTransportReset.use('compile', hbs({
                viewEngine: {
                    partialsDir: './viewHtml/',
                    defaultLayout: ''
                },
                viewPath: './viewHtml/',
                extName: '.hbs'
            }));
            var mailOptions = {
                to: userData.email,
                from: "tequieroecommerce@gmail.com",
                subject: "Reseteo forzado de tú contraseña",
                // html:`
                //     <h1>Hola ${userData.name}!</h1><br/>
                //     <h2>Te informamos que por <strong>motivos de seguridad</strong> tuvimos que forzar el cambio de contraseña en tu cuenta.</h2>
                //     <h2>De modo que la proxima vez que inicies sesión deberas recuperar tu contraseña.</h2>
                //     <p>Lamentamos las molestias causadas.</p>
                // `,
                template: 'index'
            };
            smtpTransportReset.sendMail(mailOptions, function (err) {
                if (err) {
                    console.log("Ocurrio un error", err);
                } else {
                    req.flash("passwordReset", "Message.");
                }
            });
            res.status(200).json({ msg: "Password reseteda correctamente" });
            break;
        default:
            res.status(404).json({ msg: "Datos incorrectos" });
            break;
    }
};

// Controller para hacer admin a un usuario
const userPromote = async (req, res) => {
    const idUser = req.body.id; // id del usuario ha transformar en administrador
    const user = await User.findOne({ where: { id: idUser } });
    if (!user) {
        res.status(404).json({ msg: "El usuario no se ha encontrado" });
    } else {
        await User.update(
            {
                admin: true,
            },
            {
                where: { id: idUser },
                returning: true,
                raw: true,
            }
        );
        res.status(200).json({
            msg: "El usuario ingresado ahora es un administrador",
        });
    }
};

// Controller para quitar rol de admin a un admin
const adminToUser = async (req, res) => {
    const idUser = req.body.id; // id del usuario ha transformar en administrador
    const user = await User.findOne({ where: { id: idUser } });
    if (!user) {
        res.status(404).json({ msg: "El usuario no se ha encontrado" });
    } else {
        await User.update(
            {
                admin: false,
            },
            {
                where: { id: idUser },
                returning: true,
                raw: true,
            }
        );
        res.status(200).json({
            msg: "El usuario ingresado ya no es un administrador",
        });
    }
};

module.exports = {
    addUser,
    allUser,
    findUsername,
    passwordReset,
    forgot,
    deleteUser,
    modifyUser,
    userPromote,
    adminToUser,
    signup,
    verify,
    twoFactorAuth,
};
