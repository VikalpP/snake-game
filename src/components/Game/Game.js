import React, { Component } from "react";
import { Directions, Keymaps } from "../Constants";
import { randomVal, getRandomXnY, isEqualPoints, getRandomDirection } from "../Common";

import "./Game.css";


export default class Game extends Component {

    state = {
        apple: { x: 0, y: 0 },
        snake: {
            head: { x: 0, y: 0 },
            tail: [],
            direction: Directions.RIGHT,
            nextDirection: Directions.RIGHT,
            speed: 200 / this.props.speed
        }
    };

    // Is cell points equal to snake head
    isHead = cell => isEqualPoints(this.state.snake.head, cell);

    // Is cell points equal to apple
    isApple = cell => isEqualPoints(this.state.apple, cell);

    // Is cell points includes in Tail of snake
    isTail = cell =>
        this.state.snake.tail.find(tailPart =>
            isEqualPoints(tailPart, cell)
        );

    // Generate intial snake start
    getNewHeadPoint = _ => {

        // To Make sure that snake don't starts at any edge
        let newPoint = {
            x: randomVal(
                this.props.cols * (1 / 6),
                this.props.cols * (5 / 6)
            ),
            y: randomVal(
                this.props.rows * (1 / 6),
                this.props.rows * (5 / 6)
            )
        };

        // Check is snake's new head point same as apple
        return this.isApple(newPoint)
            ? this.getNewHeadPoint()
            : newPoint;
    };

    // Generate new points for next apple
    getNewApplePoint = _ => {
        let newPoint = getRandomXnY(this.props.cols, this.props.rows);

        // Check is apple's new point is part of snake
        return this.isTail(newPoint) || this.isHead(newPoint)
            ? this.getNewApplePoint()
            : newPoint;
    };

    // Actions when key pressed by user
    KeyPressed = ev => {
        if (this.props.isGameOver()) return;
        const { direction } = this.state.snake;

        switch (ev.keyCode) {
            case Keymaps.LEFT:  // LEFT key
                if (direction === Directions.RIGHT) return;
                this.changeDirection(Directions.LEFT);
                break;
            case Keymaps.RIGHT: // RIGHT key
                if (direction === Directions.LEFT) return;
                this.changeDirection(Directions.RIGHT);
                break;
            case Keymaps.UP:    // UP key
                if (direction === Directions.DOWN) return;
                this.changeDirection(Directions.UP);
                break;
            case Keymaps.DOWN:  // DOWN key
                if (direction === Directions.UP) return;
                this.changeDirection(Directions.DOWN);
                break;
            default:
                break;
        }
    };

    // Change next direction of Snake
    changeDirection = direction => {
        this.setState(({ snake }) => ({
            snake: {
                ...snake,
                nextDirection: direction
            }
        }));
    };


    // Check whether Snake will hit the wall on next move 
    willHitWall = _ => {
        const { head, nextDirection } = this.state.snake;
        let newHeadLocation = {
            x: head.x + nextDirection.x,
            y: head.y + nextDirection.y
        }
        return (
            newHeadLocation.x < 0 ||
            newHeadLocation.x >= this.props.cols ||
            newHeadLocation.y < 0 ||
            newHeadLocation.y >= this.props.rows
        );
    };

    isSelfCollision = _ => this.isTail(this.state.snake.head);

    isAppleEating = _ =>
        isEqualPoints(this.state.apple, this.state.snake.head);

    componentDidMount = _ => {
        document.addEventListener("keydown", this.KeyPressed);

        this.resetGame();
    };

    gameLoop = _ => {
        // Check if game is over then stop
        if (this.props.isGameOver()) return;

        // Check for apple eating
        const isAppleEating = this.isAppleEating();

        // Check for wall-hit Or self-collision
        if (this.willHitWall() || this.isSelfCollision()) {
            this.props.do_gameOver();
            return;
        }

        // Next snake step
        this.setState(
            ({ snake, apple }) => {
                const nextState = {
                    snake: {
                        ...snake,
                        head: {
                            x: snake.head.x + snake.nextDirection.x,
                            y: snake.head.y + snake.nextDirection.y
                        },
                        tail: [snake.head, ...snake.tail],
                        direction: snake.nextDirection
                    },
                    apple: isAppleEating ? this.getNewApplePoint() : apple
                };
                // If snake is eating then keep last tail-part else pop last tail-part
                isAppleEating
                    ? this.props.increaseCurrentScore(5)
                    : nextState.snake.tail.pop();

                return nextState;
            },
            _ => {
                // game timer manager
                setTimeout(_ => this.gameLoop(), this.state.snake.speed);
            }
        );
    };

    getContents = _ => {
        let contents = [];
        for (let row = 0; row < this.props.rows; row++) {
            contents.push(
                <div className="row" key={row}>
                    {this.getColumnData(row)}
                </div>
            );
        }
        return contents;
    };

    getColumnData = row => {
        let contents = [];
        for (let col = 0; col < this.props.cols; col++)
            contents.push(this.getCellData(row, col));

        return contents;
    };


    getCellData = (y, x) => (
        <div key={`${x} ${y}`}
            className={`cell ${
                (this.isHead({ x, y }) && "head")
                || (this.isApple({ x, y }) && "apple")
                || (this.isTail({ x, y }) && "tail")
                || ''
                }`}
        />
    );

    resetGame = _ => {
        this.setState(
            {
                apple: this.getNewApplePoint(),
                snake: {
                    ...this.state.snake,
                    head: this.getNewHeadPoint(),
                    tail: [],
                    nextDirection: getRandomDirection()
                }
            },
            _ => {
                this.gameLoop();
            }
        );
    }

    render() {

        return (
            <section className="game-container">
                {/* Game Space */}
                {this.getContents()}
            </section>
        );
    }
}
