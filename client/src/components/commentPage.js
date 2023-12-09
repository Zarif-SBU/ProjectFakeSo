import React from 'react';
import axios from 'axios';

export default class CommentsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {currentPage: 1, comments: [], ids: this.props.ids}        
        this.handlePrev = this.handlePrev.bind(this);
        this.handleNext = this.handleNext.bind(this);
    }

    handlePrev() {
        this.setState(prevState => ({currentPage: prevState.currentPage - 1}));
    }

    handleNext() {
        this.setState((prevState) => ({currentPage: prevState.currentPage + 1}));
    }

    componentDidMount() {
        this.updateQ();
      }
    
    updateQ = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/comments`);
          this.setState({ comments: response.data });
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
    };

    render() {
        let rows = [];
        this.state.ids.forEach(id => {
            let comment = this.state.comments.findOne({ _id: id });
            if(comment) {
                rows.push(<CommentDiv 
                            comment = {comment}
                        />);
            }
        });
        
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
        let totalPages = Math.ceil(rows.length / 3);
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

class CommentDiv extends React.Component{
    render() {
        const comment = this.props.comment;
        const user = comment.comment_by;
        const text = comment.text;
        const date = comment.comment_date_time;
        const votes = comment.votes;

        return(<div>
            <h3>{text}</h3>
            <p>written by {user}</p>
            <p>votes {votes}</p>
            <button>upvote</button>
        </div>);

    }
}