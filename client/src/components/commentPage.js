import React from 'react';

class CommentsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            comments: this.props.comments,
            ids: this.props.ids
        };
        this.handlePrev = this.handlePrev.bind(this);
        this.handleNext = this.handleNext.bind(this);
    }

    handlePrev() {
        this.setState((prevState) => ({
            currentPage: Math.max(prevState.currentPage - 1, 1)
        }));
    }

    handleNext() {
        const totalPages = Math.ceil(this.state.ids.length / 3);
        this.setState((prevState) => ({
            currentPage: Math.min(prevState.currentPage + 1, totalPages)
        }));
    }

    render() {
        const rows = this.state.ids
            .map((id) => {
                const comment = this.state.comments.find((comment) => comment._id === id);
                return comment ? (
                    <CommentDiv key={comment._id} comment={comment} />
                ) : null;
            })
            .filter(Boolean);

        const currIndex = (this.state.currentPage - 1) * 3;
        let lastIndex = currIndex + 3;
        let isLastPage = false;
        if (lastIndex > rows.length - 1) {
            lastIndex = rows.length;
            isLastPage = true;
        }
        const totalPages = Math.ceil(rows.length / 3);
        const slicedRows = rows.slice(currIndex, lastIndex);

        return (
            <div>
                <div>{slicedRows}</div>
                <div>
                    {this.state.currentPage > 1 && (
                        <button onClick={this.handlePrev}>Previous</button>
                    )}
                    <> {this.state.currentPage} out of {totalPages} pages </>
                    {!isLastPage && <button onClick={this.handleNext}>Next</button>}
                </div>
            </div>
        );
    }
}

class CommentDiv extends React.Component {
    render() {
        const comment = this.props.comment;
        const user = comment.comment_by;
        const text = comment.text;
        const votes = comment.votes;

        return (
            <div>
                <p>{text}</p>
                <p>written by {user}</p>
                <p>votes {votes}</p>
                <button>upvote</button>
            </div>
        );
    }
}

export default CommentsList;