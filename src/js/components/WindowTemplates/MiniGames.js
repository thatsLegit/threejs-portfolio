import WindowTemplate from './WindowTemplate';
import Game from '../Games/Snake';

class MiniGames extends WindowTemplate {
    constructor(window) {
        super(window, null, 'miniGames');
    }

    cssTemplate() {
        return `
            ${super.cssTemplate()}

            #${this.id} .content {
                width: 600px;
            }

            #snake-canvas {
                background-color: #f0f0f0;
                border: 5px solid #000;
                margin-top: 50px;
                margin-left: 50px;
            }

            #${this.id} p {
                font-family: "Sigmar One", cursive;
                margin: 0;
            }

            #${this.id} button {
                padding: 8px 16px;
                font-size: 16px;
                font-weight: bold;
                background-color: #ffa500;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.2s;
            }

            #${this.id} button:hover {
                background-color: #e69400;
            }

            #${this.id} #footer {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                width: 100%;
            }

            #${this.id} #score {
                color: #000;
                font-size: 20px;
                font-weight: bold;
            }

            #${this.id} #highscore {
                color: #000;
                font-size: 20px;
                font-weight: bold;
            }
        `;
    }

    startSnakeGame() {
        const menuContainer = document.getElementById('retry');
        menuContainer.textContent = 'New game';

        const game = new Game();
        game.start();

        game.retryButton.addEventListener('click', () => {
            game.start();
        });
    }

    htmlTemplate() {
        return `
            ${super.htmlTemplate()}
            <div class="content">
                <canvas id="snake-canvas" width="500" height="400"></canvas>
                <div id="footer">
                    <div>
                        <p>Score:</p>
                        <p id="score">0</p>
                    </div>

                    <button id="retry">New game</button>

                    <div>
                        <p>Highscore:</p>
                        <p id="highscore">0</p>
                    </div>
            </div>
        `;
    }

    generate() {
        super.generate();

        const snakeButton = document.getElementById('retry');
        snakeButton.addEventListener('click', () => {
            snakeButton.textContent = 'Retry';
            this.startSnakeGame();
        });
    }
}

export default MiniGames;
