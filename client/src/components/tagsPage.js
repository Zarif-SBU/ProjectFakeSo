import React from 'react';
import axios from 'axios';

export default class TagsPage extends React.Component {
    render() {
        return (
            <>
            <div id="tagHeader">
            <div id="tagCount">{this.props.tags.length} Tags</div>
            <h1 id="allTagSpec">All Tags</h1>
            <div className id = "tagBtn">
            <button id = "q_btn" onClick={this.props.questionFunc}> Ask Question </button>
            </div>

            </div>

            <div id="tagStuff">
                <TagList tags = {this.props.tags} handleSearch={this.props.handleSearch} questions={this.props.questions}/>
            </div>
            </>
        );
    }
}

class TagList extends React.Component {
    render() {
    const tagBox = []
        this.props.tags.forEach(tag => {
            const counter = NumberOfQuestion(tag, this.props.questions);
            tagBox.push(<div id = "tagDiv" onClick={() => this.props.handleSearch('[' + tag.name + ']')}>
                {tag.name}
                <p>{counter} questions</p>
            </div>);
        });
        return(<>
            {tagBox}
        </>);
    }
}


function NumberOfQuestion(tag, questions) {
    var counter = 0;
    questions.forEach(question => {
        question.tags.forEach(tagId=>{
            if(tagId === tag._id) {
                counter++;
            }
        });
    });
    return counter;
}
