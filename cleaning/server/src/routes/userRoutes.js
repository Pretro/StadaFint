const express = require('express')
const {Service} = require('../helpers/schema')
const {serviceTypes} = require('../helpers/constants')
const { getCleaners } = require('../controllers/cleaner')
const router = express.Router()

/* Req.userInfo som används under denna rutt görs tillgänglig av
    UserAuthMiddleware från huvudappen */

// Användars Request är info.
router.get('/', async (req, res) => res.json(req.userInfo))

// Användars Request är alla tjänster som efterfrågas, för närvarande inte i bruk
router.get('/services', async (req, res) => {
    const userId = req.userInfo._id
    try {

        // Hitta följande information
        const userServices = await Service.find({customer: userId}).sort({dateCreated:-1}).select('-customer').populate('cleaner').lean()
        res.json(userServices)
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
})
router.get('/cleaners', getCleaners)
router.post('/service', async (req, res) => {
     
    // Extract the service from the req
    const {serviceType, cleanerId, serviceTime} = req.body
    
    // Veriferar om en giltig serviceTyp finns, returnerar felet
    if(!serviceType || !serviceTypes.includes(serviceType)){
        return res.status(400).json({message: 'invalide service type'})
    }

    if(!cleanerId || !serviceTime){
        return res.status(400).json({message: 'missing required. parameter'})
    }
    const userId = req.userInfo._id

    // Skapar en const som ska ha tjänst informationen
    const thisService = new Service({
        customer: userId,
        cleaner: cleanerId,
        serviceTime: new Date(serviceTime),
        type: serviceType,
        status: 'pending',
        dateCreated: Date.now()
        
    })
    try {
        await thisService.save()
        const userServices = await Service.find({customer: userId}).select('-customerId').lean()
        res.json(userServices)
        
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
})

module.exports = router
