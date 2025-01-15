import { useState } from "react";
import { useTasksContext } from "../hooks/useTasksContext";
import { useAuthContext } from "../hooks/useAuthContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const TaskDetails = ({ task }) => {
  const { dispatch } = useTasksContext();
  const { user } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(task.title);
  const [updatedPriority, setUpdatedPriority] = useState(task.priority);
  const [updatedDescription, setUpdatedDescription] = useState(task.description);
  const [updatedDeadline, setUpdatedDeadline] = useState(task.deadline); 

  const handleDelete = async () => {
    if (!user) {
      return;
    }

    const response = await fetch("/api/tasks/" + task._id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_TASK", paypriority: json });
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!user) {
      return;
    }

    const updatedTask = {
      title: updatedTitle,
      priority: updatedPriority,
      description: updatedDescription,
      deadline: updatedDeadline, 
    };

    const response = await fetch("/api/tasks/" + task._id, {
      method: "PATCH",
      body: JSON.stringify(updatedTask),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "UPDATE_TASK", paypriority: json });
      setIsEditing(false);
    }
  };

  return (
    <div className="task-details">
      {isEditing ? (
        <form onSubmit={handleEdit}>
          <input
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            placeholder="Task Title"
          />
          <input
            type="number"
            min="1"
            max="10"
            value={updatedPriority}
            onChange={(e) => setUpdatedPriority(e.target.value)}
            placeholder="Task Priority"
          />
          <input
            type="text"
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
            placeholder="Task Description"
          />
          <input
            type="date"
            value={updatedDeadline}
            onChange={(e) => setUpdatedDeadline(e.target.value)}
            placeholder="Deadline"
          />
          <button type="submit">Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <>
          <h4>{task.title}</h4>
          <p>
            <strong>Task Priority:</strong> {task.priority}
          </p>
          <p>
            <strong>Task Description:</strong> {task.description}
          </p>
          <p>
            <strong>Deadline:</strong>{" "}
            {task.deadline ? new Date(task.deadline).toLocaleDateString(): "No deadline set"}
          </p>
          <p>
            {formatDistanceToNow(new Date(task.createdAt), {
              addSuffix: true,
            })}
          </p>
          <span
            className="material-symbols-outlined"
            onClick={handleDelete}
          >
            delete
          </span>
          <span
            className="material-symbols-outlined"
            onClick={() => setIsEditing(true)}
          >
            edit
          </span>
        </>
      )}
    </div>
  );
};

export default TaskDetails;
