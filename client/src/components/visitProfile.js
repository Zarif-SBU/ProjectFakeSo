import React from 'react';
import axios from 'axios';

export default class VisitProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state={users: this.props.userSS, username: "", email: this.props.userEmail, admin: this.props.userA, answerFuncthree: null, userAList: this.props.userAList, answeredQuestions: this.props.userAQList, showAnsweredQuestions: false, showTagsPage: false,};
    }

    handleTagsButtonClick = () => {
        this.setState((prevState) => ({
            showTagsPage: !prevState.showTagsPage,
        }));
    };

    handleButtonClick = () => {
        this.setState((prevState) => ({
            showAnsweredQuestions: !prevState.showAnsweredQuestions,
        }));
    };
    render(){
        const hasTags = this.props.userTList.userTags.length > 0;
        //if user is admin, then they got a whole diff page set up
        if(this.state.admin){
            return(
                <div className="profile">
                    <h2>Admin Username: </h2>
                    <p> {this.props.userN}</p>
    
                    <br></br>
    
                    <h2>Admin Email: </h2>
                    <p>{this.state.email}</p>
    
                    <br></br>
                    <h2>Reputation: {this.props.userR}</h2>
                    <br></br>
                    <h2>Member Since: </h2>
                    <p>{this.props.userD}</p>
    
                    <br></br>
                    <h2>Questions Asked: </h2>
                    <div> <QuestionList questions={this.props.userQList}
                                        newQuestionS={this.props.newQuestion}
                                        test={this.props.test}
                    /> 
                    </div>
                    <br></br>
                    <h2>All Existing Users: </h2>
                    <div>
                        <UserList 
                            users={this.props.userSS}
                            goToUserS={this.props.goToUserS}
                        />
                    </div>

                    <h2>Tags Posted: </h2>
                        {hasTags && this.state.showTagsPage && (
                            <TagsPage tags={this.props.userTList} questions={this.props.userQList} goToTag={this.props.goToTag} />
                        )}
                        {hasTags && (
                            <button onClick={this.handleTagsButtonClick}>
                                {this.state.showTagsPage ? 'Hide Tags Page' : 'Show Tags Page'}
                            </button>
                        )}
                        {!hasTags && <p>No tags available.</p>}
                    <h2>Questions Answered: </h2>
                    {this.state.showAnsweredQuestions && (
                        <div>
                            <AnsweredQuestionList
                                goToAns={this.props.goToAns}
                                questions={this.state.answeredQuestions}
                                tags={this.props.tags}
                                userAList={this.state.userAList}
                            />
                        </div>
                    )}
                    {this.state.answeredQuestions !== undefined ? (
                        <button onClick={this.handleButtonClick}>
                             {this.state.showAnsweredQuestions ? 'Hide Answered Questions' : 'Show Answered Questions'}
                        </button>
                    ) : (
                        <p>No questions answered.</p>
                    )}
                </div>
            );
        }
        //if user is not admin, then
        if(this.state.admin=== false){
            return(
                <div className="profile">
                    <h2>Username: </h2>
                    <p> {this.props.userN}</p>
    
                    <br></br>
    
                    <h2>Email: </h2>
                    <p>{this.state.email}</p>
    
                    <br></br>
                    <h2>Reputation: {this.props.userR}</h2>
                    <br></br>
                    <h2>Member Since: </h2>
                    <p>{this.props.userD}</p>
    
                    <br></br>
                    <h2>Questions Asked: </h2>
                    <div> <QuestionList questions={this.props.userQList}
                                        newQuestionS={this.props.newQuestion}
                                        test={this.props.test}
                    /> </div>
                    <h2>Tags Posted: </h2>
                        {hasTags && this.state.showTagsPage && (
                            <TagsPage tags={this.props.userTList} questions={this.props.userQList} goToTag={this.props.goToTag} />
                        )}
                        {hasTags && (
                            <button onClick={this.handleTagsButtonClick}>
                                {this.state.showTagsPage ? 'Hide Tags Page' : 'Show Tags Page'}
                            </button>
                        )}
                        {!hasTags && <p>No tags available.</p>}
                    <h2>Questions Answered: </h2>
                    {this.state.showAnsweredQuestions && (
                        <div>
                            <AnsweredQuestionList
                                goToAns={this.props.goToAns}
                                questions={this.state.answeredQuestions}
                                tags={this.props.tags}
                                userAList={this.state.userAList}
                            />
                        </div>
                    )}
                    {this.state.answeredQuestions !== undefined ? (
                        <button onClick={this.handleButtonClick}>
                             {this.state.showAnsweredQuestions ? 'Hide Answered Questions' : 'Show Answered Questions'}
                        </button>
                    ) : (
                        <p>No questions answered.</p>
                    )}
                </div>
            );
        }
        
    }
}

