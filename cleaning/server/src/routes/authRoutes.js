const express = require('express')
// denna hjälpfunktion skulle förklaras i filerna
const {signToken} = require('../helpers/token')
const {hashPassword, comparePassword} = require('../helpers/bcrypt')
const {User} = require('../helpers/schema')


// routerfunktionen skapar en grupp av ruttobjekt som skickas till huvudappen
// rutter i den här gruppen skulle förlänga vägen för routern i huvudappen
// dvs '/register' skulle vara '/auth/register' eftersom den här routern är registrerad som
// '/auth' i huvudappen
const router = express.Router()

// Registreringsväg
router.post('/register', async (req, res) => {
   // hämta de förväntade fälten från app request
    let {fullName, email, password, phoneNumber, address} = req.body

    // det är viktigt att serialisera e-postmeddelandet innan du sparar till databasen
    email = email.trim().toLowerCase()
    try {
        // hitta om en användare med den e-postadressen finns i databasen
        const user = await User.findOne({ email }).lean()
        // om de gör det skulle vi returnera ett fel eftersom det inte är vettigt att
         // har 2 användare med samma e-postadress
        if(user){
            return res.status(400).json({message: 'email has been registered'})
        }
        // vi måste hasha användarlösenordet innan vi sparar till databasen
         // normal säkerhetspraxis
        let hashedPassword = await hashPassword(password)
        // instansierar en ny användare som ska sparas / skapas
        const thisUser = new User({ // User är användarmodellen för databasen
            fullName,
            email,
            hashedPassword,
            phoneNumber,
            address,
            isAdmin: false,
            dateCreated: Date.now()
        })
        // spara användare,
        await thisUser.save()
        res.json({})

    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
})
// Registrerings Route
router.post('/login', async (req, res) => {
    // hämta de förväntade fälten från appförfrågan
    let {email, password} = req.body
    // det är viktigt att serialisera e-postmeddelandet innan du sparar till databasen
    email = email.trim().toLowerCase()
    try {
        // hitta om en användare med den e-postadressen om den finns i databasen
        const user = await User.findOne({ email }).select('+hashedPassword').lean()
        // om det inte finns någon användare kan vi inte logga in returfel
        if(!user){
            return res.status(400).json({message: 'e-post finns inte'})
        }
        // om vi har ett användarlösenord jämför lösenordet med hashedPassword sparat i databasen
        const isValidPassword = await  comparePassword(password, user.hashedPassword)
        // om lösenordet är felaktigt returnerar felet
        if(!isValidPassword){
            return res.status(400).json({message: 'Ogiltiga uppgifter'})
        }
        // om lösenordet är korrekt, skapa autentiseringsuppgifter för att verifiera denna användare
        const token = signToken(user._id)
       // skicka inloggningsuppgifter till användaren
        res.json({token})

    } catch (error) {
        res.status(500).json({message: 'Serverfel'})
    }
})

module.exports = router
