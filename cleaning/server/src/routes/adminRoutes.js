const express = require('express')
// this helper function would be explained in the files
const {Service, User} = require('../helpers/schema')
const {serviceStatus} = require('../helpers/constants')
const {createCleaner, getCleaners, updateCleaner} = require ('../controllers/cleaner')
const {getUsers} = require('../controllers/user')
const router = express.Router()

// router function creates a group of route object that is passed to the main app
// routes  in this group would extend the path of the router in the main app
// i.e '/users' would be '/admin/users' bcoz this router is register as
// '/admin' in the main app

// admin gets the list of all users & return result
router.get('/users', getUsers)
// admin gets the list of all requested services  & return result
router.get('/services', async (req, res) => {
    try {
        const service = await Service.find({}).sort({dateCreated:-1}).populate('customer').populate('cleaner')
        res.json(service)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Server Error'})
    }
})

// admin delete a user by his id i.e :userId & return the list of the remaining users
router.delete('/user/:userId', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId)
        getUsers(req, res)
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
})
// admin delete a service by his id i.e :serviceId & return the list of the remaining services
router.delete('/service/:serviceId', async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.serviceId)
        const services = await Service.find({}).populate('customer').populate('cleaner')
        res.json(services)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Server Error'})
    }
})

// admin update a user by his id i.e :userId & return the new list of users
router.put('/user/:userId', async (req, res) => {
    // obtain the expected fields from the app request
    let {fullName, email, phoneNumber, address} = req.body
    // it is essential to serialize the email before saving to the database
    email = email.trim().toLowerCase()
    try {
        // find & update
        await User.findByIdAndUpdate(req.params.userId, {fullName, email, phoneNumber, address})
        getUsers(req, res)
    } catch (error) {
        if(error?.codeName ==='DuplicateKey'){
            return res.status(400).json({message: 'User with this email exist'})
        }
        res.status(500).json({message: 'Server Error'})
    }
})
// admin update a service by his id i.e :serviceId & return the new list of services
router.put('/service/:serviceId', async (req, res) => {
    try {
        // extract the service from the req
        const {status} = req.body
        // ensure a valid service is requested hence return error
        if(!status || !serviceStatus.includes(status)){
            return res.status(400).json({message: 'invalide service status'})
        }
        await Service.findByIdAndUpdate(req.params.serviceId, {status})
        const service = await Service.find({}).populate('customer')
        res.json(service)
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
})

router.post('/cleaner', createCleaner)
router.get('/cleaners', getCleaners)
router.put('/cleaner/:cleanerId', updateCleaner)

module.exports = router
