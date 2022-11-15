const {verifyToken} = require('./token')
const {User} = require('./schema')

// Säkerställer att användaren har giltiga referenser
const AuthMiddleware = (req, res, next) => {
    try {
      // kolla efter token annars returnerar fel
      const token = req.headers.authorization
      if (!token || !token.split(' ')[1]) {
        return res.status(401).json({message: 'Obehörig'})
      }
     // verifierar token och skickar användar-ID
      const tokenPayload = verifyToken(token.split(' ')[1])
      req.userId = tokenPayload.key
      next()
      
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({message: 'Obehörig'})
      }
      if (error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError') {
        return res.status(401).json({message: 'Obehörig'})
      }
      return res.status(500).json({message: 'Obehörig'})
    }
}

/* kontrollerar om användaren finns och skickar användarinformationen 
   annars returnerar felet*/
const UserAuthMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select('+isAdmin').lean()
        if(!user){
            return res.status(401).json({message: 'Obehörig'})
        }
        req.userInfo = user
        next()
    } catch (error) {
        res.status(500).json({message: 'Server Fel'})
    }
    
}
/* kontrollerar att användaren är en admin annars returnerar den ett 
   ett felmeddelande*/
const AdminAuthMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select('+isAdmin').lean()
        if(!user){
            return res.status(401).json({message: 'Obehörig'})
        }
        if(!user.isAdmin){
            return res.status(403).json({message: 'Tillträde beviljas ej'})
        }
        req.userInfo = user
        next()
    } catch (error) {
        res.status(500).json({message: 'Server Fel'})
    }
}

module.exports = {AuthMiddleware, UserAuthMiddleware, AdminAuthMiddleware}