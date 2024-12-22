import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import styled from 'styled-components';
import TodoItemComponent from './TodoItem';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import checkAuth from '../api/checkauth';

const animatedComponents = makeAnimated();

// Styled components with media queries for responsiveness
const Container = styled.div`
  padding: 20px;
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 20px;
  width: 100%; /* Ensure full width for both small and large screens */
  flex-wrap: nowrap; /* Prevent wrapping for both small and large screens */

  @media (max-width: 768px) {
    gap: 10px; /* Adjust gap for smaller screens */
  }
`;

const StyledButton = styled(Button)`
  font-size: 15px; /* Default font size for larger screens */

  @media (max-width: 768px) {
    font-size: 12px; /* Smaller font size for mobile screens */
  }
`;

const SelectWrapper = styled.div`
  width: 20%;
  @media (max-width: 768px) {
    width: 100%;
    margin-top: 10px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  width: 400px;
  position: relative;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  z-index: 1001;

  h2 {
    margin-bottom: 10px;
  }

  @media (max-width: 768px) {
    width: 80%;
    padding: 20px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 20px;
`;

const TodoWrapper = styled.div`
  margin-top: 50px;
  width: 100%;
  @media (max-width: 768px) {
    margin-top: 20px;
  }
`;

const Message = styled.h1`
  font-size: 24px;
  color: #333;
  text-align: center;
  margin-top: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Todo = () => {
  const [listName, setListName] = useState('');
  const [listId, setListId] = useState(null);
  const [userList, setUserList] = useState([]);
  const [userTodo, setUserTodo] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodoLists = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users/todo/lists", {
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
          const errorData = await response.json();
          if (response.status === 404 && errorData.message === "No todo lists found for the user") {
            setUserList([]);
            return;
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const options = data.lists.map(list => ({
          label: list.listName,
          value: list._id,
        }));
        setUserList(options);
        // handleChange(options[0]);
        // navigate(`/todo/${options[0].value}`);
      } catch (error) {
        console.error("Error fetching todo lists:", error);
      }
    };

    fetchTodoLists();
  }, []);

  const handleChange = async (selectedOption) => {
    setListId(selectedOption.value);
    try {
      const response = await fetch(`http://localhost:3000/api/users/todo/lists/getList/${selectedOption.value}`, {
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
        const errorData = await response.json();
        if (response.status === 404 && errorData.message === "Todo list not found for the user") {
          return;
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setUserTodo(data.tasks);
      navigate(`/todo/${selectedOption.value}`);
    } catch (error) {
      console.error("Error fetching todo list:", error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const addNewList = async () => {
    if (!listName) {
      toast.warning("Please enter a list name.", {
        position: "top-right",
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/users/todo/lists/addList', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({ listName }),
      });

      const isAuthValid = await checkAuth(response);
      if (!isAuthValid) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to add the list');
      }

      const result = await response.json();
      setUserList(prevLists => [...prevLists, { label: result.list.listName, value: result.list._id }]);
      closeModal();
      setListName('');
      toast.success("New list added!", {
        position: "top-right",
      });
    } catch (error) {
      toast.warning("Error adding new list!", {
        position: "top-right",
      });
      console.error('Error adding new list:', error);
    }
  };

  const handleEditList = () => {
    navigate('/todo/edit-list-name', { state: { userList } });
  };

  return (
    <Container>
      <Row>
        <ButtonWrapper>
          <Button
            style={{ fontSize: '15px' }}
            variant="contained"
            size="large"
            startIcon={<AddCircleOutlineIcon />}
            onClick={openModal}
          >
            Add New List
          </Button>
          <Button
            style={{ fontSize: '15px' }}
            variant="contained"
            size="large"
            startIcon={<EditIcon />}
            onClick={handleEditList}
          >
            Edit List
          </Button>
        </ButtonWrapper>

        <SelectWrapper>
          <Select
            closeMenuOnSelect={true}
            components={animatedComponents}
            options={userList}
            defaultValue={userList[0]}
            onChange={handleChange}
          />
        </SelectWrapper>
      </Row>

      <TodoWrapper>
        {userList.length > 0 ? (
          listId !== null ?
            <TodoItemComponent userTodo={userTodo} listId={listId} setUserTodo={setUserTodo} />
            :
            <Message>Please select a list to view tasks</Message>
        ) : (
          <Message>No List Added</Message>
        )}
      </TodoWrapper>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContainer>
            <CloseButton onClick={closeModal}>&times;</CloseButton>
            <h2>Add New List</h2>
            <input
              type="text"
              placeholder="List Name"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            />
            <Button
              variant="contained"
              onClick={addNewList}
              sx={{ fontSize: '12px', marginTop: '10px' }}
            >
              Save List
            </Button>
          </ModalContainer>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Todo;
