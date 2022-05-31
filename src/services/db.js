import * as pg from 'pg'

// Utils
import { ERROR_CODES } from 'utils/constants.js'

const { Pool } = pg.default

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    sslmode: 'require',
    rejectUnauthorized: false,
  },
})

const handlePostgresError = (constraint) => {
  switch (constraint) {
    case 'products_pkey':
      return ERROR_CODES.PRODUCT_UNIQUE
    default:
      return ERROR_CODES.DEFAULT
  }
}

const db = async (query, values = []) => {
  const client = await pool.connect()

  try {
    return await client.query(query, values).then((result) => result.rows)
  } catch (error) {
    /**
     * https://blog.larah.me/dont-rethrow-new-Error-error/
     *
     * keeping the error stack trace
     */

    // Read PostgreSQL errors
    error.errorCode = handlePostgresError(error?.constraint)
    error.status = 400

    /**
     * Re-write the database error message if it is production environment to not show any sensative database information
     * If it is development, keep the exact error for debugging purposes
     */
    if (process.env.NODE_ENV === 'production') {
      error.message = 'PostgreSQL internal error'
    }

    throw error
  } finally {
    client.release()
  }
}

export default db
