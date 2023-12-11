import React from 'react';
import axios from 'axios';
import CommentForm from './commentForm';
import CommentsList from './commentPage';

export default class AnswerPage extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = {answers: [], question: this.props.question, comments:[], keyForRemount: 0};
        this.handleNewComment = this.handleNewComment.bind(this);
    }

    componentDidMount() {
        this.updateQ();
    }
    
    handleNewComment() {
        this.updateQ();
    }

    updateQ = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/questions/${this.props.question._id}`);
            this.setState({ question: response.data });
            const res = await axios.get(`http://localhost:8000/comments`);
            this.setState((prevState) => ({ comments: res.data, keyForRemount: prevState.keyForRemount + 1 }));
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    render() {
        return (
            <div id="replacement" key={this.state.keyForRemount}>
                <QuestionDisplay 
                    userEmail = {this.props.userEmail}
                    question = {this.state.question}
                    questionFuncTwo={this.props.questionFunc}
                    comments={this.state.comments}
                    onSubmit = {this.handleNewComment}
                    commentC={this.props.commentC}
                />
                <Answers 
                    question = {this.state.question}
                    answers = {this.props.answers}
                    ansBtn ={this.props.ansBtn}
                    comments={this.state.comments}
                    onSubmit = {this.handleNewComment}
                    userEmail = {this.props.userEmail}
                    commentC={this.props.commentC}
                />
            </div>
        );
    }
}



class QuestionDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isUpvoted: false,
            isDownvoted: false,
            question: this.props.question,
            reputation: 0
        };
        this.handleUpVote = this.handleUpVote.bind(this);
        this.handleDownVote = this.handleDownVote.bind(this);
    }
    
    hyperlinker(text) {
        let filter = /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g;
        let returnText = text;
        let matchText = text.match(filter);
    
        if (matchText) {
          for (const match of matchText) {
            const [fullMatch, linkText, hrefLink] = match.match(/\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/);
            const newLink = `<a href="${hrefLink}" target="blank">${linkText}</a>`;
            returnText = returnText.replace(fullMatch, newLink);
          }
        }
        return returnText;
        }

    handleUpVote = async () => {
        try {
            const response = await axios.post(`http://localhost:8000/question/increment-vote`, {
                userEmail: this.props.userEmail,
                question: this.props.question,
            });
            const updatedQuestion = response.data.question;
            const updatedReputation = response.data.userReputation;
            this.setState((prevState) => ({
                isUpvoted: !prevState.isUpvoted,
                isDownvoted: false,
                question: updatedQuestion,
                reputation: updatedReputation,
          }));
        } catch (error) {
            console.error('Error incrementing views:', error);
        }
    }

    handleDownVote = async () => {
        try {
          const response = await axios.post(`http://localhost:8000/question/decrement-vote`, {
            userEmail: this.props.userEmail,
            question: this.props.question,
          });
          const updatedQuestion = response.data.question;
          const updatedReputation = response.data.userReputation;
          this.setState((prevState) => ({
            isUpvoted: false,
            isDownvoted: !prevState.isDownvoted,
            question: updatedQuestion,
            reputation: updatedReputation,
          }));
        } catch (error) {
          console.error('Error decrementing views:', error);
        }
    }

    render() {
        const { isUpvoted, isDownvoted } = this.state;
        const question = this.state.question;
        const title = question.title;
        const text = this.hyperlinker(question.text);
        const name = question.asked_by;
        const views = question.views;
        const votes = question.votes;
        let replies = 0;
        if(question.answers != null) {
            replies = question.answers.length;
        }

        return(
            <div>
                <div id = 'ansPageQuestionUpper'>
                    <div id='questionViews'>
                        {views} views
                    </div>
                    <div id='questionT'><h1>{title}</h1></div>
                    <div id = 'askAnsButton'>
                        <button id = "q_btn" onClick={this.props.questionFuncTwo}> Ask Question </button>
                    </div>
                </div>
                <div id = 'ansPageQuestionLower'>
                    <div id='questionAnswers'>
                        <p> {replies} replies</p>
                        <p> {votes} votes</p>
                    </div>
                    <div id='questionTT'>

                        <p dangerouslySetInnerHTML={{__html: text}} />

                    <div id='questionN'>{name} <div id = 'questionDate'>asked {this.props.question.date}</div></div>
                    </div>
                </div>
                <button onClick={this.handleUpVote} disabled={question.userEmail === this.props.userEmail || this.props.userEmail === "Guest"}>
                    {isUpvoted ? 'Upvoted' : 'UpVote'}
                </button>
                <button onClick={this.handleDownVote} disabled={question.userEmail === this.props.userEmail || this.props.userEmail === "Guest"}>
                    {isDownvoted ? 'Downvoted' : 'DownVote'}
                </button>
                <CommentsList ids = {question.comments} comments={this.props.comments} userEmail = {this.props.userEmail}/> 
                <CommentForm id = {question._id} isItQuestion = {true} onSubmit = {this.props.onSubmit} userEmail = {this.props.userEmail} commentCTwo={this.props.commentC}/>
            </div>
        );
    }
}

