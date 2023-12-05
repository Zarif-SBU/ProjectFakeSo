import React from 'react';
import axios from 'axios';


export default class AnswerForm extends React.Component {
    constructor(props){
        super(props);
        this.state={ansName:"", ansText:""};
       
        this.handleChange=this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }


    handleChange(event){
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }


    async postAnswer(newname, newtext, newdate) {
        let answerData = {
          text: newtext,
          ans_by: newname,
          ans_date_time: newdate,
        };
     
        try {
          const answerId = await axios.post('http://localhost:8000/createAnswer', answerData);
          console.log("Answer Created and Posted Successfully");
          return answerId.data;
           
        } catch (err) {
          console.error('Error posting data:', err);
        }
      }


   
      async addAnswer(answerDetails) {
        try {
          const res = await axios.post(`http://localhost:8000/questions/${this.props.questionIt._id}/add-answer`, answerDetails);
          console.log("Answer incremented successfully:", res.data);
        } catch (err) {
          console.error("Error incrementing answer count:", err);
        }
      }


    async handleSubmit(event){
        try{
            if(this.state.ansName.trim() === ""){
                throw "useAnswer_E";
            }
            if(this.state.ansText.trim() === ""){
                throw "textAnswer_E";
            }


            console.log(this.state.ansName);
            console.log(this.state.ansText);
            //Now, add it to the answer database and then push it to the question schema
            let tempDate = new Date();
            let newAnswerId = await this.postAnswer(this.state.ansName, this.state.ansText, tempDate);
            console.log(newAnswerId);

            //adds it to the question scehma now
            await this.addAnswer(newAnswerId);
            // this.props.questionIt.answers.push(newAnswerId);

            //then return back to the question itself
            this.props.returnFunc(this.props.questionIt);
           
        }
        catch(err){
            if(err==="useAnswer_E")
              {
                this.setState({nameAnsError:"Input is empty", textAnsError:""});
              }
            else if(err==="textAnswer_E")
              {
                this.setState({nameAnsError:"", textAnsError:"Input is empty"});
              }


        }
    }


    render() {
        return (
            <div id="askQst_inner">
                <h3>Username*</h3>
                <input className="qstBox" id="ansUser" name="ansName" type="text" onChange={this.handleChange} value={this.state.ansName}></input>


                <p id="userAnsErr" className="errorAll">{this.state.nameAnsError}</p>


                <br></br>
                <h3>Answer Text*</h3>
                <textarea id="ansText" size="30" rows="10" cols="40" name="ansText" onChange={this.handleChange} value={this.state.ansText}></textarea>


                <p id="textAnsErr" className="errorAll">{this.state.textAnsError}</p>


                <br></br>
                <br></br>
                <button type="submit" id="ansSubmit" onClick={this.handleSubmit}>Post Answer</button>
            </div>


        );
    }
}

