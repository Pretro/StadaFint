const {verifyToken} = require('./token')
const {User} = require('./schema')

// This middleware ensure the user hass valid credentials
const AuthMiddleware = (req, res, next) => {
    try {
      // check for token else return error
      const token = req.headers.authorization
      if (!token || !token.split(' ')[1]) {
        return res.status(401).json({message: 'Unauthorized'})
      }
      // verify tokin and pass the userId
      const tokenPayload = verifyToken(token.split(' ')[1])
      req.userId = tokenPayload.key
      next()
      // throw token verification 
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({message: 'Unauthorized'})
      }
      if (error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError') {
        return res.status(401).json({message: 'Unauthorized'})
      }
      return res.status(500).json({message: 'Unauthorized'})
    }
}

// check if user exist & pass the user info else return error
const UserAuthMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select('+isAdmin').lean()
        if(!user){
            return res.status(401).json({message: 'Unauthorized'})
        }
        req.userInfo = user
        next()
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
    
}
// check if user exist & is an admin else return error
const AdminAuthMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select('+isAdmin').lean()
        if(!user){
            return res.status(401).json({message: 'Unauthorized'})
        }
        if(!user.isAdmin){
            return res.status(403).json({message: 'Access denied'})
        }
        req.userInfo = user
        next()
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
}

module.exports = {AuthMiddleware, UserAuthMiddleware, AdminAuthMiddleware}