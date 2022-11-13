const mongoose = require('mongoose')

const mongoConnect = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useFindAndModify: false,
            // useCreateIndex: true
        })
      
      return console.log('server connected')
    } catch (error) {
      console.error('error connecting to DB', error)
    }
  }

module.exports = mongoConnect