class Answers extends React.Component {
    constructor(props){
        super(props);
        this.state={currentPage: 1};
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
    render() {
        
        let rows = [];
        const ansIds = this.props.question.answers;
        if(ansIds != null) {
            ansIds.findLast(ansId => {
                this.props.answers.forEach((answer) =>{
                    if(answer._id === ansId) {
                        rows.push(<Answer answer = {answer} comments={this.props.comments} onSubmit = {this.props.onSubmit} userEmail = {this.props.userEmail} commentC={this.props.commentC}/>)
                    }
                });
            });
        }
        if(rows.length===0){
            return(
                <div className="answersEmpty">
                    No Answers Yet
                    <br></br>
                    <button className="answerBtn" onClick={this.props.ansBtn}> Post Answer </button>
                </div>
            );
        }
        
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
        let slicerows = rows.slice(currIndex, lastIndex);
        return(
            <>
                <div>
                    {slicerows}
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
                <button className="answerBtn" onClick={this.props.ansBtn}> Post Answer </button>
            </>
        );
    }
}

class Answer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isUpvoted: false,
            isDownvoted: false,
            answer: this.props.answer,
            reputation: 0
        };
        this.handleUpVote = this.handleUpVote.bind(this);
        this.handleDownVote = this.handleDownVote.bind(this);
    }

    hyperlinker(text) {
        let filter = /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g;
        let returnText = text;
        let matchText = text.match(filter);
    
        if (matchText) {
          for (const match of matchText) {
            const [fullMatch, linkText, hrefLink] = match.match(/\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/);
            const newLink = `<a href="${hrefLink}" target="blank">${linkText}</a>`;
            returnText = returnText.replace(fullMatch, newLink);
          }
        }
        return returnText;
    }

    handleUpVote = async () => {
        if(this.props.userEmail == this.state.answer.userEmail) {
            console.alert("Cant downvote own question");
            return;
        }
        try {
            const response = await axios.post(`http://localhost:8000/answer/increment-vote`, {
                userEmail: this.props.userEmail,
                answer: this.props.answer,
            });
            const updatedAnswer = response.data.answer;
            const updatedReputation = response.data.userReputation;
            this.setState((prevState) => ({
                isUpvoted: !prevState.isUpvoted,
                isDownvoted: false,
                answer: updatedAnswer,
                reputation: updatedReputation,
              }));
        } catch (error) {
            console.error('Error incrementing views:', error);
        }
    }
    
    handleDownVote = async () => {
        if(this.props.userEmail == this.state.answer.userEmail) {
            console.alert("Cant downvote own question");
            return;
        }
        try {
            const response = await axios.post(`http://localhost:8000/answer/decrement-vote`, {
                userEmail: this.props.userEmail,
                answer: this.props.answer,
            });
            const updatedAnswer = response.data.answer;
            const updatedReputation = response.data.userReputation;
            this.setState((prevState) => ({
                isUpvoted: false,
                isDownvoted: !prevState.isDownvoted,
                answer: updatedAnswer,
                reputation: updatedReputation,
              }));
        } catch (error) {
            console.error('Error decrementing views:', error);
        }
    }

    render() {
        const { isUpvoted, isDownvoted } = this.state;
        const answer = this.state.answer;
        const text = this.hyperlinker(answer.text);
        const ansBy = answer.ans_by;
        const vote = answer.votes;
        return(
            <div className='answerAndCommentDiv'>
                <div className='answerVote'>
                    <div id='answerDiv'>
                        <div className='answerText' dangerouslySetInnerHTML={{__html: text}}/>
                        <div className='answerAuthor'>{ansBy}
                            <div id='questionDate'>answered {this.props.answer.date}</div>
                        </div>
                        
                        <></>
                    </div>
                    <>Votes: {vote} | </>
                    <button onClick={this.handleUpVote} disabled={answer.userEmail === this.props.userEmail || this.props.userEmail === "Guest"}>
                        {isUpvoted ? 'Upvoted' : 'UpVote'}
                    </button>
                    <button onClick={this.handleDownVote} disabled={answer.userEmail === this.props.userEmail || this.props.userEmail === "Guest"}>
                        {isDownvoted ? 'Downvoted' : 'DownVote'}
                    </button>
                    <> |</>
                </div >
                    <div className='comments'>
                    <CommentsList ids = {answer.comments} comments={this.props.comments} userEmail = {this.props.userEmail} /> 
                    <CommentForm id = {answer._id} isItQuestion = {false} onSubmit = {this.props.onSubmit} userEmail = {this.props.userEmail} commentCTwo={this.props.commentC}/>
                </div>
            </div>
        );
    }
}
