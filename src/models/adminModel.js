const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema(
{
      fName: {
        type: String,
        required: true,
        trim : true
      },
      lName: {
        type: String,
        required: true,
        trim : true
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim : true
      },
      password : {
        type: String,
        required: true,
        unique: true,
        trim : true
      },
      phone: {
        type: String,
        required: true,
        unique: true,
        trim : true
      },

    },{timestamps: true}

);


module.exports = mongoose.model('admin', adminSchema)