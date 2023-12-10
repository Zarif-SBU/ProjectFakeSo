import axios from 'axios';
import React from 'react';
export default class CommentForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            id: this.props.id,
            isItQuestion: this.props.isItQuestion,
            userEmail: this.props.userEmail,
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
            const text = this.state.text;
            const id = this.state.id;
            const isItQuestion = this.state.isItQuestion;
            const userEmail = this.state.userEmail;
            await this.createComment(text, id, isItQuestion, userEmail);
            //this.props.onSubmit();
            this.setState({ text: '' });
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    createComment = async (text, id, isItQuestion, userEmail) => {
        try {
            const response = await axios.post('http://localhost:8000/createComment', { text, id, isItQuestion, userEmail});
            console.log('Comment created successfully:', response.data);
        } catch (error) {
            console.error('Error creating comment:', error);
            throw error; 
        }
    };

    render() {
        return (
            <div className='commentForm'>
                <input
                    className="commentText"
                    name="valueText"
                    type="text"
                    id="commentText"
                    onChange={this.handleChange}
                    value={this.state.text}
                />
                <button onClick={this.handleSubmit}>Submit</button>
            </div>
        );
    }
}