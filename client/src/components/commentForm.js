import axios from 'axios';
import React from 'react';
export default class CommentForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            id: this.props.id,
            isItQuestion: this.props.isItQuestion,
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
            await this.createComment(text, id, isItQuestion);
            console.log("activate")
            this.props.onSubmit();
            this.setState({ text: '' });
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    createComment = async (text, id, isItQuestion) => {
        try {
            const response = await axios.post('http://localhost:8000/createComment', { text, id, isItQuestion });
            console.log('Comment created successfully:', response.data);
        } catch (error) {
            console.error('Error creating comment:', error);
            throw error; 
        }
    };

    render() {
        return (
            <div>
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