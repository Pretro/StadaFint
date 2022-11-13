const express = require('express')
// this helper function would be explained in the files
const {signToken} = require('../helpers/token')
const {hashPassword, comparePassword} = require('../helpers/bcrypt')
const {User} = require('../helpers/schema')


// router function creates a group of route object that is passed to the main app
// routes  in this group would extend the path of the router in the main app
// i.e '/register' would be '/auth/register' bcoz this router is register as
// '/auth' in the main app
const router = express.Router()

// Registeration route
router.post('/register', async (req, res) => {
    // obtain the expected fields from the app request
    let {fullName, email, password, phoneNumber, address} = req.body

    // it is essential to serialize the email before saving to the database
    email = email.trim().toLowerCase()
    try {
        // find if a user with that email exist in the database
        const user = await User.findOne({ email }).lean()
        // if they do, we would return an error because it doesn't make sense to
        // have 2 users with the same email
        if(user){
            return res.status(400).json({message: 'email has been registered'})
        }
        // we need to hash the user password before saving to database
        // normal security practise
        let hashedPassword = await hashPassword(password)
        // instantiating a new user to be saved / created
        const thisUser = new User({ // User is the user model of the database
            fullName,
            email,
            hashedPassword,
            phoneNumber,
            address,
            isAdmin: false,
            dateCreated: Date.now()
        })
        // saving user, 
        await thisUser.save()
        res.json({})

    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
})
// Registeration route
router.post('/login', async (req, res) => {
    // obtain the expected fields from the app request
    let {email, password} = req.body
    // it is essential to serialize the email before saving to the database
    email = email.trim().toLowerCase()
    try {
        // find if a user with that email exist in the database
        const user = await User.findOne({ email }).select('+hashedPassword').lean()
        // if no use, then we can't login return error
        if(!user){
            return res.status(400).json({message: 'email does not exist'})
        }
        // if we have a user compare password to the hashedPassword saved on the database
        const isValidPassword = await  comparePassword(password, user.hashedPassword)
        // if password is incorrenct return error
        if(!isValidPassword){
            return res.status(400).json({message: 'Invalid Credentials'})
        }
        // if password is correct, create a crendtials to verify this user 
        const token = signToken(user._id)
        // send credentials to user
        res.json({token})

    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
})

module.exports = router
