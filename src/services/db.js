import * as pg from 'pg'

// Utils
import { PSQL_CODES } from 'utils/constants.js'

const { Pool } = pg.default

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    sslmode: 'require',
    rejectUnauthorized: false,
  },
})

const handlePostgresError = (code) => {
  switch (code) {
    case '23505':
      return PSQL_CODES.UNIQUE
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
    error.message = 'PostgreSQL internal error'
    console.log(error)
    throw error
  } finally {
    client.end()
  }
}

export default db
