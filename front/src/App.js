import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import ContentfulComponent from './ContentfulComponent.jsx';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div>
          <ContentfulComponent/>
        </div>
      </div>
    );
  }
}

export default App;
