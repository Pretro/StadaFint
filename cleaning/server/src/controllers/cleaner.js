const { Cleaner } = require("../helpers/schema")


// This function helps me check that the values being sent to the
// server are correct and would not messup the database
// I made it a seperate function because I would be needing it in more than one place
const sanitazeCleanerInput = (cleaner) => {
    const {userName, phoneNumber, isAvailable} = cleaner
    const {windowCleaning, premiumCleaning, standardCleaning} = cleaner?.services || {}

    if(!userName || ! phoneNumber){
        return null
    }
    return {
        userName,
        phoneNumber,
        isAvailable: Boolean(isAvailable),
        services: {
          windowCleaning: Boolean(windowCleaning),
          premiumCleaning: Boolean(premiumCleaning),
          standardCleaning: Boolean(standardCleaning),
        }
    }
}

const body = {
    userName: String,
    phoneNumber: String,
    isAvailable: Boolean,
    services: {
        windowCleaning: Boolean,
        premiumCleaning: Boolean,
        standardCleaning: Boolean,
    }
}

const createCleaner = async (req, res) => {

    const payload = sanitazeCleanerInput(req.body)
    if(!payload){
        return res.status(400).json({message: 'missing required input'})
    }
    try {
        const newCleaner = new Cleaner({...payload, dateCreated: Date.now()})
        await newCleaner.save()
        res.json({})
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
} 
const getCleaners = async (req, res) => {

    const availablility = req.userInfo.isAdmin ? {} : {isAvailable: true}
    try {
        const cleaners = await Cleaner.where(availablility).sort({dateCreated:-1}).select('+services')
        res.json(cleaners)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Server Error'})
    }
} 
const updateCleaner = async (req, res) => {
    const payload = sanitazeCleanerInput(req.body)
    if(!payload){
        return res.status(400).json({message: 'missing required input'})
    }
    try {
        await Cleaner.findByIdAndUpdate(req.params.cleanerId, payload)
        res.json({})
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
}

module.exports = {createCleaner, getCleaners, updateCleaner}