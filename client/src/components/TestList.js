import React from 'react';
import axios from 'axios';



function QuestionOrder(questions, order, answers) {
    if(order === "Newest") {
        const orderedQuestions = questions.slice(); 
        orderedQuestions.sort((questionA, questionB) => {return new Date(questionB.ask_date_time) - new Date(questionA.ask_date_time);});
        return orderedQuestions;
    }
    else if(order === "Unanswered") {
        const orderedQuestions = [];
        if(questions.length != null) {
            questions.forEach(question => {
                if(question.answers == null) {
                    question.answers = [];
                }
                if(question.answers.length == 0) {
                    orderedQuestions.push(question); 
                }
        });
        return orderedQuestions;
    }
    }
    else if(order === "Active") {
        const orderedQuestions = questions.slice();
        orderedQuestions.sort((questionA, questionB) => {
            if(questionA.answers == null) {
                questionA.answers = [];
            }
            if(questionB.answers == null) {
                questionB.answers = [];
            } 
            const answerDateA = questionA.answers.map(ansId => answers.find(answer => answer._id === ansId).ans_date_time)
                .sort((a, b) =>{ return new Date(b) - new Date(a);})[0];
            const answerDateB = questionB.answers.map(ansId => answers.find(answer => answer._id === ansId).ans_date_time)
                .sort((a, b) =>{ return new Date(b) - new Date(a);})[0];
            return new Date(answerDateB) - new Date(answerDateA);
        });
        return orderedQuestions;
    }
    return questions;
}

function FilteredQst (question, filterText, tags) {
    const searchWords = filterText.toLowerCase().split(' ');
    const questionTitle = question.title.toLowerCase();
    const questionText = question.text.toLowerCase();
 
    // Check if any words are present in the title or text
    return searchWords.some((word) => {        
        if(word[0] === '[' && word[word.length-1] === ']') {
            word = word.slice(1, word.length-1);
            var exist = false;
            if(question.tags != null && tags != null) {
                question.tags.forEach(tagId => {
                    tags.forEach(tag => {
                        if(tagId === tag._id) {
                            if(tag.name === word) {
                                exist = true;
                            }
                        }
                    });
                });
        }
            return exist;
        } else {
            return questionTitle.includes(word) || questionText.includes(word);
        }
    });
}

export default class QuestionList extends React.Component {
    constructor(props){
        super(props);
        this.state={clickedQuestion: null, currentPage: 1, questionsPerPage: 5,};
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
        const orderedQuestions = QuestionOrder(this.props.questions, this.props.threeBtn, this.props.answers);
        orderedQuestions.forEach(question =>{
            if(FilteredQst (question, this.props.searchReTwo, this.props.tags)) {
                rows.push(<QuestionDiv
                            userEmail = {this.props.userEmail}
                            question = {question}
                            key = {question._id}
                            tags = {this.props.tags}
                            ansFuncThree={this.props.ansFuncTwo}
                            onQuestionClick={this.handleQuestionClick}
                        />);
            }
        });
        if(rows.length===0){
            return(
                <div id="noQuestions">
                    No Questions Found
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

class QuestionDiv extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isUpvoted: false,
            isDownvoted: false,
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleUpVote = this.handleUpVote.bind(this);
        this.handleDownVote = this.handleDownVote.bind(this);
        this.incrementViews = this.incrementViews.bind(this)
        this.state = {isClickled: false, question: this.props.question};
    }

    incrementViews = async () => {
        try {
          const res = await axios.post(`http://localhost:8000/questions/${this.props.question}/increment-views`);
          const updatedQuestion = res.data;
          this.setState({ question: updatedQuestion });
        } catch (err) {
          console.error('Error incrementing views:', err);
        }
    };

    handleUpVote = async () => {
        try {
          const response = await axios.post(`http://localhost:8000/question/increment-vote`, {
            userEmail: this.props.userEmail,
            question: this.props.question,
          });
          const updatedQuestion = response.data;
          this.setState((prevState) => ({
            isUpvoted: !prevState.isUpvoted,
            isDownvoted: false,
            question: updatedQuestion,
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
          const updatedQuestion = response.data;
          this.setState((prevState) => ({
            isUpvoted: false,
            isDownvoted: !prevState.isDownvoted,
            question: updatedQuestion,
          }));
        } catch (error) {
          console.error('Error decrementing views:', error);
        }
    }

    handleClick = async () => {
        await this.incrementViews();
        this.setState({isClickled: true})
        this.props.onQuestionClick(this.state.question);
        //ANS FUNC THREE now has the question itself
        this.props.ansFuncThree(this.state.question);
        
    }

    render() {
        const { isUpvoted, isDownvoted } = this.state;
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
                    <div id='questionName'><p>{name} </p> 
                    <p id='questionDate'>asked {this.props.question.date} </p>
                    </div>
                </div>
                <button onClick={this.handleUpVote} > {isUpvoted ? 'Upvoted' : 'UpVote'} </button>
                <button onClick={this.handleDownVote} > {isDownvoted ? 'Downvoted' : 'DownVote'} </button>
            </div>
        );
    }
}