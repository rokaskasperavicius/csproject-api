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
export const getEmailInfo = async () => {
  // Query to get email config informatiom
  const configQuery = 'SELECT email, name FROM config'
  const config = await db(configQuery)

  const { name, email } = config[0]

  const todayQuery = `
    SELECT P.name
      FROM products P
      JOIN subcategories SC ON P.subcategory_name = SC.name
      WHERE CURRENT_DATE = P.expiry_date AND SC.category_name = 'Food';
  `

  const tomorrowQuery = `
    SELECT P.name
      FROM products P
      JOIN subcategories SC ON P.subcategory_name = SC.name
      WHERE (CURRENT_DATE + INTERVAL '1 day') = P.expiry_date AND SC.category_name = 'Food';
  `

  const futureQuery = `
    SELECT P.name
      FROM products P
      JOIN subcategories SC ON P.subcategory_name = SC.name
      WHERE (CURRENT_DATE + INTERVAL '30 days') >= P.expiry_date AND SC.category_name <> 'Food' AND notified IS FALSE;
  `

  const todayFood = await db(todayQuery)
  const tomorrowFood = await db(tomorrowQuery)
  const futureProducts = await db(futureQuery)

  return {
    name,
    email,
    todayFood,
    tomorrowFood,
    futureProducts,
  }
}

export const sendEmail = async () => {
  const { name, email, todayFood, tomorrowFood, futureProducts } =
    await getEmailInfo()

  // Don't send an email if there aren't any expiring products
  if (
    todayFood.length === 0 &&
    tomorrowFood.length === 0 &&
    futureProducts.length === 0
  ) {
    return false
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
  var source = fs.readFileSync('src/templates/expiring.hbs', 'utf8').toString()

  // Load the html with the name and products using handlebars syntax
  var template = Handlebars.compile(source)
  var output = template({ name, todayFood, tomorrowFood, futureProducts })

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
   * If the email was sent, set all expiring medicine and cosmetics as sent
   * so the user doesn't get the notification about the products twice
   *
   * https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-update-join/
   * */
  if (transporterResponse.accepted) {
    const query = `
      UPDATE products
        SET notified = true
        FROM subcategories
        WHERE products.subcategory_name = subcategories.name AND (CURRENT_DATE + INTERVAL '30 days') >= products.expiry_date AND subcategories.category_name <> 'Food';
    `
    await db(query)
  }

  return true
}
