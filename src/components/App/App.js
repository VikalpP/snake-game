import React, { Component } from 'react';
import Game from '../Game/Game';
import Score from '../Score/Score';
import GameOver from '../GameOver/GameOver';
import './App.css';

class App extends Component {

  initState = {
    currentScore: 0,
    game_over: false
  }
  state = this.initState;

  increaseCurrentScore = point => {
    this.setState({ currentScore: this.state.currentScore + point })
  }

  do_gameOver = _ => {
    this.setState({ game_over: true })
  }

  isGameOver = _ => this.state.game_over

  playAgain = _ => {
    this.setState({ ...this.initState }, _ => {
      this.GameComponent.current.resetGame();
    })
  }

  constructor(props) {
    super(props);
    this.GameComponent = React.createRef();
  }

  render() {
    return (
      <div className="App">
        <div id="Scorebar">
          <Score currentScore={this.state.currentScore} />
        </div>
        <div className="game-space">
          {/* Add Game Over Message over game space */}
          {(this.state.game_over) &&
            <GameOver currentScore={this.state.currentScore} playAgain={this.playAgain} />}

          <Game rows="20" cols="20" speed="1" increaseCurrentScore={this.increaseCurrentScore}
            do_gameOver={this.do_gameOver}
            isGameOver={this.isGameOver}
            ref={this.GameComponent} />
        </div>
      </div>
    );
  }
}

export default App;
