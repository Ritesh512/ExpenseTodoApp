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

const animatedComponents = makeAnimated();

// Styled components
const Container = styled.div`
  padding: 20px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ButtonWrapper = styled.div`
  display:flex;
  gap:20px;
  ${'' /* width: 20%; */}
`;

const SelectWrapper = styled.div`
  width: 20%;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
  max-width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  z-index: 1001;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  position: absolute;
  top: 37%;
  left: 61%;
`;

const TodoWrapper = styled.div`
  margin-top: 50px;
  width: 100%;
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

        if (!response.ok) {
          if (response.status === 404) {
            const errorData = await response.json();
            if (errorData.message === "No todo lists found for the user") {
              console.log("No todo lists found for the user");
              setUserList([]);
              return;
            }
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const options = data.lists.map(list => ({
          label: list.listName,
          value: list._id,
        }));
        setUserList(options);
        console.log(options, options[0]._id);
        handleChange(options[0]);
        navigate(`/todo/${options[0].value}`);
      } catch (error) {
        console.error("Error fetching todo lists:", error);
      }
    };

    fetchTodoLists();
  }, []);



  const handleChange = async (selectedOption) => {
    setListId(selectedOption.value);
    console.log('Selected option:', selectedOption);
    const response = await fetch(`http://localhost:3000/api/users/todo/lists/getList/${selectedOption.value}`, {
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        const errorData = await response.json();
        if (errorData.message === "Todo list not found for the user") {
          console.log("Todo list not found for the user");
          // setUserTodo([]);
          return;
        }
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    // console.log(JSON.stringify(data));
    setUserTodo(data.tasks);
    if (listId) {
      navigate(`/todo/${listId}`);
    }
    // You can perform other actions here
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
      console.log('New list added:', result);
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
    <div>
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
            <Button style={{ fontSize: '15px' }} 
              onClick={handleEditList}
              variant="contained"
              size="large"
              startIcon={<EditIcon />}>
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
          {
            userList.length > 0 ?
              <TodoItemComponent userTodo={userTodo} listId={listId} setUserTodo={setUserTodo} />
              :
              <h1>No List Added</h1>
          }
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
    </div>
  )
};

export default Todo
