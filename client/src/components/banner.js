import React from 'react';

export default class Banner extends React.Component{
  constructor(props) {
    super(props);
    this.state = { search: '' }; // Initialize the state properly
    this.handleSearchInput = this.handleSearchInput.bind(this);
  }

  handleSearchInput(e) {
    if (e.key === 'Enter') {
      this.storeInput();
    }
  }

  storeInput() {
    // You can access the search input in this.state.search
    // and perform any actions you need here
    const searchInput = this.state.search;
    console.log('Search Input:', searchInput);
    this.props.searchFunc(this.state.search);
  }

  render() {
    return (
      <div id="header">
        <div>
          <h1 id="title">Fake Stack Overflow</h1>
        </div>
        <div id="search_bar">
          <input
            type="text"
            id="search_q"
            placeholder="Search..."
            value={this.state.search}
            onKeyUp={this.handleSearchInput}
            onChange={(e) => this.setState({ search: e.target.value })} // Update the search state
          />
        </div>
      </div>
    );
  }
}