const express = require('express')
const {Service, User} = require('../helpers/schema')
const {serviceStatus} = require('../helpers/constants')
const {createCleaner, getCleaners, updateCleaner} = require ('../controllers/cleaner')
const {getUsers} = require('../controllers/user')
const router = express.Router()

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

// admin ta bort en användare med hans id, dvs :userId och returnerar listan över de återstående användarna
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

// admin uppdaterar en användare med hans id, dvs :userId och returnerar den nya listan med användare
router.put('/user/:userId', async (req, res) => {
    
        // Tilldelar variabler till body
    let {fullName, email, phoneNumber, address} = req.body
    email = email.trim().toLowerCase()
    try {
        
        // Hitta & uppdatera användaruppgifter
        await User.findByIdAndUpdate(req.params.userId, {fullName, email, phoneNumber, address})
        getUsers(req, res)
    } catch (error) {
        if(error?.codeName ==='DuplicateKey'){
            return res.status(400).json({message: 'Användare med denna e-postadress finns'})
        }
        res.status(500).json({message: 'Server Fel'})
    }
})

// admin uppdaterar en tjänst med hans id i.s :service ID och returnerar den nya listan med tjänster
router.put('/service/:serviceId', async (req, res) => {
    try {
        const {status} = req.body
        
        // se till att en giltig tjänst efterfrågas, om det inte stämmer, returneras ett felmeddelande
        if(!status || !serviceStatus.includes(status)){
            return res.status(400).json({message: 'Ogiltig servicestatus'})
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
