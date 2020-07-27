import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "./Home.css";

class Home extends Component {

  render() {
    return (
      <div id="container">
	  <div className="content">
      <h1>Bridgify</h1>
      <h3>An ERC20-FIAT Swap Protocol</h3>
<Link to='/dashboard'><button type="submit" id="btn">Dashboard</button></Link>
</div>
</div>
    );
  }
}

export default Home;