import React from 'react'
import axios from 'axios'

export default class NewTag extends React.Component{
    constructor(props){
        super(props);
        this.state={ansText:""};

        this.handleChange=this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.editNewTag=this.editNewTag.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    async editNewTag(newname, newemail, tagObj){
        let tagData={
            name: newname,
            UserEmails: [newemail]
        };

        try{
            const response= await axios.post(`http://localhost:8000/editTag/${tagObj}`, tagData);
            if(response.status === 404){
                window.alert("Cannot Delete Tag in Use");
            }
            else if (response.status === 201){
                window.alert("Tag has been editted!");
                window.location.reload();
            }
        }
        catch(error){
            console.error('Error editting data:', error);
        }
    }

    async handleSubmit(event){
        let tagArray = this.state.ansText.split(" ");
        try{
            if (tagArray.length > 5) {
                throw "tagMany";
            }
            for (let i = 0; i < tagArray.length; i++) {
                if (tagArray[i].length > 10) {
                    throw "tagerror";
                }
            }
            this.editNewTag(this.state.ansText, this.props.userEmail, this.props.tagIt._id);

        }
        catch(error){
            if(error==="tagMany")
              {
                this.setState({textAnsError:"*There can only be 5 tags*"});
              }
            if(error==="tagerror"){
                this.setState({textAnsError:"Tags cannot be of length 10 or higher"});
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