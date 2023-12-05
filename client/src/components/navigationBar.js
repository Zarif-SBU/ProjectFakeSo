import React from 'react';

export default class NavigationBar extends React.Component {
    render() {
        return (
            <div>
                <nav id="nav">
                    <button id="menuQ" className={this.props.isQuestionsActive ? 'actives' : ''} onClick={this.props.homeFunc}>Questions</button>
                    <button id="menuT" className={this.props.isTagsActive ? 'actives' : ''} onClick={this.props.tagsFunc}>Tags</button>
                </nav>
            </div>
        );
    }
}