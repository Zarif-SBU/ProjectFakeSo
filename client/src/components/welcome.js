import React from 'react';
import axios from 'axios';

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state={login: false, register: false, userName: "", email:"", password:"", passwordVerification:"", userLogin:"", userPassword:"", errorMessage: ""};
        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleReturn = this.handleReturn.bind(this);
        this.handleReturnRegister=this.handleReturnRegister.bind(this);
        this.handleGuest=this.handleGuest.bind(this);
        this.handleLogOut=this.handleLogOut.bind(this);
    }

    handleReturnRegister = async () => {
        let dataStuff = {
          userName: this.state.userName,
          email: this.state.email,
          passwordHash: this.state.password,
        };
        if(!(this.state.email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))){
            this.setState({ errorMessage: 'Email must be in example@example.example format' });
            return;
        }
        if (this.state.password.toLowerCase().includes(this.state.userName.toLowerCase())) {
            this.setState({ errorMessage: 'Password cannot include username' });
          return;
        }
        if (this.state.password.toLowerCase().includes(this.state.email.toLowerCase().split('@')[0])) {
            this.setState({ errorMessage: 'Password cannot include email' });
          return;
        }
        if (this.state.password !== this.state.passwordVerification) {
            this.setState({ errorMessage: 'Password does not match' });
          return;
        }
        try {
          const response = await axios.post('http://localhost:8000/register', dataStuff);
          if (response.status === 201) {
            this.handleLogin();
          }
        } catch (error) {
          if (error.response && error.response.status === 409) {
            this.setState({ errorMessage: 'User with this email already exists' });
          } else {
            this.setState({ errorMessage: 'Error registering user' });
          }
          console.error('Error registering: ', error.message);
        }
      }

    handleReturn = async() => {
        let dataStuff = {
            email: this.state.userLogin,
            passwordHash: this.state.userPassword
         }
         try {
            const response = await axios.post('http://localhost:8000/login', dataStuff, { withCredentials: true });
            console.log(response.data);
            if(response.status === 200) {
                // this.setState({login: false});
                // this.props.loginFunc();
                console.log("We have reached logged in phase");
            }
            
        } catch(error) {
            if (error.response && error.response.status === 401) {
                this.setState({ errorMessage: 'User with this email does not exist' });
            }
            if (error.response && error.response.status === 402) {
                this.setState({ errorMessage: 'Password is incorrect' });
            }
            console.error('Error logging in: ', error.message);
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

    handleLogOut = async() =>{
        try {
            await axios.post('http://localhost:8000/logout', { withCredentials: true });
            console.log('Logging Out');
          } catch (error) {
            console.error('Error posting data:', error);
          }
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
                    <h3>Email:</h3>
                    <input id = "userLogin" name="userLogin" type="text" onChange={this.handleChange} value={this.state.userLogin}></input>
                    <h3>Password:</h3>
                    <input id = "userPassword" name="userPassword" type="text" onChange={this.handleChange} value={this.state.userPassword}></input>
                    <p id="titleError" className="errorAll">{this.state.errorMessage}</p>
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
                    <p id="titleError" className="errorAll">{this.state.errorMessage}</p>
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
                    <button id = "testLogOut" onClick={this.handleLogOut}> SIGN OUT</button>
                </div>
            </div>
        );
    }


}
