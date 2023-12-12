import React from 'react';
import axios from 'axios';

export default class NewAnswer extends React.Component{
    constructor(props){
        super(props);

        this.state={ansText:""};

        this.handleChange=this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }

    handleChange(event){
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    async editAnswer(newname, newtext, newdate, answerId){
        let answerData = {
            text: newtext,
            ans_by: newname,
            ans_date_time: newdate,
            userEmail: newname
          };
       
          try {
            const answerStuff = await axios.post(`http://localhost:8000/editAnswer/${answerId}`, answerData);

            window.location.reload();
            //this.props.returnHome();
            //this.props.goReturn=();

            console.log("Answer Created and Posted Successfully");
            return answerId.data;
             
          } catch (err) {
            console.error('Error posting data:', err);
          }

    }

    async handleSubmit(event){
        try{
            if(this.state.ansText.trim() === ""){
                throw "textAnswer_E";
            }
            //Now, add it to the answer database and then push it to the question schema
            let tempDate = new Date();
            let newAnswerId = await this.editAnswer(this.props.userEmail, this.state.ansText, tempDate, this.props.answerIt._id);
            console.log(newAnswerId);

            //adds it to the question scehma now
            // await this.addAnswer(newAnswerId);
            // this.props.questionIt.answers.push(newAnswerId);

            //then return back to the question itself
            // this.props.returnFunc(this.props.questionIt);
        }

        catch(err){
             if(err==="textAnswer_E")
              {
                this.setState({textAnsError:"Input is empty"});
              }
        }
    }

    render(){
        return (
            <div id="askQst_inner">
                <br></br>
                <h3>Answer Text*</h3>
                <textarea id="ansText" size="30" rows="10" cols="40" name="ansText" onChange={this.handleChange} value={this.state.ansText}></textarea>


                <p id="textAnsErr" className="errorAll">{this.state.textAnsError}</p>


                <br></br>
                <br></br>
                <button type="submit" id="ansSubmit" onClick={this.handleSubmit}>Post Editted Answer</button>
            </div>
        );
    }
}