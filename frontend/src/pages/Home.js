import { useState, useEffect } from "react";
import { useTasksContext } from "../hooks/useTasksContext";
import { useAuthContext } from "../hooks/useAuthContext";

//components
import TaskDetails from "../components/TaskDetails";
import TaskForm from "../components/TaskForm";

const Home = () => {
  const { tasks, dispatch } = useTasksContext();
  const { user } = useAuthContext();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [sortedTasks, setSortedTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch(`/api/tasks?search=${search}&sort=${sort}`, 
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_TASKS", payload: json });
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [dispatch, user, search]); 

  useEffect(() => {
    if (tasks) {
      let sorted = [...tasks];
      if (sort === "newest") {
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sort === "oldest") {
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else if (sort === "low_blood_sugar") {
        sorted.sort((a, b) => a.load - b.load);
      } else if (sort === "high_blood_sugar") {
        sorted.sort((a, b) => b.load - a.load);
      } else if (sort === "earliest_deadline") { // New sort option
        sorted.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      } else if (sort === "latest_deadline") { // New sort option
        sorted.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
      }
      setSortedTasks(sorted);
    }
  }, [sort, tasks]);
  
  return (
    <div className="home">
      <div className="search">
        <input
          type="text"
          placeholder="Search Tasks"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="sort-container"> 
        <select value={sort} onChange={(e) => setSort(e.target.value)} placeholder="Sort Tasks">
          <option value="newest">Newest to Oldest</option>
          <option value="oldest">Oldest to Newest</option>
          <option value="low_blood_sugar">Low Priority</option>
          <option value="high_blood_sugar">High Priority</option>
          <option value="earliest_deadline">Earliest Deadline</option> 
          <option value="latest_deadline">Latest Deadline</option> 
        </select>
      </div>
      </div>
      
      <div className="tasks">
        {sortedTasks.map((task) => (
          <TaskDetails key={task._id} task={task} />
        ))}
      </div>
      <TaskForm />
    </div>
  );
};
export default Home;




