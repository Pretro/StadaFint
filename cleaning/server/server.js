require('dotenv').config()
const express = require('express') 
const cors = require('cors') 
const mongoose = require('mongoose')

const {AuthMiddleware, UserAuthMiddleware, AdminAuthMiddleware} = require('./src/helpers/authMiddleWares')
const authRoutes = require('./src/routes/authRoutes')
const userRoutes = require('./src/routes/userRoutes')
const adminRoutes = require('./src/routes/adminRoutes')


const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// en dummy route för att kontrollera om servern körs
app.use('/healthz', (req, res) => res.status(200).json({ 'server status': 'healthy' }))

// slutpunkterna för autentisering
app.use('/auth', authRoutes)

// AuthMiddleware Se till att användaren har giltig
// referenser innan du kommer åt slutpunkterna nedan
app.use(AuthMiddleware)

// UserAuthMiddleware Se till att användaren existerade tidigare
// anropar användarroutes
app.use('/user', UserAuthMiddleware, userRoutes)

// AdminAuthMiddleware Se till att användaren finns och
// har administratörsbehörighet innan du anropar adminRoutes
app.use('/admin', AdminAuthMiddleware, adminRoutes)

// lyssnar på servern och väntar
// databasanslutningar
app.listen(process.env.PORT || 5001, async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
      
      return console.log('server ansluten')
    } catch (error) {
      console.error('fel vid anslutning till databasen', error)
    }
  }) 
