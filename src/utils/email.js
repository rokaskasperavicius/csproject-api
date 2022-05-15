// For templating html files
import Handlebars from 'handlebars'

// Library for sending emails
import sgMail from '@sendgrid/mail'

// Libary to format date to a readable format
import date from 'date-and-time'
import ordinal from 'date-and-time/plugin/ordinal'

// For reading files
import fs from 'fs'

// Services
import db from 'services/db.js'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

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

  // Get the html template for the email
  var source = fs.readFileSync('src/templates/expiring.hbs', 'utf8').toString()

  // Load the html with the name and products using handlebars syntax
  var template = Handlebars.compile(source)
  var output = template({ name, todayFood, tomorrowFood, futureProducts })

  // Alow date formater to show ordinal notation of a day
  date.plugin(ordinal)

  const mailOptions = {
    from: 'cs.project.ruc@gmail.com',
    to: email,
    subject: `${date.format(new Date(), 'MMMM DDD')} - Expiring products`,
    html: output,
  }

  await sgMail.send(mailOptions)

  /**
   * If the email was sent, set all expiring medicine and cosmetics as sent
   * so the user doesn't get the notification about the products twice
   *
   * https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-update-join/
   * */
  const query = `
    UPDATE products
      SET notified = true
      FROM subcategories
      WHERE products.subcategory_name = subcategories.name AND (CURRENT_DATE + INTERVAL '30 days') >= products.expiry_date AND subcategories.category_name <> 'Food';
  `
  await db(query)
}
