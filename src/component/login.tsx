import { Card,CardHeader,TextField, CardContent, CardActions, Button } from "@mui/material"
import styled from 'styled-components';
import React, { useEffect,useState, ChangeEvent } from "react";
import { useNavigate }  from "react-router-dom"
import { gql, useMutation, useLazyQuery  } from '@apollo/client';

    type UserDTO = {
        username: String
    }

    /**
     * Mutation
     */
     const CREATE_USER = gql`
     
     mutation CreateUser($input: UserDTO!) {
        createUser(input: $input) {
             username
        }
      }
   `;
   const USER_QUERY = gql`
    query GetUser($username: String!) {
        getUser( username : $username ) {
           username
           favorites
          }
      }
   `;

   

    /**
     * Styles
     */

     const StyledCard =  styled(Card)`
     marginTop: 10px;
     background: papayawhip;
     `
     const StyledForm = styled.form`
     margin: 0 auto;
     display: flex;
     flex-direction: column;
     background: white;
     padding: 20px;
     margin-top: 30px;
     `
     const StyledDiv = styled.div`
     background-color: #637DBA;
     text-align: center;
     width: 100%; height: 100%;
     position: absolute;
     `
     const StyledCardContent = styled(CardContent)``
 
     const StyledCardActions = styled(CardActions)``
     const StyledButton = styled(Button)`
     background-color: black;
     `
     const StyledHeader = styled(CardHeader) `
     `

const Login = () => {
    const[username,setUserName] = useState("")
    const navigate = useNavigate()
    const [createUser] = useMutation(CREATE_USER,{onCompleted: (data)=> {
        console.log("created user",data)
        localStorage.setItem("user",data.createUser.username)
        navigate('/home')
    }});
    const [getUser] = useLazyQuery (USER_QUERY, {
        onCompleted: (data)=> {
        console.log(data)
        //user exisits
        if(data!= null){
            localStorage.setItem("user",data.getUser.username)
            navigate('/home')
        } else {
            //if not create user
            console.log("username",username)
            createUser(
                {
                 variables: { input: {
                    username : username
                    } 
                } 
            });
        }
    }, onError: (error)=> {
        console.log(error)
    }});
  

    /**
     * Hooks
     */

    /** 
     * Call Backs and Other stuff
     */
    const handleUserNameChange = (e:ChangeEvent<HTMLInputElement| HTMLTextAreaElement>) => {
        console.log(e)
        setUserName(e.target.value)
    } 

    const onKeyPress = () => {

    }

 

    const handleLogin = () => {
        // e.preventDefault();
        // const user = { username, password };
        // // send the username and password to the server
        // const response = await axios.post(
        //   "http://blogservice.herokuapp.com/api/login",
        //   user
        // );
        // set the state of the user
       // setUser(response.data)
        // store the user in localStorage
        // localStorage.setItem('user', response.data)
        // console.log(response.data)

      //  navigate('/home')
      
      getUser({
          variables: {
              username: username
          }
      })  

      
    }

    return( <StyledDiv>
  

        <StyledForm>
        <StyledCard>
        <StyledHeader  title="Login to Rick and Morty Info" />
            <StyledCardContent>
                <TextField
                fullWidth
                id="username"
                type="email"
                placeholder="Username"
                label="Username"
                onChange={(e)=> handleUserNameChange(e)}
                margin="normal"
                onKeyPress={onKeyPress}
            ></TextField>
            </StyledCardContent>
            <StyledCardActions>
                <StyledButton
                variant="contained"
                size="large"
                onClick={handleLogin}
                sx={{ float: "right" }}
                disabled={false}>
                    Login
                </StyledButton>
            </StyledCardActions>
           
        </StyledCard>
        </StyledForm>
    </StyledDiv>)
    
}

export default Login