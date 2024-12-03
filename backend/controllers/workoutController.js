const Workout = require('../models/WorkoutModel')
const mongoose = require('mongoose')

const getWorkouts = async (req, res) => {
    const user_id = req.user._id;
    const { search, sort } = req.query; 

    const query = { user_id };
    if (search) {
        query.title = { $regex: search, $options: 'i' };  
    }

    const sortOptions = { createdAt: -1 }; // Default sort
    if (sort === 'load-desc') {
        sortOptions.load = -1; 
    } else if (sort === 'deadline-asc') {
        sortOptions.deadline = 1; 
    } else if (sort === 'deadline-desc') {
        sortOptions.deadline = -1; 
    }

    const workouts = await Workout.find(query).sort(sortOptions);

    res.status(200).json(workouts);
};


//get single workout
const getWorkout=async(req,res)=>{
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such task'})
    }

    const workout=await Workout.findById(id)

    if (!workout) {
        return res.status(404).json({error: 'No such task'})
    }

    res.status(200).json(workout)
}



//create new workout
const createWorkout = async (req, res) =>{
    console.log("Request body:", req.body);
    const{title, load, reps, deadline}=req.body

    let emptyFields=[]

    if(!title){
        emptyFields.push('title')
    }
    if (!load || load<1 || load>10){
        emptyFields.push('load')
    }
    if(!reps){
        emptyFields.push('reps')
    }
    if(!deadline){
        emptyFields.push('deadline')
    }
    if(emptyFields.length>0){
        return res.status(400).json({error: 'Please fill in all the fields', emptyFields})
    }

    //add doc to db
    try{
        const user_id=req.user._id
        const workout= await Workout.create({title, load, reps, deadline, user_id})
        res.status(200).json(workout)
    } catch(error){
        console.error("Error saving workout:", error);
        res.status(400).json({error: error.message})
    }
}

//delete a workout
const deleteWorkout = async(req,res)=>{
    const{id}=req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such task'})
    }

    const workout=await Workout.findOneAndDelete({_id: id})

    if (!workout) {
        return res.status(404).json({error: 'No such task'})
    }
    res.status(200).json(workout)
}


//update a workout
const updateWorkout = async (req, res) => {
    const { id } = req.params;
    

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such task' });
    }
    const { load } = req.body;
    if (load && (load < 1 || load > 10)) {
        return res.status(400).json({ error: 'Priority must be between 1 and 10.' });
    }

    // Filter out user_id from req.body to avoid overwriting it
    const updateFields = { ...req.body };
    delete updateFields.user_id;  // Prevent updating the user_id field

    const workout = await Workout.findOneAndUpdate({ _id: id }, updateFields, { new: true });

    if (!workout) {
        return res.status(404).json({ error: 'No such workout' });
    }

    res.status(200).json(workout);
};




module.exports={
    getWorkouts,
    getWorkout,
    createWorkout,
    deleteWorkout,
    updateWorkout
}