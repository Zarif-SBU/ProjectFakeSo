import axios from 'axios';
import React from 'react';

export default class CommentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            id: this.props.id,
            isItQuestion: this.props.isItQuestion,
            userEmail: this.props.userEmail,
            error: null, // New state for error handling
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ text: event.target.value });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const userEmail = this.state.userEmail;
            const text = this.state.text;
            if (text.length > 140) {
                this.setState({ error: 'Comment should not exceed 140 characters.' });
                return; 
            }

            let reputation = await axios.get(`http://localhost:8000/user/getreputation/${userEmail}`);
            if(reputation.data < 50) {
                this.setState({ error: 'Cannot comment if reputation is less than 50' });
                return;
            }
            const id = this.state.id;
            const isItQuestion = this.state.isItQuestion;

            await this.createComment(text, id, isItQuestion, userEmail);
            this.setState({ error: null });

            await this.props.commentCTwo();
            this.setState({ text: '' });
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    createComment = async (text, id, isItQuestion, userEmail) => {
        try {
            const response = await axios.post('http://localhost:8000/createComment', { text, id, isItQuestion, userEmail });
            console.log('Comment created successfully:', response.data);
        } catch (error) {
            console.error('Error creating comment:', error);
            throw error;
        }
    };

    render() {
        return (
            <div className='commentForm'>
                <p>Comments cannot be more than 140 characters</p>
                <input
                    className="commentText"
                    name="valueText"
                    type="text"
                    id="commentText"
                    onChange={this.handleChange}
                    value={this.state.text}
                />
                <button onClick={this.handleSubmit} disabled={this.state.userEmail === 'Guest'}>
                    {this.state.userEmail === 'Guest' ? 'Guests cannot comment' : 'Submit'}
                </button>
                {this.state.error && <p style={{color: 'red'}} className="error-message">{this.state.error}</p>}
            </div>
        );
    }
}