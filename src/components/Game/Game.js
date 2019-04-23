import React, { Component } from "react";
import { Directions, Keymaps } from "../Constants";
import { randomVal, getRandomXnY, isEqualPoints } from "../Common";
import "./Game.css";

export default class Game extends Component {

    // Generate random direction
    getRandomDirection = _ => {
        const i = randomVal(0, 3);
        switch (i) {
            case 0:
                return Directions.LEFT;
            case 1:
                return Directions.UP;
            case 2:
                return Directions.RIGHT;
            case 3:
                return Directions.DOWN;
            default:
                return Directions.RIGHT;
        }
    };

    state = {
        apple: { x: 0, y: 0 },
        snake: {
            head: { x: 0, y: 0 },
            tail: [],
            direction: Directions.RIGHT,
            nextDirection: Directions.RIGHT,
            speed: this.props.speed
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

    // Is point out of center in board
    isPointOutOfCenter = newPoint => {
        let max = (5 / 6), min = (1 / 6);
        return (
            newPoint.x > this.props.cols * max ||
            newPoint.x < this.props.cols * min ||
            newPoint.y > this.props.rows * max ||
            newPoint.y < this.props.rows * min
        );
    };

    // Generate intial snake start
    getNewHeadPoint = _ => {
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

        // Check is snake's new head point same as apple OR Snakes point is not at the end of any edge
        return this.isApple(newPoint) || this.isPointOutOfCenter(newPoint)
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
        if (this.state.game_over) return;
        const { direction } = this.state.snake;
        switch (ev.keyCode) {
            case Keymaps.LEFT: // LEFT key
                if (direction.x === 1) return;
                this.changeDirection(Directions.LEFT);
                break;
            case Keymaps.RIGHT: // RIGHT key
                if (direction.x === -1) return;
                this.changeDirection(Directions.RIGHT);
                break;
            case Keymaps.UP: // UP key
                if (direction.y === 1) return;
                this.changeDirection(Directions.UP);
                break;
            case Keymaps.DOWN: // DOWN key
                if (direction.y === -1) return;
                this.changeDirection(Directions.DOWN);
                break;
            default:
                break;
        }
    };

    changeDirection = direction => {
        this.setState(({ snake }) => ({
            snake: {
                ...snake,
                nextDirection: direction
            }
        }));
    };

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
        document.addEventListener("keydown", e => {
            this.KeyPressed(e);
        });

        this.setState(
            {
                apple: this.getNewApplePoint(),
                snake: {
                    ...this.state.snake,
                    head: this.getNewHeadPoint(),
                    velocity: [this.getRandomDirection()]
                }
            },
            _ => {
                this.gameLoop();
            }
        );
    };

    gameLoop = _ => {
        // Check if game is over then stop
        if (this.state.game_over) return;

        // Check for apple eating
        const isAppleEating = this.isAppleEating();

        // Check for wall-hit Or self-collision
        if (this.willHitWall() || this.isSelfCollision()) {
            this.setState({ game_over: true });
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
                setTimeout(_ => this.gameLoop(), 200 / this.state.snake.speed);
            }
        );
    };

    render() {
        const { rows, cols } = this.props;

        let getContents = _ => {
            let contents = [];

            if (this.state.game_over) contents.push(getGameOverMessage());

            for (let row = 0; row < rows; row++) {
                contents.push(
                    <div className="row" key={row}>
                        {getColumnData(row)}
                    </div>
                );
            }
            return contents;
        };

        let getGameOverMessage = _ => (
            <div id="gameOver_banner" key={"gameOver"}>
                Game Over
            </div>
        );

        let getColumnData = row => {
            let contents = [];
            for (let col = 0; col < cols; col++) {
                contents.push(getCellData(row, col));
            }
            return contents;
        };

        let getCellData = (y, x) => (
            <div
                key={`${x} ${y}`}
                className={`cell ${
                    this.isHead({ x, y })
                        ? "head"
                        : this.isApple({ x, y })
                            ? "apple"
                            : this.isTail({ x, y })
                                ? "tail"
                                : ""
                    }`}
            />
        );

        return <section className="game-container">{getContents()}</section>;
    }
}
