const jwt = require('jsonwebtoken')
const tokenModel = require('../modules/user/token/tokenModel')
const moment = require('moment')
const tokenConfig = require('../../config/config').token
const authorizationTypes = require('../const/authorizationTypes')
const permissionModel = require('../modules/security/permission/permissionModel')
const rolePermissionModel = require('../modules/security/permission/rolePermissionModel')
const userPermissionModel = require('../modules/security/permission/userPermissionModel')

module.exports = {
  authorization: (module, permission, options = null) => {
    return function authorization (req, res, cb) {
      console.log('Controlling authorization middleware')
      console.log('Module: ', module)
      console.log('Permission: ', permission)
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

          // Validate token
          const { result, error } = await tokenModel.validateTokenByIdUser(token, decoded.id)
          if (error) return res.status(401).json({ error: 'AUTH_FAILED' })
          if (result.expiration < moment().format('YYYY-MM-DD HH:mm:ss')) return res.status(401).json({ error: 'TOKEN_EXPIRED' })
          if (!result.active) return res.status(401).json({ error: 'TOKEN_IS_NOT_ACTIVE' })

          // Get permission id by code
          const resultPermission = await permissionModel.getByCode(permission)
          if (resultPermission.error) return res.status(500).json({ data: null, error: resultPermission.error })
          const permissionId = resultPermission.result.id

          // Check if user has permission
          const resultAuthUser = await userPermissionModel.checkUserPermission(result.userId, permissionId)
          if (resultAuthUser.error) return res.status(500).json({ data: null, error: resultAuthUser.error })

          if (resultAuthUser.result === authorizationTypes.PERMITED) {
            req.userData = decoded
            return cb()
          } else if (resultAuthUser.result === authorizationTypes.DENIED) {
            return res.status(401).json({
              error: 'NOT_AUTHORIZED',
              desc: 'User is not authorized to access this resource'
            })
          }

          // Check if role has permission
          const resultAuthRole = await rolePermissionModel.checkRolePermission(result.user.roleId, permissionId)
          console.log('resultAuthRole', resultAuthRole)
          if (resultAuthRole.error) return res.status(500).json({ data: null, error: resultAuthRole.error })

          if (resultAuthRole.result === authorizationTypes.PERMITED) {
            req.userData = decoded
            return cb()
          }

          return res.status(401).json({
            error: 'NOT_AUTHORIZED',
            desc: 'Role is not authorized to access this resource'
          })
        })
      } catch (error) {
        console.error(error)
        return res.status(401).json({ error: 'AUTH_FAILED' })
      }
    }
  }
}
