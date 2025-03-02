const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 400;

const SNAKE_COLOR = '#f00';
const FOOD_COLOR = '#0f0';
const CELL_COLOR = '#f0f0f0';

const CELL_SIZE = 20;
const CELLS_PER_ROW = CANVAS_WIDTH / CELL_SIZE;
const CELLS_PER_COLUMN = CANVAS_HEIGHT / CELL_SIZE;

export default class Game {
    constructor() {
        this.canvas = document.getElementById('snake-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.retryButton = document.getElementById('retry');
        this.highScoreElement = document.getElementById('highscore');

        this.keyInputLocked = false;
        this.direction = 'bottom';
        this.grid = null;
        this.score = 0;
    }

    initGrid() {
        this.grid = [];

        for (let i = 0; i < CELLS_PER_ROW; i++) {
            this.grid.push([]);
            for (let j = 0; j < CELLS_PER_COLUMN; j++) {
                // 0 is empty, 1 is taken
                this.grid[i][j] = 0;
            }
        }

        this.grid[12][8] = 1;
        this.grid[12][9] = 1;
        this.grid[12][10] = 1;
        this.grid[12][11] = 1;
    }

    initSnake() {
        this.snakePositions = [
            {
                x: 12,
                y: 8,
            },
            {
                x: 12,
                y: 9,
            },
            {
                x: 12,
                y: 10,
            },
            {
                x: 12,
                y: 11,
            },
        ];

        this.ctx.fillStyle = SNAKE_COLOR;

        this.snakePositions.forEach((position) => {
            this.ctx.fillRect(position.x * CELL_SIZE, position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        });
    }

    initFood() {
        this.foodPosition = {
            x: Math.floor(Math.random() * CELLS_PER_ROW),
            y: Math.floor(Math.random() * CELLS_PER_COLUMN),
        };

        this.drawFood(this.foodPosition.x, this.foodPosition.y);
    }

    drawFood(x, y) {
        this.ctx.fillStyle = FOOD_COLOR;
        this.ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }

    initScore() {
        this.score = 0;
        this.scoreElement.textContent = this.score.toString();
        this.highScoreElement.textContent = (
            localStorage.getItem('highscore') || this.score
        ).toString();
    }

    eatFood() {
        this.score += 1;
        this.scoreElement.textContent = this.score.toString();

        let updatedFoodPositionX = Math.floor(Math.random() * CELLS_PER_ROW);
        let updatedFoodPositionY = Math.floor(Math.random() * CELLS_PER_COLUMN);

        while (this.grid[updatedFoodPositionX][updatedFoodPositionY] === 1) {
            updatedFoodPositionX = Math.floor(Math.random() * CELLS_PER_ROW);
            updatedFoodPositionY = Math.floor(Math.random() * CELLS_PER_COLUMN);
        }

        this.foodPosition.x = updatedFoodPositionX;
        this.foodPosition.y = updatedFoodPositionY;

        this.drawFood(updatedFoodPositionX, updatedFoodPositionY);
    }

    drawSnake() {
        let updatedX = this.snakePositions[this.snakePositions.length - 1].x;
        let updatedY = this.snakePositions[this.snakePositions.length - 1].y;

        if (updatedX !== this.foodPosition.x || updatedY !== this.foodPosition.y) {
            const tail = this.snakePositions.shift();

            this.ctx.fillStyle = CELL_COLOR;
            this.ctx.fillRect(tail.x * CELL_SIZE, tail.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

            this.grid[tail.x][tail.y] = 0;
        } else {
            this.eatFood();
        }

        switch (this.direction) {
            case 'top':
                updatedY -= 1;
                break;
            case 'bottom':
                updatedY += 1;
                break;
            case 'left':
                updatedX -= 1;
                break;
            case 'right':
                updatedX += 1;
                break;
        }

        this.snakePositions.push({
            x: updatedX,
            y: updatedY,
        });

        this.ctx.fillStyle = SNAKE_COLOR;
        this.snakePositions.forEach((position) => {
            this.ctx.fillRect(position.x * CELL_SIZE, position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        });
    }

    displayGameOverText() {
        this.ctx.font = '24px Sigmar One';
        this.ctx.fillStyle = 'bold';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        this.ctx.fillText('Game Over ☠️', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }

    isGameOver() {
        const snakeHead = this.snakePositions[this.snakePositions.length - 1];

        if (snakeHead.x >= CELLS_PER_ROW) {
            return true;
        } else if (snakeHead.y >= CELLS_PER_COLUMN) {
            return true;
        } else if (snakeHead.x < 0) {
            return true;
        } else if (snakeHead.y < 0) {
            return true;
        } else if (this.grid[snakeHead.x][snakeHead.y] === 1) {
            return true;
        }

        return false;
    }

    clearGameOverText() {
        this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    start() {
        document.removeEventListener('keydown', this.directionHandler);
        clearInterval(this.intervalId);

        this.keyInputLocked = false;
        this.direction = 'bottom';

        this.clearGameOverText();
        this.initGrid();
        this.initSnake();
        this.initFood();
        this.initScore();

        this.play();
    }

    directionHandler(e) {
        if (this.keyInputLocked) return;
        if (e.key === 'ArrowUp' && this.direction !== 'bottom') {
            this.direction = 'top';
            this.keyInputLocked = true;
        } else if (e.key === 'ArrowDown' && this.direction !== 'top') {
            this.direction = 'bottom';
            this.keyInputLocked = true;
        } else if (e.key === 'ArrowLeft' && this.direction !== 'right') {
            this.direction = 'left';
            this.keyInputLocked = true;
        } else if (e.key === 'ArrowRight' && this.direction !== 'left') {
            this.direction = 'right';
            this.keyInputLocked = true;
        }
    }

    play() {
        this.intervalId = setInterval(() => {
            this.drawSnake();

            if (this.isGameOver()) {
                this.displayGameOverText();

                const highScore = localStorage.getItem('highscore') || 0;

                if (this.score > highScore) {
                    localStorage.setItem('highscore', this.score);
                    this.highScoreElement.textContent = this.score.toString();
                }

                return clearInterval(this.intervalId);
            }

            const snakeHead = this.snakePositions[this.snakePositions.length - 1];

            if (snakeHead.x < this.grid.length && snakeHead.y < this.grid[0].length) {
                this.grid[snakeHead.x][snakeHead.y] = 1;
            }

            this.keyInputLocked = false;
        }, 250);

        document.addEventListener('keydown', this.directionHandler.bind(this));
    }
}
