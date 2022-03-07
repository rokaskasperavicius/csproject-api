// For sending emails
const nodemailer = require('nodemailer')

// For templating html emails
var hbs = require('nodemailer-express-handlebars')

const sendEmail = (template, subject, emailTo, context, isProd) => {
  let mailConfig

  // Configs
  const fromEmail = 'no-reply@csproject.com'

  const prodUser = 'goodname258@gmail.com'
  const testUser = '06f5d18fe37d94'

  if (isProd) {
    mailConfig = {
      service: 'SendinBlue',
      auth: {
        user: prodUser,
        pass: process.env.PROD_EMAIL_AUTH,
      },
    }
  } else {
    mailConfig = {
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: testUser,
        pass: process.env.TEST_EMAIL_AUTH,
      },
    }
  }

  const transporter = nodemailer.createTransport(mailConfig)

  // For templating
  const handlebarOptions = {
    viewEngine: {
      partialsDir: './templates/',
      defaultLayout: false,
    },
    viewPath: './templates/',
    extName: '.html',
  }

  transporter.use('compile', hbs(handlebarOptions))

  const mailOptions = {
    from: fromEmail,
    to: emailTo,
    subject: subject,
    template: template, // the name of the template file i.e email.handlebars
    context,
  }

  return transporter.sendMail(mailOptions).catch((err) => err)
}

module.exports = sendEmail
