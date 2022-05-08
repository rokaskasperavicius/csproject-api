// For templating html files
import Handlebars from 'handlebars'

// Libary to format date to a readable format
import date from 'date-and-time'
import ordinal from 'date-and-time/plugin/ordinal'

// For reading files
import fs from 'fs'

// For sending emails
import nodemailer from 'nodemailer'

// Services
import db from 'services/db.js'

// Function to get all products which will expire in the set range of days
const getEmailInfo = async () => {
  // Query to get email config informatiom
  const configQuery = 'SELECT email, name, range FROM config'
  const config = await db(configQuery)

  const { range, name, email } = config[0]

  const query = `
    SELECT name, to_char(expiry_date, 'YYYY-MM-DD') AS "expiryDate"
      FROM products
      WHERE (CURRENT_DATE + ($1 || ' days')::INTERVAL) >= expiry_date AND notified IS FALSE
      ORDER BY expiry_date ASC;
  `
  const data = await db(query, [range])

  return {
    name,
    email,
    range,
    products: data,
  }
}

export const sendEmail = async () => {
  const { name, email, products, range } = await getEmailInfo()

  // Don't send an email if there aren't any expiring products
  if (!products || products.length === 0) {
    return
  }

  let mailConfig
  const isProduction = process.env.NODE_ENV === 'production'

  /**
   * If the environment is production, send the email to real user.
   * Otherwise, send the email to the test environment.
   */
  if (isProduction) {
    mailConfig = {
      service: 'SendinBlue',
      auth: {
        user: process.env.PROD_EMAIL_USER,
        pass: process.env.PROD_EMAIL_AUTH,
      },
    }
  } else {
    mailConfig = {
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.DEV_EMAIL_USER,
        pass: process.env.DEV_EMAIL_AUTH,
      },
    }
  }

  // Create email transporter
  const transporter = nodemailer.createTransport(mailConfig)

  // Get the html template for the email
  var source = fs.readFileSync('src/templates/expiring.html', 'utf8').toString()

  // Load the html with the name and products using handlebars syntax
  var template = Handlebars.compile(source)
  var output = template({ name, products })

  // Alow date formater to show ordinal notation of a day
  date.plugin(ordinal)

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: `${date.format(new Date(), 'MMMM DDD')} - Expiring products`,
    html: output,
  }

  const transporterResponse = await transporter.sendMail(mailOptions)

  /**
   * If the email was sent, set all expiring products as sent
   * so the user doesn't get the notification about the product twice
   * */
  if (transporterResponse.accepted) {
    const query = `
      UPDATE products
        SET notified = true
        WHERE (CURRENT_DATE + ($1 || ' days')::INTERVAL) >= expiry_date
    `

    await db(query, [range])
  }
}
