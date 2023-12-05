export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state={login: false, register: false, userName: "", email:"", password:"", passwordVerification:""};
    }

    handleChange(event){
        const { name, value } = event.target;
        this.setState({[name]: value});
    }

    handleLogin() {
        this.setState({login: true, register: false});
    }

    handleRegister() {
        this.setState({login: false, register: true});
    }

    handleGuest(){
        //do the setup for setting a guest session then u would want to go activate my handleGoToLogin function to then go back

    }

    render() {
        //if the login is true, it means u clicked the button
        if(login===true){
            return(
                <div id = "loginContainer">
                    <h2>Please enter your user information</h2>
                    <h3>Username:</h3>
                    <input id = "userName" name="userName" type="text" onChange={this.handleChange} value={this.state.userName}></input>
                    <h3>Password:</h3>
                    <input id = "password" name="password" type="text" onChange={this.handleChange} value={this.state.password}></input>
                </div>);
        }

        if(register===true){
            return(
                <div id = "loginContainer">
                    <h2>Please enter registration information</h2>
                    <h3>Username:</h3>
                    <input id = "email" name="email" type="text" onChange={this.handleChange} value={this.state.userName}></input>
                    <h3>Username:</h3>
                    <input id = "userName" name="userName" type="text" onChange={this.handleChange} value={this.state.userName}></input>
                    <h3>Password:</h3>
                    <input id = "password" name="password" type="text" onChange={this.handleChange} value={this.state.password}></input>
                    <h3>Retype password:</h3>
                    <input id = "passwordVerification" name="passwordVerification" type="text" onChange={this.handleChange} value={this.state.passwordVerification}></input>
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
