const {verifyToken} = require('./token')
const {User} = require('./schema')

// Denna mellanvara säkerställer att användaren har giltiga referenser
const AuthMiddleware = (req, res, next) => {
    try {
      // kolla efter token annars returnerar fel
      const token = req.headers.authorization
      if (!token || !token.split(' ')[1]) {
        return res.status(401).json({message: 'Unauthorized'})
      }
     // verifiera tokin och skicka användar-ID
      const tokenPayload = verifyToken(token.split(' ')[1])
      req.userId = tokenPayload.key
      next()
      // kasta token verifiering
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

// kontrollera om användaren finns och skicka användarinformationen 
//annars returnerar felet
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
// kontrollera om användaren finns & är ett admin else return error
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