class UserList extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        let rows=[];
        this.props.users.forEach(user =>{
                rows.push(<UserDiv
                        goToUserS={this.props.goToUserS}
                        userS ={user}
                        key = {user._id}
                        />);
        });
        if(rows.length===0){
            return(
                <div id="noQuestions">
                    No Users Found
                </div>
            );
        }
        return (
            <div>
                {rows}
            </div>
        );
    }
}

class UserDiv extends React.Component{
    constructor(props){
        super(props);
        this.state={
            user: this.props.userS
        }

        this.handleClick=this.handleClick.bind(this);
        this.handleDelete=this.handleDelete.bind(this);
    }

    handleClick(){
        this.props.goToUserS(this.state.user);
    }

    async handleDelete(){
        // const user = this.state.user;
        // const userName = user.userName;
    
        // const confirmDelete = window.confirm(`Are you sure you want to delete the user ${userName}?`);
    
        // if (confirmDelete) {
        //   try {
        //     const response = await axios.post(`http://localhost:8000/deleteUser/${user._id}`);
        //     window.alert("User has successfully been deleted");
        //     window.location.reload();

        //   } catch (error) {
        //     console.error('Error deleting User:', error);
        //   }
        // }
    }

    render(){
        const user=this.state.user;
        const userName=user.userName;

        return(
            <div onClick={this.handleClick}>
                <div className='userDiv'>
                    <h1>{userName}</h1>
                    <button onClick={this.handleDelete}>Delete User</button>
                </div>
            </div>
        );
    
    }
}

class QuestionList extends React.Component {
    constructor(props){
        super(props);
        this.state={clickedQuestion: null};
        this.handleQuestionClick=this.handleQuestionClick.bind(this);
    }

    handleQuestionClick = async(clickedQuestion) => {
        console.log("Question clicked:", clickedQuestion);
        this.setState({clickedQuestion: null});
    }

    render() {
        let rows = [];
        this.props.questions.forEach(question =>{
                rows.push(<QuestionDiv
                            // userEmail = {this.props.userEmail}
                            question = {question}
                            newQuestionFunc={this.props.newQuestionS}
                            test={this.props.test}
                            key = {question._id}
                            // ansFuncThree={this.props.ansFuncTwo}
                            onQuestionClick={this.handleQuestionClick}
                        />);
        });
        
        if(rows.length===0){
            return(
                <div id="noQuestions">
                    No Questions Found
                </div>
            );
        }
        
        return (
            <div>
                {rows}
            </div>
        );
    }
}

class QuestionDiv extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isClickled: false, 
            question: this.props.question,
        };
        this.handleClick = this.handleClick.bind(this);
    }


    handleClick = async () => {

        // // this.props.ansFuncThree(this.state.question);
        // this.setState({isClickled: true})
        // this.props.onQuestionClick(this.state.question);
        // //add back on the state question
        // this.props.newQuestionFunc(this.state.question);
        // console.log("New Question Going");
        
    }

    render() {
        const question = this.state.question;
        const title = question.title;

        return(
            <div className='questionDiv' onClick={this.handleClick} >
                <div id='questionTitle'> <h1>{title}</h1> </div>
            </div>
        );
    }
}

class AnsweredQuestionList extends React.Component {
    constructor(props){
        super(props);
        this.state={clickedQuestion: null, currentPage: 1, questionsPerPage: 5, userAList: this.props.userAList}
        this.handleQuestionClick=this.handleQuestionClick.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
        this.handleNext = this.handleNext.bind(this);
    }

    handlePrev() {
        this.setState(prevState => ({
          currentPage: prevState.currentPage - 1
        }));
      }

    handleNext() {
        this.setState((prevState) => ({currentPage: prevState.currentPage + 1}));
    }

    handleQuestionClick = async(clickedQuestion) => {
        console.log("Question clicked:", clickedQuestion);
        this.setState({clickedQuestion: null});
    }

    render() {
        let rows = []; 
        this.props.questions.forEach(question =>{
                rows.push(<AnsweredQuestionDiv
                            goToAns={this.props.goToAns}
                            question = {question}
                            key = {question._id}
                            tags = {this.props.tags}
                            userAList = {this.props.userAList}
                            // ansFuncThree={this.props.ansFuncTwo}
                            // onQuestionClick={this.handleQuestionClick}
                        />);
        });
        if(rows.length===0){
            return(
                <div id="noQuestions">
                    No Answers Found
                </div>
            );
        }
        rows.reverse();
        let currIndex = 0;
        if(((this.state.currentPage - 1) * 5 )>rows.length - 1) {
            currIndex = 0;
            this.setState({currentPage: 1});
        } 
        else {
            currIndex = (this.state.currentPage - 1) * 5;
        }
        let lastIndex = currIndex + 5;
        if(lastIndex > rows.length-1) {
            lastIndex = rows.length;
        }
        let totalPages = Math.ceil(rows.length / 5);
        let slicedRows = rows.slice(currIndex, lastIndex);
        return (
            <div>
                <div>
                    {slicedRows}
                </div>
                <div>
                    {this.state.currentPage > 1 && (
                        <button onClick={this.handlePrev}>
                        Previous
                        </button>
                    )}
                    <>   {this.state.currentPage}  out of  {totalPages} pages  </>
                    {<button onClick={this.handleNext}>
                        Next
                        </button>
                    }
                </div>
            </div>
        );
    }
}

