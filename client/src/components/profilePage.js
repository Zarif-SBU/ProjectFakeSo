import React from 'react';
import axios from 'axios';

export default class ProfilePage extends React.Component{
    constructor(props){
        super(props);
        this.state={username: "", email: this.props.userEmail, admin: false};
    }

    render(){
        //if user is admin, then they got a whole diff page set up
        if(this.state.admin){
            return(
                <div>

                </div>
            );
        }
        //if user is not admin, then
        if(this.state.admin=== false){
            return(
                <div>
                    <h2>Username</h2>
                    <p> {this.props.userN}</p>
    
                    <br></br>
    
                    <h2>Email</h2>
                    <p>{this.state.email}</p>
    
                    <br></br>
                    <h2>Reputiation: 0</h2>
                    <br></br>
                    <h2>Member Since</h2>
                    <p>{this.props.userD}</p>
    
                    <br></br>
                    <h2>Questions Asked</h2>
    
                    <h2>Tags Posted</h2>
                    <h2>Answers Posted</h2>
    
                </div>
            );
        }
        
    }
}