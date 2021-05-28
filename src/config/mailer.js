const nodemailer = require('nodemailer');

//rzhykrlmbbmxylnx


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'juansesosa98@gmail.com', // generated ethereal user
      pass: 'rzhykrlmbbmxylnx', // generated ethereal password
    },
  });
  
transporter.verify(() => {
    console.log('Ready email');
})

module.exports = {
  transporter
};