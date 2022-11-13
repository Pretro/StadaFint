const express = require('express')
// denna hjälpfunktion skulle förklaras i filerna
const {Service, User} = require('../helpers/schema')
const {serviceStatus} = require('../helpers/constants')
const {createCleaner, getCleaners, updateCleaner} = require ('../controllers/cleaners')
const {getUsers} = require('../controllers/user')
const router = express.Router()

// routerfunktionen skapar en grupp av ruttobjekt som skickas till huvudappen
// routes i den här gruppen skulle förlänga vägen för routern i huvudappen
// dvs '/users' skulle vara '/admin/users' eftersom den här routern är registrerad som
// '/admin' i huvudappen

// admin får listan över alla användare och returnerar resultatet
router.get('/users', getUsers)
// admin får listan över alla begärda tjänster och returresultat
router.get('/services', async (req, res) => {
    try {
        const service = await Service.find({}).sort({dateCreated:-1}).populate('customer').populate('cleaner')
        res.json(service)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Server Fel'})
    }
})

// admin ta bort en användare med hans id, dvs :userId & returnera listan över de återstående användarna
router.delete('/user/:userId', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId)
        getUsers(req, res)
    } catch (error) {
        res.status(500).json({message: 'Server Fel'})
    }
})
// admin raderar en tjänst med hans id i.s :service Id och returnerar listan över de återstående tjänsterna
router.delete('/service/:serviceId', async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.serviceId)
        const services = await Service.find({}).populate('customer').populate('cleaner')
        res.json(services)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Server Fel'})
    }
})

// admin uppdatera en användare med hans id, dvs :userId & returnera den nya listan med användare
router.put('/user/:userId', async (req, res) => {
    // hämta de förväntade fälten från appförfrågan
    let {fullName, email, phoneNumber, address} = req.body
    // det är viktigt att serialisera e-postmeddelandet innan du sparar till databasen
    email = email.trim().toLowerCase()
    try {
        // hitta & uppdatera
        await User.findByIdAndUpdate(req.params.userId, {fullName, email, phoneNumber, address})
        getUsers(req, res)
    } catch (error) {
        if(error?.codeName ==='DuplicateKey'){
            return res.status(400).json({message: 'Användare med denna e-postadress finns'})
        }
        res.status(500).json({message: 'Server Fel'})
    }
})
// admin uppdatera en tjänst med hans id i.s :service ID och returnera den nya listan med tjänster
router.put('/service/:serviceId', async (req, res) => {
    try {
        // extrahera tjänsten från req
        const {status} = req.body
        // se till att en giltig tjänst efterfrågas, därför returnerar felet
        if(!status || !serviceStatus.includes(status)){
            return res.status(400).json({message: 'ogiltig servicestatus'})
        }
        await Service.findByIdAndUpdate(req.params.serviceId, {status})
        const service = await Service.find({}).populate('customer')
        res.json(service)
    } catch (error) {
        res.status(500).json({message: 'Server Fel'})
    }
})

router.post('/cleaner', createCleaner)
router.get('/cleaners', getCleaners)
router.put('/cleaner/:cleanerId', updateCleaner)

module.exports = router
