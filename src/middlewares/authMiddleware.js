const jwt = require('jsonwebtoken')
const tokenModel = require('../models/tokenModel')
const moment = require('moment')
const tokenConfig = require('../../config/config').token

module.exports = {
  authorization: (sections) => {
    return function authorization (req, res, cb) {
      console.log('Controlling authorization middleware, sections: ', sections)
      try {
        const token = req.headers['x-access-token']
        console.log('Authentication token: ' + token)
        if (!token) {
          return res.status(401).json({
            error: 'AUTH_FAILED'
          })
        }
        console.log('verify token', `${tokenConfig.expirationToken}${tokenConfig.expirationUnit}`)

        jwt.verify(token, process.env.JWT_KEY, { algorithm: 'HS256' }, async (err, decoded) => {
          if (err) {
            return res.status(401).json({
              error: err.name
            })
          }
          const { result, error } = await tokenModel.validateTokenByIdUser(token, decoded.id)
          if (error) return res.status(401).json({ error: 'AUTH_FAILED' })
          if (result.expiration < moment().format('YYYY-MM-DD HH:mm:ss')) return res.status(401).json({ error: 'TOKEN_EXPIRED' })
          if (!result.active) return res.status(401).json({ error: 'TOKEN_IS_NOT_ACTIVE' })

          // here we can check roles and permissions
          if (sections.includes(result.user.role?.name)) return res.status(401).json({ error: 'NOT_AUTHORIZED' })
          req.userData = decoded
          cb()
        })
      } catch (error) {
        console.error(error)
        return res.status(401).json({ error: 'AUTH_FAILED' })
      }
    }
  }
}
