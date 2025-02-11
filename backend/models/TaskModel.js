const mongoose = require('mongoose')

const Schema = mongoose.Schema
const taskSchema = new Schema({

    title: {
        type: String, 
        required:  true
    },
    description: {
        type: String, 
        required: true
    },
    priority: {
        type: Number,
        required: true,
        min: 1, 
        max: 10
    },
    deadline: {
        type: Date,
        required: true 
    },
    user_id:{
        type: String,
        required: true
    }
} ,{timestamps: true})

module.exports = mongoose.model('Task', taskSchema)

//taskSchema.find()
