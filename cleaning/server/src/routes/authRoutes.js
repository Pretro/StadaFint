const express = require('express')
const {signToken} = require('../helpers/token')
const {hashPassword, comparePassword} = require('../helpers/bcrypt')
const {User} = require('../helpers/schema')
const router = express.Router()

// Registreringsväg
router.post('/register', async (req, res) => {
    let {fullName, email, password, phoneNumber, address} = req.body
    email = email.trim().toLowerCase()
    try {
        // Hitta en användare med e-postadressen som finns i databasen
        const user = await User.findOne({ email }).lean()

        // Om email finns redan med en användare, ska det returneras ett felmeddelande
        if(user){
            return res.status(400).json({message: 'Email has been registered'})
        }

        // Tilldelar en variabel till funktionen "hashPassword" om innehåller parameter "password"
        let hashedPassword = await hashPassword(password)

        // Instansierar en ny användare som ska sparas / skapas
        const thisUser = new User({ // User modellen för databasen
            fullName,
            email,
            hashedPassword,
            phoneNumber,
            address,
            isAdmin: false,
            dateCreated: Date.now()
        })

        // Sparar användaren,
        await thisUser.save()
        res.json({})

    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
})

// Registrerings Route
router.post('/login', async (req, res) => {
    let {email, password} = req.body
    email = email.trim().toLowerCase()
    try {
        const user = await User.findOne({ email }).select('+hashedPassword').lean()

        // om det inte finns någon användare får vi ett felmeddelande
        if(!user){
            return res.status(400).json({message: 'E-post finns inte'})
        }
        
        // JämNför lösenordet 
        const isValidPassword = await  comparePassword(password, user.hashedPassword)
        
        // Om lösenordet är felaktigt returneras ett felmeddelande
        if(!isValidPassword){
            return res.status(400).json({message: 'Ogiltiga uppgifter'})
        }
        
        // Om lösenordet är korrekt, skapas autentiseringsuppgifter för att verifiera användaren
        const token = signToken(user._id)
         res.json({token})

    } catch (error) {
        res.status(500).json({message: 'Serverfel'})
    }
})

module.exports = router
