import React from 'react'
import axios from 'axios'

export default class NewTag extends React.Component{
    constructor(props){
        super(props);

        this.handleChange=this.handleChange.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    render(){
        return(
            <div>

            </div>
        );
    }
}