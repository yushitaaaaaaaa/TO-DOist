import {useState} from 'react'
import {useTasksContext} from '../hooks/useTasksContext'
import { useAuthContext } from '../hooks/useAuthContext'

const TaskForm = ()=>{
    const {dispatch} = useTasksContext()
    const {user} = useAuthContext()

    const[title, setTitle] = useState('')
    const[priority, setPriority] = useState('')
    const[description, setDescription] = useState('')
    const[error, setError] = useState('')
    const[deadline, setDeadline] = useState("");
    const[emptyFields, setEmptyFields] = useState([])

    const handleSubmit = async (e) =>{
        e.preventDefault()

        if (!user){
            setError('You must be logged in')
            return
        }

       
        const task = { title, description, priority, deadline };

        const response= await fetch('/api/tasks', {
            method: 'POST',
            body: JSON.stringify(task),
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        
        const json = await response.json()

        if(!response.ok){
            setError(json.error)
            setEmptyFields(json.emptyFields)
        }

        if(response.ok){
            setEmptyFields([])
            setError(null)
            setTitle('')
            setLoad('')
            setReps('')
            setDeadline('');

            dispatch({type: 'CREATE_TASK', paypriority:json})
        }
    }

    return(
        <div className="create">
  <h3>Enter a Task</h3>
  <form onSubmit={handleSubmit}>
    <label>Task Name:</label>
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      required
      placeholder="Enter Task Name"
    />

    <label>Task Description:</label>
    <input
      type="text"
      value={description}
      onChange={(e) => setReps(e.target.value)}
      required
      placeholder="Enter Task Description"
    />

    <label>Task Priority (1-10):</label>
    <input
      type="number"
      value={priority}
      onChange={(e) => setLoad(e.target.value)}
      min="1"
      max="10"
      required
      placeholder="Enter Task Priority"
    />

    <label>Deadline:</label>
    <input
      type="date"
      value={deadline}
      onChange={(e) => setDeadline(e.target.value)}
      required
    />

    <button type="submit">Add Task</button>
  </form>
</div>
    )
}

export default TaskForm;
