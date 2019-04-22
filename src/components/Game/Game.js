import React, { Component } from "react";
import { Directions, Keymaps } from "../Constants";
import "./Game.css";

export default class Game extends Component {
    randomVal = (min, max) => Math.floor(Math.random() * (max - min) + min);

    getRandomXnY = _ => ({
        x: this.randomVal(0, this.props.cols),
        y: this.randomVal(0, this.props.rows)
    });

    // Checks points equality
    isEqualPoints = (Obj1, Obj2) => Obj1.x === Obj2.x && Obj1.y === Obj2.y;

    // Generate random direction
    getRandomDirection = () => {
        switch (this.randomVal(0, 3)) {
            case 0:
                return Directions.LEFT;
            case 1:
                return Directions.TOP;
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
            velocity: this.getRandomDirection(),
            speed: this.props.speed
        }
    };

    // Is cell points equal to snake head
    isHead = cell => this.isEqualPoints(this.state.snake.head, cell);

    // Is cell points equal to apple
    isApple = cell => this.isEqualPoints(this.state.apple, cell);

    // Is cell points includes in Tail of snake
    isTail = cell =>
        this.state.snake.tail.find(tailPart =>
            this.isEqualPoints(tailPart, cell)
        );

    // Point out of center point in board
    isPointOutOfCenter = newPoint => {
        return (
            newPoint.x > this.props.cols * (3 / 4) ||
            newPoint.x < this.props.cols * (1 / 4) ||
            newPoint.y > this.props.rows * (3 / 4) ||
            newPoint.y < this.props.rows * (1 / 4)
        );
    };

    // Generate intial snake start
    getNewHeadPoint = () => {
        let newPoint = {
            x: this.randomVal(
                this.props.cols * (1 / 4),
                this.props.cols * (3 / 4)
            ),
            y: this.randomVal(
                this.props.rows * (1 / 4),
                this.props.rows * (3 / 4)
            )
        };

        // Check is snake's new head point same as apple OR Snakes point is not at the end of any edge
        return this.isApple(newPoint) || this.isPointOutOfCenter(newPoint)
            ? this.getNewHeadPoint()
            : newPoint;
    };

    // Generate new points for next apple
    getNewApplePoint = () => {
        let newPoint = this.getRandomXnY();

        // Check is apple's new point is part of snake
        return this.isTail(newPoint) || this.isHead(newPoint)
            ? this.getNewApplePoint()
            : newPoint;
    };

    // Actions when key pressed by user
    KeyPressed = ev => {
        const { snake } = this.state;
        switch (ev.keyCode) {
            case Keymaps.LEFT: // LEFT key
                if (snake.velocity.x === 1) return;
                this.changeVelocity(Directions.LEFT);
                break;
            case Keymaps.RIGHT: // RIGHT key
                if (snake.velocity.x === -1) return;
                this.changeVelocity(Directions.RIGHT);
                break;
            case Keymaps.UP: // UP key
                if (snake.velocity.y === 1) return;
                this.changeVelocity(Directions.UP);
                break;
            case Keymaps.DOWN: // DOWN key
                if (snake.velocity.y === -1) return;
                this.changeVelocity(Directions.DOWN);
                break;
            default:
                break;
        }
    };

    changeVelocity = direction => {
        this.setState(({ snake }) => ({
            snake: {
                ...snake,
                velocity: direction
            }
        }));
    };

    isWallHit = () => {
        const snakeHead = this.state.snake.head;
        return (
            snakeHead.x < 0 ||
            snakeHead.x > this.props.cols ||
            snakeHead.y < 0 ||
            snakeHead.y > this.props.rows
        );
    };

    isSelfCollision = () => this.isTail(this.state.snake.head);

    isAppleEating = () =>
        this.isEqualPoints(this.state.apple, this.state.snake.head);

    componentDidMount = () => {
        document.addEventListener("keydown", e => {
            this.KeyPressed(e);
        });

        this.gameLoop();
    };

    gameLoop = () => {
        // Check if game is over then stop
        if (this.state.game_over) return;

        // Check for wall-hit Or self-collision
        if (this.isWallHit() || this.isSelfCollision()) {
            this.setState({ game_over: true });
            return;
        }

        // Check for apple eating
        const isEating = this.isAppleEating();

        // Next snake step
        this.setState(
            ({ snake, apple }) => {
                const nextState = {
                    snake: {
                        ...snake,
                        head: {
                            x: snake.head.x + snake.velocity.x,
                            y: snake.head.y + snake.velocity.y
                        },
                        tail: [snake.head, ...snake.tail]
                    },
                    apple: isEating ? this.getNewApplePoint() : apple
                };
                // If snake is eating then keep last tail-part else pop last tail-part
                if (!isEating) nextState.snake.tail.pop();
                return nextState;
            },
            _ => {
                // game timer manager
                setTimeout(_ => this.gameLoop(), this.state.snake.speed * 300);
            }
        );
    };

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            apple: this.getNewApplePoint(),
            snake: {
                ...this.state.snake,
                head: this.getNewHeadPoint()
            }
        };
    }

    render() {
        const { rows, cols } = this.props;

        let getContents = () => {
            let contents = [];
            for (let row = 0; row < rows; row++) {
                contents.push(
                    <div className="row" key={row}>
                        {getColumnData(row)}
                    </div>
                );
            }
            return contents;
        };

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
