// For sending emails
import nodemailer from 'nodemailer'

// For templating html emails
import hbs from 'nodemailer-express-handlebars'

const sendEmail = async (template, subject, emailTo, context, isProd) => {
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

  return await transporter.sendMail(mailOptions)
}

export default sendEmail
