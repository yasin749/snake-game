import Vue from "vue/dist/vue";
import config from '../../../config';

var game = Vue.component('game', {
    props: {
        play: {type: Boolean}
    },
    data: function () {
        return {
            snake: {
                play: this.play,
                tail: [],
                directionX: 1,
                directionY: 0,
            },
            apple: {
                posX: 0,
                posY: 0,
            },
            score: {
                count: 0,
            },
            timer: null,
        }
    },
    created() {
        this.boxCountX = config.canvas.width / config.canvas.gridSize;
        this.boxCountY = config.canvas.height / config.canvas.gridSize;

        this.headOfSnake = Object.assign({}, this.snake.tail[this.snake.tail.length - 1]);
        this.endOfSnake = Object.assign({}, this.snake.tail[0]);
    },
    mounted() {
        this.createApple();
        this.createSnake();
        this.draw();
        document.addEventListener('keydown', this.onKeyDown);
    },
    watch: {
        play() {
            this.snake.play = this.play;
        },
        'snake.play': function () {
            this.$emit('onPlayChange', this.snake.play);
            this.loop();
        },
        'score.count': function () {
            this.$emit('onScoreChange', this.score.count);
        }
    },
    methods: {
        loop() {
            clearInterval(this.timer);
            if (!this.snake.play) {
                return false;
            }

            this.timer = setInterval(() => {
                this.calc();
                this.draw();
            }, config.snake.speed);
        },
        calc() {
            this.headOfSnake = Object.assign({}, this.snake.tail[this.snake.tail.length - 1]);
            this.endOfSnake = Object.assign({}, this.snake.tail[0]);

            this.headOfSnake.posX += this.snake.directionX;
            this.headOfSnake.posY += this.snake.directionY;

            // Out of box control
            if (this.headOfSnake.posX === this.boxCountX) {
                this.headOfSnake.posX = 0;
            } else if (this.headOfSnake.posX < 0) {
                this.headOfSnake.posX = this.boxCountX - 1;
            } else if (this.headOfSnake.posY === this.boxCountY) {
                this.headOfSnake.posY = 0;
            } else if (this.headOfSnake.posY < 0) {
                this.headOfSnake.posY = this.boxCountY - 1;
            }

            if (this.isEatingAppleSnake()) {
                this.scoreChange();
                this.addTailSnake();
                this.createApple();
            }

            if (this.isBumpSnake()) {
                this.gameReset();
                return;
            }

            this.snake.tail.push(this.headOfSnake);
            this.snake.tail.shift();
        },
        draw() {
            const canvas = this.$refs.canvas;
            const context = canvas.getContext('2d');
            this.drawCanvas(canvas, context);
            this.drawApple(context);
            this.drawSnake(context);
        },
        drawCanvas(canvas, context) {
            canvas.width = config.canvas.width;
            canvas.height = config.canvas.height;

            context.fillStyle = 'black';
            context.fillRect(
                0,
                0,
                config.canvas.width,
                config.canvas.height
            );
        },
        createApple() {
            this.apple.posX = Math.floor(Math.random() * this.boxCountX);
            this.apple.posY = Math.floor(Math.random() * this.boxCountY);
        },
        drawApple(context) {
            context.fillStyle = config.apple.color;
            context.fillRect(
                this.apple.posX * config.canvas.gridSize,
                this.apple.posY * config.canvas.gridSize,
                config.canvas.gridSize - config.canvas.gridSpace,
                config.canvas.gridSize - config.canvas.gridSpace
            );
        },
        createSnake() {
            let position = Math.floor(Math.random() * (this.boxCountX - (config.snake.initialTailSize * 3))) + config.snake.initialTailSize;
            this.snake.tail = [];
            for (let i = 0; i <= config.snake.initialTailSize; i++) {
                this.snake.tail.push({
                    posX: this.snake.directionX ? position + i : position,
                    posY: this.snake.directionY ? position + i : position,
                });
            }
        },
        addTailSnake() {
            this.endOfSnake.posX += this.snake.directionX;
            this.endOfSnake.posY += this.snake.directionY;
            this.snake.tail.unshift(this.endOfSnake);
        },
        isEatingAppleSnake() {
            if (this.headOfSnake.posX === this.apple.posX && this.headOfSnake.posY === this.apple.posY) {
                return true;
            }
            return false;
        },
        isBumpSnake() {
            for (let i in this.snake.tail) {
                if (this.snake.tail[i].posX === this.headOfSnake.posX && this.snake.tail[i].posY === this.headOfSnake.posY) {
                    return true;
                }
            }
            return false;
        },
        drawSnake(context) {
            this.snake.tail.forEach(tail => {
                context.fillStyle = config.snake.color;
                context.fillRect(
                    tail.posX * config.canvas.gridSize,
                    tail.posY * config.canvas.gridSize,
                    config.canvas.gridSize - config.canvas.gridSpace,
                    config.canvas.gridSize - config.canvas.gridSpace
                );
            });
        },
        gamePlay() {
            this.snake.play = true;
        },
        gamePause() {
            this.snake.play = false;
        },
        gameReset() {
            this.score.count = 0;
            this.gamePause();
            this.createSnake();
            this.createApple();
            this.draw();
        },
        scoreChange(count = 1) {
            this.score.count += count;
        },
        onKeyDown(e) {
            // Direction keys
            if (config.keys.left.indexOf(e.keyCode) !== -1) {
                this.snakeRotateLeft();
            }
            if (config.keys.up.indexOf(e.keyCode) !== -1) {
                this.snakeRotateUp();
            }
            if (config.keys.right.indexOf(e.keyCode) !== -1) {
                this.snakeRotateRight();
            }
            if (config.keys.down.indexOf(e.keyCode) !== -1) {
                this.snakeRotateDown();
            }
            // Play
            if (config.keys.gamePlay.indexOf(e.keyCode) !== -1) {
                this.gamePlay();
            }
            // Play Toggle
            if (config.keys.gamePlayToggle.indexOf(e.keyCode) !== -1) {
                this.snake.play ? this.gamePause() : this.gamePlay();
            }
        },
        snakeRotateLeft() {
            if (this.snake.directionX !== 1) {
                this.snake.directionX = -1;
                this.snake.directionY = 0;
            }
        },
        snakeRotateUp() {
            if (this.snake.directionY !== 1) {
                this.snake.directionY = -1;
                this.snake.directionX = 0;
            }
        },
        snakeRotateRight() {
            if (this.snake.directionX !== -1) {
                this.snake.directionX = 1;
                this.snake.directionY = 0;
            }
        },
        snakeRotateDown() {
            if (this.snake.directionY !== -1) {
                this.snake.directionY = 1;
                this.snake.directionX = 0;
            }
        },
    },
    template: `
        <canvas ref="canvas"></canvas>
    `,
})

export default game;
