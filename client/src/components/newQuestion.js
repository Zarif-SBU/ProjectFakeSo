import React from 'react';
import axios from 'axios';


export default class NewQuestion extends React.Component{
    constructor(props){
        super(props);
        //FILL UP THE STATES WITH THE PREVIOUS QUESTION PARAMETER STUFF
        this.state = { valueTitle: this.props.questionIt.title, valueText: this.props.questionIt.text, valueTag: "", valueSummary: this.props.questionIt.summary, valueEmail: ""};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete= this.handleDelete.bind(this);
    }

    async handleDelete(){
        //does a post request to delete the question from the database
        try{
            await axios.post(`http://localhost:8000/deleteQuestion/${this.props.questionIt._id}`);
            //can reload if it does not work
            window.location.reload();
            console.log("heyo question removed");
        }
        catch(error){
            console.error('Error deleting data:', error);
        }

    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    async editNewUser(newtitle, newtext, newtag, newname, newdate, newSummary, quesID) {
        const tagId = [];
        const answerArray = [];
        console.log("bruher: ", newtag);

        //if there was something inside newtag
        if (newtag.length > 0) {
            for (let i = 0; i < newtag.length; i++) {
                const tagTemp = { name: newtag[i].toLowerCase() };
                var change=false;

                for (let j = 0; j < this.props.tag.length; j++) {
                    //if the tag already exists in the tags array, push the id of the existing tag onto the array
                    console.log(this.props.tag[j].name);
                    if (tagTemp.name === (this.props.tag[j].name).toLowerCase()) {
                        console.log("WE FOUND THE SAME ONE")
                        tagId.push(this.props.tag[j]._id);
                        change=true;
                    }
                }
                //if none of them matched, create a new tag and then post it
                if(change===false){
                    let tagStore = await axios.post("http://localhost:8000/createTag", tagTemp);
                    console.log("SADLY, WE HAVE TO CREATE ONE"+tagStore.data.tagId);
                    // tagId.push(tagStore.data._id);
                    tagId.push(tagStore.data.tagId);
                }
            }
        }

        let dataStuff = {
            title: newtitle,
            text: newtext,
            tags: tagId,
            answers: answerArray,
            asked_by: newname,
            ask_date_time: newdate,
            views: 0,
            summary: newSummary,
            userEmail: newname
        };

        try {
            //pass the question ID and all the dataStuff to the function
            await axios.post(`http://localhost:8000/editQuestion/${quesID}`, dataStuff);
            window.location.reload();
            console.log('Question updated successfully');
        } catch (error) {
            console.error('Error editting data:', error);
        }
    }

    handleSubmit(event) {
        let tagArray = this.state.valueTag.split(" ");

        //TITLE ERRORS
        try {
            if (this.state.valueTitle.trim() === "") {
                throw "titleempty";
            }


            if (this.state.valueTitle.length > 50) {
                throw "titlelength";
            }

            if (this.state.valueSummary.length > 140) {
                throw "Summarylength";
            }

            if (this.state.valueText.trim() === "") {
                throw "textempty";
            }


            if (tagArray.length > 5) {
                throw "tagMany";
            }

            for (let i = 0; i < tagArray.length; i++) {
                if (tagArray[i].length > 10) {
                    throw "tagerror";
                }
            }

            //if no errors, reset all errors and return back home and all
            this.setState({ titleError: "", userError: "", textError: "", tagError: "", summaryError: "" });
            let newDate = new Date();
            // console.log("Bruher: ", this.props.questionIt._id);
            //Now, it will store it into model.js (QUESTIONIT is now stored as the question id)
            this.editNewUser(this.state.valueTitle, this.state.valueText, tagArray, this.props.userEmail, newDate, this.state.valueSummary, this.props.questionIt._id);
            //PASS EVERYTHING INTO MODEL.JS

            
        }


        catch (err) {
            if (err === "titleempty") {
                this.setState({ titleError: "*Input is empty*", userError: "", textError: "", tagError: "", summaryError:"" });

            }
            else if (err === "titlelength") {
                this.setState({ titleError: "*Input is longer than 50 characters*", userError: "", textError: "", tagError: "", summaryError:"" })
            }
            else if (err === "Summarylength") {
                this.setState({ summaryError: "Summary is longer than 140 characters*",titleError: "", userError: "", textError: "", tagError: "" })
            }
            else if (err === "textempty") {
                this.setState({ textError: "*Input is empty*", userError: "", titleError: "", tagError: "", summaryError:"" });
            }
            else if (err === "tagerror") {
                this.setState({ tagError: "*Tags should be less than 10 characters*", userError: "", textError: "", titleError: "", summaryError:"" });
            }
            else if (err === "tagMany") {
                this.setState({ tagError: "*There can only be 5 tags*", userError: "", textError: "", titleError: "", summaryError:"" });
            }
            

        }

    }


    render(){
        console.log("Stufferererer: ", this.props.questionIt);
        return (
            <div id="askQst_inner">
                <h3>Question Title*</h3>
                <p><i>Limit title to 50 characters or less</i></p>
                <input className="qstBox" name="valueTitle" type="text" id="qstTitles" onChange={this.handleChange} value={this.state.valueTitle}></input>


                <p id="titleError" className="errorAll">{this.state.titleError}</p>


                <h3>Question Summary*</h3>
                <p><i>Limit title to 140 characters or less</i></p>
                <input className="qstBox" name="valueSummary" type="text" id="qstSummaries" onChange={this.handleChange} value={this.state.valueSummary}></input>


                <p id="summaryError" className="errorAll">{this.state.summaryError}</p>


                <h3>Question Text*</h3>
                <p> <i>Add details</i></p>
                <textarea className="qstBox" name="valueText" type="text" size="30" id="qstTexts" rows="8" cols="40" onChange={this.handleChange} value={this.state.valueText}></textarea>


                <p id="textError" className="errorAll">{this.state.textError}</p>


                <h3>Tags*</h3>
                <p><i>Add keywords separated by whitespace</i></p>
                <input className="qstBox" name="valueTag" type="text" id="qstTags" onChange={this.handleChange} value={this.state.valueTag}></input>


                <p id="tagError" className="errorAll">{this.state.tagError}</p>

                <button id="qstSubmit" onClick={this.handleSubmit}>Post New Editted Question</button>
                <br></br>
                <button id="qstSubmitTwo" onClick={this.handleDelete}>Delete Question</button>


            </div>
        );
    }

}