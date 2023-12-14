import React from 'react';
import axios from 'axios';
class CommentsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            comments: this.props.comments,
            ids: this.props.ids,
        };
        this.handlePrev = this.handlePrev.bind(this);
        this.handleNext = this.handleNext.bind(this);
    }

    handlePrev() {
        this.setState((prevState) => ({
          currentPage: prevState.currentPage - 1
        }));
    }

    handleNext() {
      this.setState((prevState) => ({currentPage: prevState.currentPage + 1}));
    }

    render() {
        const rows = this.state.ids
            .map((id) => {
                const comment = this.state.comments.find((comment) => comment._id === id);
                return comment ? (
                    <CommentDiv key={comment._id} comment={comment} userEmail = {this.props.userEmail}/>
                ) : null;
        }).filter(Boolean).reverse();

        let currIndex = 0;
        if(((this.state.currentPage - 1) * 3 )>rows.length - 1) {
            currIndex = 0;
            this.setState({currentPage: 1});
        } 
        else {
            currIndex = (this.state.currentPage - 1) * 3;
        }
        let lastIndex = currIndex + 3;
        if(lastIndex > rows.length-1) {
            lastIndex = rows.length;
        }
        let totalPages = Math.ceil(rows.length / 3);
        let slicedRows = rows.slice(currIndex, lastIndex);

        return (
            <div>
                <div>{slicedRows}</div>
                <div>
                    {this.state.currentPage > 1 && (
                        <button onClick={this.handlePrev}>Previous</button>
                    )}
                    <> {this.state.currentPage} out of {totalPages} pages </>
                    {<button onClick={this.handleNext}>Next</button>}
                </div>
            </div>
        );
    }
}

class CommentDiv extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        comment: this.props.comment,
      };
    }
  
    handleUpVote = async () => {
      try {
        const response = await axios.post(`http://localhost:8000/comment/increment-vote`, {
          userEmail: this.props.userEmail,
          comment: this.state.comment,
        });
        const updatedComment = response.data;
        this.setState({
          comment: updatedComment,
        });
      } catch (error) {
        console.error('Error incrementing upvotes:', error);
      }
    };
  
    render() {
      const comment = this.state.comment;
      const user = comment.comment_by;
      const text = comment.text;
      const votes = comment.votes;
  
      return (
        <div
          style={{
            padding: '15px',
            border: '2px dotted black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: '10px',
            marginBottom: '10px',
            backgroundColor: '#f5f5f5',
          }}
        >
          <div id='commentDiv' style={{ flex: 1 }}>
            <p id='commentText' style={{ margin: 0 }}>{text}</p>
          </div>
          <div style={{ paddingLeft: '20px', paddingRight: '20px', color: 'orange' }}>
            <p id='comemntUser' style={{ margin: 0 }}>written by {user}</p>
          </div>
          <div style={{ paddingLeft: '20px' }}>
            <p id='comemntVote' style={{ margin: 0, marginBottom: '5px' }}>votes {votes}</p>

            <button 
              onClick={this.handleUpVote}  disabled={comment.userEmail === this.props.userEmail || this.props.userEmail === "Guest"}>
                Up Vote
            </button>
          </div>
        </div>
      );
    }
  }

export default CommentsList;