const {User} = require('../helpers/schema')

const getUsers =  async (req, res) => {
    try {
        const users = await User.where({isAdmin: false}).sort({dateCreated:-1}).lean()
        return res.json(users)
    } catch (error) {
       return  res.status(500).json({message: 'Server Fel'})
    }
}

module.exports = {getUsers}