import React from 'react'
import './GameOver.css'
import Score from '../Score/Score'
import imgSnake from '../../assets/image/snake.png'

export default function GameOver({ currentScore, playAgain,snake_length }) {
    return (
        <div id="gameOver-dialog">
            <div className="container">
                <div className="card">

                    <img className="snake_image" src={imgSnake} alt="Snake" />

                    <div className="card_content">
                        <h2 className="title">Game Over!</h2>
                        <svg viewBox="0 0 800 500">
                            <path d="M 0 100 Q 50 200 100 250 Q 250 400 350 300 C 400 250 550 150 650 300 Q 750 450 800 400 L 800 500 L 0 500" stroke="transparent" fill="#333" />
                            <path className="card_svg_line" d="M 0 100 Q 50 200 100 250 Q 250 400 350 300 C 400 250 550 150 650 300 Q 750 450 800 400" stroke="pink" strokeWidth="3" fill="transparent" />
                        </svg>

                        <div className="content">
                            <Score currentScore={currentScore} snake_length={snake_length} />
                            <button className="btn-rounded btn-normal btn-tryAgain" onClick={playAgain}>
                                Play Again?
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
