const mongoose = require('mongoose');

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/googlebooks', {
  useNewUrlParser: true,
  useFindAndModify: false
}).catch(error => console.log("mongoose connect error: ", error))

module.exports = mongoose.connection;
