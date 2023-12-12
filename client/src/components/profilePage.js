import React from 'react';
import axios from 'axios';

export default class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state={username: "", email: this.props.userEmail, admin: false, answerFuncthree: null, userAList: this.props.userAList, answeredQuestions: this.props.userAQList};

        this.handleGoToNewQuestion=this.handleGoToNewQuestion.bind(this);
    }

    async handleGoToNewQuestion() {
        
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
                    <h2>Reputation: {this.props.userR}</h2>
                    <br></br>
                    <h2>Member Since</h2>
                    <p>{this.props.userD}</p>
    
                    <br></br>
                    <h2>Questions Asked</h2>
                    <div> <QuestionList questions={this.props.userQList}
                                        newQuestionS={this.props.newQuestion}
                                        test={this.props.test}
                    /> </div>
                    <h2>Tags Posted</h2>
                    <h2>Answers Posted</h2>
                    <AnsweredQuestionList
                    goToAns={this.props.goToAns}
                    questions = {this.state.answeredQuestions} tags = {this.props.tags} userAList = {this.state.userAList}/>
                </div>
            );
        }
        
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

        // this.props.ansFuncThree(this.state.question);
        this.setState({isClickled: true})
        this.props.onQuestionClick(this.state.question);
        //add back on the state question
        this.props.newQuestionFunc(this.state.question);
        console.log("New Question Going");
        
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