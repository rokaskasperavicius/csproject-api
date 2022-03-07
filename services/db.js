const { Pool } = require('pg')

const ERROR_CODES = require('#base/constants.js')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    sslmode: 'require',
    rejectUnauthorized: false,
  },
})

const handlePostgresError = (code) => {
  switch (code) {
    default:
      return ERROR_CODES.UNKNOWN
  }
}

const db = async (query) => {
  const client = await pool.connect()

  try {
    return await client.query(query).then((result) => result.rows)
  } catch (error) {
    /**
     * https://blog.larah.me/dont-rethrow-new-Error-error/
     *
     * keeping the error stack trace
     */

    // Read PostgreSQL errors
    error.code = handlePostgresError(error.code)

    throw error
  } finally {
    client.end()
  }
}

module.exports = db
