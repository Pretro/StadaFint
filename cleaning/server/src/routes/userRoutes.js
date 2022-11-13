const express = require('express')
// this helper function would be explained in the files
const {Service} = require('../helpers/schema')
const {serviceTypes} = require('../helpers/constants')
const { getCleaners } = require('../controllers/cleaner')
const router = express.Router()

// router function creates a group of route object that is passed to the main app
// routes  in this group would extend the path of the router in the main app
// i.e '/' would be '/user/' & '/services' would be '/user/services' bcoz this router is register as
// '/user' in the main app

/**
 * req.userInfo used throughout this routes is made available by
 * the UserAuthMiddleware from the main app
 */

// User Request is info, 
router.get('/', async (req, res) => res.json(req.userInfo))

// User Request all the services he has requested, currently not in use out
// can be a nice feature un later iterations of the app
router.get('/services', async (req, res) => {
    // extract userId from the userInfo
    const userId = req.userInfo._id
    try {
        // find all seervices that this requested
        const userServices = await Service.find({customer: userId}).sort({dateCreated:-1}).select('-customer').populate('cleaner').lean()
        // return result
        res.json(userServices)
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
})
router.get('/cleaners', getCleaners)

// use request a new service
router.post('/service', async (req, res) => {
    // extract the service from the req
    const {serviceType, cleanerId, serviceTime} = req.body
    // ensure a valid serviceType is requested hence return error
    if(!serviceType || !serviceTypes.includes(serviceType)){
        return res.status(400).json({message: 'invalide service type'})
    }
    if(!cleanerId || !serviceTime){
        return res.status(400).json({message: 'missing required. parameter'})
    }
    // extract userId from the userInfo
    const userId = req.userInfo._id
    // instantiating a new user to be saved / created
    const thisService = new Service({
        customer: userId,
        cleaner: cleanerId,
        serviceTime: new Date(serviceTime),
        type: serviceType,
        status: 'pending',
        dateCreated: Date.now()
        
    })
    try {
        // save service
        await thisService.save()
        // return a list of all services including the new service
        const userServices = await Service.find({customer: userId}).select('-customerId').lean()
        // send list to user
        res.json(userServices)
        
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
})

module.exports = router
