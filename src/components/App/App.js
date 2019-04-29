import React, { Component } from "react";
import Game from "../Game/Game";
import Score from "../Score/Score";
import GameOver from "../GameOver/GameOver";
import Dashboard from "../Dashboard/Dashboard";
import "./App.css";

class App extends Component {
    initState = {
        currentScore: 0,
        bestScore: 0,
        game_over: false,
        snake_length: 0
    };
    state = this.initState;

    increaseCurrentScore = point => {
        this.setState({ currentScore: this.state.currentScore + point }, _ => {
            this.check_For_BestScore();
        });
    };

    check_For_BestScore = _ => {
        const { bestScore, currentScore } = this.state;
        if (bestScore < currentScore) {
            this.setState({ bestScore: currentScore }, _ => {
                window.localStorage.setItem("bestScore", this.state.bestScore);
            });
        }
    };

    do_gameOver = _ => {
        this.setState({ game_over: true });
    };

    isGameOver = _ => this.state.game_over;

    startGame = _ => this.GameComponent.current.resetGame();

    playAgain = _ => {
        this.setState({ ...this.initState }, _ => {
            this.startGame();
        });
    };

    update_snake_length = len => this.setState({ snake_length: len });

    constructor(props) {
        super(props);
        this.GameComponent = React.createRef();
    }

    componentDidMount() {
        let storage = window.localStorage;
        let bestScore = storage.getItem("bestScore");
        if (bestScore) this.setState({ bestScore });
    }

    render() {
        return (
            <div className="App">
                <div id="Scorebar">
                    <Score
                        currentScore={this.state.currentScore}
                        bestScore={this.state.bestScore}
                        snake_length={this.state.snake_length}
                    />
                </div>
                <div className="game-space">
                    {/* Add Game Over Message over game space */}
                    {this.state.game_over && (
                        <GameOver
                            currentScore={this.state.currentScore}
                            bestScore={this.state.bestScore}
                            playAgain={this.playAgain}
                            snake_length={this.state.snake_length}
                        />
                    )}

                    {this.state.snake_length === 0 && (
                        <Dashboard startGame={this.startGame} />
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
