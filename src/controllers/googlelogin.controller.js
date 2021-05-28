const server = require("express").Router();
const { User, conn } = require("../db.js");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);
const bcrypt = require("bcryptjs");
const { login } = require("./auth.controller");

const loginGoogle = async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const { given_name, family_name, email, sub } = ticket.getPayload();
  const hashedPassword = bcrypt.hash(sub, 10);
  const user = await User.findOrCreate({
    defaults: {
      name: given_name,
      surname: family_name,
      admin: false,
      email: email,
      username: email, //el email es unico, mejor ese campo
      password: (await hashedPassword).toString(), //cambiar a null - ver hashSync
    },
    where: {
      email: email,
    },
  });
  res.json(user);
};

// Check authentication middleware

const authentication = async (req, res, next) => {
  const user = await db.user.findFirst({ where: { id: req.session.userId } });
  req.user = user;
  next();
};

// Sign out route

const deleteLogin = async (req, res) => {
  await req.session.destroy();
  res.status(200);
  res.json({
    message: "Logged out successfully",
  });
};

// "Me" route

const me = async (req, res) => {
  res.status(200);
  res.json(req.user);
};

module.exports = { loginGoogle, authentication, deleteLogin, me };
