const express = require('express')
// Denna hjälpfunktion skulle förklaras i filerna
const {Service} = require('../helpers/schema')
const {serviceTypes} = require('../helpers/constants')
const { getCleaners } = require('../controllers/cleaners')
const router = express.Router()

// routerfunktionen skapar en grupp av ruttobjekt som skickas till huvudappen
// Routern i den här gruppen skulle förlänga vägen för routern i huvudappen
// dvs '/' skulle vara '/user/' & '/services' skulle vara '/user/services' eftersom denna router är registrerad som
// '/user' i huvudappen

/**
  * req.userInfo som används under denna rutt görs tillgänglig av
  * UserAuthMiddleware från huvudappen
  */

// Användars Request är info.
router.get('/', async (req, res) => res.json(req.userInfo))

// Användars Request är alla tjänster han har efterfrågat, för närvarande inte i bruk
// kan vara en trevlig funktion i senare iterationer av appen
router.get('/services', async (req, res) => {
    // extrahera userId från userInfo
    const userId = req.userInfo._id
    try {
        // hitta alla tjänster som denna begäran
        const userServices = await Service.find({customer: userId}).sort({dateCreated:-1}).select('-customer').populate('cleaner').lean()
        // returnera resultat
        res.json(userServices)
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
})
router.get('/cleaners', getCleaners)

// använderen begära en ny tjänst/service
router.post('/service', async (req, res) => {
     // extract the service from the req
    const {serviceType, cleanerId, serviceTime} = req.body
    // se till att en giltig serviceType efterfrågas, därför returnerar felet
    if(!serviceType || !serviceTypes.includes(serviceType)){
        return res.status(400).json({message: 'invalide service type'})
    }
    if(!cleanerId || !serviceTime){
        return res.status(400).json({message: 'missing required. parameter'})
    }
    // extrahera userId från userInfo
    const userId = req.userInfo._id
    // instansierar en ny användare som ska sparas / skapas
    const thisService = new Service({
        customer: userId,
        cleaner: cleanerId,
        serviceTime: new Date(serviceTime),
        type: serviceType,
        status: 'pending',
        dateCreated: Date.now()
        
    })
    try {
        // spara tjänst
        await thisService.save()
        // returnera en lista över alla tjänster inklusive den nya tjänsten
        const userServices = await Service.find({customer: userId}).select('-customerId').lean()
        // skicka lista till användare
        res.json(userServices)
        
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
})

module.exports = router
