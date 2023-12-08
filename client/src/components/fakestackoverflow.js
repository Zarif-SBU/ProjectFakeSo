import React from 'react';
import Banner from './banner.js';
import NavigationBar from './navigationBar.js';
import QuestionForm from './questionForm.js';
import TagsPage from './tagsPage.js';
import AnswerForm from './answerForm.js';
import AnswerPage from './answerPage.js';
import axios from 'axios';
import QuestionList from './TestList.js';
import Welcome from './welcome.js';

export default class FakeStackOverflow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {profilePage: false, loginPager: true, questions:[], answers:[], tags:[], qstAmount:0, searchRe:"", threeBtn: "Newest", showAns: false, showForm: false, tagForm: false, showQuestions: true, isClickled: false, isTagsActive: false, isQuestionsActive: false, qstDisplayed: null };
    //Tag States
    this.handleTagsEr = this.handleTagsEr.bind(this);
    //Question Home States
    this.handleHome = this.handleHome.bind(this);
    //Open Ask Questions
    this.openQuestionForm = this.openQuestionForm.bind(this);
    //Clickable questions
    this.clickQuestion=this.clickQuestion.bind(this);
    //Answer Form Page
    this.handleAnswerForm=this.handleAnswerForm.bind(this);
    //The 3 Buttons
    this.handleNewest=this.handleNewest.bind(this);
    this.handleActive=this.handleActive.bind(this);
    this.handleUnanswered=this.handleUnanswered.bind(this);
    this.handleSearch=this.handleSearch.bind(this);
    //login page request to then home page
    this.handleGoToLogin=this.handleGoToLogin.bind(this);
  }

  componentDidMount = async() => {
    await axios.get('http://localhost:8000/questions')
      .then(response => this.setState({ questions: response.data, qstAmount: response.data.length }))
      .catch(error => console.error('Error fetching questions:', error));
    await axios.get('http://localhost:8000/answers')
      .then(response => this.setState({ answers: response.data}))
      .catch(error => console.error('Error fetching answers:', error));
    await axios.get('http://localhost:8000/tags')
      .then(response => this.setState({ tags: response.data }))
      .catch(error => console.error('Error fetching tags:', error));
    await axios.get("http://localhost:8000/auth")
      .then(response => this.setState({loginPager: response.data.login}))
      .catch(error => console.error("Error fetch session stuff: ", error));
    
  }

  retrieve = async() =>{
    await axios.get('http://localhost:8000/questions')
      .then(response => this.setState({ questions: response.data, qstAmount: response.data.length }))
      .catch(error => console.error('Error fetching questions:', error));
    await axios.get('http://localhost:8000/answers')
      .then(response => this.setState({ answers: response.data}))
      .catch(error => console.error('Error fetching answers:', error));
    await axios.get('http://localhost:8000/tags')
      .then(response => this.setState({ tags: response.data }))
      .catch(error => console.error('Error fetching tags:', error));
    
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.searchRe !== this.state.searchRe ||
      prevState.threeBtn !== this.state.threeBtn ||
      prevState.showAns !== this.state.showAns ||
      prevState.showForm !== this.state.showForm ||
      prevState.tagForm !== this.state.tagForm ||
      prevState.showQuestions !== this.state.showQuestions ||
      prevState.isClickled !== this.state.isClickled ||
      prevState.isTagsActive !== this.state.isTagsActive ||
      prevState.isQuestionsActive !== this.state.isQuestionsActive ||
      prevState.qstDisplayed !== this.state.qstDisplayed 

    ) {
      this.retrieve();
    }
  }

  //this means that once loginpager is false, we will then be able to bypass the login screen to then have all the information for the regular page 
  handleGoToLogin = async()=>{
    await this.retrieve();
    this.setState({loginPager:false});
  }

  handleSearch = async(searchResult) =>{
    await this.retrieve();
    this.setState({searchRe: searchResult,  showQuestions: true, showForm: false, tagForm: false, isTagsActive: false, isQuestionsActive: true, isClickled: false, showAns: false});
    console.log(this.searchRe);
  }

  handleNewest = async() =>{
    await this.retrieve();
    this.setState({threeBtn:"Newest"});
  }

  handleActive = async() =>{
    await this.retrieve();
    this.setState({threeBtn:"Active"});
  }

  handleUnanswered = async() =>{
    await this.retrieve();
    this.setState({threeBtn:"Unanswered"});
  }

  handleAnswerForm = async() =>{
    await this.retrieve();
    this.setState({ showAns: true, showForm: false, showQuestions: false, tagForm: false, isClickled: false});
  }

  clickQuestion = async(clickedQuestion) =>{
    await this.retrieve();
    //now qstDisplayed has to value of clickedQuestion, the object
    this.setState({isClickled: true, qstDisplayed: clickedQuestion, showForm: false, showQuestions: false, tagForm: false, showAns: false});
  }

  openQuestionForm = async() => {
    await this.retrieve();
    this.setState({ showForm: true, showQuestions: false, tagForm: false, isClickled: false, showAns: false});
  }

  handleTagsEr = async() => {
    await this.retrieve();
    this.setState({ showForm: false, showQuestions: false, tagForm: true, isTagsActive: true, isQuestionsActive: false, isClickled: false, showAns: false });
  }

  handleHome = async() => {
    await this.retrieve();
    this.setState({ searchRe: "",showQuestions: true, showForm: false, tagForm: false, isTagsActive: false, isQuestionsActive: true, isClickled: false, showAns: false});
  }

  render() {
    //displays the login page first
    console.log("Hello: ", this.state.loginPager);

    if(this.state.loginPager){
      return(
        <div>
            <Welcome
             loginFunc={this.handleGoToLogin}
            />
        </div>
      );
    }

    //displays the Answers Form
    if(this.state.showAns){
      return(
        <div>
          <Banner
          searchFunc={this.handleSearch} />
          <NavigationBar
            homeFunc={this.handleHome}
            tagsFunc={this.handleTagsEr}
            isTagsActive={this.state.isTagsActive}  // Pass the state to the NavigationBar
            isQuestionsActive={this.state.isQuestionsActive}  // Pass the state to the NavigationBar
          />
          <div className="FormContainerClass">
            <AnswerForm
              answers = {this.state.answers}
              //temp handleHome
              returnFunc={this.clickQuestion}
              questionIt = {this.state.qstDisplayed} 
            />
          </div>
         
        </div>
      );
    }

    //This state.showForm will be the questions form page rendering
    if (this.state.showForm) {
      return (
        <div>
          <Banner 
          searchFunc={this.handleSearch}
          />
          <NavigationBar
            homeFunc={this.handleHome}
            tagsFunc={this.handleTagsEr}
            isTagsActive={this.state.isTagsActive}  // Pass the state to the NavigationBar
            isQuestionsActive={this.state.isQuestionsActive}  // Pass the state to the NavigationBar 
          />
          <div className="FormContainerClass">
            <QuestionForm
              tag={this.state.tags}
              returnFunc={this.handleHome}
            />
          </div>
         
        </div>
      );
    }

    //For the Question Page and Answers displayment itself
    if(this.state.isClickled){
      return(
        <div>
        <Banner
        searchFunc={this.handleSearch}
        />
        <NavigationBar
          homeFunc={this.handleHome}
          tagsFunc={this.handleTagsEr}
          isTagsActive={this.state.isTagsActive}  // Pass the state to the NavigationBar
          isQuestionsActive={this.state.isQuestionsActive}  // Pass the state to the NavigationBar
        />
        <div className="FormContainerClass">
        <AnswerPage
          questionBtn={this.openQuestionForm}
          question = {this.state.qstDisplayed} 
          answers = {this.state.answers}
          questionFunc={this.openQuestionForm}
          ansBtn={this.handleAnswerForm} // Change the prop name to "ansBtn
          />
        </div>
      </div>

      );
    }

    //For tags
    if (this.state.tagForm) {
      return (
        <div>
          <Banner 
          searchFunc={this.handleSearch}/>
          <NavigationBar
            homeFunc={this.handleHome}
            tagsFunc={this.handleTagsEr}
            isTagsActive={this.state.isTagsActive}  // Pass the state to the NavigationBar
            isQuestionsActive={this.state.isQuestionsActive}  // Pass the state to the NavigationBar
            
          />
          <div className="FormContainerClass">
            <TagsPage
              questionFunc={this.openQuestionForm}
              tags = {this.state.tags}
              handleSearch = {this.handleSearch}
              questions = {this.state.questions}
            />
          </div>
        </div>
      );
    }

    //if you click on questions, return back to home page ***CAN REMOVE BY SETTING DEFAULT STATE OF QUESTION TO BE TRUE ANYWAYS****
    if (this.state.showQuestions) {
      return (
        <div>
          <Banner 
          searchFunc={this.handleSearch}/>
          <NavigationBar
            homeFunc={this.handleHome}
            tagsFunc={this.handleTagsEr}
            isTagsActive={this.state.isTagsActive}  // Pass the state to the NavigationBar
            isQuestionsActive={this.state.isQuestionsActive}  // Pass the state to the NavigationBar
          />
          <div className="FormContainerClass">
            <DisplayText
              questions = {this.state.questions}
              answers = {this.state.answers}
              tags = {this.state.tags}
              onClick={this.openQuestionForm}
              ansFunc={this.clickQuestion}
              newFunc={this.handleNewest}
              actFunc={this.handleActive}
              unFunc={this.handleUnanswered}
              threeBtn={this.state.threeBtn}
              searchRe= {this.state.searchRe}
              amount={this.state.qstAmount}
            />
          </div>
        </div>
      );
    }
  }
}


class DisplayText extends React.Component {
  render() {
    return (
      <div id="replacement">
        <div id="content">
          <div className="align_content">
            <h1 id="content_header"> All Questions </h1>
            <div id="ask_btn">
              <button id="q_btn" onClick={this.props.onClick}> Ask Question </button>
            </div>
          </div>
          <div className="align_content">
            <div id="count_questions" > {this.props.amount} Questions </div>
            <table className="three_bar">
            <tbody>
              <tr className="bar_row">
                <td className="bar_link" id="newer" onClick={this.props.newFunc}>Newest</td>
                <td className="bar_link" id="activer" onClick={this.props.actFunc}>Active</td>
                <td className="bar_link" id="unanswered" onClick={this.props.unFunc}>Unanswered</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="questionPage">
          <QuestionList
            answers = {this.props.answers}
            questions = {this.props.questions}
            tags = {this.props.tags}
            searchReTwo={this.props.searchRe}
            threeBtn={this.props.threeBtn}
            ansFuncTwo={this.props.ansFunc}
          />
        </div>
      </div>
    );
  }
}