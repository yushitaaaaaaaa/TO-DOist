import {createContext, useReducer} from 'react'

export const TasksContext = createContext()

export const tasksReducer = (state, action) => {
    switch (action.type){
        case 'SET_TASKS':
            return {
                tasks: action.payload.map((task) => ({
                    ...task,
                    deadline: task.deadline, // Include deadline
                  })),
            }
        case 'CREATE_TASK':
            return{
                tasks: [action.payload, ...state.tasks]
            }
        case "UPDATE_TASK":
            return {
                tasks: state.tasks.map((task) =>
                task._id === action.payload._id ? action.payload: task
                ),
            };
        case 'DELETE_TASK':
            return{
                tasks: state.tasks.filter((w)=>w._id !== action.payload._id)
            }
        default:
            return state
    }

}

export const TasksContextProvider = ({children})=> {
    const [state, dispatch]= useReducer(tasksReducer, {
        tasks: null
    })



    return (
        <TasksContext.Provider value={{...state, dispatch}}>
            {children}
        </TasksContext.Provider>
    )
}
