import { figure1 } from './figure1.js';

const RENDER_TIME = 1000;
export const STEP = 20;
const GAME_SIZE_W = 15 * STEP; // 300
const GAME_SIZE_H = 30 * STEP; // 600

class Game {
  figure;
  figures;
  position;
  isGameOver;

  start = () => {
    this.figures = [];
    this.isGameOver = false;
    console.log('start');

    this._setPosition();
    // this._renderGame();
    this._createGameLoop();

    const rotateBtnElement = document.getElementById('btn-rotate');
    const stopBtnElement = document.getElementById('btn-stop');

    rotateBtnElement.addEventListener('click', () => {
      console.log('ROTATE');
    });

    stopBtnElement.addEventListener('click', () => {
        this.isGameOver = !this.isGameOver;
    });
  };

  update = () => {
    console.log('update');

    console.log(this.figure);
    this._setFigure();
    this._updateFigurePosition();
    this._renderGame();
  };

  stop() {
    // this.isGameOver = true;
    // this._setPosition();
    console.log(this.figure);
    // this.figure.position.
    this.figures.push(this.figure);
    this._setPosition();
    console.log('stop');
  }

  _setPosition = () => {
    this.position = { x: 0, y: 0 };
  };

  _updateFigurePosition = () => {
    const isValid = this._validatePosition();
    if (!isValid) {
      return this.stop();
    }

    this.position.x += STEP;
  };

  _validatePosition = (position) => {
    console.log('validate');
    console.log(this.position.x);
    console.log(this.position.x + this.figure.size.x);

    if (
      this.figures.find((figure) => {
        console.log('figure.elements: ', figure.elements[0]?.x);
        console.log('this.position.x: ', this.position.x);
        console.log('this.position.y: ', this.position.y);
        return figure.elements.some((element) => {
          return (
            element.x === this.position.x + this.figure.size.x ||
            element.y === this.position.y + this.figure.size.y
          );
        });
      })
    ) {
      if (this.position.x === 0) {
        this.isGameOver = true;
      }

      return false;
    }

    if (this.position.x + this.figure.size.x === GAME_SIZE_W) {
      return false;
    }

    return true;
  };

  _setFigure = () => {
    this.figure = figure1({ size: STEP, position: this.position });
  };

  _renderGame = () => {
    const element = document.getElementById('wrapper');

    element.innerHTML = `
        <svg
            width="${GAME_SIZE_W}"
            height="${GAME_SIZE_H}"
            xmlns="http://www.w3.org/2000/svg"
        >
            ${this.figure.element}
            ${this.figures.map((figure) => figure.element)}
        </svg>
      `;
  };

  _createGameLoop = () => {
    let start = null;
    const gameLoop = (timestamp) => {
      if (this.isGameOver) return;
      if (start === null) start = timestamp;
      let progress = timestamp - start;

      if (progress > RENDER_TIME) {
        this.update();
        start = timestamp;
      }
      requestAnimationFrame(gameLoop);
    };

    requestAnimationFrame(gameLoop);
  };
}

new Game().start();
