import React, { useState } from 'react';
import styled from 'styled-components';
import { FaClock, FaEdit } from 'react-icons/fa';
import { FcClock } from "react-icons/fc";
import { MdEditNote } from "react-icons/md";
import { Button, TextField } from '@mui/material';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import checkAuth from '../api/checkauth';
import { useNavigate } from 'react-router-dom';

// Styled components
const TodoContainer = styled.div`
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  padding-bottom: 20px;
`;

const TodoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Checkbox = styled.input`
  margin-right: 20px;
  transform: scale(1.5);
`;

const Title = styled.div`
  flex-grow: 1;
  color: black;
`;

const Reminder = styled.div`
  display: flex;
  align-items: center;
  color: black;
  margin-right: 30px;
  fontSize:20px;
`;

const EditIcon = styled.div`
  cursor: pointer;
  color: black;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 30px; 
  cursor: pointer;

`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;


const TodoItemComponent = ({ userTodo, listId, setUserTodo }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [duration, setDuration] = useState(null);
  const [reminder, setReminder] = useState('');
  const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setTaskName('');
    setDuration('');
    setReminder('');
  }

  const createTask = async () => {
    if (taskName && duration && listId) {
      try {
        const reminderInMinutes = reminder
          ? reminder
          : null;

        const response = await fetch(`http://localhost:3000/api/users/todo/lists/addTask/${listId}`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
          },
          body: JSON.stringify({
            taskName,
            duration,
            reminder: reminderInMinutes,
          }),
        });

        const isAuthValid = await checkAuth(response);
        if (!isAuthValid) {
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to create the task');
        }

        const result = await response.json();
        console.log(JSON.stringify(result));
        setUserTodo((prevTodos) => [...prevTodos, {
          _id: result.task._id,
          taskName: result.task.taskName,
          duration: result.task.duration, // Ensure the duration is a number (in minutes)
          reminder: result.task.reminder || null,
        }]);

        toast.success("Task created successfully!", {
          position: "top-right",
        });

        // Clear the form fields after successful creation
        setTaskName('');
        setDuration('');
        setReminder('');
        closeModal();
      } catch (error) {
        toast.warning("Error creating task:!", {
          position: "top-right",
        });
      }
    } else {
      if (!listId) {
        toast.warning("Please select a list!", {
          position: "top-right",
        });
      }
      else {
        toast.warning("Please fill in the required fields.!", {
          position: "top-right",
        });
      }

    }
  };


  const calculateTimeLeft = (targetDate) => {
    if (typeof targetDate === 'string' || targetDate instanceof String) {
      targetDate = new Date(targetDate);
    }
    const now = new Date(); // Get the current date and time
    const timeDiffInMilliseconds = targetDate - now; // Difference in milliseconds

    if (timeDiffInMilliseconds <= 0) {
      return "0d 0h 0m"; // If the target date has already passed
    }

    // Convert milliseconds to minutes
    const timeDiffInMinutes = Math.floor(timeDiffInMilliseconds / 60000);

    // Calculate days, hours, and minutes
    const days = Math.floor(timeDiffInMinutes / (24 * 60));
    const hours = Math.floor((timeDiffInMinutes % (24 * 60)) / 60);
    const minutes = timeDiffInMinutes % 60;
    return `${days}d ${hours}h ${minutes}m`; // Return the formatted time left
  };


  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/todo/lists/${listId}/task/${taskId}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });

      const isAuthValid = await checkAuth(response);
      if (!isAuthValid) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to delete the task');
      }

      // Update the state by filtering out the deleted task
      setUserTodo((prevTodos) => prevTodos.filter((todo) => todo._id !== taskId));
      toast.success("Task deleted successfully!", {
        position: "top-right",
      });
    } catch (error) {
      toast.warning("Error deleting task!", {
        position: "top-right",
      });
    }
  };

  const handleCheckboxChange = (taskId) => {
    // Call the delete function when the checkbox is checked
    handleDeleteTask(taskId);
  };



  return (
    <TodoContainer>
      {userTodo.length > 0 ? userTodo.map((todo, index) => (
        <TodoItem key={todo._id || index}>
          <Checkbox type="checkbox" onChange={() => handleCheckboxChange(todo._id)} />
          <Title>{todo.taskName}</Title>
          <Reminder>
            <FcClock style={{ marginRight: '5px', fontSize: '24px' }} />
            {calculateTimeLeft(todo.duration)}
          </Reminder>
          {/* <EditIcon>
            <MdEditNote style={{ fontSize: '24px' }} />
          </EditIcon> */}
        </TodoItem>
      )) :
        <h1>No Task Added</h1>
      }

      <ButtonContainer>
        <Button
          variant="contained"
          size="large"
          sx={{ fontSize: '12px', marginTop: '10px' }}
          onClick={openModal}
        >
          Add New Task
        </Button>
      </ButtonContainer>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContainer>
            <CloseButton onClick={closeModal}>&times;</CloseButton>
            <h2>Add New Task</h2>
            <TextField
              label="Task Name"
              fullWidth
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              margin="normal"
              InputLabelProps={{ style: { fontSize: '15px' } }}
              InputProps={{
                style: { fontSize: '16px' },
              }}
            />
            <TextField
              label="Duration"
              type="datetime-local"
              fullWidth
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              margin="normal"
              InputLabelProps={{ shrink: true, style: { fontSize: '15px' } }}
              InputProps={{
                style: { fontSize: '16px' },
              }}
            />
            <TextField
              label="Reminder (optional)"
              type="datetime-local"
              fullWidth
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              margin="normal"
              InputLabelProps={{ shrink: true, style: { fontSize: '15px' } }}
              InputProps={{
                style: { fontSize: '16px' },
              }}
            />
            <ButtonContainer>
              <Button variant="contained" onClick={createTask}
                sx={{ fontSize: '12px', marginTop: '10px' }}>
                Save Task
              </Button>
            </ButtonContainer>
          </ModalContainer>
        </ModalOverlay>
      )}
    </TodoContainer>
  );
}


export default TodoItemComponent;