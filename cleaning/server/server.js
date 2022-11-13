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

// a dummy route to check if the server is running
app.use('/healthz', (req, res) => res.status(200).json({ 'server status': 'healthy' }))


// the endpoints for authentication
app.use('/auth', authRoutes)
// The AuthMiddleware Ensure the user has valid
// credentials before accessing the endpoints below
app.use(AuthMiddleware)
// The UserAuthMiddleware Ensure the user exist before
// calling the userRoutes
app.use('/user', UserAuthMiddleware, userRoutes)
// The AdminAuthMiddleware Ensure the user exist & 
// has admin priviledge before calling the adminRoutes
app.use('/admin', AdminAuthMiddleware, adminRoutes)

// listening to the server & awaiting
// database connections
app.listen(process.env.PORT || 5001, async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
      
      return console.log('server connected')
    } catch (error) {
      console.error('error connecting to DB', error)
    }
  }) 
