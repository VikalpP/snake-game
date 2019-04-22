import React, { Component } from 'react';
import Game from '../Game/Game'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Game rows="20" cols="20" speed="1" />
      </div>
    );
  }
}

export default App;
