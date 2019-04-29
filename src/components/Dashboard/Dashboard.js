import React, { Component } from "react";
import "./Dashboard.css";
import imgSnake from "../../assets/image/snake.png";
import imgApple from "../../assets/image/apple_24px.png";
import imgStrawberry from "../../assets/image/strawberry_24px.png";

export default class Dashboard extends Component {
    render() {
        return (
            <div id="dashboard-dialog">
                <div className="card">
                    <header className="card_title">
                        <img
                            className="card_title_icon"
                            src={imgSnake}
                            alt="Snake"
                        />
                    </header>
                    <section className="card_content">
                        <h2 className="card_content_title">Snake Game</h2>
                        <span className="card_content_howTo">How to score?</span>
                        <ul className="card_content_items">
                            <li>
                                <div className="item">
                                    <img src={imgApple} alt="Apple" />
                                </div>
                                <span> +5 Points</span>
                            </li>
                            <li>
                                <div className="item">
                                    <img
                                        src={imgStrawberry}
                                        alt="imgStrawberry"
                                    />
                                </div>
                                <span> -3 Snake length</span>
                            </li>
                        </ul>
                        <button
                            className="btn-rounded btn-normal btn-playGame"
                            onClick={this.props.startGame}
                        >
                            Let's Play
                        </button>
                    </section>
                </div>
            </div>
        );
    }
}
