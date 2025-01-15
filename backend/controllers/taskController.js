const Task = require('../models/TaskModel')
const mongoose = require('mongoose')

const getTasks = async (req, res) => {
    const user_id = req.user._id;
    const { search, sort } = req.query; 

    const query = { user_id };
    if (search) {
        query.title = { $regex: search, $options: 'i' };  
    }

    const sortOptions = { createdAt: -1 }; // Default sort
    if (sort === 'priority-desc') {
        sortOptions.priority = -1; 
    } else if (sort === 'deadline-asc') {
        sortOptions.deadline = 1; 
    } else if (sort === 'deadline-desc') {
        sortOptions.deadline = -1; 
    }

    const tasks = await Task.find(query).sort(sortOptions);

    res.status(200).json(tasks);
};


//get single task
const getTask=async(req,res)=>{
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such task'})
    }

    const task=await Task.findById(id)

    if (!task) {
        return res.status(404).json({error: 'No such task'})
    }

    res.status(200).json(task)
}



//create new task
const createTask = async (req, res) =>{
    console.log("Request body:", req.body);
    const{title, priority, description, deadline}=req.body

    let emptyFields=[]

    if(!title){
        emptyFields.push('title')
    }
    if (!priority || priority<1 || priority>10){
        emptyFields.push('priority')
    }
    if(!description){
        emptyFields.push('description')
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
        const task= await Task.create({title, priority, description, deadline, user_id})
        res.status(200).json(task)
    } catch(error){
        console.error("Error saving task:", error);
        res.status(400).json({error: error.message})
    }
}

//delete a task
const deleteTask = async(req,res)=>{
    const{id}=req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such task'})
    }

    const task=await Task.findOneAndDelete({_id: id})

    if (!task) {
        return res.status(404).json({error: 'No such task'})
    }
    res.status(200).json(task)
}


//update a task
const updateTask = async (req, res) => {
    const { id } = req.params;
    

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such task' });
    }
    const { priority } = req.body;
    if (priority && (priority < 1 || priority > 10)) {
        return res.status(400).json({ error: 'Priority must be between 1 and 10.' });
    }

    // Filter out user_id from req.body to avoid overwriting it
    const updateFields = { ...req.body };
    delete updateFields.user_id;  // Prevent updating the user_id field

    const task = await Task.findOneAndUpdate({ _id: id }, updateFields, { new: true });

    if (!task) {
        return res.status(404).json({ error: 'No such task' });
    }

    res.status(200).json(task);
};




module.exports={
    getTasks,
    getTask,
    createTask,
    deleteTask,
    updateTask
}
