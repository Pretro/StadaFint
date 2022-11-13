const { Cleaner } = require("../helpers/schema")


// Den här funktionen hjälper mig att kontrollera att värdena som skickas till
// servern är korrekta och skulle inte förstöra databasen
// Jag gjorde det till en separat funktion eftersom jag skulle behöva det på mer än ett ställe.
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
        dateCreated: Date.now(),
        services: {
          windowCleaning: Boolean(windowCleaning),
          premiumCleaning: Boolean(premiumCleaning),
          standardCleaning: Boolean(standardCleaning),
        }
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