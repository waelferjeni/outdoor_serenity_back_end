//create model of post Document
const mongoose = require('mongoose');
const circuitSchema = new mongoose.Schema({
    lieu:String,
    detail:String,
    date_debut:Date,
    date_fin:Date,
    image:String,
    agence:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})

const Circuit = mongoose.model('Circuit',circuitSchema)

module.exports = Circuit;