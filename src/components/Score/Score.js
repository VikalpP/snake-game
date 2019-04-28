import React from "react";
import "./Score.css";
import imgApple from "../../assets/image/apple_64px.png";
import imgTrophy from "../../assets/image/trophy_64px.png";
import imgSnake_logo from "../../assets/image/snake_logo_64px.png";

export default function Score({ currentScore, snake_length }) {
    return (
        <div id="scores-container">
            <div className="score currentScore">
                <img src={imgApple} alt="Apple" />
                <span>{currentScore}</span>
            </div>
            <div className="score bestScore">
                <img src={imgTrophy} alt="Trophy" />
                <span>{currentScore}</span>
            </div>
            <div className="score snake-length">
                <img src={imgSnake_logo} alt="Snake length" />
                <span>{snake_length}</span>
            </div>
        </div>
    );
}
