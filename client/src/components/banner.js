import React from 'react';
import axios from 'axios';

export default class Banner extends React.Component{
  constructor(props) {
    super(props);
    this.state = { search: '', userName: "test"}; // Initialize the state properly
    this.handleSearchInput = this.handleSearchInput.bind(this);
    this.handleLogOut=this.handleLogOut.bind(this);
    this.handleGuest=this.handleGuest.bind(this);
  }

  // componentDidMount = async() =>{
  //   await axios.post(`http://localhost:8000/user/${this.props.userName}/getUserName`)
  //     .then(response => this.setState({userName: response.data}))
  //     .catch(error => console.error('Error fetching user name:', error));
  // }

  handleRefresh = () => {
    // Force a page refresh
    console.log("Heyo");
    window.location.reload();
  };

  handleSearchInput(e) {
    if (e.key === 'Enter') {
      this.storeInput();
    }
  }

  async handleLogOut(){
    try {
      const res = await axios.post('http://localhost:8000/logout', { withCredentials: true });
      console.log('Logging Out');
      if(res.status === 200){
        this.handleRefresh();
      }

      // window.location.reload();
    } catch (error) {
      console.error('Error posting data:', error);
    }
  }

  async handleGuest(){
    if(this.props.userName==="Guest"){
      //do nothing if the user is a guest, as they cannot log in
      window.alert("You have to log in to see your profile");
    }
    else{
      this.props.goProfile();
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
          <h2> Welcome {this.props.userN}</h2>
          <button onClick={this.handleGuest}>Visit Profile</button>
          <button onClick={this.handleLogOut}>Log Out</button>
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