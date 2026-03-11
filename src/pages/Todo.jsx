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
  background-color: var(--color-bg-main);
  min-height: 100vh;
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 2rem;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: nowrap;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const SelectWrapper = styled.div`
  width: 25rem;
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
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: var(--color-grey-0);
  padding: 30px;
  border-radius: var(--border-radius-lg);
  width: 90%;
  max-width: 500px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-lg);
  position: relative;

  h2 {
    margin-bottom: 2rem;
    color: var(--color-grey-900);
    font-size: 2.4rem;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2.8rem;
  cursor: pointer;
  position: absolute;
  top: 1.5rem;
  right: 2rem;
  color: var(--color-grey-400);
  transition: color 0.2s;

  &:hover {
    color: var(--color-grey-900);
  }
`;

const TodoWrapper = styled.div`
  margin-top: 40px;
  width: 100%;
`;

const Message = styled.h2`
  font-size: 2rem;
  color: var(--color-grey-500);
  text-align: center;
  margin-top: 40px;
  padding: 30px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-md);
`;

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'var(--glass-bg)',
    borderColor: 'var(--glass-border)',
    color: 'var(--color-grey-900)',
    '&:hover': {
      borderColor: 'var(--color-brand-600)',
    },
    boxShadow: state.isFocused ? '0 0 0 1px var(--color-brand-600)' : 'none',
    borderRadius: 'var(--border-radius-sm)',
    fontSize: '1.4rem'
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'var(--color-grey-0)',
    border: '1px solid var(--glass-border)',
    boxShadow: 'var(--shadow-md)',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected 
      ? 'var(--color-brand-600)' 
      : state.isFocused 
        ? 'var(--color-bg-accent)' 
        : 'transparent',
    color: state.isSelected ? 'white' : 'var(--color-grey-900)',
    '&:active': {
      backgroundColor: 'var(--color-brand-700)',
    }
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'var(--color-grey-900)',
  })
};

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
            variant="contained"
            size="large"
            startIcon={<AddCircleOutlineIcon />}
            onClick={openModal}
            sx={{ borderRadius: '8px', textTransform: 'none', px: 3 }}
          >
            Add List
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<EditIcon />}
            onClick={handleEditList}
            sx={{ borderRadius: '8px', textTransform: 'none', px: 3, color: 'var(--color-grey-600)', borderColor: 'var(--glass-border)' }}
          >
            Edit
          </Button>
        </ButtonWrapper>

        <SelectWrapper>
          <Select
            closeMenuOnSelect={true}
            components={animatedComponents}
            options={userList}
            defaultValue={userList[0]}
            onChange={handleChange}
            styles={customSelectStyles}
            placeholder="Select Todo List..."
          />
        </SelectWrapper>
      </Row>

      <TodoWrapper>
        {userList.length > 0 ? (
          listId !== null ?
            <TodoItemComponent userTodo={userTodo} listId={listId} setUserTodo={setUserTodo} />
            :
            <Message>Select a list from the menu to start tracking tasks.</Message>
        ) : (
          <Message>No Todo lists yet. Start by creating one!</Message>
        )}
      </TodoWrapper>

      {isModalOpen && (
        <ModalOverlay onClick={closeModal}>
          <ModalContainer onClick={e => e.stopPropagation()}>
            <CloseButton onClick={closeModal}>&times;</CloseButton>
            <h2>Create New List</h2>
            <input
              type="text"
              placeholder="List Name (e.g. Shopping, Work)"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px', 
                marginBottom: '20px', 
                background: 'var(--color-bg-accent)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                color: 'var(--color-grey-900)',
                fontSize: '1.6rem'
              }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={addNewList}
              sx={{ borderRadius: '8px', py: 1.5, fontSize: '1.4rem' }}
            >
              Start List
            </Button>
          </ModalContainer>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Todo;