class AnsweredQuestionDiv extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isClickled: false, 
            question: this.props.question,
            userAList: this.props.userAList,
            answersForThisQuestion: [],
        };
        this.handleClick = this.handleClick.bind(this);
        this.incrementViews = this.incrementViews.bind(this);
    }

    incrementViews = async () => {
        try {
            const res = await axios.post(`http://localhost:8000/questions/${this.props.question._id}/increment-views`);
            const updatedQuestion = res.data;
            this.setState({ question: updatedQuestion });
        } catch (err) {
            console.error('Error incrementing views:', err);
        }
    };

    handleClick = async () => {
        const matchingAnswers = this.state.question.answers.filter(answer =>
            this.state.userAList.some(userAnswer => userAnswer._id === answer)
        );
        console.log("->>>>>>>>> ", matchingAnswers);
        this.props.goToAns(this.state.question, matchingAnswers);
        // await this.incrementViews();
        // this.setState({isClickled: true});
        // this.props.onQuestionClick(this.state.question);
        // //ANS FUNC THREE now has the question itself
        // this.props.ansFuncThree(this.state.question);
        
    }

    render() {
        const question = this.state.question;
        const title = question.title;
        const name = question.asked_by ;
        const views = question.views;
        const summary = question.summary;
        const votes = question.votes;
        let replies = 0;
        if(question.answers != null) {
            replies = question.answers.length;
        }
        
        const row = [];
        if(question.tags != null) {
        question.tags.map((tagId) =>{
            this.props.tags.map((tag) => {
                if(tagId === tag._id) {
                    var tagElem = (<> {tag.name} </>);
                    row.push(<p id = 'questionDivIndTag'>{tagElem} </p>);
                }
            });
        });
        }

        
        return(
            <div className='questionDivNotClick'>
                <div className='questionDiv' onClick={this.handleClick} >
                    <div id='questionViewsAndAnswers' key = {question._id}>
                        <p> {views} views</p>
                        <p> {replies} replies</p>
                        <p> {votes} votes </p>
                    </div>
                    <div id='questionTitle'><h1>{title}</h1>
                    <div id='questionSummary'><h1>{summary}</h1></div>
                    <div id='questionTags'>{row}</div>
                    </div>
                    <div id='questionName'>
                        <p>{name} </p> 
                        <p id='questionDate'>asked {this.props.question.date} </p>
                    </div>
                </div>
            </div>
        );
    }
}


class TagsPage extends React.Component {
    render() {
        return (
            <>
            <div id="tagStuff">   
                <TagList tags = {this.props.tags} questions={this.props.questions} goToTag={this.props.goToTag}/>
            </div>
            </>
        );
    }
}

class TagList extends React.Component {
    constructor(props){
        super(props);

       
    }

   


    render() {
    const tagBox = [];
    {console.log("tags: ", this.props.tags)}
        this.props.tags.userTags.forEach(tag => {
            const counter = NumberOfQuestion(tag, this.props.questions);
            tagBox.push(
                <TagDiv 
                    tagObj={tag}
                    counter={counter}
                    goToTag={this.props.goToTag}
                />

            );
        });
        return(<>
            {tagBox}
        </>);
    }
}

class TagDiv extends React.Component{
    constructor(props){
        super(props);
        
        this.handleDelete=this.handleDelete.bind(this);
        this.handleEdit=this.handleEdit.bind(this);
    }

    async handleEdit(){
        //give the tag object to fakestackoverflow to then be passed into newTag
        // console.log("we are entering edit");
        // console.log("The other tag in question: ", this.props.tagObj);
        // this.props.goToTag(this.props.tagObj);
    }

    async handleDelete(){
        // try{
        //     console.log("this is the taggggg: ", this.props.tagObj);
        //     const response= await axios.post(`http://localhost:8000/deleteTag`, this.props.tagObj);
        //     if(response.status === 404){
        //         window.alert("Cannot Delete Tag in Use");
        //     }
        //     else if (response.status === 200){
        //         window.alert("Tag has been removed!");
        //         window.location.reload();
        //         console.log("heyo tag removed");
        //     }

        // }
        // catch(error){
        //     console.error('Error deleting Tag:', error);
        // }
    }

    render(){
        return(
            <div id = "tagDiv" >
                {this.props.tagObj.name}
                <p>{this.props.counter} questions</p>
                <button onClick={this.handleEdit}> Edit </button>
                <button onClick={this.handleDelete}> Delete </button>
            </div>
        );
    }
}


function NumberOfQuestion(tag, questions) {
    var counter = 0;
    questions.forEach(question => {
        question.tags.forEach(tagId=>{
            if(tagId === tag._id) {
                counter++;
            }
        });
    });
    return counter;
}
