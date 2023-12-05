import React from 'react';
import Banner from "./banner.js";
import NavigationBar from './navigationBar';
import axios from 'axios';


export default class QuestionForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { valueTitle: "", valueText: "", valueTag: "", valueName: "" };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });

    }


    async postNewUser(newtitle, newtext, newtag, newname, newdate) {
        const tagId = [];
        const answerArray = [];

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
            views: 0
        };

        try {
            await axios.post('http://localhost:8000/createQuestion', dataStuff);
            console.log('Question created successfully');
        } catch (error) {
            console.error('Error posting data:', error);
        }

    }

    handleSubmit(event) {
        let tagArray = this.state.valueTag.split(" ");

        //TITLE ERRORS
        try {

            if (this.state.valueTitle.trim() === "") {
                throw "titleempty";
            }


            if (this.state.valueTitle.length > 100) {
                throw "titlelength";
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

            if (this.state.valueName.trim() === "") {
                throw "userempty";
            }


            //if no errors, reset all errors and return back home and all
            this.setState({ titleError: "", userError: "", textError: "", tagError: "" });
            let newDate = new Date();
            //Now, it will store it into model.js
            this.postNewUser(this.state.valueTitle, this.state.valueText, tagArray, this.state.valueName, newDate);

            //PASS EVERYTHING INTO MODEL.JS
            this.props.returnFunc();
        }
        catch (err) {
            if (err === "titleempty") {
                this.setState({ titleError: "*Input is empty*", userError: "", textError: "", tagError: "" });

            }
            else if (err === "titlelength") {
                this.setState({ titleError: "*Input is longer than 100 characters*", userError: "", textError: "", tagError: "" })
            }
            else if (err === "textempty") {
                this.setState({ textError: "*Input is empty*", userError: "", titleError: "", tagError: "" });
            }
            else if (err === "tagerror") {
                this.setState({ tagError: "*Tags should be less than 10 characters*", userError: "", textError: "", titleError: "" });
            }
            else if (err === "tagMany") {
                this.setState({ tagError: "*There can only be 5 tags*", userError: "", textError: "", titleError: "" });
            }
            else if (err === "userempty") {
                this.setState({ userError: "User is empty", titleError: "", textError: "", tagError: "" });
            }

        }

    }




    render() {
        return (
            <div id="askQst_inner">
                <h3>Question Title*</h3>
                <p><i>Limit title to 100 characters or less</i></p>
                <input className="qstBox" name="valueTitle" type="text" id="qstTitles" onChange={this.handleChange} value={this.state.valueTitle}></input>


                <p id="titleError" className="errorAll">{this.state.titleError}</p>


                <h3>Question Text*</h3>
                <p> <i>Add details</i></p>
                <textarea className="qstBox" name="valueText" type="text" size="30" id="qstTexts" rows="8" cols="40" onChange={this.handleChange} value={this.state.valueText}></textarea>


                <p id="textError" className="errorAll">{this.state.textError}</p>


                <h3>Tags*</h3>
                <p><i>Add keywords separated by whitespace</i></p>
                <input className="qstBox" name="valueTag" type="text" id="qstTags" onChange={this.handleChange} value={this.state.valueTag}></input>


                <p id="tagError" className="errorAll">{this.state.tagError}</p>


                <h3>Username*</h3>
                <input className="qstBox" name="valueName" type="text" id="qstUsers" onChange={this.handleChange} value={this.state.valueName}></input>
                <br></br>
                <p id="userError" className="errorAll">{this.state.userError}</p>


                <button id="qstSubmit" onClick={this.handleSubmit}>Post Question</button>


            </div>
        );

    }
}