import React, { useState,useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;
`;

const FormContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 350px;
`;

const Header = styled.h2`
  background-color: #3498db;
  color: #fff;
  margin: 0;
  padding: 20px;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const FormInput = styled.input`
  margin-bottom: 15px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  background-color: #3498db;
  color: #fff;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #2980b9;
  }
`;

const CreateAccountLink = styled.p`
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
  margin-bottom: 20px;

  a {
    color: #3498db;
    text-decoration: underline;

    &:hover {
      color: #2980b9;
    }
  }
`;

const SelectRole = styled.select`
  margin-bottom: 15px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login clicked!");
    let result = await fetch("http://localhost:3000/api/users/login",{
            method:"post",
            body:JSON.stringify({email,password}),
            headers:{'Content-Type': 'application/json'}
        });
        result = await result.json();
        console.warn(result);
        if(result.token){
            localStorage.setItem("user",JSON.stringify(result.loginUser));
            localStorage.setItem("token",JSON.stringify(result.token));
            toast.success("Login Successfully", {
              position: "top-right",
            });
            if(result.loginUser.role==="admin"){
              console.log(result.loginUser.role);
              navigate("/")
            }else{
              navigate("/");
            }
        }else{
          toast.warning(result.error, {
            position: "top-Right"
          });
        }
    
  };

  return (
    <CenteredContainer>
      <FormContainer>
        <Header>Login</Header>
        <LoginForm onSubmit={handleSubmit}>
          <FormInput
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <SelectRole value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            {/* <option value="admin">Club Admin</option> */}
          </SelectRole>
          <SubmitButton type="submit">Login</SubmitButton>
        </LoginForm>
        <CreateAccountLink>
          Don't have an account? <Link to="/signup">Create Account</Link>
        </CreateAccountLink>
      </FormContainer>
    </CenteredContainer>
  );
};

export default Login;
