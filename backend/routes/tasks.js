const express = require('express')
const {
    createTask, 
    getTasks,
    getTask,
    deleteTask, 
    updateTask
} = require('../controllers/taskController')
const requireAuth = require('../middleware/requireAuth')



const router=express.Router()

//require auth for all workout routes
router.use(requireAuth)

router.get('/', getTasks)

router.get('/:id',getTask)

router.post('/', createTask)

router.delete('/:id', deleteTask)

router.patch('/:id', updateTask)

module.exports=router 
