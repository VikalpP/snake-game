import React, { Component } from "react";
import Game from "../Game/Game";
import Score from "../Score/Score";
import GameOver from "../GameOver/GameOver";
import "./App.css";

class App extends Component {
    initState = {
        currentScore: 0,
        game_over: false,
        snake_length: 0
    };
    state = this.initState;

    increaseCurrentScore = point => {
        this.setState({ currentScore: this.state.currentScore + point });
    };

    do_gameOver = _ => {
        this.setState({ game_over: true });
    };

    isGameOver = _ => this.state.game_over;

    playAgain = _ => {
        this.setState({ ...this.initState }, _ => {
            this.GameComponent.current.resetGame();
        });
    };

    update_snake_length = len => this.setState({ snake_length: len });

    constructor(props) {
        super(props);
        this.GameComponent = React.createRef();
    }

    render() {
        return (
            <div className="App">
                <div id="Scorebar">
                    <Score currentScore={this.state.currentScore} 
                    snake_length={this.state.snake_length}/>
                </div>
                <div className="game-space">
                    {/* Add Game Over Message over game space */}
                    {this.state.game_over && (
                        <GameOver
                            currentScore={this.state.currentScore}
                            playAgain={this.playAgain}
                        />
                    )}

                    <Game
                        rows="20"
                        cols="20"
                        speed="1"
                        ref={this.GameComponent}
                        isGameOver={this.isGameOver}
                        do_gameOver={this.do_gameOver}
                        update_snake_length={this.update_snake_length}
                        increaseCurrentScore={this.increaseCurrentScore}
                    />
                </div>
            </div>
        );
    }
}

export default App;
