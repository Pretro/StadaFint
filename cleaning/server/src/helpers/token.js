const jwt = require('jsonwebtoken')

const thirtyDays = 60 * 60 * 24 * 30

// Functions to sign & verify user credentials

const signToken = (userId) => jwt.sign({
    key: userId
  }, process.env.TOKEN_SECRET, { expiresIn: thirtyDays })

const verifyToken = (token) => jwt.verify(token, process.env.TOKEN_SECRET)

module.exports = {signToken, verifyToken}
