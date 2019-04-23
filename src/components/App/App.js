import React, { Component } from 'react';
import Game from '../Game/Game';
import Score from '../Score/Score';
import './App.css';

class App extends Component {
  state = {
    currentScore: 0
  }

  increaseCurrentScore = point => {
    this.setState({ currentScore: this.state.currentScore + point })
  }
  render() {
    return (
      <div className="App">
        <div>
          <Score currentScore={this.state.currentScore} />
        </div>
        <div>
          <Game rows="20" cols="20" speed="1" increaseCurrentScore={this.increaseCurrentScore} />
        </div>
      </div>
    );
  }
}

export default App;
