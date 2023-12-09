import React from 'react';
import axios from 'axios';



export default class AnswerPage extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = {answers: [], question: this.props.question};
    }

    componentDidMount() {
        this.updateQ();
      }
    
      updateQ = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/questions/${this.props.question._id}`);
          this.setState({ question: response.data });
        } catch (error) {
          console.error('Error fetching questions:', error);
        }
      };

    render() {
        return (
            <div id="replacement">
                <QuestionDisplay question = {this.state.question}
                questionFuncTwo={this.props.questionFunc}/>
                <Answers 
                question = {this.state.question}
                answers = {this.props.answers}
                ansBtn ={this.props.ansBtn}
                />
            </div>
        );
    }
}


class QuestionDisplay extends React.Component {
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


    render() {
        const question = this.props.question;
        const title = question.title;
        const text = this.hyperlinker(question.text);
        const name = question.askedBy;
        const views = question.views;
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
                    </div>
                    <div id='questionTT'>

                        <p dangerouslySetInnerHTML={{__html: text}} />

                    <div id='questionN'>{name} <div id = 'questionDate'>asked {this.props.question.date}</div></div>
                    </div>
                </div>
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
                        rows.push(<Answer answer = {answer}/>)
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
        let isLastpage = false;
        if(lastIndex > rows.length-1) {
            lastIndex = rows.length;
            isLastpage = true;
        }
        let totalPages = Math.ceil(rows.length / 5);
        rows = rows.slice(currIndex, lastIndex);
        return(
            <div className="answerPage">
                <div>
                    {rows}
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
            </div>
        );
    }
}

class Answer extends React.Component {
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

    render() {
        const answer = this.props.answer;
        const text = this.hyperlinker(answer.text);
        const ansBy = answer.ans_by;
        const ansDate = answer.ansDate;
        return(
            <div className='answerDiv'>
                <div className='answerText' dangerouslySetInnerHTML={{__html: text}}/>
                <div className='answerAuthor'>{ansBy}<div id='questionDate'>answered {this.props.answer.date}</div></div>
                
            </div>
        );
    }
}