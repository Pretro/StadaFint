const jwt = require('jsonwebtoken')

const thirtyDays = 60 * 60 * 24 * 30

const signToken = (userId) => jwt.sign({
    key: userId
  }, process.env.TOKEN_SECRET, { expiresIn: thirtyDays })

const verifyToken = (token) => jwt.verify(token, process.env.TOKEN_SECRET)

const AuthMiddleware = (req, res, next) => {
    try {
      const token = req.headers.authorization
      if (!token || !token.split(' ')[1]) {
        return res.status(401).json({message: 'Unauthorized'})
      }
      const tokenPayload = verifyToken(token.split(' ')[1])
      req.userId = tokenPayload.key
      next()
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

module.exports = {signToken, verifyToken, AuthMiddleware}
