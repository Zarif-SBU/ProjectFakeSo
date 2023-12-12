import React from 'react'
import axios from 'axios'

export default class NewTag extends React.Component{
    constructor(props){
        super(props);
        this.state={ansText:""};

        this.handleChange=this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    async handleSubmit(event){
        let tagArray = this.state.ansText.split(" ");
        try{
            if (tagArray.length > 5) {
                throw "tagMany";
            }
        }
        catch(error){
            if(err==="tagMany")
              {
                this.setState({textAnsError:"*There can only be 5 tags*"});
              }
        }
    }

    render(){
        return(
            <div id="askQst_inner">
            <br></br>
            <h3>Tag*</h3>
            <textarea id="ansText" size="30" rows="10" cols="40" name="ansText" onChange={this.handleChange} value={this.state.ansText}></textarea>


            <p id="textAnsErr" className="errorAll">{this.state.textAnsError}</p>


            <br></br>
            <br></br>
            <button type="submit" id="ansSubmit" onClick={this.handleSubmit}>Post Editted Answer</button>
        </div>
        );
    }
}