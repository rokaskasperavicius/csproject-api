import * as pg from 'pg'

const { Pool } = pg.default

import ERROR_CODES from 'utils/constants.js'

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
    error.errorCode = handlePostgresError(error.code)

    throw error
  } finally {
    client.end()
  }
}

export default db
