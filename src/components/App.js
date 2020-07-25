import React, { Component } from 'react';
import { Route ,Switch } from 'react-router-dom';
import Home from './Home.js';
import Dashboard from './Dashboard.js';
import "./App.css";

class App extends Component {

  render() {
    return (
      <div>
        <Switch>
         <Route path='/' exact component={Home}/> 
         <Route path='/dashboard' exact component={Dashboard}/>        
         </Switch>
      </div>
      
    );
      }
}
export default App;