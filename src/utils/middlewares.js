import axios from 'axios'
import joi from 'joi'

// Utils
import { PSQL_CODES } from 'utils/constants'

export function errorHandler(error, req, res, next) {
  const { ip } = req
  const browser = req.headers['user-agent']

  // axios.post(process.env.DISCORD_WEBHOOK, {
  //   content: '```' + error.stack + '```',
  //   embeds: [
  //     {
  //       color: 14362664,
  //       fields: [],
  //       timestamp: new Date().toISOString(),
  //       fields: [
  //         {
  //           name: 'IP',
  //           value: ip,
  //           inline: true,
  //         },
  //         {
  //           name: 'Browser',
  //           value: browser,
  //           inline: true,
  //         },
  //       ],
  //       footer: {
  //         text: 'Server',
  //         icon_url:
  //           'https://cdn.iconscout.com/icon/free/png-256/node-js-1174925.png',
  //       },
  //     },
  //   ],
  // })

  const status = error.status || 500
  const code = error.errorCode || PSQL_CODES.DEFAULT
  const text = error.message || 'Something went wrong'

  res.status(error.status || 500).json({
    success: false,
    errorCode: code,
    errorText: text,
  })
}

export const schemaHandler = (schema, property) => {
  return (req, res, next) => {
    try {
      req[property] = {
        ...req[property],
        ...joi.attempt(req[property], schema),
      }

      next()
    } catch (err) {
      next(err)
    }
  }
}
