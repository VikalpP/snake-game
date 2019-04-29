import React, { Component } from "react";
import { Directions, Keymaps, noPoint } from "../Constants";
import {
    randomVal,
    getRandomXnY,
    isEqualPoints,
    getRandomDirection
} from "../Common";
import "./Game.css";

export default class Game extends Component {
    state = {
        apple: noPoint,
        snake: {
            head: noPoint,
            tail: [],
            direction: Directions.RIGHT,
            nextDirection: Directions.RIGHT,
            speed: 200 / this.props.speed
        },
        strawberry: noPoint
    };

    componentDidMount = _ => {
        // Keyboard Event listner
        document.addEventListener("keydown", this.KeyPressed);

        // Reset the Game as initial configurations
        //this.resetGame();
    };

    // Is cell points equal to snake head
    isHead = cell => isEqualPoints(this.state.snake.head, cell);

    // Is cell points equal to apple
    isApple = cell => isEqualPoints(this.state.apple, cell);

    // Is cell points equal to isStrawberry
    isStrawberry = cell => isEqualPoints(this.state.strawberry, cell);

    // Is cell points includes in Tail of snake
    isTail = cell =>
        this.state.snake.tail.find(tailPart => isEqualPoints(tailPart, cell));

    // Generate intial snake start
    getNewHeadPoint = _ => {
        // To Make sure that snake don't starts at any edge
        let newPoint = {
            x: randomVal(this.props.cols * (1 / 6), this.props.cols * (5 / 6)),
            y: randomVal(this.props.rows * (1 / 6), this.props.rows * (5 / 6))
        };

        // Check is snake's new head point same as apple
        return this.isApple(newPoint) ? this.getNewHeadPoint() : newPoint;
    };

    // Generate new points for next apple
    getNewFruitPoint = _ => {
        let newPoint = getRandomXnY(this.props.cols, this.props.rows);

        // Check is fruit's new point is part of snake or any fruit
        return this.isTail(newPoint) ||
            this.isHead(newPoint) ||
            this.isApple(newPoint)
            ? this.getNewFruitPoint()
            : newPoint;
    };

    // Actions when key pressed by user
    KeyPressed = ev => {
        if (this.props.isGameOver()) return;
        const { direction } = this.state.snake;

        switch (ev.keyCode) {
            case Keymaps.LEFT: // LEFT key
                if (direction === Directions.RIGHT) return;
                this.changeDirection(Directions.LEFT);
                break;
            case Keymaps.RIGHT: // RIGHT key
                if (direction === Directions.LEFT) return;
                this.changeDirection(Directions.RIGHT);
                break;
            case Keymaps.UP: // UP key
                if (direction === Directions.DOWN) return;
                this.changeDirection(Directions.UP);
                break;
            case Keymaps.DOWN: // DOWN key
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
        };
        return (
            newHeadLocation.x < 0 ||
            newHeadLocation.x >= this.props.cols ||
            newHeadLocation.y < 0 ||
            newHeadLocation.y >= this.props.rows
        );
    };

    // Check for self collision by checking whether head includes in any tail parts
    isSelfCollision = _ => this.isTail(this.state.snake.head);

    // Chech for Applie eats by comparing points of Snake-head & Apple
    isAppleEating = _ => isEqualPoints(this.state.apple, this.state.snake.head);

    // Chech for Applie eats by comparing points of Snake-head & Strawberry
    isStrawberryEating = _ =>
        isEqualPoints(this.state.strawberry, this.state.snake.head);

    // Reduce
    Bonus_ReduceTail = (tail, n) => {
        for (var i = 0; i < n && tail.length > 1; i++) tail.pop();
        return tail;
    };

    // change stages of Game
    gameLoop = _ => {
        // Check if game is over then stop
        if (this.props.isGameOver()) return;

        // Check for Fruits eating
        const isAppleEating = this.isAppleEating();
        const isStrawberryEating = this.isStrawberryEating();

        // Check for wall-hit Or self-collision
        if (this.willHitWall() || this.isSelfCollision()) {
            this.props.do_gameOver();
            return;
        }

        // Next snake step
        this.setState(
            ({ snake, apple, strawberry }) => {
                const nextState = {
                    snake: {
                        ...snake,
                        head: {
                            x: snake.head.x + snake.nextDirection.x, // Move ahead snake
                            y: snake.head.y + snake.nextDirection.y
                        },
                        tail: [snake.head, ...snake.tail], // Add previous head path in tail
                        direction: snake.nextDirection
                    },
                    apple: isAppleEating ? this.getNewFruitPoint() : apple,
                    strawberry: isStrawberryEating ? noPoint : strawberry
                };
                // If snake is eating then keep last tail-part else pop last tail-part
                isAppleEating
                    ? this.props.increaseCurrentScore(5)
                    : isStrawberryEating
                    ? (nextState.snake.tail = this.Bonus_ReduceTail(
                          nextState.snake.tail,
                          3 // Reduce it's 3 tail parts
                      ))
                    : nextState.snake.tail.pop();

                return nextState;
            },
            _ => {
                this.props.update_snake_length(
                    this.state.snake.tail.length + 1
                );
                // Every time snake gain 5 more tail parts add Randomly a Strawberry
                if (
                    this.isStrawberry(noPoint) &&
                    Math.random() > 0.5 &&
                    this.state.snake.tail.length % 5 === 4
                ) {
                    this.setState(
                        { strawberry: this.getNewFruitPoint() },
                        _ => {
                            // 5 seconds to eat strawberry else disappear
                            setTimeout(this.makeDisappear_Strawberry, 5000);
                        }
                    );
                }
                // game timer manager
                setTimeout(this.gameLoop, this.state.snake.speed);
            }
        );
    };

    makeDisappear_Strawberry = _ => {
        if (!this.isStrawberry(noPoint))
            this.setState({
                strawberry: noPoint
            });
    };

    addTimerForFruit = _ => (
        <div className="circle-timer">
            <div className="half spinner" />
            <div className="half filler" />
            <div className="mask" />
        </div>
    );

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
        <div
            key={`${x} ${y}`}
            className={`cell ${(this.isHead({ x, y }) && "head") ||
                (this.isApple({ x, y }) && "apple") ||
                (this.isStrawberry({ x, y }) && "strawberry") ||
                (this.isTail({ x, y }) && "tail") ||
                ""}`}
        >
            {this.isStrawberry({ x, y }) && this.addTimerForFruit()}
        </div>
    );

    resetGame = _ => {
        this.setState(
            {
                apple: this.getNewFruitPoint(),
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
    };

    render() {
        return (
            <div>
                <section className="game-container">
                    {/* Game Space */}
                    {this.getContents()}
                </section>
            </div>
        );
    }
}
