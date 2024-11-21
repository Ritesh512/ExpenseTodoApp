import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTrashAlt } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { toast } from "react-toastify";

// Styled components
const Container = styled.div`
  max-width: 500px;
  margin: 20px auto;
  padding: 30px 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  border-radius: 8px;
  min-height: 100px; /* Minimum height to fit small content */
  max-height: 500px; /* Fixed maximum height */
  overflow-y: auto; /* Scrollable if content overflows */
`;

const Heading = styled.h2`
  top: 20px; 
  background-color: #fff; /* Match container background */
  margin: 0 0 20px; /* Remove top margin and add bottom margin */
  padding: 10px 0; /* Add padding for better spacing */
  text-align: center;
  color: #333;
`;

const ListContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-radius: 8px; /* Round the corners */
  margin-bottom: 10px; /* Gap between each list item */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Shadow between items */
  background-color: #f9f9f9; /* Light background for list items */
`;

const ListItem = styled.span`
  font-size: 16px;
  color: #333;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  font-size: 18px;
  transition: color 0.3s ease;

  &:hover {
    color: #d9534f;
  }
`;

const EditListName = () => {
  const { state } = useLocation();
  const [listNames, setListNames] = useState(state?.userList || []);
  console.log(listNames, state);

  const handleDelete = async (listId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/todo/lists/${listId}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setListNames((prevListNames) => prevListNames.filter((list) => list.value !== listId));

      const data = await response.json();
      console.log('Delete successfully!', data);
      toast.success("List Deleted successful:", {
        position: "top-right",
      });

      // Optionally, you can remove the deleted item from the UI
      // after a successful delete. You'll need to manage state.
    } catch (error) {
      toast.warning("Error deleting item!", {
        position: "top-right",
      });
      console.error('Error deleting item:', error);
    }
  };

  return (
    <>
      <Heading>Edit List Names</Heading> {/* Added heading */}
      <Container>
        {listNames.map((list, index) => (
          <ListContainer key={index}>
            <ListItem>{list.label}</ListItem>
            <DeleteButton onClick={() => handleDelete(list.value)}>
              <FaTrashAlt />
            </DeleteButton>
          </ListContainer>
        ))}
      </Container>
    </>
  );
};

export default EditListName;
