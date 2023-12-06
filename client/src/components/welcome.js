import React from 'react';
import axios from 'axios';

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state={login: false, register: false, userName: "", email:"", password:"", passwordVerification:"", userLogin:"", userPassword:""};
        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleReturn = this.handleReturn.bind(this);
        this.handleReturnRegister=this.handleReturnRegister.bind(this);
        this.handleGuest=this.handleGuest.bind(this);
    }

    handleReturnRegister = async() => {
        let dataStuff = {
           userName: this.state.userName,
           email: this.state.email,
           passwordHash: this.state.password
        };
        if(this.state.password !== this.state.passwordVerification) {
            alert("password does not match");
            return;
        }
        try {
            const response = await axios.post('http://localhost:8000/register', dataStuff);
            console.log(response.data);
            this.handleLogin();
        } catch(error) {
            console.error('Error registering: ', error.message);
        }

        //Goes to Login once register is complete
    }

    handleReturn = async() => {
        let dataStuff = {
            userName: this.state.userLogin,
            passwordHash: this.state.userPassword
         }
         try {
            const response = await axios.post('http://localhost:8000/login', dataStuff);
            console.log(response.data);
            if(response.data.error==="Invalid credentials"){
                throw "login err";
            }

            //Goes to the home page once login is complete (MIGHT HAVE IT PASS IN SOME INFORMATION TO BE STORED IN A STATE TO BE UTILIZE)
            this.props.loginFunc();
            
        } catch(err) {
            console.err('Error logging in: ', err.message);
        }
        
    }
    
    handleChange = async(event) => {
        const { name, value } = event.target;
        this.setState({[name]: value});
    }

    handleLogin = async() => {
        this.setState({login: true, register: false});
        
    }

    handleRegister = async() => {
        this.setState({login: false, register: true});
    }

    handleGuest = async() => {
        //do the setup for setting a guest session then u would want to go activate my handleGoToLogin function to then go back

        //Return back home once it is done
        this.props.loginFunc();
    }

    render() {
        //if the login is true, it means u clicked the button
        if(this.state.login===true){
            return(
                <div id = "loginContainer">
                    <h2>Please enter your user information</h2>
                    <h3>Username:</h3>
                    <input id = "userLogin" name="userLogin" type="text" onChange={this.handleChange} value={this.state.userLogin}></input>
                    <h3>Password:</h3>
                    <input id = "userPassword" name="userPassword" type="text" onChange={this.handleChange} value={this.state.userPassword}></input>
                    <br></br>
                    <br></br>
                    <button type="submit" id="loginSubmit" onClick={this.handleReturn}>Login</button>
                </div>);
        }

        if(this.state.register===true){
            return(
                <div id = "loginContainer">
                    <h2>Please enter registration information</h2>
                    <h3>Email:</h3>
                    <input id = "email" name="email" type="text" onChange={this.handleChange} value={this.state.email}></input>
                    <h3>Username:</h3>
                    <input id = "userName" name="userName" type="text" onChange={this.handleChange} value={this.state.userName}></input>
                    <h3>Password:</h3>
                    <input id = "password" name="password" type="text" onChange={this.handleChange} value={this.state.password}></input>
                    <h3>Retype password:</h3>
                    <input id = "passwordVerification" name="passwordVerification" type="text" onChange={this.handleChange} value={this.state.passwordVerification}></input>
                    <br></br>
                    <br></br>
                    <button type="submit" id="loginSubmit" onClick={this.handleReturnRegister}>Register</button>
                </div>);
        }
        return (
            <div>
                <h2>Welcome to Fake FakeStackOverflow, please select one of the options below</h2>
                <div id = "welcomeForm">
                    <button id = "login" onClick = {this.handleLogin}>LOGIN</button>
                    <button id = "register" onClick = {this.handleRegister}>REGISTER</button>
                    <button id = "guest" onClick ={this.handleGuest}>SIGN IN AS GUEST</button>
                </div>
            </div>
        );
    }


}
