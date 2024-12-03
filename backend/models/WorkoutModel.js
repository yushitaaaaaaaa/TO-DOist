const mongoose = require('mongoose')

const Schema = mongoose.Schema
const workoutSchema = new Schema({

    title: {
        type: String, 
        required:  true
    },
    reps: {
        type: String, 
        required: true
    },
    load: {
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

module.exports = mongoose.model('Workout', workoutSchema)

//workoutSchema.find()